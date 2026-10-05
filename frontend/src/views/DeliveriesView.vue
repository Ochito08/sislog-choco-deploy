<template>
  <AppLayout title="Entregas">
    <div class="page-header">
      <div>
        <p class="eyebrow">Operación logística</p>
        <h1>Gestión de entregas</h1>
        <p class="subtitle">
          Consulta y realiza seguimiento a las ayudas humanitarias registradas.
        </p>
      </div>

      <RouterLink v-if="canCreate" to="/entregas/nueva" class="primary">
        + Nueva entrega
      </RouterLink>
    </div>

    <section class="summary-grid">
      <article>
        <span>Total</span>
        <strong>{{ deliveries.length }}</strong>
      </article>

      <article>
        <span>Pendientes</span>
        <strong>{{ countStatus('Pendiente') }}</strong>
      </article>

      <article>
        <span>En preparación</span>
        <strong>{{ countStatus('Preparando') }}</strong>
      </article>

      <article>
        <span>En tránsito</span>
        <strong>{{ countStatus('En tránsito') }}</strong>
      </article>
    </section>

    <section class="panel filters-panel">
      <div class="panel-header">
        <div>
          <h2>Buscar entregas</h2>
          <p>Filtra por texto, estado o destino.</p>
        </div>
      </div>

      <form class="filters" @submit.prevent="loadDeliveries">
        <label>
          <span>Buscar</span>
          <input
            v-model.trim="filters.search"
            type="search"
            placeholder="Tipo de ayuda, origen..."
          />
        </label>

        <label>
          <span>Estado</span>
          <select v-model="filters.status">
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Preparando">Preparando</option>
            <option value="En tránsito">En tránsito</option>
            <option value="Entregada">Entregada</option>
          </select>
        </label>

        <label>
          <span>Destino</span>
          <input
            v-model.trim="filters.destination"
            placeholder="Ej. Istmina"
          />
        </label>

        <div class="filter-actions">
          <button type="submit" class="primary button" :disabled="loading">
            {{ loading ? 'Consultando...' : 'Aplicar' }}
          </button>

          <button type="button" class="secondary" @click="clearFilters">
            Limpiar
          </button>
        </div>
      </form>
    </section>

    <p v-if="error" class="message error">{{ error }}</p>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Entregas registradas</h2>
          <p>
            {{ deliveries.length }}
            resultado{{ deliveries.length === 1 ? '' : 's' }}
          </p>
        </div>
      </div>

      <div v-if="loading" class="empty-state">
        Cargando entregas...
      </div>

      <div v-else-if="!deliveries.length" class="empty-state">
        <strong>No hay entregas para mostrar</strong>
        <span>Prueba cambiando los filtros.</span>
      </div>

      <div v-else class="delivery-list">
        <article
          v-for="delivery in deliveries"
          :key="delivery.id"
          class="delivery-card"
        >
          <div class="delivery-icon">↗</div>

          <div class="delivery-content">
            <div class="delivery-title">
              <div>
                <span class="delivery-id">Entrega #{{ delivery.id }}</span>
                <h3>{{ delivery.tipo || 'Ayuda humanitaria' }}</h3>
              </div>

              <span
                class="status"
                :class="statusClass(delivery.estado)"
              >
                {{ delivery.estado }}
              </span>
            </div>

            <div class="delivery-info">
              <span>
                <strong>Origen:</strong>
                {{ delivery.origen || '—' }}
              </span>

              <span>
                <strong>Destino:</strong>
                {{ delivery.destino || '—' }}
              </span>

              <span>
                <strong>Cantidad:</strong>
                {{ delivery.cantidad ?? '—' }}
              </span>

              <span>
                <strong>Responsable:</strong>
                {{ delivery.responsable || 'Sin asignar' }}
              </span>
            </div>
          </div>

          <RouterLink
            :to="`/entregas/${delivery.id}`"
            class="detail-link"
          >
            Ver detalle →
          </RouterLink>
        </article>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { getCurrentUser } from '../services/auth'
import { listDeliveries } from '../services/deliveries'

const deliveries = ref([])
const loading = ref(false)
const error = ref('')
const user = getCurrentUser()

