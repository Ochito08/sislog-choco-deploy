<template>
  <AppLayout title="Entregas">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">Entregas</h1>
          <p class="text-sm text-gray-500">Consulta y filtra los envíos por estado, destino o responsable.</p>
        </div>
        <RouterLink
          v-if="canCreate"
          to="/entregas/nueva"
          class="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-semibold"
        >
          ＋ Nueva entrega
        </RouterLink>
      </div>

      <!-- Filtros -->
      <form @submit.prevent="load" class="grid md:grid-cols-3 gap-3 bg-white p-4 rounded-md shadow">
        <input v-model="filters.search" class="border rounded-md p-2 text-sm" placeholder="Buscar por ID, origen, ayuda o transporte" />
        <select v-model="filters.status" class="border rounded-md p-2 text-sm">
          <option value="">Todos los estados</option>
          <option>Pendiente</option>
          <option>Preparando</option>
          <option>En tránsito</option>
          <option>Entregada</option>
        </select>
        <input v-model="filters.destination" class="border rounded-md p-2 text-sm" placeholder="Filtrar por destino" />
        <select v-if="user?.role !== 'Responsable de transporte'" v-model="filters.responsibleId" class="border rounded-md p-2 text-sm">
          <option value="">Todos los responsables</option>
          <option v-for="person in responsibles" :key="person.id" :value="person.id">{{ person.name }}</option>
        </select>
        <div class="flex gap-2 col-span-full">
          <button type="submit" class="px-3 py-2 bg-green-700 text-white rounded-md text-sm font-semibold">Aplicar</button>
          <button type="button" @click="clearFilters" class="px-3 py-2 border rounded-md text-sm">Limpiar</button>
        </div>
      </form>

      <!-- Lista -->
      <div class="bg-white p-4 rounded-md shadow">
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <div v-if="loading" class="text-center text-gray-500">Consultando entregas...</div>
        <div v-else-if="deliveries.length" class="grid md:grid-cols-3 gap-4">
          <DeliveryCard v-for="item in deliveries" :key="item.id" :delivery="item" />
        </div>
        <div v-else class="text-center text-gray-400">No se encontraron entregas con esos filtros.</div>
      </div>
    </div>
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
