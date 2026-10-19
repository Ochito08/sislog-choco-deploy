<template>
  <AppLayout title="Usuarios">
    <div class="users-page">
      <header class="page-heading">
        <div class="heading-copy">
          <span class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span> ADMINISTRACIÓN DE ACCESOS</span>
          <h1 ref="headingRef" tabindex="-1">Gestión de usuarios<span class="title-dot">.</span></h1>
          <p>Organiza los accesos, roles y permisos de las personas que hacen posible la logística humanitaria.</p>
        </div>
        <button id="create-user-button" class="button button-primary create-button" type="button" :disabled="rolesLoading || !roles.length" @click="openCreate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          <span>Nuevo usuario</span>
        </button>
      </header>

      <section class="overview" aria-label="Resumen de usuarios">
        <span class="overview-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
        </span>
        <div class="overview-text"><span>USUARIOS EN LA LISTA</span><strong>{{ loading ? '—' : users.length }}</strong></div>
        <div class="overview-separator" aria-hidden="true"></div>
        <p class="overview-description">Controla los accesos de administradores, coordinadores, transportadores y receptores desde un solo lugar.</p>
        <span class="overview-label"><span class="online-dot" aria-hidden="true"></span> Panel de administración</span>
      </section>

      <section class="panel filters-panel" aria-labelledby="filters-title">
        <div class="panel-heading">
          <div>
            <h2 id="filters-title">Buscar y filtrar</h2>
            <p>Encuentra rápidamente a un integrante del equipo.</p>
          </div>
          <span class="section-label">FILTROS</span>
        </div>
        <form class="filters" @submit.prevent="loadUsers">
          <label class="filter-field search-field">
            <span>Nombre o correo</span>
            <span class="search-control">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
              <input v-model.trim="filters.search" type="search" placeholder="Buscar usuario..." />
            </span>
          </label>
          <label class="filter-field"><span>Rol</span>
            <select v-model="filters.role">
              <option value="">Todos los roles</option>
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </label>
          <label class="filter-field"><span>Estado</span>
            <select v-model="filters.active">
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </label>
          <div class="filter-actions">
            <button class="button button-primary apply-button" type="submit" :disabled="loading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg>
              Filtrar
            </button>
            <button class="button button-secondary clear-button" type="button" @click="clearFilters">Limpiar</button>
          </div>
        </form>
      </section>

      <p v-if="message" class="notice notice-success" role="status">
        <span aria-hidden="true">✓</span> {{ message }}
      </p>
      <p v-if="error" class="notice notice-error" role="alert">
        <span aria-hidden="true">!</span> {{ error }}
      </p>
      <div v-if="rolesError" class="notice notice-error" role="alert">
        {{ rolesError }} No se pueden crear usuarios hasta disponer de los roles.
        <button class="button button-secondary" type="button" :disabled="rolesLoading" @click="loadRoles">Reintentar roles</button>
      </div>

      <section class="panel directory-panel" aria-labelledby="directory-title">
        <div class="directory-heading">
          <div><h2 id="directory-title">Directorio de usuarios</h2><p>Consulta y administra las cuentas registradas.</p></div>
          <span class="count-badge" aria-live="polite">{{ loading ? 'Consultando...' : usersError ? 'Sin resultados disponibles' : `${users.length} ${users.length === 1 ? 'resultado' : 'resultados'}` }}</span>
        </div>

        <div v-if="loading" class="empty-state" role="status">
          <div class="loading-ring" aria-hidden="true"></div>
          <strong>Consultando usuarios...</strong>
          <p>Estamos cargando la lista de accesos.</p>
        </div>
        <div v-else-if="usersError" class="empty-state" role="alert">
          <strong>No se pudo consultar el directorio</strong>
          <p>{{ usersError }}</p>
          <button class="button button-secondary" type="button" @click="loadUsers">Reintentar consulta</button>
        </div>
        <div v-else-if="users.length" class="table-wrap">
          <table>
            <thead><tr><th scope="col">Usuario</th><th scope="col">Rol asignado</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="item in users" :key="item.id">
                <td data-label="Usuario">
                  <div class="identity">
                    <div class="avatar" aria-hidden="true">{{ initials(item.name) }}</div>
                    <div class="identity-text"><strong>{{ item.name }}</strong><span>{{ item.email }}</span></div>
                  </div>
                </td>
                <td data-label="Rol"><span class="role-pill">{{ item.role }}</span></td>
                <td data-label="Estado"><span class="status-pill" :class="item.active ? 'is-active' : 'is-inactive'"><span class="status-dot" aria-hidden="true"></span>{{ item.active ? 'Activo' : 'Inactivo' }}</span></td>
                <td data-label="Acciones">
                  <div class="row-actions">
                    <button :id="`edit-user-${item.id}`" class="action-button edit-button" type="button" :aria-label="`Editar a ${item.name}`" @click="openEdit(item)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5 4 4M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11L4 20Z"/></svg>
                      Editar
                    </button>
                    <button class="action-button status-button" :class="item.active ? 'deactivate' : 'activate'" type="button" :disabled="savingId === item.id || (item.id === currentUser?.id && item.active)" :title="item.id === currentUser?.id && item.active ? 'No puedes desactivar tu propia cuenta' : ''" :aria-label="`${item.active ? 'Desactivar' : 'Activar'} a ${item.name}`" @click="toggleStatus(item)">
                      {{ savingId === item.id ? 'Guardando...' : item.active ? 'Desactivar' : 'Activar' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="10" r="6"/><path d="m16 15 5 5M9 8l4 4m0-4-4 4"/></svg>
          </div>
          <strong>No encontramos usuarios</strong>
          <p>Prueba con otros filtros o limpia la búsqueda para volver a consultar.</p>
          <button class="button button-secondary" type="button" @click="clearFilters">Limpiar filtros</button>
        </div>
      </section>

      <div v-if="modalOpen">
        <dialog ref="modalRef" class="modal" aria-modal="true" aria-labelledby="user-modal-title" aria-describedby="user-modal-description" tabindex="-1" @cancel.prevent="closeModal" @click="closeOnBackdrop">
          <div class="modal-heading">
            <div>
              <span class="modal-eyebrow">GESTIÓN DE ACCESOS</span>
              <h2 id="user-modal-title">{{ editingUser ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
              <p id="user-modal-description">{{ editingUser ? 'Actualiza sus datos y el rol asignado en el sistema.' : 'Completa la información para crear una nueva cuenta.' }}</p>
            </div>
            <button class="close-button" type="button" aria-label="Cerrar ventana" :disabled="formSaving" @click="closeModal">×</button>
          </div>
          <form class="user-form" :aria-busy="formSaving" @submit.prevent="saveUser">
            <p v-if="formError" ref="formErrorRef" tabindex="-1" class="notice notice-error" role="alert">{{ formError }}</p>
            <div class="form-grid">
              <label class="form-field">Nombre completo
                <input v-model.trim="form.name" autocomplete="name" maxlength="100" placeholder="Ej. María Córdoba" :aria-invalid="Boolean(fieldErrors.name)" :aria-describedby="fieldErrors.name ? 'user-name-error' : undefined" :disabled="formSaving" />
                <small id="user-name-error" v-if="fieldErrors.name">{{ fieldErrors.name }}</small>
              </label>
              <label class="form-field">Correo electrónico
                <input v-model.trim="form.email" type="email" autocomplete="email" maxlength="120" placeholder="usuario@sislog.co" :aria-invalid="Boolean(fieldErrors.email)" :aria-describedby="fieldErrors.email ? 'user-email-error' : undefined" :disabled="formSaving" />
                <small id="user-email-error" v-if="fieldErrors.email">{{ fieldErrors.email }}</small>
              </label>
              <label class="form-field">Rol del usuario
                <select v-model="form.role" :aria-invalid="Boolean(fieldErrors.role)" :aria-describedby="fieldErrors.role ? 'user-role-error' : undefined" :disabled="formSaving"><option value="" disabled>Seleccionar rol</option><option v-for="role in roles" :key="role" :value="role">{{ role }}</option></select>
                <small id="user-role-error" v-if="fieldErrors.role">{{ fieldErrors.role }}</small>
              </label>
              <label class="form-field">{{ editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña' }}
                <input v-model="form.password" type="password" autocomplete="new-password" maxlength="72" :placeholder="editingUser ? 'Vacía para conservar la actual' : 'Mínimo 6 caracteres'" :aria-invalid="Boolean(fieldErrors.password)" :aria-describedby="fieldErrors.password ? 'user-password-error' : undefined" :disabled="formSaving" />
                <small id="user-password-error" v-if="fieldErrors.password">{{ fieldErrors.password }}</small>
              </label>
            </div>
            <div v-if="editingUser" class="form-tip"><span aria-hidden="true">i</span> Si no escribes una nueva contraseña, la cuenta conservará la actual.</div>
            <div class="modal-actions">
              <button class="button button-secondary" type="button" :disabled="formSaving" @click="closeModal">Cancelar</button>
              <button class="button button-primary" type="submit" :disabled="formSaving || rolesLoading || !roles.length">{{ formSaving ? 'Guardando...' : editingUser ? 'Guardar cambios' : 'Crear usuario' }}</button>
            </div>
          </form>
        </dialog>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { getCurrentUser } from '../services/auth'
import { createUser, listRoles, listUsers, setUserActive, updateUser } from '../services/users'

const currentUser = getCurrentUser()
const users = ref([])
const roles = ref([])
const rolesLoading = ref(true)
const rolesError = ref('')
const usersError = ref('')
let usersRequestId = 0
const loading = ref(true)
const error = ref('')
const message = ref('')
const savingId = ref(null)
const modalOpen = ref(false)
const modalRef = ref(null)
const headingRef = ref(null)
const formErrorRef = ref(null)
let previousFocus = null
let previousFocusId = ''
const editingUser = ref(null)
const formSaving = ref(false)
const formError = ref('')
const fieldErrors = ref({})
const filters = reactive({ search: '', role: '', active: '' })
const form = reactive({ name: '', email: '', role: '', password: '' })

function initials(name) {
  return String(name || 'US').split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

async function loadUsers() {
  const requestId = ++usersRequestId
  loading.value = true
  usersError.value = ''
  try {
    const result = await listUsers({ ...filters })
    if (requestId === usersRequestId) users.value = result
  } catch (e) {
    if (requestId === usersRequestId) usersError.value = e.message || 'Verifica la conexión e inténtalo de nuevo.'
  } finally {
    if (requestId === usersRequestId) loading.value = false
  }
}

async function loadRoles() {
  rolesLoading.value = true
  rolesError.value = ''
  try {
    const result = await listRoles()
    if (!Array.isArray(result) || !result.length) throw new Error('No hay roles disponibles.')
    roles.value = result
  } catch (e) {
    roles.value = []
    rolesError.value = `No se pudieron cargar los roles. ${e.message || ''}`
  } finally {
    rolesLoading.value = false
  }
}

function clearFilters() {
  filters.search = ''
  filters.role = ''
  filters.active = ''
  loadUsers()
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.role = ''
  form.password = ''
  formError.value = ''
  fieldErrors.value = {}
}

function focusModal() {
  previousFocus = document.activeElement
  previousFocusId = previousFocus?.id || ''
  modalOpen.value = true
  nextTick(() => {
    if (!modalOpen.value) return
    modalRef.value?.showModal()
    modalRef.value?.querySelector('input')?.focus()
  })
}

function openCreate() {
  if (rolesLoading.value || !roles.value.length) return
  editingUser.value = null
  resetForm()
  focusModal()
}

function openEdit(item) {
  editingUser.value = item
  resetForm()
  form.name = item.name
  form.email = item.email
  form.role = item.role
  focusModal()
}

function closeModal() {
  if (formSaving.value) return
  modalRef.value?.close()
  modalOpen.value = false
  editingUser.value = null
  restoreFocus()
}

async function restoreFocus() {
  await nextTick()
  if (modalOpen.value) return
  const target = previousFocus?.isConnected
    ? previousFocus
    : previousFocusId ? document.getElementById(previousFocusId) : null
  if (target && !target.disabled && target.getClientRects().length) target.focus()
  else headingRef.value?.focus()
}

function closeOnBackdrop(event) {
  if (event.target !== modalRef.value) return
  const rect = modalRef.value.getBoundingClientRect()
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal()
}

async function saveUser() {
  if (formSaving.value || rolesLoading.value || !roles.value.length) return
  formSaving.value = true
  formError.value = ''
  fieldErrors.value = {}
  message.value = ''
  try {
    const payload = { name: form.name, email: form.email, role: form.role }
    if (!editingUser.value || form.password) payload.password = form.password

    if (editingUser.value) {
      await updateUser(editingUser.value.id, payload)
      message.value = 'Usuario actualizado correctamente.'
    } else {
      await createUser(payload)
      message.value = 'Usuario creado correctamente.'
    }
    await loadUsers()
    formSaving.value = false
    closeModal()
  } catch (e) {
    formError.value = e.message
    fieldErrors.value = e.fieldErrors || {}
    formSaving.value = false
    await nextTick()
    const focusTarget = modalRef.value?.querySelector('[aria-invalid="true"]') || formErrorRef.value
    focusTarget?.focus()
  } finally {
    formSaving.value = false
  }
}

async function toggleStatus(item) {
  message.value = ''
  error.value = ''
  savingId.value = item.id
  try {
    await setUserActive(item.id, !item.active)
    message.value = item.active ? 'Usuario desactivado correctamente.' : 'Usuario activado correctamente.'
    await loadUsers()
  } catch (e) {
    error.value = e.message
  } finally {
    savingId.value = null
  }
}

onMounted(() => {
  loadRoles()
  loadUsers()
})
</script>

<style scoped>
dialog.modal{margin:auto;padding:0;color:inherit;width:min(calc(100% - 40px),660px)}dialog.modal::backdrop{background:rgba(15,40,29,.61);backdrop-filter:blur(3px)}
@media(max-width:620px){dialog.modal{margin:auto auto 8px;width:calc(100% - 16px)}}
.users-page{--green:#164a3a;--green-2:#28745a;--gold:#d4a72c;--line:#e3eae5;--muted:#74877c;--ink:#203a2e;width:100%;max-width:1260px;color:var(--ink)}
.page-heading{display:flex;align-items:center;justify-content:space-between;gap:22px;margin:2px 0 26px}.heading-copy{min-width:0}.eyebrow{display:flex;align-items:center;gap:8px;color:#378363;font-size:10px;font-weight:850;letter-spacing:.15em}.eyebrow-dot,.online-dot{width:7px;height:7px;border-radius:50%;background:#38a274}.page-heading h1{margin:10px 0 8px;font-size:clamp(26px,3vw,34px);letter-spacing:-.04em;line-height:1.18}.title-dot{color:var(--gold)}.page-heading p{margin:0;max-width:630px;color:#718078;font-size:13px;line-height:1.65}
.button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 17px;border:1px solid transparent;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;transition:background .16s,border-color .16s,transform .16s}.button svg{width:17px;height:17px}.button-primary{background:var(--green);color:#fff;box-shadow:0 5px 14px rgba(22,74,58,.13)}.button-primary:not(:disabled):hover{background:#267759;transform:translateY(-1px)}.button-secondary{border-color:#dce6df;background:#fff;color:#4a6054}.button-secondary:not(:disabled):hover{background:#f0f6f1;border-color:#c5d8cb}.button:disabled{opacity:.6;cursor:not-allowed}.create-button{min-height:46px;padding:0 20px}
.overview{display:flex;align-items:center;gap:20px;min-height:115px;padding:23px 27px;margin-bottom:24px;border:1px solid #dbe9df;border-radius:16px;background:linear-gradient(100deg,#e8f3ea 0%,#f5f9f3 65%,#fff 100%)}.overview-icon{display:grid;place-items:center;flex:none;width:54px;height:54px;border-radius:15px;background:#164a3a;color:#fff;box-shadow:0 8px 18px rgba(22,74,58,.12)}.overview-icon svg{width:25px;height:25px}.overview-text{display:grid;gap:4px;min-width:100px}.overview-text span{color:#607d6b;font-size:9px;font-weight:800;letter-spacing:.1em}.overview-text strong{color:#164a3a;font-size:30px;letter-spacing:-.04em;line-height:1}.overview-separator{width:1px;height:54px;background:#ceded2}.overview-description{max-width:360px;margin:0;font-size:12px;line-height:1.65;color:#547064}.overview-label{display:inline-flex;align-items:center;gap:8px;margin-left:auto;padding:9px 12px;border:1px solid #d6e7da;border-radius:999px;background:#fff;color:#327354;font-size:10px;font-weight:800;white-space:nowrap}
.panel{overflow:hidden;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:0 4px 18px rgba(27,71,47,.025)}.filters-panel{margin-bottom:18px;padding:22px 23px 24px}.panel-heading,.directory-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:15px}.panel-heading{margin-bottom:20px}.panel-heading h2,.directory-heading h2{margin:0;font-size:16px;letter-spacing:-.02em}.panel-heading p,.directory-heading p{margin:5px 0 0;color:var(--muted);font-size:12px;line-height:1.5}.section-label{padding:7px 9px;border-radius:7px;background:#f1f6f2;color:#6c8f7a;font-size:9px;font-weight:850;letter-spacing:.1em}
.filters{display:grid;grid-template-columns:minmax(180px,1.45fr) minmax(135px,.95fr) minmax(135px,.8fr) auto;align-items:end;gap:12px}.filter-field{display:grid;min-width:0;gap:8px;color:#345344;font-size:11px;font-weight:800}.filter-field input,.filter-field select,.form-field input,.form-field select{width:100%;height:43px;min-width:0;padding:0 13px;border:1px solid #dbe5df;border-radius:9px;outline:none;background:#fbfcfa;color:#273e32;font-size:12px;font-weight:500;transition:border-color .16s,box-shadow .16s}.filter-field input::placeholder,.form-field input::placeholder{color:#9bab9f}.filter-field input:focus,.filter-field select:focus,.form-field input:focus,.form-field select:focus{border-color:#2f936b;box-shadow:0 0 0 3px rgba(47,147,107,.11);background:#fff}.search-control{position:relative}.search-control svg{position:absolute;left:13px;top:50%;width:17px;height:17px;transform:translateY(-50%);color:#90a69a;pointer-events:none}.search-control input{padding-left:39px}.filter-actions{display:flex;gap:9px;align-items:center}.filter-actions .button{min-height:43px}
.notice{display:flex;align-items:center;gap:9px;margin:0 0 15px;padding:13px 15px;border:1px solid transparent;border-radius:10px;font-size:12px;line-height:1.55}.notice>span{display:grid;place-items:center;flex:none;width:21px;height:21px;border-radius:50%;font-size:11px;font-weight:900}.notice-success{border-color:#cfe9d8;background:#eff9f1;color:#23724b}.notice-success>span{background:#d7eddc}.notice-error{border-color:#f2ccca;background:#fff2f1;color:#9d3b34}.notice-error>span{background:#f9dbd7}
.directory-heading{align-items:center;padding:21px 23px;border-bottom:1px solid #e9efea}.count-badge{flex:none;padding:8px 12px;border-radius:999px;background:#eaf3ee;color:#28745a;font-size:11px;font-weight:800}
.table-wrap{width:100%;overflow-x:auto}table{width:100%;min-width:680px;border-collapse:collapse}thead{background:#f8faf8}th{text-align:left;padding:16px 21px;border-bottom:1px solid #ebf0eb;color:#7a9182;font-size:10px;font-weight:850;letter-spacing:.095em;text-transform:uppercase}td{padding:18px 21px;border-bottom:1px solid #eff3ef;font-size:12px;vertical-align:middle}tbody tr:last-child td{border-bottom:0}tbody tr:hover{background:#fbfdfb}.identity{display:flex;align-items:center;gap:12px;min-width:0}.avatar{display:grid;place-items:center;flex:none;width:42px;height:42px;border:1px solid #d7e9dd;border-radius:13px;background:#eaf3ed;color:#227453;font-size:12px;font-weight:850}.identity-text{min-width:0}.identity-text strong,.identity-text span{display:block;max-width:300px;overflow-wrap:anywhere}.identity-text strong{color:#264337;font-size:12px;font-weight:850}.identity-text span{margin-top:4px;color:#83978a;font-size:11px}.role-pill{display:inline-block;max-width:220px;padding:8px 11px;border:1px solid #e5ede8;border-radius:8px;background:#f5f8f5;color:#48705b;font-size:11px;font-weight:750;line-height:1.35}.status-pill{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border-radius:999px;font-size:11px;font-weight:850;white-space:nowrap}.status-dot{width:7px;height:7px;border-radius:50%;background:currentColor}.is-active{background:#e6f6eb;color:#218253}.is-inactive{background:#f0f2f0;color:#84918a}.row-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.action-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:35px;padding:7px 10px;border:1px solid transparent;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap;transition:background .16s}.action-button svg{width:15px;height:15px}.edit-button{background:#edf5ef;color:#24694e}.edit-button:hover{background:#dcece1}.deactivate{background:#fff2f0;color:#aa4940}.deactivate:hover{background:#fae2de}.activate{background:#e4f5eb;color:#267b51}.activate:hover{background:#d6eddf}.action-button:disabled{opacity:.45;cursor:not-allowed}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:240px;padding:35px 20px;text-align:center}.empty-state strong{margin-top:11px;font-size:15px}.empty-state p{max-width:360px;margin:9px 0 17px;color:var(--muted);font-size:12px;line-height:1.6}.empty-icon{display:grid;place-items:center;width:55px;height:55px;border-radius:17px;background:#f0f6f1;color:#4d8d68}.empty-icon svg{width:27px;height:27px}.loading-ring{width:28px;height:28px;margin-bottom:7px;border:3px solid #dceadf;border-top-color:#28745a;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.modal-backdrop{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:20px;background:rgba(15,40,29,.61);backdrop-filter:blur(3px)}.modal{width:min(100%,660px);max-height:min(90vh,780px);overflow-y:auto;border:1px solid #e0e9e1;border-radius:18px;background:#fff;box-shadow:0 30px 95px rgba(9,30,19,.26);outline:none}.modal-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;padding:27px 29px 21px;border-bottom:1px solid #edf2ed}.modal-eyebrow{color:#357e5c;font-size:10px;font-weight:850;letter-spacing:.13em}.modal-heading h2{margin:8px 0;font-size:24px;letter-spacing:-.035em}.modal-heading p{margin:0;color:var(--muted);font-size:12px;line-height:1.6}.close-button{display:grid;place-items:center;flex:none;width:36px;height:36px;border:1px solid #e6ebe7;border-radius:10px;background:#fff;color:#6d8173;font-size:26px;line-height:1;cursor:pointer}.close-button:hover{background:#f2f6f2}.close-button:disabled{opacity:.5}.user-form{padding:23px 29px 27px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:19px 16px}.form-field{display:grid;align-content:start;gap:8px;font-size:12px;font-weight:800;color:#345344}.form-field input,.form-field select{height:46px;font-size:13px}.form-field small{font-size:11px;font-weight:600;color:#ad413d;line-height:1.4}.form-field [aria-invalid="true"]{border-color:#d17c76}.form-tip{display:flex;align-items:flex-start;gap:9px;margin-top:19px;padding:12px 13px;border-radius:9px;background:#f5f8f5;color:#627a6b;font-size:11px;line-height:1.55}.form-tip span{display:grid;place-items:center;flex:none;width:18px;height:18px;border-radius:50%;background:#e0ece2;color:#327253;font-family:Georgia,serif;font-weight:bold}.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:25px;padding-top:20px;border-top:1px solid #eff2ef}.modal-actions .button{min-height:43px}
:focus-visible{outline:3px solid #d4a72c;outline-offset:3px}
@media(max-width:1100px){.overview-description{max-width:280px}.overview-label{display:none}.filters{grid-template-columns:minmax(170px,1.5fr) minmax(130px,1fr) minmax(125px,.8fr)}.filter-actions{grid-column:1/-1;justify-content:flex-end}}
@media(max-width:740px){.page-heading{align-items:flex-start;flex-direction:column;margin-bottom:18px}.create-button{width:100%}.overview{gap:14px;padding:19px}.overview-description{display:none}.overview-separator{display:none}.filters{grid-template-columns:repeat(2,minmax(0,1fr))}.search-field{grid-column:1/-1}.filter-actions{justify-content:stretch}.filter-actions .button{flex:1}.filters-panel{padding:19px}.directory-heading{padding:18px 19px}}
@media(max-width:620px){.filters{grid-template-columns:minmax(0,1fr)}.search-field,.filter-actions{grid-column:auto}.filter-actions{display:grid;grid-template-columns:1fr 1fr}.table-wrap{overflow:visible;padding:12px;background:#f9fbf9}table,tbody{display:block;width:100%;min-width:0}thead{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}tbody tr{display:block;margin-bottom:12px;padding:6px 16px;border:1px solid #e2eae3;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(22,74,58,.025)}tbody tr:last-child{margin-bottom:0}tbody tr:hover{background:#fff}td{display:grid;grid-template-columns:80px minmax(0,1fr);align-items:center;gap:11px;min-width:0;padding:12px 0;border-bottom:1px solid #eff2ef}tbody tr:last-child td{border-bottom:1px solid #eff2ef}tbody tr td:last-child,tbody tr:last-child td:last-child{border-bottom:0}td::before{content:attr(data-label);font-size:10px;font-weight:850;letter-spacing:.025em;color:#819186}th{display:none}.identity{min-width:0}.avatar{width:38px;height:38px;border-radius:10px}.identity-text span{font-size:10px}.row-actions{gap:6px}.action-button{min-height:35px}.role-pill{max-width:100%;white-space:normal}.modal-backdrop{align-items:end;padding:8px}.modal{max-height:calc(100dvh - 16px);border-radius:16px}.modal-heading{padding:21px 19px 17px}.user-form{padding:20px 19px}.form-grid{grid-template-columns:minmax(0,1fr);gap:15px}.modal-actions{display:grid;grid-template-columns:1fr 1fr}.modal-actions .button{padding:0 8px}.overview-icon{width:46px;height:46px}.overview-text strong{font-size:26px}}
@media(max-width:370px){.page-heading h1{font-size:25px}.directory-heading{align-items:flex-start;flex-direction:column}.filter-actions{grid-template-columns:1fr}.identity{gap:8px}td{grid-template-columns:65px minmax(0,1fr);gap:9px}.row-actions{align-items:stretch}.action-button{flex:1}}
@media(prefers-reduced-motion:reduce){.loading-ring{animation:none}.button,.action-button{transition:none}}
</style>
