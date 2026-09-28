<template>
  <RouterLink :to="`/entregas/${delivery.id}`" class="delivery-card">
    <div class="main-info"><div class="id-row"><strong>{{ delivery.id }}</strong><StatusBadge :status="delivery.estado" /></div><div class="route">{{ delivery.origen }} <span>→</span> {{ delivery.destino }}</div></div>
    <div class="type"><strong>{{ delivery.tipo }}</strong><span>{{ delivery.cantidad }} unidades</span></div>
    <span class="arrow">›</span>
  </RouterLink>
</template>
<script setup>
import StatusBadge from './StatusBadge.vue'
defineProps({ delivery: { type: Object, required: true } })
</script>
<style scoped>
.delivery-card{min-height:72px;padding:13px 16px;display:grid;grid-template-columns:1fr 150px 20px;align-items:center;gap:12px;border-bottom:1px solid #eef2f0;color:inherit;text-decoration:none;transition:.18s}.delivery-card:hover{background:#fafcfb}.id-row{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.id-row strong{font-size:10px;color:#667085}.route{margin-top:7px;font-size:12px;font-weight:700}.route span{margin:0 5px;color:#98a2b3}.type{text-align:right}.type strong,.type span{display:block}.type strong{font-size:11px}.type span{margin-top:3px;color:#98a2b3;font-size:9px}.arrow{font-size:21px;color:#98a2b3}@media(max-width:600px){.delivery-card{grid-template-columns:1fr 18px}.type{display:none}}
</style>
