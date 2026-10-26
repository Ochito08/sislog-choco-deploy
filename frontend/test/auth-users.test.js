import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

// Exercises real frontend logic using simulated Vue state and services.
// Does not mount a DOM or verify keyboard/browser accessibility.
const frontend = new URL('../', import.meta.url)
const plain = value => JSON.parse(JSON.stringify(value))
const user = { id: 91, name: 'Persona Sintetica', email: 'persona@example.test', role: 'Administrador', active: true }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
function harness({ fetch = async () => json({}), imports = {}, initial = {} } = {}) {
  const storage = new Map(Object.entries(initial))
  const redirects = []
  const location = { pathname: '/login', assign: path => redirects.push(path) }
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)), removeItem: key => storage.delete(key) }
  const document = { activeElement: null, getElementById: () => null }
  const context = vm.createContext({ localStorage, fetch, FormData, window: { location }, document })
  const cache = new Map()
  const vue = { ref: value => ({ value }), reactive: value => value, nextTick: fn => Promise.resolve().then(fn), onMounted: () => {} }
  function synthetic(key, values) {
    if (!cache.has(key)) cache.set(key, new vm.SyntheticModule(Object.keys(values), function () {
      for (const [name, value] of Object.entries(values)) this.setExport(name, value)
    }, { context, identifier: key }))
    return cache.get(key)
  }
  async function moduleAt(url, exports = []) {
    if (cache.has(url.href)) return cache.get(url.href)
    let source = await readFile(url, 'utf8')
    if (url.pathname.endsWith('.vue')) {
      source = source.match(/<script setup>([\s\S]*?)<\/script>/)?.[1]
      assert.ok(source, 'Expected script setup')
      source += `\nexport { ${exports.join(', ')} }`
    }
    const mod = new vm.SourceTextModule(source, { context, identifier: url.href, initializeImportMeta: meta => { meta.env = {} } })
    cache.set(url.href, mod)
    await mod.link((specifier, referencing) => {
      if (Object.hasOwn(imports, specifier)) return synthetic(specifier, imports[specifier])
      if (specifier === 'vue') return synthetic('vue', vue)
      if (specifier.endsWith('.vue')) return synthetic(specifier, { default: {} })
      return moduleAt(new URL(specifier.endsWith('.js') ? specifier : `${specifier}.js`, referencing.identifier))
    })
    return mod
  }
  return { storage, redirects, location, document, async load(relative, exports = []) {
    const mod = await moduleAt(new URL(relative, frontend), exports)
    await mod.evaluate()
    return mod.namespace
  } }
}
const session = () => ({ sislog_token: 'synthetic-session', sislog_user: JSON.stringify(user) })

for (const [status, expected] of [[400, /datos/], [401, /sesión/], [403, /permisos/], [404, /no existe/], [409, /conflicto/], [500, /servidor/]]) {
  test(`API preserves HTTP ${status} and provides a clear fallback`, async () => {
    const h = harness({ fetch: async () => json({}, status), initial: session() })
    const api = await h.load('src/services/api.js')
    await assert.rejects(api.apiRequest('/users'), e => e.status === status && expected.test(e.message))
    assert.equal(h.storage.has('sislog_token'), status !== 401)
  })
}
test('API preserves server validation/conflict details', async () => {
  const h = harness({ fetch: async () => json({ error: 'Correo ya registrado.', fieldErrors: { email: 'Correo duplicado.' } }, 409) })
  const api = await h.load('src/services/api.js')
  await assert.rejects(api.apiRequest('/users'), e => e.status === 409 && e.message === 'Correo ya registrado.' && e.fieldErrors.email === 'Correo duplicado.')
})
test('API distinguishes network failures without clearing the session', async () => {
  const h = harness({ fetch: async () => { throw new TypeError('offline') }, initial: session() })
  const api = await h.load('src/services/api.js')
  await assert.rejects(api.apiRequest('/auth/me'), e => e.status === 0 && /conectar/.test(e.message))
  assert.equal(h.storage.has('sislog_token'), true)
})
test('Malformed JSON cannot bypass 401 session invalidation', async () => {
  const h = harness({ fetch: async () => new Response('{invalid', { status: 401, headers: { 'content-type': 'application/json' } }), initial: session() })
  h.location.pathname = '/usuarios'
  const api = await h.load('src/services/api.js')
  await assert.rejects(api.apiRequest('/users'), e => e.status === 401 && /sesión/.test(e.message))
  assert.equal(h.storage.has('sislog_token'), false)
  assert.equal(h.storage.has('sislog_user'), false)
  assert.deepEqual(h.redirects, ['/login'])
})
test('Malformed successful JSON is a readable response error', async () => {
  const h = harness({ fetch: async () => new Response('{invalid', { headers: { 'content-type': 'application/json' } }) })
  const api = await h.load('src/services/api.js')
  await assert.rejects(api.apiRequest('/users'), e => e.status === 200 && /respuesta inválida/.test(e.message))
})
test('Authentication recovers token-only sessions with malformed cached user', async () => {
  const requests = []
  const h = harness({ initial: { sislog_token: 'synthetic-session', sislog_user: '{invalid' }, fetch: async (url, options) => { requests.push({ url, options }); return json({ user }) } })
  const auth = await h.load('src/services/auth.js')
  assert.equal(auth.getCurrentUser(), null)
  assert.equal(auth.isAuthenticated(), true)
  await auth.refreshCurrentUser()
  assert.deepEqual(plain(auth.getCurrentUser()), user)
  assert.match(requests[0].url, /\/auth\/me$/)
  assert.equal(Boolean(requests[0].options.headers.Authorization), true)
  auth.logout()
  assert.equal(auth.isAuthenticated(), false)
})
test('Login service rejects incomplete sessions without storing them', async () => {
  const h = harness({ fetch: async () => json({ user }) })
  const auth = await h.load('src/services/auth.js')
  await assert.rejects(auth.login('persona@example.test', 'synthetic-secret'), /incompleta/)
  assert.equal(h.storage.has('sislog_token'), false)
})