const filters = reactive({
  search: '',
  status: '',
  destination: ''
})

const canCreate = computed(() =>
  ['Coordinador logístico', 'Administrador'].includes(user?.role)
)

function countStatus(status) {
  return deliveries.value.filter(item => item.estado === status).length
}

function statusClass(status) {
  return {
    Pendiente: 'pending',
    Preparando: 'preparing',
    'En tránsito': 'transit',
    Entregada: 'delivered'
  }[status] || 'default'
}

async function loadDeliveries() {
  loading.value = true
  error.value = ''

  try {
    deliveries.value = await listDeliveries(filters)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function clearFilters() {
  filters.search = ''
  filters.status = ''
  filters.destination = ''

  await loadDeliveries()
}

onMounted(loadDeliveries)
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.eyebrow {
  margin: 0 0 5px;
  color: #28745a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #263238;
  font-size: 27px;
}

.subtitle {
  margin: 7px 0 0;
  color: #98a2b3;
  font-size: 11px;
}

.primary {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: #164a3a;
  color: #fff;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.primary:hover {
  background: #28745a;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.summary-grid article {
  padding: 17px;
  border: 1px solid #e4eae7;
  border-radius: 10px;
  background: #fff;
}

.summary-grid span {
  color: #7d8b86;
  font-size: 10px;
  font-weight: 700;
}

.summary-grid strong {
  display: block;
  margin-top: 7px;
  color: #263238;
  font-size: 23px;
}

.panel {
  margin-bottom: 14px;
  overflow: hidden;
  border: 1px solid #e4eae7;
  border-radius: 10px;
  background: #fff;
}

.panel-header {
  padding: 16px 18px;
  border-bottom: 1px solid #eef2f0;
}

.panel-header h2 {
  margin: 0;
  color: #263238;
  font-size: 14px;
}

.panel-header p {
  margin: 4px 0 0;
  color: #98a2b3;
  font-size: 10px;
}

.filters {
  display: grid;
  grid-template-columns: 1.3fr .8fr 1fr auto;
  gap: 12px;
  padding: 16px 18px;
  align-items: end;
}

label span {
  display: block;
  margin-bottom: 6px;
  color: #667085;
  font-size: 10px;
  font-weight: 800;
}

input,
select {
  width: 100%;
  min-height: 42px;
  padding: 0 11px;
  border: 1px solid #dfe7e3;
  border-radius: 8px;
  background: #fff;
  color: #263238;
  font-size: 11px;
  outline: none;
}

input:focus,
select:focus {
  border-color: #6aa4dc;
  box-shadow: 0 0 0 3px rgba(106, 164, 220, .13);
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.button {
  min-width: 85px;
}

.secondary {
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #dfe7e3;
  border-radius: 8px;
  background: #fff;
  color: #475467;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.delivery-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 17px 18px;
  border-bottom: 1px solid #eef2f0;
}

.delivery-card:last-child {
  border-bottom: 0;
}

.delivery-card:hover {
  background: #fbfcfb;
}

.delivery-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #e8f3ee;
  color: #28745a;
  font-weight: 900;
}

.delivery-content {
  min-width: 0;
  flex: 1;
}

.delivery-title {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.delivery-id {
  color: #98a2b3;
  font-size: 9px;
  font-weight: 700;
}

.delivery-title h3 {
  margin: 3px 0 0;
  color: #263238;
  font-size: 13px;
}

.delivery-info {
  margin-top: 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: #667085;
  font-size: 10px;
}

.delivery-info strong {
  color: #475467;
}

.status {
  height: fit-content;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
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

.detail-link {
  color: #28745a;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.detail-link:hover {
  text-decoration: underline;
}

.empty-state {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 30px;
  color: #98a2b3;
  font-size: 11px;
}

.empty-state strong {
  color: #475467;
  font-size: 13px;
}

.message {
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 11px;
}

.message.error {
  border: 1px solid #f2cccc;
  background: #fff0f0;
  color: #a83b3b;
}

@media (max-width: 950px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .filter-actions {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }

  .delivery-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .detail-link {
    margin-left: 52px;
  }
}

@media (max-width: 520px) {
  h1 {
    font-size: 23px;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    grid-column: auto;
  }
}
</style>
