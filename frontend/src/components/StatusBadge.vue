<template><span class="badge" :class="statusClass"><i></i>{{ status }}</span></template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ status: { type: String, required: true } })
const statusClass = computed(() => ({'Entregada':'delivered','En tránsito':'transit','Preparando':'preparing'}[props.status] || 'pending'))
</script>
<style scoped>
.badge{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;font-size:10px;font-weight:800}.badge i{width:6px;height:6px;border-radius:50%;background:currentColor}.pending{background:#fff3e5;color:#c97520}.preparing{background:#f0ecff;color:#6f55c7}.transit{background:#eaf2fb;color:#3578c7}.delivered{background:#e8f3ee;color:#28745a}
</style>
