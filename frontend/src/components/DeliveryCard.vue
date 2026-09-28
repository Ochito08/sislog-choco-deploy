<template>
  <div class="border rounded-md p-4 shadow hover:shadow-lg transition">
    <h2 class="font-semibold text-lg">{{ delivery.beneficiario }}</h2>
    <p class="text-sm text-gray-600">Tipo: {{ delivery.tipo }}</p>
    <p class="text-sm text-gray-600">Cantidad: {{ delivery.cantidad }}</p>
    <StatusBadge :status="delivery.status" />
  </div>
</template>

<script setup>
defineProps({
  delivery: { type: Object, required: true }
})
import StatusBadge from './StatusBadge.vue'
</script>
