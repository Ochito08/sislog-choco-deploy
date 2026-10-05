<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Gestión de Entregas</h1>

    <!-- Filtros -->
    <div class="flex gap-4 mb-6">
      <input v-model="search" placeholder="Buscar cliente..." class="border p-2 flex-1" />
      <select v-model="filterStatus" class="border p-2">
        <option value="">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En tránsito">En tránsito</option>
        <option value="Entregada">Entregada</option>
      </select>
      <button @click="clearFilters" class="bg-gray-200 px-4 py-2 rounded">Limpiar</button>
    </div>

    <!-- Listado -->
    <div class="grid gap-4">
      <DeliveryCard
        v-for="delivery in filteredDeliveries"
        :key="delivery.id"
        :delivery="delivery"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DeliveryCard from '../components/DeliveryCard.vue'

const deliveries = ref([])
const search = ref('')
const filterStatus = ref('')

onMounted(() => {
  // Simulación de carga desde API
  deliveries.value = [
    { id: 1, cliente: 'Juan Pérez', status: 'Pendiente' },
    { id: 2, cliente: 'María Gómez', status: 'En tránsito' },
    { id: 3, cliente: 'Carlos López', status: 'Entregada' }
  ]
})

const filteredDeliveries = computed(() => {
  return deliveries.value.filter(d => {
    const matchSearch = d.cliente.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = filterStatus.value ? d.status === filterStatus.value : true
    return matchSearch && matchStatus
  })
})

function clearFilters() {
  search.value = ''
  filterStatus.value = ''
}
</script>
