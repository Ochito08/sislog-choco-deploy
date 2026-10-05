<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Detalle de Entrega</h1>
    <p><strong>Cliente:</strong> {{ delivery.cliente }}</p>
    <p><strong>Estado:</strong> <StatusBadge :status="delivery.status" /></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'

const delivery = ref({
  id: 1,
  cliente: 'Juan Pérez',
  status: 'Pendiente'
})
</script>
