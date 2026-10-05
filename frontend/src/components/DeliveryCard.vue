<template>
  <div class="border p-4 rounded shadow">
    <h2 class="font-semibold">{{ delivery.cliente }}</h2>
    <StatusBadge :status="delivery.status" />
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue'
const props = defineProps({ delivery: Object })
</script>
