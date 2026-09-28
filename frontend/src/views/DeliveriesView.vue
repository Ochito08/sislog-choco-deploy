<template>
  <AppLayout title="Entregas">
    <div class="header">
      <div><h1>Entregas</h1><p>Consulta y filtra los envíos por estado, destino o responsable.</p></div>
      <RouterLink v-if="canCreate" to="/entregas/nueva" class="primary">＋ Nueva entrega</RouterLink>
    </div>

    <section class="panel filters-panel">
      <form class="filters" @submit.prevent="load">
        <input v-model.trim="filters.search" placeholder="Buscar por ID, origen, ayuda o transporte" />
        <select v-model="filters.status">
          <option value="">Todos los estados</option><option>Pendiente</option><option>Preparando</option><option>En tránsito</option><option>Entregada</option>
        </select>
        <input v-model.trim="filters.destination" placeholder="Filtrar por destino" />
        <select v-if="user?.role !== 'Responsable de transporte'" v-model="filters.responsibleId">
          <option value="">Todos los responsables</option><option v-for="person in responsibles" :key="person.id" :value="person.id">{{ person.name }}</option>
        </select>
        <button type="submit">Aplicar</button>
        <button type="button" class="secondary" @click="clearFilters">Limpiar</button>
      </form>
    </section>

    <section class="panel">
      <p v-if="error" class="error">{{ error }}</p>
      <div v-if="loading" class="empty">Consultando entregas...</div>
      <div v-else-if="deliveries.length"><DeliveryCard v-for="item in deliveries" :key="item.id" :delivery="item" /></div>
      <div v-else class="empty">No se encontraron entregas con esos filtros.</div>
    </section>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import DeliveryCard from '../components/DeliveryCard.vue'
import { listDeliveries } from '../services/deliveries'
import { getCurrentUser } from '../services/auth'
import { listResponsibles } from '../services/users'

const deliveries = ref([])
const responsibles = ref([])
const loading = ref(true)
const error = ref('')
const user = getCurrentUser()
const canCreate = ['Coordinador logístico', 'Administrador'].includes(user?.role)
const filters = reactive({ search: '', status: '', destination: '', responsibleId: '' })

async function load() {
  loading.value = true
  error.value = ''
  try { deliveries.value = await listDeliveries(filters) }
  catch (e) { error.value = e.message }
  finally { loading.value = false }
}

function clearFilters() {
  filters.search = ''; filters.status = ''; filters.destination = ''; filters.responsibleId = ''
  load()
}

onMounted(async () => {
  try { responsibles.value = await listResponsibles() } catch { responsibles.value = [] }
  await load()
})
</script>

<style scoped>
.header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}.header h1{margin:0;font-size:22px}.header p{margin:5px 0 0;color:#98a2b3;font-size:11px}.primary{padding:11px 15px;border-radius:8px;background:#164a3a;color:#fff;text-decoration:none;font-size:11px;font-weight:800}.panel{overflow:hidden;background:#fff;border:1px solid #e4eae7;border-radius:10px}.filters-panel{margin-bottom:12px;padding:14px}.filters{display:grid;grid-template-columns:minmax(180px,1.3fr) 160px minmax(140px,.8fr) 220px auto auto;gap:8px}.filters input,.filters select{height:40px;padding:0 10px;border:1px solid #d9e2dd;border-radius:7px;background:#fafcfb;color:#263238;outline:none;font-size:10px}.filters button{padding:0 13px;border:0;border-radius:7px;background:#164a3a;color:#fff;font-size:10px;font-weight:800;cursor:pointer}.filters .secondary{border:1px solid #d9e2dd;background:#fff;color:#667085}.empty{padding:40px;text-align:center;color:#7d8b86;font-size:11px}.error{margin:12px;padding:10px;border-radius:7px;background:#fff0f0;color:#a83b3b;font-size:10px}@media(max-width:1050px){.filters{grid-template-columns:1fr 1fr 1fr}.filters input:first-child{grid-column:span 2}}@media(max-width:650px){.header{align-items:flex-start;flex-direction:column}.primary{width:100%;text-align:center}.filters{grid-template-columns:1fr}.filters input:first-child{grid-column:auto}.filters button{height:40px}}
</style>
