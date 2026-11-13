<template>
  <AppLayout title="Inventario">
    <section class="inventory-hero">
      <div>
        <span class="eyebrow">WMS · CONTROL DE SUMINISTROS</span>
        <h1>Centro de inventarios</h1>
        <p>Stock consolidado, lotes, vencimientos y prioridad FEFO por almacén.</p>
      </div>
      <button class="refresh" type="button" :disabled="loading" @click="loadAll">{{ loading ? 'Actualizando...' : 'Actualizar datos' }}</button>
    </section>

    <p v-if="error" class="notice error">{{ error }}</p>

    <section class="kpi-grid">
      <article><span>Productos</span><strong>{{ summary.products || 0 }}</strong><small>catálogo activo</small></article>
      <article><span>Almacenes</span><strong>{{ summary.warehouses || 0 }}</strong><small>puntos de stock</small></article>
      <article class="warning"><span>Stock crítico</span><strong>{{ summary.criticalStock || 0 }}</strong><small>requieren atención</small></article>
      <article class="danger"><span>Alertas abiertas</span><strong>{{ summary.openAlerts || 0 }}</strong><small>operativas</small></article>
    </section>

    <section class="panel">
      <header><div><span class="eyebrow">EXISTENCIAS</span><h2>Stock por almacén</h2><p>Disponible, cuarentena y próximo vencimiento.</p></div></header>
      <div v-if="loading" class="empty">Consultando PostgreSQL...</div>
      <div v-else-if="!stock.length" class="empty">Aún no hay existencias registradas. El módulo ya está conectado y listo para recibir productos y lotes.</div>
      <div v-else class="table-wrap"><table><thead><tr><th>Producto</th><th>Almacén</th><th>Disponible</th><th>Cuarentena</th><th>Próximo vencimiento</th><th>Estado</th></tr></thead><tbody><tr v-for="row in stock" :key="`${row.product_id}-${row.warehouse_id}`"><td><strong>{{ row.product_name }}</strong><small>{{ row.sku }}</small></td><td>{{ row.warehouse_name }}</td><td>{{ number(row.available_stock) }} {{ row.unit }}</td><td>{{ number(row.quarantined_stock) }}</td><td>{{ date(row.nearest_expiry) }}</td><td><span class="pill" :class="{ critical: Number(row.available_stock) < Number(row.minimum_stock) }">{{ Number(row.available_stock) < Number(row.minimum_stock) ? 'Crítico' : 'Normal' }}</span></td></tr></tbody></table></div>
    </section>

    <div class="split">
      <section class="panel">
        <header><div><span class="eyebrow">FEFO</span><h2>Prioridad de salida</h2><p>First Expired, First Out.</p></div></header>
        <div v-if="!fefo.length" class="empty">No hay lotes disponibles para priorizar.</div>
        <div v-else class="fefo-list"><article v-for="lot in fefo.slice(0,8)" :key="lot.id"><span class="priority">#{{ lot.fefo_priority }}</span><div><strong>{{ lot.product_name }}</strong><small>{{ lot.lot_code }} · vence {{ date(lot.expiry_date) }}</small></div><b>{{ number(lot.quantity_available) }}</b></article></div>
      </section>
      <section class="panel">
        <header><div><span class="eyebrow">ALERTAS</span><h2>Atención requerida</h2><p>Stock, vencimiento, frío y cuarentena.</p></div></header>
        <div v-if="!alerts.length" class="empty">No hay alertas abiertas.</div>
        <div v-else class="alert-list"><article v-for="item in alerts.slice(0,8)" :key="item.id"><span :class="['severity',item.severity]">{{ item.severity }}</span><div><strong>{{ item.alert_type.replaceAll('_',' ') }}</strong><p>{{ item.message }}</p></div></article></div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { inventorySummary, listInventoryStock, listFefoLots, listInventoryAlerts } from '../services/inventory'

