<template>
<AppLayout title="Detalle de entrega">
  <div v-if="loading" class="missing">Cargando entrega...</div>
  <div v-else-if="error && !delivery" class="missing">{{ error }}</div>
  <div v-else-if="delivery">
    <div class="header">
      <div><RouterLink to="/entregas" class="back">← Volver a entregas</RouterLink><h1>{{ delivery.id }}</h1><p>{{ delivery.origen }} → {{ delivery.destino }}</p></div>
      <StatusBadge :status="delivery.estado" />
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="grid">
      <section class="card">
        <h2>Información de la entrega</h2>
        <dl>
          <div><dt>Tipo de ayuda</dt><dd>{{ delivery.tipo }}</dd></div>
          <div><dt>Cantidad</dt><dd>{{ delivery.cantidad }} unidades</dd></div>
          <div><dt>Responsable</dt><dd>{{ delivery.responsable }}</dd></div>
          <div><dt>Transporte</dt><dd>{{ delivery.transporte }}</dd></div>
          <div><dt>Registrada</dt><dd>{{ formatDate(delivery.createdAt) }}</dd></div>
          <div><dt>Recepción</dt><dd>{{ delivery.receivedAt ? formatDate(delivery.receivedAt) : 'Pendiente' }}</dd></div>
          <div v-if="delivery.receivedByName"><dt>Recibida por</dt><dd>{{ delivery.receivedByName }}</dd></div>
        </dl>
      </section>
      <section class="card">
        <h2>Seguimiento</h2>
        <div class="steps">
          <button v-for="item in states" :key="item" :class="{active:delivery.estado===item,passed:isPassed(item)}" disabled>{{ item }}</button>
        </div>
        <div class="actions" v-if="delivery.estado !== 'Entregada'">
          <button v-if="canAdvance && nextStatus" class="advance" :disabled="saving" @click="advance">{{ saving ? 'Actualizando...' : `Avanzar a “${nextStatus}”` }}</button>
          <button v-if="canConfirmReception" class="receive" :disabled="saving" @click="receive">{{ saving ? 'Confirmando...' : 'Confirmar recepción' }}</button>
          <p v-if="!canAdvance && !canConfirmReception" class="notice">Tu rol puede consultar esta entrega, pero no tiene una acción disponible en su estado actual.</p>
        </div>
        <p v-else class="success">✓ Recepción confirmada. La entrega quedó registrada en el historial.</p>
      </section>
    </div>

    <section class="card trace-card">
      <h2>Trazabilidad</h2>
      <p class="trace-help">Registro cronológico de las acciones realizadas sobre esta entrega.</p>
      <div v-if="timeline.length" class="timeline">
        <div v-for="(event,index) in timeline" :key="`${event.at}-${index}`" class="timeline-item">
          <span class="dot"></span>
          <div><strong>{{ eventLabel(event) }}</strong><p>{{ formatDate(event.at) }}<span v-if="event.userName"> · {{ event.userName }}</span></p></div>
        </div>
      </div>
      <div v-else class="empty-trace">Esta entrega fue creada antes de habilitar el registro detallado de trazabilidad.</div>
    </section>
  </div>
</AppLayout>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { confirmReception, getDelivery, updateDeliveryStatus } from '../services/deliveries'
import { getCurrentUser } from '../services/auth'

