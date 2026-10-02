<template>
  <span :class="badgeClass" class="px-2 py-1 rounded-md text-xs font-semibold">
    {{ status }}
  </span>
</template>

<!-- prueba commit -->

<script setup>
import { computed } from 'vue'
const props = defineProps({ status: String })

const badgeClass = computed(() => {
  switch (props.status) {
    case 'Pendiente': return 'bg-yellow-100 text-yellow-700'
    case 'En tránsito': return 'bg-blue-100 text-blue-700'
    case 'Entregada': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
})
</script>