async function routerHarness(options) {
  let guard
  const h = harness({ ...options, imports: { 'vue-router': { createWebHistory: () => ({}), createRouter: () => ({ beforeEach: fn => { guard = fn } }) } } })
  await h.load('src/router/index.js')
  return { ...h, guard }
}
const privateRoute = { meta: { requiresAuth: true }, query: {} }
test('Route guard rejects anonymous access without contacting the server', async () => {
  let calls = 0
  const h = await routerHarness({ fetch: async () => { calls++; return json({ user }) } })
  assert.equal(await h.guard(privateRoute), '/login')
  assert.equal(calls, 0)
})
test('Route guard restores token-only sessions and rejects nonadministrators', async () => {
  const h = await routerHarness({ initial: { sislog_token: 'synthetic-session' }, fetch: async () => json({ user: { ...user, role: 'Responsable de transporte' } }) })
  assert.equal(await h.guard(privateRoute), undefined)
  assert.equal(h.storage.has('sislog_user'), true)
  assert.equal(await h.guard({ meta: { requiresAuth: true, roles: ['Administrador'] }, query: {} }), '/dashboard')
})
test('Route guard preserves session on network failure without a Login loop', async () => {
  const h = await routerHarness({ initial: session(), fetch: async () => { throw new TypeError('offline') } })
  const destination = await h.guard(privateRoute)
  assert.deepEqual(plain(destination), { path: '/login', query: { session: 'unavailable' } })
  assert.equal(await h.guard({ meta: { guest: true }, query: destination.query }), undefined)
  const directLogin = await h.guard({ meta: { guest: true }, query: {} })
  assert.deepEqual(plain(directLogin), { path: '/login', query: { session: 'unavailable' }, replace: true })
  assert.equal(h.storage.has('sislog_token'), true)
})
test('Route guard invalidates a rejected session', async () => {
  const h = await routerHarness({ initial: session(), fetch: async () => json({}, 401) })
  assert.equal(await h.guard(privateRoute), '/login')
  assert.equal(h.storage.has('sislog_token'), false)
})
test('Login prevents duplicate requests while authentication is pending', async () => {
  const pending = deferred()
  let calls = 0
  const routes = []
  const h = harness({ imports: { 'vue-router': { useRoute: () => ({ query: {} }), useRouter: () => ({ push: async path => routes.push(path) }) }, '../services/auth': { login: () => { calls++; return pending.promise }, refreshCurrentUser: async () => user } } })
  const view = await h.load('src/views/LoginView.vue', ['submit', 'loading', 'error', 'email', 'password'])
  view.email.value = user.email
  view.password.value = 'synthetic-secret'
  const first = view.submit()
  await view.submit()
  assert.equal(calls, 1)
  assert.equal(view.loading.value, true)
  pending.resolve(user)
  await first
  assert.equal(view.loading.value, false)
  assert.deepEqual(routes, ['/dashboard'])
})

