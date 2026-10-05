<template>
  <span
    class="status-badge"
    :class="statusClass"
  >
    <span class="dot"></span>
    {{ status || 'Sin estado' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: ''
  }
})

const statusClass = computed(() => {
  return {
    Pendiente: 'pending',
    Preparando: 'preparing',
    'En tránsito': 'transit',
    Entregada: 'delivered'
  }[props.status] || 'default'
})
</script>

<style scoped>
.status-badge {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.pending {
  background: #fff3e5;
  color: #b86718;
}

.preparing {
  background: #fff8dc;
  color: #9b7410;
}

.transit {
  background: #eaf2fb;
  color: #2f6fb5;
}

.delivered {
  background: #e8f3ee;
  color: #28745a;
}

.default {
  background: #eef2f0;
  color: #667085;
}
</style>