const route=useRoute(); const delivery=ref(null); const loading=ref(true); const saving=ref(false); const error=ref(''); const states=['Pendiente','Preparando','En tránsito','Entregada']; const user=getCurrentUser()
const canAdvance=computed(()=>['Coordinador logístico','Responsable de transporte','Administrador'].includes(user?.role) && ['Pendiente','Preparando'].includes(delivery.value?.estado))
const canConfirmReception=computed(()=>['Responsable del punto receptor','Coordinador logístico','Administrador'].includes(user?.role) && delivery.value?.estado==='En tránsito')
const nextStatus=computed(()=>delivery.value?.estado==='Pendiente'?'Preparando':delivery.value?.estado==='Preparando'?'En tránsito':null)
const timeline=computed(()=>Array.isArray(delivery.value?.events)?[...delivery.value.events].sort((a,b)=>new Date(a.at)-new Date(b.at)):[])
function isPassed(s){return delivery.value&&states.indexOf(s)<states.indexOf(delivery.value.estado)}
function formatDate(value){return value?new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)):'—'}
function eventLabel(event){if(event.type==='CREATED')return 'Entrega registrada';if(event.type==='STATUS_CHANGED')return `Estado actualizado a ${event.estado}`;if(event.type==='RECEIVED')return 'Recepción confirmada';return event.estado||'Actualización de entrega'}
async function load(){loading.value=true;error.value='';try{delivery.value=await getDelivery(route.params.id)}catch(e){error.value=e.message}finally{loading.value=false}}
async function advance(){if(!nextStatus.value)return;saving.value=true;error.value='';try{delivery.value=await updateDeliveryStatus(delivery.value.id,nextStatus.value)}catch(e){error.value=e.message}finally{saving.value=false}}
async function receive(){saving.value=true;error.value='';try{delivery.value=await confirmReception(delivery.value.id)}catch(e){error.value=e.message}finally{saving.value=false}}
onMounted(load)
</script>
<style scoped>
.header{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:20px}.back{display:inline-block;margin-bottom:13px;color:#28745a;text-decoration:none;font-size:10px;font-weight:800}.header h1{margin:0;font-size:22px}.header p{margin:5px 0 0;color:#667085;font-size:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.card{padding:20px;background:#fff;border:1px solid #e4eae7;border-radius:10px}.card h2{margin:0 0 18px;font-size:13px}dl{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:18px}dt{color:#98a2b3;font-size:9px}dd{margin:4px 0 0;font-size:12px;font-weight:800}.steps{display:grid;gap:9px}.steps button{padding:11px;text-align:left;border:1px solid #d9e2dd;border-radius:8px;background:#fafcfb;color:#667085;font-size:10px;font-weight:800}.steps button.active{border-color:#164a3a;background:#164a3a;color:#fff}.steps button.passed{border-color:#bcd7cd;background:#e8f3ee;color:#28745a}.actions{margin-top:16px}.advance,.receive{width:100%;padding:11px;border:0;border-radius:8px;color:#fff;font-size:10px;font-weight:800;cursor:pointer}.advance{background:#164a3a}.receive{background:#28745a}.advance:disabled,.receive:disabled{opacity:.65;cursor:wait}.notice{margin:12px 0 0;color:#98a2b3;font-size:9px}.success{margin:16px 0 0;padding:11px;border-radius:8px;background:#e8f3ee;color:#28745a;font-size:10px;font-weight:800}.error{margin:0 0 14px;padding:10px;border-radius:7px;background:#fff0f0;color:#a83b3b;font-size:10px}.missing{padding:40px;background:#fff;border:1px solid #e4eae7;border-radius:10px;text-align:center;color:#667085}.trace-card{margin-top:14px}.trace-card h2{margin-bottom:4px}.trace-help{margin:0 0 18px;color:#98a2b3;font-size:9px}.timeline{position:relative;display:grid;gap:0}.timeline-item{position:relative;display:grid;grid-template-columns:20px 1fr;gap:10px;padding:0 0 17px}.timeline-item:not(:last-child)::before{content:"";position:absolute;left:6px;top:12px;bottom:-2px;width:1px;background:#d9e2dd}.dot{width:13px;height:13px;margin-top:1px;border:3px solid #e8f3ee;border-radius:50%;background:#28745a;z-index:1}.timeline-item strong{font-size:10px}.timeline-item p{margin:4px 0 0;color:#98a2b3;font-size:9px}.empty-trace{padding:18px;border-radius:8px;background:#fafcfb;color:#7d8b86;font-size:10px}@media(max-width:750px){.grid{grid-template-columns:1fr}.header{align-items:flex-start;flex-direction:column}dl{grid-template-columns:1fr}}
</style>
