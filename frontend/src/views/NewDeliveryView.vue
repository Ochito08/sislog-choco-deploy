<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Registrar Nueva Entrega</h1>
    <form @submit.prevent="crearEntrega" class="space-y-4 max-w-md">
      <input v-model="cliente" placeholder="Nombre del cliente" class="border p-2 w-full" />
      <select v-model="status" class="border p-2 w-full">
        <option>Pendiente</option>
        <option>En tránsito</option>
        <option>Entregada</option>
      </select>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cliente = ref('')
const status = ref('Pendiente')

function crearEntrega() {
  console.log(`Entrega creada: ${cliente.value} - ${status.value}`)
  alert(`Entrega creada para ${cliente.value} con estado ${status.value}`)
  cliente.value = ''
  status.value = 'Pendiente'
}
</script>
