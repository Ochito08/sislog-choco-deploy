<template>
<AppLayout title="Dashboard">
  <div class="page-header"><div><h1>Buen día, {{ firstName }} 👋</h1><p>{{ formattedDate }} · Gestión logística humanitaria</p></div><RouterLink v-if="canCreate" to="/entregas/nueva" class="primary">＋ Nueva entrega</RouterLink></div>
  <p v-if="error" class="message error">{{ error }}</p>
  <p v-if="loading" class="message">Cargando información del servidor...</p>
  <template v-else>
    <div class="kpis">
      <article><i class="total">◈</i><div><strong>{{ deliveries.length }}</strong><span>Total entregas</span></div></article>
      <article><i class="pending">△</i><div><strong>{{ count('Pendiente') }}</strong><span>Pendientes</span></div></article>
      <article><i class="transit">⇢</i><div><strong>{{ count('En tránsito') }}</strong><span>En tránsito</span></div></article>
      <article><i class="delivered">✓</i><div><strong>{{ count('Entregada') }}</strong><span>Entregadas</span></div></article>
    </div>
    <div class="grid">
      <section class="panel"><header><div><h2>Entregas recientes</h2><p>Últimas operaciones registradas</p></div><RouterLink to="/entregas">Ver todas →</RouterLink></header><DeliveryCard v-for="item in deliveries.slice(0,5)" :key="item.id" :delivery="item" /><div v-if="!deliveries.length" class="empty">No hay entregas disponibles para tu usuario.</div></section>
      <section class="panel summary"><header><div><h2>Resumen por estado</h2><p>Situación actual</p></div></header><div class="big-number">{{ deliveries.length }}<span>total</span></div><div class="row"><span>Entregadas</span><strong>{{ count('Entregada') }}</strong></div><div class="row"><span>En tránsito</span><strong>{{ count('En tránsito') }}</strong></div><div class="row"><span>Preparando</span><strong>{{ count('Preparando') }}</strong></div><div class="row"><span>Pendientes</span><strong>{{ count('Pendiente') }}</strong></div></section>
    </div>
  </template>
</AppLayout>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'; import AppLayout from '../components/AppLayout.vue'; import DeliveryCard from '../components/DeliveryCard.vue'; import { listDeliveries } from '../services/deliveries'; import { getCurrentUser } from '../services/auth'
const deliveries=ref([]); const loading=ref(true); const error=ref(''); const user=getCurrentUser(); const firstName=(user?.name||'Usuario').split(' ')[0]; const canCreate=['Coordinador logístico','Administrador'].includes(user?.role); const count=s=>deliveries.value.filter(x=>x.estado===s).length; const formattedDate=computed(()=>new Intl.DateTimeFormat('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date())); onMounted(async()=>{try{deliveries.value=await listDeliveries()}catch(e){error.value=e.message}finally{loading.value=false}})
</script>
<style scoped>
.page-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}.page-header h1{margin:0;font-size:22px}.page-header p{margin:6px 0 0;color:#98a2b3;font-size:11px;text-transform:capitalize}.primary{padding:11px 15px;border-radius:8px;background:#164a3a;color:#fff;text-decoration:none;font-size:11px;font-weight:800}.message{padding:12px 14px;border-radius:8px;background:#fff;border:1px solid #e4eae7;color:#667085;font-size:11px}.message.error{background:#fff0f0;border-color:#f2cccc;color:#a83b3b}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}.kpis article{min-height:86px;padding:14px;display:flex;align-items:center;gap:13px;background:#fff;border:1px solid #e4eae7;border-radius:10px}.kpis i{width:39px;height:39px;display:grid;place-items:center;border-radius:9px;font-style:normal}.total,.delivered{background:#e8f3ee;color:#28745a}.pending{background:#fff3e5;color:#e58a32}.transit{background:#eaf2fb;color:#3578c7}.kpis strong,.kpis span{display:block}.kpis strong{font-size:20px}.kpis span{margin-top:4px;font-size:10px;font-weight:700}.grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(220px,.8fr);gap:13px}.panel{overflow:hidden;background:#fff;border:1px solid #e4eae7;border-radius:10px}.panel>header{padding:16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eef2f0}.panel h2{margin:0;font-size:13px}.panel p{margin:4px 0 0;color:#98a2b3;font-size:9px}.panel header a{color:#28745a;text-decoration:none;font-size:10px;font-weight:800}.summary{padding-bottom:15px}.big-number{width:112px;height:112px;margin:25px auto;display:flex;flex-direction:column;align-items:center;justify-content:center;border:13px solid #e8f3ee;border-radius:50%;font-size:25px;font-weight:800;color:#164a3a}.big-number span{font-size:9px;color:#98a2b3}.row{margin:0 18px;padding:10px 0;display:flex;justify-content:space-between;border-bottom:1px solid #eef2f0;font-size:10px}.empty{padding:28px;text-align:center;color:#98a2b3;font-size:10px}@media(max-width:900px){.kpis{grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}}@media(max-width:520px){.page-header{align-items:flex-start;flex-direction:column}.primary{width:100%;text-align:center}.kpis{grid-template-columns:1fr 1fr}}
</style>
