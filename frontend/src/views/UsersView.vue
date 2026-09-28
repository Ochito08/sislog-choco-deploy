<template>
  <AppLayout title="Usuarios">
    <div class="header">
      <div>
        <h1>Usuarios y roles</h1>
        <p>Administración de accesos para coordinadores, transportadores, receptores y administradores.</p>
      </div>
      <button class="primary" @click="openCreate">＋ Nuevo usuario</button>
    </div>

    <section class="panel filters-panel">
      <form class="filters" @submit.prevent="loadUsers">
        <input v-model.trim="filters.search" placeholder="Buscar por nombre o correo" />
        <select v-model="filters.role">
          <option value="">Todos los roles</option>
          <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
        </select>
        <select v-model="filters.active">
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button type="submit">Filtrar</button>
        <button type="button" class="secondary" @click="clearFilters">Limpiar</button>
      </form>
    </section>

    <p v-if="message" class="message success">{{ message }}</p>
    <p v-if="error" class="message error">{{ error }}</p>

    <section class="panel users-panel">
      <div v-if="loading" class="empty">Consultando usuarios...</div>
      <div v-else-if="users.length" class="table-wrap">
        <table>
          <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            <tr v-for="item in users" :key="item.id">
              <td>
                <div class="identity"><div class="avatar">{{ initials(item.name) }}</div><div><strong>{{ item.name }}</strong><span>{{ item.email }}</span></div></div>
              </td>
              <td><span class="role">{{ item.role }}</span></td>
              <td><span class="status" :class="item.active ? 'active' : 'inactive'">{{ item.active ? 'Activo' : 'Inactivo' }}</span></td>
              <td>
                <div class="actions">
                  <button class="edit" @click="openEdit(item)">Editar</button>
                  <button
                    class="toggle"
                    :class="item.active ? 'deactivate' : 'activate'"
                    :disabled="savingId === item.id || (item.id === currentUser?.id && item.active)"
                    :title="item.id === currentUser?.id && item.active ? 'No puedes desactivar tu propia cuenta' : ''"
                    @click="toggleStatus(item)"
                  >{{ savingId === item.id ? 'Guardando...' : item.active ? 'Desactivar' : 'Activar' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty">No se encontraron usuarios con los filtros seleccionados.</div>
    </section>

    <div v-if="modalOpen" class="modal-backdrop" @click.self="closeModal">
      <section class="modal" role="dialog" aria-modal="true">
        <div class="modal-header"><div><h2>{{ editingUser ? 'Editar usuario' : 'Nuevo usuario' }}</h2><p>{{ editingUser ? 'Actualiza los datos y permisos del usuario.' : 'Crea un acceso para SISLOG-CHOCÓ.' }}</p></div><button class="close" @click="closeModal">×</button></div>
        <form @submit.prevent="saveUser">
          <p v-if="formError" class="message error">{{ formError }}</p>
          <div class="form-grid">
            <label>Nombre completo
              <input v-model.trim="form.name" maxlength="100" placeholder="Ej. María Córdoba" />
              <small v-if="fieldErrors.name">{{ fieldErrors.name }}</small>
            </label>
            <label>Correo electrónico
              <input v-model.trim="form.email" type="email" maxlength="120" placeholder="usuario@sislog.co" />
              <small v-if="fieldErrors.email">{{ fieldErrors.email }}</small>
            </label>
            <label>Rol
              <select v-model="form.role"><option value="" disabled>Seleccionar rol</option><option v-for="role in roles" :key="role" :value="role">{{ role }}</option></select>
              <small v-if="fieldErrors.role">{{ fieldErrors.role }}</small>
            </label>
            <label>{{ editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña' }}
              <input v-model="form.password" type="password" maxlength="72" :placeholder="editingUser ? 'Déjala vacía para conservarla' : 'Mínimo 6 caracteres'" />
              <small v-if="fieldErrors.password">{{ fieldErrors.password }}</small>
            </label>
          </div>
          <div class="modal-actions"><button type="button" class="secondary" @click="closeModal">Cancelar</button><button class="primary" type="submit" :disabled="formSaving">{{ formSaving ? 'Guardando...' : editingUser ? 'Guardar cambios' : 'Crear usuario' }}</button></div>
        </form>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { getCurrentUser } from '../services/auth'
import { createUser, listRoles, listUsers, setUserActive, updateUser } from '../services/users'

const currentUser = getCurrentUser()
const users = ref([])
const roles = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')
const savingId = ref(null)
const modalOpen = ref(false)
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
  loading.value = true
  error.value = ''
  try {
    users.value = await listUsers(filters)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
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

function openCreate() {
  editingUser.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(item) {
  editingUser.value = item
  resetForm()
  form.name = item.name
  form.email = item.email
  form.role = item.role
  modalOpen.value = true
}

function closeModal() {
  if (formSaving.value) return
  modalOpen.value = false
  editingUser.value = null
}

async function saveUser() {
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
    modalOpen.value = false
    await loadUsers()
  } catch (e) {
    formError.value = e.message
    fieldErrors.value = e.fieldErrors || {}
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

onMounted(async () => {
  try {
    roles.value = await listRoles()
  } catch (e) {
    error.value = e.message
  }
  await loadUsers()
})
</script>

<style scoped>
.header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.header h1{margin:0;font-size:22px}.header p{margin:5px 0 0;color:#98a2b3;font-size:11px}.primary,.secondary,.filters button,.actions button{border:0;border-radius:8px;font-size:10px;font-weight:800;cursor:pointer}.primary{padding:11px 15px;background:#164a3a;color:#fff}.secondary{padding:10px 14px;border:1px solid #d9e2dd;background:#fff;color:#667085}.panel{background:#fff;border:1px solid #e4eae7;border-radius:10px}.filters-panel{margin-bottom:12px;padding:14px}.filters{display:grid;grid-template-columns:minmax(190px,1fr) 230px 150px auto auto;gap:9px}.filters input,.filters select,.form-grid input,.form-grid select{width:100%;height:40px;padding:0 11px;border:1px solid #d9e2dd;border-radius:7px;background:#fafcfb;color:#263238;outline:none;font-size:10px}.filters button{padding:0 14px;background:#164a3a;color:#fff}.filters .secondary{background:#fff;color:#667085;border:1px solid #d9e2dd}.message{margin:0 0 12px;padding:10px 12px;border-radius:8px;font-size:10px}.message.success{background:#e8f3ee;color:#28745a}.message.error{background:#fff0f0;color:#a83b3b}.users-panel{overflow:hidden}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:760px}th,td{padding:13px 15px;text-align:left;border-bottom:1px solid #eef2f0;font-size:10px}th{background:#fafcfb;color:#7d8b86;font-size:9px;text-transform:uppercase;letter-spacing:.5px}.identity{display:flex;align-items:center;gap:10px}.avatar{width:34px;height:34px;display:grid;place-items:center;flex:0 0 auto;border-radius:50%;background:#e8f3ee;color:#164a3a;font-size:9px;font-weight:800}.identity strong,.identity span{display:block}.identity strong{font-size:10px}.identity span{margin-top:3px;color:#98a2b3;font-size:9px}.role{display:inline-block;max-width:250px;padding:6px 8px;border-radius:999px;background:#f4f7f5;color:#28745a;font-size:9px}.status{display:inline-block;padding:5px 8px;border-radius:999px;font-size:9px;font-weight:800}.status.active{background:#e8f3ee;color:#28745a}.status.inactive{background:#f1f3f2;color:#7d8b86}.actions{display:flex;gap:6px}.actions button{padding:7px 9px}.edit{background:#eef5f2;color:#164a3a}.toggle.deactivate{background:#fff0f0;color:#a83b3b}.toggle.activate{background:#e8f3ee;color:#28745a}.actions button:disabled{opacity:.45;cursor:not-allowed}.empty{padding:42px;text-align:center;color:#7d8b86;font-size:11px}.modal-backdrop{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:18px;background:rgba(19,39,32,.48)}.modal{width:100%;max-width:650px;max-height:90vh;overflow:auto;padding:20px;background:#fff;border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.22)}.modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:18px}.modal h2{margin:0;font-size:17px}.modal p{margin:5px 0 0;color:#98a2b3;font-size:10px}.close{border:0;background:transparent;color:#667085;font-size:24px;cursor:pointer}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.form-grid label{font-size:10px;font-weight:800}.form-grid input,.form-grid select{margin-top:6px}.form-grid small{display:block;margin-top:5px;color:#b33a3a;font-size:9px;font-weight:500}.modal-actions{margin-top:20px;display:flex;justify-content:flex-end;gap:9px}.modal-actions button:disabled{opacity:.6;cursor:wait}@media(max-width:900px){.filters{grid-template-columns:1fr 1fr}.filters input{grid-column:1/-1}}@media(max-width:620px){.header{align-items:flex-start;flex-direction:column}.header>.primary{width:100%}.filters{grid-template-columns:1fr}.filters input{grid-column:auto}.filters button{height:40px}.form-grid{grid-template-columns:1fr}.modal-actions{flex-direction:column-reverse}.modal-actions button{width:100%}}
</style>