const usersExports = ['trapFocus', 'modalRef', 'saveUser', 'loadUsers', 'loadRoles', 'clearFilters', 'openCreate', 'openEdit', 'toggleStatus', 'users', 'roles', 'rolesLoading', 'rolesError', 'usersError', 'loading', 'form', 'fieldErrors', 'formError', 'filters', 'editingUser', 'modalOpen', 'savingId', 'message', 'error', 'formSaving']
async function usersHarness(overrides = {}) {
  const calls = { create: [], update: [], status: [] }
  const services = { listUsers: async () => [], listRoles: async () => ['Administrador'], createUser: async data => { calls.create.push(plain(data)); return { ...user, ...data } }, updateUser: async (id, data) => { calls.update.push({ id, data: plain(data) }); return { ...user, ...data } }, setUserActive: async (id, active) => { calls.status.push({ id, active }); return { ...user, active } }, ...overrides }
  const h = harness({ imports: { '../services/auth': { getCurrentUser: () => user }, '../services/users': services } })
  const view = await h.load('src/views/UsersView.vue', usersExports)
  view.roles.value = ['Administrador']
  view.rolesLoading.value = false
  return { view, calls, document: h.document }
}
const fillValid = view => Object.assign(view.form, { name: user.name, email: user.email, role: user.role, password: 'synthetic-secret' })
test('Users validates required fields before calling the API', async () => {
  const { view, calls } = await usersHarness()
  await view.saveUser()
  assert.deepEqual(Object.keys(view.fieldErrors.value).sort(), ['email', 'name', 'password', 'role'])
  assert.equal(calls.create.length, 0)
  assert.equal(view.formSaving.value, false)
})
test('Users blocks creation without roles and retries roles independently', async () => {
  let fail = true
  const { view, calls } = await usersHarness({ listRoles: async () => { if (fail) throw new Error('Roles inaccesibles.'); return ['Administrador'] } })
  await view.loadRoles()
  const rolesError = view.rolesError.value
  await view.loadUsers()
  assert.equal(view.rolesError.value, rolesError)
  fillValid(view)
  view.openCreate()
  await view.saveUser()
  assert.equal(view.modalOpen.value, false)
  assert.equal(calls.create.length, 0)
  fail = false
  await view.loadRoles()
  assert.equal(view.rolesError.value, '')
  assert.equal(view.roles.value.length, 1)
})
test('Users creates a valid account and omits empty password when editing', async () => {
  const { view, calls } = await usersHarness()
  fillValid(view)
  await view.saveUser()
  assert.equal(calls.create.length, 1)
  view.editingUser.value = user
  fillValid(view)
  view.form.password = ''
  await view.saveUser()
  assert.equal(calls.update.length, 1)
  assert.equal(calls.update[0].id, user.id)
  assert.equal(Object.hasOwn(calls.update[0].data, 'password'), false)
})
test('Users preserves backend field errors for validation/conflicts', async () => {
  const conflict = Object.assign(new Error('Correo duplicado.'), { status: 409, fieldErrors: { email: 'Correo ya utilizado.' } })
  const { view } = await usersHarness({ createUser: async () => { throw conflict } })
  fillValid(view)
  await view.saveUser()
  assert.equal(view.formError.value, 'Correo duplicado.')
  assert.equal(view.fieldErrors.value.email, 'Correo ya utilizado.')
  assert.equal(view.formSaving.value, false)
})
test('Users ignores stale responses and snapshots current filters', async () => {
  const pending = [deferred(), deferred()]
  const queries = []
  const { view } = await usersHarness({ listUsers: filters => { queries.push(plain(filters)); return pending[queries.length - 1].promise } })
  view.filters.search = 'antiguo'
  const old = view.loadUsers()
  Object.assign(view.filters, { search: 'reciente', role: 'Administrador', active: 'false' })
  const latest = view.loadUsers()
  pending[1].resolve([{ ...user, name: 'Resultado Reciente' }])
  await latest
  pending[0].resolve([{ ...user, name: 'Resultado Antiguo' }])
  await old
  assert.equal(view.users.value[0].name, 'Resultado Reciente')
  assert.equal(view.loading.value, false)
  assert.deepEqual(queries, [{ search: 'antiguo', role: '', active: '' }, { search: 'reciente', role: 'Administrador', active: 'false' }])
})
test('Users distinguishes failure from successful empty results', async () => {
  let fail = true
  const { view } = await usersHarness({ listUsers: async () => { if (fail) throw new Error('Sin conexión.'); return [] } })
  await view.loadUsers()
  assert.equal(view.usersError.value, 'Sin conexión.')
  assert.equal(view.loading.value, false)
  fail = false
  await view.loadUsers()
  assert.equal(view.usersError.value, '')
  assert.equal(view.users.value.length, 0)
})
test('Users clears every filter before requesting the directory again', async () => {
  const queries = []
  const { view } = await usersHarness({ listUsers: async filters => { queries.push(plain(filters)); return [] } })
  Object.assign(view.filters, { search: 'persona', role: 'Administrador', active: 'true' })
  view.clearFilters()
  await Promise.resolve()
  assert.deepEqual(queries, [{ search: '', role: '', active: '' }])
})
test('Users prevents overlapping status mutations across different rows', async () => {
  const pending = deferred()
  const requests = []
  const { view } = await usersHarness({ setUserActive: (id, active) => { requests.push({ id, active }); return pending.promise } })
  const first = view.toggleStatus({ id: 801, active: true })
  await view.toggleStatus({ id: 802, active: false })
  assert.deepEqual(requests, [{ id: 801, active: false }])
  assert.equal(view.savingId.value, 801)
  pending.resolve({})
  await first
  assert.equal(view.savingId.value, null)
  assert.match(view.message.value, /desactivado/)
})

