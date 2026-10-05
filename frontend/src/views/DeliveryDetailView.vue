<template>
  <AppLayout title="Detalle de entrega">
    <div class="page-header">
      <div>
        <p class="eyebrow">SEGUIMIENTO LOGÍSTICO</p>
        <h1>Detalle de entrega</h1>
        <p class="subtitle">
          Consulta la información, el estado y la trazabilidad de la operación.
        </p>
      </div>

      <RouterLink to="/entregas" class="back-link">
        ← Volver a entregas
      </RouterLink>
    </div>

    <p v-if="error" class="message error">
      {{ error }}
    </p>

    <div v-if="loading" class="loading-card">
      Cargando información de la entrega...
    </div>

    <template v-else-if="delivery">
      <section class="hero-card">
        <div class="hero-main">
          <div class="delivery-icon">↗</div>

          <div>
            <span class="delivery-id">
              Entrega #{{ delivery.id }}
            </span>

            <h2>
              {{ delivery.tipo || 'Ayuda humanitaria' }}
            </h2>

            <p>
              {{ delivery.origen }} → {{ delivery.destino }}
            </p>
          </div>
        </div>

        <span
          class="status"
          :class="statusClass(delivery.estado)"
        >
          {{ delivery.estado }}
        </span>
      </section>

      <div class="content-grid">
        <section class="panel">
          <div class="panel-header">
            <div>
              <h2>Información de la entrega</h2>
              <p>Datos principales de la operación logística.</p>
            </div>
          </div>

          <div class="info-grid">
            <article>
              <span>Origen</span>
              <strong>{{ delivery.origen || '—' }}</strong>
            </article>

            <article>
              <span>Destino</span>
              <strong>{{ delivery.destino || '—' }}</strong>
            </article>

            <article>
              <span>Tipo de ayuda</span>
              <strong>{{ delivery.tipo || '—' }}</strong>
            </article>

            <article>
              <span>Cantidad</span>
              <strong>{{ delivery.cantidad ?? '—' }}</strong>
            </article>

            <article>
              <span>Responsable</span>
              <strong>
                {{ delivery.responsable || 'Sin asignar' }}
              </strong>
            </article>

            <article>
              <span>Transporte</span>
              <strong>{{ delivery.transporte || '—' }}</strong>
            </article>

            <article>
              <span>Fecha de registro</span>
              <strong>{{ formatDateTime(delivery.createdAt) }}</strong>
            </article>

            <article>
              <span>Última actualización</span>
              <strong>{{ formatDateTime(delivery.updatedAt) }}</strong>
            </article>
          </div>
        </section>

        <aside class="panel action-panel">
          <div class="panel-header">
            <div>
              <h2>Seguimiento</h2>
              <p>Acciones disponibles para esta entrega.</p>
            </div>
          </div>

          <div class="action-content">
            <div class="current-status">
              <span>Estado actual</span>

              <strong>
                {{ delivery.estado }}
              </strong>
            </div>

            <button
              v-if="delivery.estado === 'Pendiente' && canAdvance"
              type="button"
              class="primary"
              :disabled="working"
              @click="changeStatus('Preparando')"
            >
              {{ working ? 'Actualizando...' : 'Iniciar preparación' }}
            </button>

            <button
              v-else-if="delivery.estado === 'Preparando' && canAdvance"
              type="button"
              class="primary"
              :disabled="working"
              @click="changeStatus('En tránsito')"
            >
              {{ working ? 'Actualizando...' : 'Marcar en tránsito' }}
            </button>

            <button
              v-else-if="delivery.estado === 'En tránsito' && canReceive"
              type="button"
              class="receive-button"
              :disabled="working"
              @click="confirmDeliveryReception"
            >
              {{ working ? 'Confirmando...' : 'Confirmar recepción' }}
            </button>

            <div
              v-else-if="delivery.estado === 'Entregada'"
              class="completed"
            >
              <div class="completed-icon">✓</div>

              <div>
                <strong>Entrega completada</strong>
                <span>
                  La recepción ya fue confirmada.
                </span>
              </div>
            </div>

            <div v-else class="no-action">
              No tienes acciones disponibles para el estado actual.
            </div>

            <p class="action-note">
              Los cambios de estado quedan registrados en la trazabilidad
              de la entrega.
            </p>
          </div>
        </aside>
      </div>

      <section class="panel history-panel">
        <div class="panel-header">
          <div>
            <h2>Trazabilidad</h2>
            <p>Historial de movimientos de la entrega.</p>
          </div>

          <span class="events-count">
            {{ delivery.events?.length || 0 }}
            evento{{ delivery.events?.length === 1 ? '' : 's' }}
          </span>
        </div>

        <div
          v-if="!delivery.events?.length"
          class="empty-history"
        >
          No hay movimientos registrados.
        </div>

        <ol v-else class="timeline">
          <li
            v-for="(event, index) in reversedEvents"
            :key="`${event.at}-${index}`"
          >
            <div class="timeline-marker">
              <span></span>
            </div>

            <div class="event-card">
              <div class="event-heading">
                <strong>{{ eventTitle(event) }}</strong>

                <span>
                  {{ formatDateTime(event.at) }}
                </span>
              </div>

              <p>
                {{ event.userName || 'Sistema' }}
              </p>
            </div>
          </li>
        </ol>
      </section>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppLayout from '../components/AppLayout.vue'