const summary = ref({})
const stock = ref([])
const fefo = ref([])
const alerts = ref([])
const loading = ref(true)
const error = ref('')

async function loadAll(){
  loading.value=true; error.value=''
  try{
    const [s,st,f,a]=await Promise.all([inventorySummary(),listInventoryStock(),listFefoLots(),listInventoryAlerts()])
    summary.value=s; stock.value=st; fefo.value=f; alerts.value=a
  }catch(e){ error.value=e.message }
  finally{ loading.value=false }
}
const number=v=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:2}).format(Number(v||0))
const date=v=>v?new Intl.DateTimeFormat('es-CO',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(v)):'—'
onMounted(loadAll)
</script>

<style scoped>
.inventory-hero{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px;padding:28px;border:1px solid var(--border-color);border-radius:24px;background:linear-gradient(135deg,var(--bg-surface),var(--color-primary-soft));box-shadow:var(--shadow-sm)}.eyebrow{color:var(--color-primary);font-size:10px;font-weight:900;letter-spacing:1.2px}.inventory-hero h1{margin:6px 0;font-size:30px}.inventory-hero p,header p{margin:0;color:var(--text-muted);font-size:12px}.refresh{min-height:44px;padding:0 16px;border:0;border-radius:12px;background:var(--color-primary);color:#fff;font-weight:800;cursor:pointer}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.kpi-grid article{padding:18px;border:1px solid var(--border-color);border-radius:18px;background:var(--bg-surface);box-shadow:var(--shadow-sm)}.kpi-grid span,.kpi-grid small{display:block;color:var(--text-muted)}.kpi-grid strong{display:block;margin:7px 0 2px;font-size:30px}.kpi-grid .warning{border-color:#e8c76d}.kpi-grid .danger{border-color:#df9690}
.panel{overflow:hidden;margin-bottom:18px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-surface);box-shadow:var(--shadow-sm)}.panel>header{padding:18px 20px;border-bottom:1px solid var(--border-soft)}.panel h2{margin:4px 0;font-size:17px}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:780px}th,td{padding:14px 16px;border-bottom:1px solid var(--border-soft);text-align:left;font-size:12px}th{color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.6px}td small{display:block;margin-top:3px;color:var(--text-muted)}.pill{display:inline-flex;padding:5px 9px;border-radius:999px;background:var(--color-success-soft);color:var(--color-success);font-size:10px;font-weight:900}.pill.critical{background:var(--color-danger-soft);color:var(--color-danger)}
.split{display:grid;grid-template-columns:1fr 1fr;gap:18px}.fefo-list,.alert-list{padding:8px 16px}.fefo-list article,.alert-list article{display:flex;align-items:center;gap:12px;padding:12px 4px;border-bottom:1px solid var(--border-soft)}.fefo-list article:last-child,.alert-list article:last-child{border:0}.fefo-list div,.alert-list div{min-width:0;flex:1}.fefo-list small{display:block;margin-top:3px;color:var(--text-muted)}.priority{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:var(--color-primary-soft);color:var(--color-primary);font-weight:900}.severity{padding:5px 8px;border-radius:999px;background:var(--bg-surface-secondary);font-size:9px;font-weight:900;text-transform:uppercase}.severity.alta,.severity.critica{background:var(--color-danger-soft);color:var(--color-danger)}.alert-list p{margin:3px 0 0;color:var(--text-muted);font-size:11px}.empty{padding:28px;text-align:center;color:var(--text-muted);font-size:12px}.notice{padding:12px 14px;margin-bottom:16px;border-radius:12px}.notice.error{background:var(--color-danger-soft);color:var(--color-danger)}
@media(max-width:1000px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}}@media(max-width:620px){.inventory-hero{align-items:stretch;flex-direction:column;padding:20px}.inventory-hero h1{font-size:25px}.kpi-grid{grid-template-columns:1fr 1fr}.kpi-grid strong{font-size:25px}}
</style>