test('Login sends real credentials to the API and stores a complete session', async () => {
  let request
  const h = harness({ fetch: async (url, options) => { request = { url, options }; return json({ token: 'synthetic-session', user }) } })
  const auth = await h.load('src/services/auth.js')
  await auth.login(` ${user.email} `, 'synthetic-secret')
  assert.match(request.url, /\/auth\/login$/)
  assert.equal(request.options.method, 'POST')
  const payload = JSON.parse(request.options.body)
  assert.equal(payload.email, user.email)
  assert.equal(typeof payload.password, 'string')
  assert.equal(auth.isAuthenticated(), true)
  assert.deepEqual(plain(auth.getCurrentUser()), user)
})
test('Login reports incorrect credentials and remains on the form', async () => {
  const routes = []
  const h = harness({ imports: { 'vue-router': { useRoute: () => ({ query: {} }), useRouter: () => ({ push: async path => routes.push(path) }) }, '../services/auth': { login: async () => { throw new Error('Correo o contraseña incorrectos.') }, refreshCurrentUser: async () => user } } })
  const view = await h.load('src/views/LoginView.vue', ['submit', 'loading', 'error'])
  await view.submit()
  assert.equal(view.error.value, 'Correo o contraseña incorrectos.')
  assert.equal(view.loading.value, false)
  assert.equal(routes.length, 0)
})
test('Login retries a temporarily unavailable session without duplicating recovery', async () => {
  const pending = deferred()
  let calls = 0
  const routes = []
  const h = harness({ imports: { 'vue-router': { useRoute: () => ({ query: { session: 'unavailable' } }), useRouter: () => ({ push: async path => routes.push(path) }) }, '../services/auth': { login: async () => user, refreshCurrentUser: () => { calls++; return pending.promise } } } })
  const view = await h.load('src/views/LoginView.vue', ['retrySession', 'loading', 'error'])
  const first = view.retrySession()
  await view.retrySession()
  assert.equal(calls, 1)
  pending.resolve(user)
  await first
  assert.equal(view.error.value, '')
  assert.equal(view.loading.value, false)
  assert.deepEqual(routes, ['/dashboard'])
})

test('Users modal wraps Tab and Shift+Tab between visible first and last controls', async () => {
  const { view, document } = await usersHarness()
  let prevented = 0
  const control = visible => ({ getClientRects: () => visible ? [{}] : [], focus() { document.activeElement = this } })
  const first = control(true)
  const middle = control(true)
  const last = control(true)
  const hidden = control(false)
  const dialog = { querySelectorAll: () => [hidden, first, middle, last, hidden] }
  view.modalRef.value = dialog
  document.activeElement = first
  view.trapFocus({ shiftKey: true, preventDefault: () => prevented++ })
  assert.equal(document.activeElement, last)
  view.trapFocus({ shiftKey: false, preventDefault: () => prevented++ })
  assert.equal(document.activeElement, first)
  document.activeElement = middle
  view.trapFocus({ shiftKey: false, preventDefault: () => prevented++ })
  assert.equal(document.activeElement, middle)
  assert.equal(prevented, 2)
})
test('Users modal retains focus on the dialog when no visible control is available', async () => {
  const { view, document } = await usersHarness()
  let prevented = 0
  const dialog = { querySelectorAll: () => [{ getClientRects: () => [] }], focus() { document.activeElement = this } }
  view.modalRef.value = dialog
  for (const shiftKey of [false, true]) {
    document.activeElement = null
    view.trapFocus({ shiftKey, preventDefault: () => prevented++ })
    assert.equal(document.activeElement, dialog)
  }
  assert.equal(prevented, 2)
})