import {
  confirmReception,
  getDelivery,
  updateDeliveryStatus
} from '../services/deliveries'

import { getCurrentUser } from '../services/auth'

const route = useRoute()
const user = getCurrentUser()

const delivery = ref(null)
const loading = ref(true)
const working = ref(false)
const error = ref('')

const elevatedRoles = [
  'Coordinador logístico',
  'Administrador'
]

const receptionRoles = [
  'Responsable del punto receptor',
  'Coordinador logístico',
  'Administrador'
]

const canAdvance = computed(() => {
  if (!delivery.value || !user) return false

  if (elevatedRoles.includes(user.role)) {
    return true
  }

  return (
    user.role === 'Responsable de transporte' &&
    Number(delivery.value.responsableId) === Number(user.id)
  )
})

const canReceive = computed(() =>
  receptionRoles.includes(user?.role)
)

const reversedEvents = computed(() => {
  if (!Array.isArray(delivery.value?.events)) {
    return []
  }

  return [...delivery.value.events].reverse()
})

async function loadDelivery() {
  loading.value = true
  error.value = ''

  try {
    delivery.value = await getDelivery(route.params.id)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function changeStatus(status) {
  working.value = true
  error.value = ''

  try {
    delivery.value = await updateDeliveryStatus(
      route.params.id,
      status
    )
  } catch (err) {
    error.value = err.message
  } finally {
    working.value = false
  }
}

async function confirmDeliveryReception() {
  working.value = true
  error.value = ''

  try {
    delivery.value = await confirmReception(route.params.id)
  } catch (err) {
    error.value = err.message
  } finally {
    working.value = false
  }
}

function statusClass(status) {
  return {
    Pendiente: 'pending',
    Preparando: 'preparing',
    'En tránsito': 'transit',
    Entregada: 'delivered'
  }[status] || 'default'
}

function eventTitle(event) {
  if (event.type === 'CREATED') {
    return 'Entrega registrada'
  }

  if (event.type === 'STATUS_CHANGED') {
    return `Estado actualizado a ${event.estado}`
  }

  if (event.type === 'RECEIVED') {
    return 'Recepción confirmada'
  }

  return 'Movimiento registrado'
}

function formatDateTime(value) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

onMounted(loadDelivery)
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

.back-link {
  color: #28745a;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
}

.back-link:hover {
  text-decoration: underline;
}

.hero-card {
  min-height: 105px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px;
  border: 1px solid #e4eae7;
  border-radius: 10px;
  background: #fff;
}

.hero-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.delivery-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 12px;
  background: #e8f3ee;
  color: #28745a;
  font-size: 20px;
  font-weight: 900;
}

.delivery-id {
  color: #98a2b3;
  font-size: 9px;
  font-weight: 700;
}

.hero-main h2 {
  margin: 4px 0 0;
  color: #263238;
  font-size: 18px;
}

.hero-main p {
  margin: 6px 0 0;
  color: #667085;
  font-size: 10px;
}

.status {
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 10px;
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

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(260px, .7fr);
  gap: 14px;
  margin-bottom: 14px;
}

.panel {
  overflow: hidden;
  border: 1px solid #e4eae7;
  border-radius: 10px;
  background: #fff;
}

.panel-header {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
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

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.info-grid article {
  min-height: 82px;
  padding: 18px;
  border-right: 1px solid #eef2f0;
  border-bottom: 1px solid #eef2f0;
}

.info-grid article:nth-child(even) {
  border-right: 0;
}

.info-grid article:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.info-grid span {
  display: block;
  color: #98a2b3;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.info-grid strong {
  display: block;
  margin-top: 7px;
  color: #344054;
  font-size: 12px;
}

.action-content {
  padding: 18px;
}

.current-status {
  margin-bottom: 16px;
  padding: 13px;
  border-radius: 8px;
  background: #f7f9f8;
}

.current-status span {
  display: block;
  color: #98a2b3;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.current-status strong {
  display: block;
  margin-top: 5px;
  color: #344054;
  font-size: 13px;
}

.primary,
.receive-button {
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.primary {
  background: #164a3a;
}

.primary:hover {
  background: #28745a;
}

.receive-button {
  background: #28745a;
}

.receive-button:hover {
  background: #21644e;
}

.primary:disabled,
.receive-button:disabled {
  opacity: .65;
  cursor: wait;
}

.action-note {
  margin: 12px 0 0;
  color: #98a2b3;
  font-size: 9px;
  line-height: 1.5;
}

.completed {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px;
  border-radius: 8px;
  background: #e8f3ee;
}

.completed-icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #28745a;
  color: #fff;
  font-weight: 900;
}

.completed strong,
.completed span {
  display: block;
}

.completed strong {
  color: #21644e;
  font-size: 11px;
}

.completed span {
  margin-top: 3px;
  color: #557067;
  font-size: 9px;
}

.no-action {
  padding: 13px;
  border-radius: 8px;
  background: #f7f9f8;
  color: #667085;
  font-size: 10px;
  text-align: center;
}

.history-panel {
  margin-bottom: 14px;
}

.events-count {
  color: #667085;
  font-size: 10px;
  font-weight: 700;
}

.timeline {
  margin: 0;
  padding: 20px 22px;
  list-style: none;
}

.timeline li {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 10px;
}

.timeline-marker {
  position: relative;
  display: flex;
  justify-content: center;
}

.timeline-marker::after {
  width: 1px;
  position: absolute;
  top: 15px;
  bottom: -12px;
  background: #dfe7e3;
  content: "";
}

.timeline li:last-child .timeline-marker::after {
  display: none;
}

.timeline-marker span {
  width: 9px;
  height: 9px;
  margin-top: 5px;
  position: relative;
  z-index: 1;
  border-radius: 50%;
  background: #28745a;
  box-shadow: 0 0 0 4px #e8f3ee;
}

.event-card {
  margin-bottom: 18px;
  padding: 12px 14px;
  border: 1px solid #eef2f0;
  border-radius: 8px;
  background: #fbfcfb;
}

.event-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.event-heading strong {
  color: #344054;
  font-size: 11px;
}

.event-heading span {
  color: #98a2b3;
  font-size: 9px;
}

.event-card p {
  margin: 5px 0 0;
  color: #667085;
  font-size: 9px;
}

.empty-history,
.loading-card {
  min-height: 150px;
  display: grid;
  place-items: center;
  padding: 30px;
  color: #98a2b3;
  font-size: 11px;
}

.loading-card {
  border: 1px solid #e4eae7;
  border-radius: 10px;
  background: #fff;
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

@media (max-width: 850px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-grid article,
  .info-grid article:nth-child(even),
  .info-grid article:nth-last-child(-n + 2) {
    border-right: 0;
    border-bottom: 1px solid #eef2f0;
  }

  .info-grid article:last-child {
    border-bottom: 0;
  }

  .event-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
