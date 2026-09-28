<template>
<AppLayout title="Dashboard">
  <div class="page-header">
    <div>
      <p class="eyebrow">Panel de operaciones</p>
      <h1>Buen día, {{ firstName }}</h1>
      <p class="date-line">{{ formattedDate }} <span>·</span> Gestión logística humanitaria</p>
    </div>
    <RouterLink v-if="canCreate" to="/entregas/nueva" class="primary">＋ Nueva entrega</RouterLink>
  </div>
  <p v-if="error" class="message error">{{ error }}</p>
  <p v-if="loading" class="message">Cargando información del servidor...</p>
  <template v-else>
    <div class="kpis" aria-label="Indicadores de entregas">
      <article class="kpi-card"><i class="total" aria-hidden="true">◈</i><div><span class="kpi-label">Total de entregas</span><strong>{{ deliveries.length }}</strong></div></article>
      <article class="kpi-card"><i class="pending" aria-hidden="true">△</i><div><span class="kpi-label">Pendientes</span><strong>{{ count('Pendiente') }}</strong></div></article>
      <article class="kpi-card"><i class="transit" aria-hidden="true">⇢</i><div><span class="kpi-label">En tránsito</span><strong>{{ count('En tránsito') }}</strong></div></article>
      <article class="kpi-card"><i class="delivered" aria-hidden="true">✓</i><div><span class="kpi-label">Entregadas</span><strong>{{ count('Entregada') }}</strong></div></article>
    </div>
    <div class="grid">
      <section class="panel recent-panel">
        <header><div><h2>Entregas recientes</h2><p>Últimas operaciones registradas</p></div><RouterLink to="/entregas">Ver todas <span aria-hidden="true">→</span></RouterLink></header>
        <DeliveryCard v-for="item in deliveries.slice(0, 5)" :key="item.id" :delivery="item" />
        <div v-if="!deliveries.length" class="empty">No hay entregas disponibles para tu usuario.</div>
      </section>
      <section class="panel summary">
        <header><div><h2>Resumen por estado</h2><p>Situación actual</p></div></header>
        <div class="big-number" aria-label="Total de entregas">{{ deliveries.length }}<span>total</span></div>
        <div class="row"><span><i class="dot delivered-dot"></i>Entregadas</span><strong>{{ count('Entregada') }}</strong></div>
        <div class="row"><span><i class="dot transit-dot"></i>En tránsito</span><strong>{{ count('En tránsito') }}</strong></div>
        <div class="row"><span><i class="dot preparing-dot"></i>Preparando</span><strong>{{ count('Preparando') }}</strong></div>
        <div class="row"><span><i class="dot pending-dot"></i>Pendientes</span><strong>{{ count('Pendiente') }}</strong></div>
      </section>
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
.page-header{align-items:flex-end;margin-bottom:24px}
.page-header h1{margin-top:4px;color:#263238;font-size:26px;line-height:1.2}
.page-header .eyebrow{margin:0;color:#28745a;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase}
.page-header .date-line{margin-top:8px;text-transform:capitalize}
.page-header .date-line span{padding:0 5px;color:#b0bbb6}
.primary{min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;font-size:12px;transition:background .18s ease,transform .18s ease}
.primary:hover{background:#28745a;transform:translateY(-1px)}
.kpis{gap:14px;margin-bottom:16px}
.kpis article{min-width:0;min-height:104px;padding:18px;border-radius:10px;box-shadow:0 2px 8px rgba(29,61,48,.025)}
.kpis i{flex:0 0 auto;font-size:18px}
.pending{color:#bd6c1d}
.kpis strong{margin-top:5px;color:#263238;font-size:24px;line-height:1}
.kpis .kpi-label{margin:0;color:#7d8b86;font-size:11px;font-weight:700}
.grid{grid-template-columns:minmax(0,1.8fr) minmax(250px,.8fr);align-items:start;gap:16px}
.panel{min-width:0;border-radius:10px}
.panel>header{min-height:70px;padding:16px 18px;gap:12px}
.panel h2{color:#263238;font-size:14px}
.panel p{font-size:11px}
.panel header a{flex:0 0 auto;font-size:11px}
.panel header a:hover{text-decoration:underline}
.panel header a span{padding-left:3px}
.summary{padding-bottom:10px}
.big-number{width:116px;height:116px;border-width:12px;font-size:28px}
.big-number span{margin-top:2px;font-size:10px;font-weight:600}
.row{display:flex;align-items:center;gap:10px;color:#667085;font-size:11px}
.row>span{display:flex;align-items:center;gap:8px}
.row strong{color:#263238;font-size:12px}
.row:last-child{border-bottom:0}
.dot{width:8px;height:8px;display:inline-block;border-radius:50%}
.delivered-dot{background:#28745a}.transit-dot{background:#3578c7}.preparing-dot{background:#d4a72c}.pending-dot{background:#e58a32}
:focus-visible{outline:3px solid rgba(53,120,199,.45);outline-offset:3px}
@media(max-width:960px){.grid{grid-template-columns:minmax(0,1.4fr) minmax(220px,.8fr)}}
@media(max-width:720px){.grid{grid-template-columns:1fr}.summary{display:grid;grid-template-columns:minmax(110px,.8fr) minmax(0,1fr);align-items:center;padding-bottom:12px}.summary>header{grid-column:1/-1}.big-number{grid-row:span 4;margin:16px auto}.row{margin-right:14px;margin-left:14px}}
@media(max-width:520px){.page-header{align-items:stretch;gap:16px}.page-header h1{font-size:23px}.primary{width:100%}.kpis{gap:9px}.kpis article{min-height:92px;padding:12px;gap:10px}.kpis i{width:35px;height:35px}.kpis strong{font-size:21px}.kpis .kpi-label{font-size:10px}.summary{grid-template-columns:1fr}.summary>header{grid-column:auto}.big-number{grid-row:auto;margin:18px auto}.row{margin-right:18px;margin-left:18px}}
</style>
