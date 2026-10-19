<template>
  <AppLayout title="Detalle de entrega">
    <div class="detail-page">
      <!-- ENCABEZADO -->
      <section class="page-header">
        <div>
          <div class="eyebrow">
            <span></span>
            Seguimiento logístico
          </div>

          <h1>Detalle de entrega</h1>

          <p class="subtitle">
            Consulta la información, el estado actual y la trazabilidad
            completa de la operación.
          </p>
        </div>

        <RouterLink
          to="/entregas"
          class="back-link"
        >
          <svg viewBox="0 0 24 24">
            <path d="M19 12H5" />
            <path d="m9 8-4 4 4 4" />
          </svg>

          Volver a entregas
        </RouterLink>
      </section>

      <!-- ERROR -->
      <div
        v-if="error"
        class="message error"
      >
        <div class="message-icon">!</div>

        <div>
          <strong>No fue posible completar la operación</strong>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- CARGA -->
      <div
        v-if="loading"
        class="loading-card"
      >
        <div class="loader"></div>

        <div>
          <strong>Cargando entrega</strong>
          <span>
            Estamos consultando la información de la operación...
          </span>
        </div>
      </div>

      <template v-else-if="delivery">
        <!-- HERO DE LA ENTREGA -->
        <section class="delivery-hero">
          <div class="hero-background"></div>

          <div class="hero-main">
            <div
              class="delivery-icon"
              :class="statusClass(delivery.estado)"
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14" />
                <path d="m15 8 4 4-4 4" />
              </svg>
            </div>

            <div class="hero-copy">
              <span class="delivery-id">
                Entrega #{{ delivery.id }}
              </span>

              <h2>
                {{ delivery.tipo || 'Ayuda humanitaria' }}
              </h2>

              <div class="route-summary">
                <div>
                  <span>Origen</span>
                  <strong>{{ delivery.origen || '—' }}</strong>
                </div>

                <div class="route-line">
                  <span></span>

                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14" />
                    <path d="m15 8 4 4-4 4" />
                  </svg>
                </div>

                <div>
                  <span>Destino</span>
                  <strong>{{ delivery.destino || '—' }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="hero-status">
            <span>Estado actual</span>

            <div
              class="status"
              :class="statusClass(delivery.estado)"
            >
              <i></i>
              {{ delivery.estado }}
            </div>
          </div>
        </section>

        <!-- INFORMACIÓN Y ACCIONES -->
        <div class="content-grid">
          <section class="panel info-panel">
            <header class="panel-header">
              <div>
                <span class="panel-kicker">
                  INFORMACIÓN
                </span>

                <h2>Datos de la entrega</h2>

                <p>
                  Información principal registrada para esta operación.
                </p>
              </div>

              <div class="header-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
                  <path d="M4 12l8 4.5 8-4.5" />
                </svg>
              </div>
            </header>

            <div class="info-grid">
              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>
                </div>

                <div>
                  <span>Origen</span>
                  <strong>{{ delivery.origen || '—' }}</strong>
                </div>
              </article>

              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>
                </div>

                <div>
                  <span>Destino</span>
                  <strong>{{ delivery.destino || '—' }}</strong>
                </div>
              </article>

              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 7h14v12H5z" />
                    <path d="M8 7V5h8v2" />
                  </svg>
                </div>

                <div>
                  <span>Tipo de ayuda</span>
                  <strong>{{ delivery.tipo || '—' }}</strong>
                </div>
              </article>

              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
                    <path d="M4 12l8 4.5 8-4.5" />
                  </svg>
                </div>

                <div>
                  <span>Cantidad</span>
                  <strong>
                    {{ delivery.cantidad ?? '—' }}
                  </strong>
                </div>
              </article>

              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3" />
                    <path d="M6 19c.5-3.4 2.5-5 6-5s5.5 1.6 6 5" />
                  </svg>
                </div>

                <div>
                  <span>Responsable</span>
                  <strong>
                    {{ delivery.responsable || 'Sin asignar' }}
                  </strong>
                </div>
              </article>

              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 7h11v9H3z" />
                    <path d="M14 10h3l3 3v3h-6z" />
                    <circle cx="7" cy="18" r="2" />
                    <circle cx="17" cy="18" r="2" />
                  </svg>
                </div>

                <div>
                  <span>Transporte</span>
                  <strong>
                    {{ delivery.transporte || '—' }}
                  </strong>
                </div>
              </article>

              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="M8 3v4M16 3v4M4 10h16" />
                  </svg>
                </div>

                <div>
                  <span>Fecha de registro</span>
                  <strong>
                    {{ formatDateTime(delivery.createdAt) }}
                  </strong>
                </div>
              </article>

              <article>
                <div class="info-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v4l3 2" />
                  </svg>
                </div>

                <div>
                  <span>Última actualización</span>
                  <strong>
                    {{ formatDateTime(delivery.updatedAt) }}
                  </strong>
                </div>
              </article>
            </div>
          </section>

          <!-- ACCIONES -->
          <aside class="panel action-panel">
            <header class="panel-header">
              <div>
                <span class="panel-kicker">
                  OPERACIÓN
                </span>

                <h2>Seguimiento</h2>

                <p>
                  Acciones disponibles para esta entrega.
                </p>
              </div>
            </header>

            <div class="action-content">
              <div class="current-status">
                <span>Estado actual</span>

                <div
                  class="status status-large"
                  :class="statusClass(delivery.estado)"
                >
                  <i></i>
                  {{ delivery.estado }}
                </div>
              </div>

              <div class="flow-preview">
                <div
                  class="flow-item"
                  :class="{
                    active:
                      delivery.estado === 'Pendiente' ||
                      delivery.estado === 'Preparando' ||
                      delivery.estado === 'En tránsito' ||
                      delivery.estado === 'Entregada'
                  }"
                >
                  <span></span>
                  <small>Pendiente</small>
                </div>

                <div
                  class="flow-line"
                  :class="{
                    active:
                      delivery.estado === 'Preparando' ||
                      delivery.estado === 'En tránsito' ||
                      delivery.estado === 'Entregada'
                  }"
                ></div>

                <div
                  class="flow-item"
                  :class="{
                    active:
                      delivery.estado === 'Preparando' ||
                      delivery.estado === 'En tránsito' ||
                      delivery.estado === 'Entregada'
                  }"
                >
                  <span></span>
                  <small>Preparando</small>
                </div>

                <div
                  class="flow-line"
                  :class="{
                    active:
                      delivery.estado === 'En tránsito' ||
                      delivery.estado === 'Entregada'
                  }"
                ></div>

                <div
                  class="flow-item"
                  :class="{
                    active:
                      delivery.estado === 'En tránsito' ||
                      delivery.estado === 'Entregada'
                  }"
                >
                  <span></span>
                  <small>En tránsito</small>
                </div>

                <div
                  class="flow-line"
                  :class="{
                    active:
                      delivery.estado === 'Entregada'
                  }"
                ></div>

                <div
                  class="flow-item"
                  :class="{
                    active:
                      delivery.estado === 'Entregada'
                  }"
                >
                  <span></span>
                  <small>Entregada</small>
                </div>
              </div>

              <button
                v-if="delivery.estado === 'Pendiente' && canAdvance"
                type="button"
                class="primary"
                :disabled="working"
                @click="changeStatus('Preparando')"
              >
                <span
                  v-if="working"
                  class="button-loader"
                ></span>

                <svg
                  v-else
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14" />
                  <path d="m15 8 4 4-4 4" />
                </svg>

                {{
                  working
                    ? 'Actualizando...'
                    : 'Iniciar preparación'
                }}
              </button>

              <button
                v-else-if="delivery.estado === 'Preparando' && canAdvance"
                type="button"
                class="primary"
                :disabled="working"
                @click="changeStatus('En tránsito')"
              >
                <span
                  v-if="working"
                  class="button-loader"
                ></span>

                <svg
                  v-else
                  viewBox="0 0 24 24"
                >
                  <path d="M3 7h11v9H3z" />
                  <path d="M14 10h3l3 3v3h-6z" />
                </svg>

                {{
                  working
                    ? 'Actualizando...'
                    : 'Marcar en tránsito'
                }}
              </button>

              <button
                v-else-if="delivery.estado === 'En tránsito' && canReceive"
                type="button"
                class="receive-button"
                :disabled="working"
                @click="confirmDeliveryReception"
              >
                <span
                  v-if="working"
                  class="button-loader"
                ></span>

                <svg
                  v-else
                  viewBox="0 0 24 24"
                >
                  <path d="m7 12 3 3 7-7" />
                  <circle cx="12" cy="12" r="9" />
                </svg>

                {{
                  working
                    ? 'Confirmando...'
                    : 'Confirmar recepción'
                }}
              </button>

              <div
                v-else-if="delivery.estado === 'Entregada'"
                class="completed"
              >
                <div class="completed-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="m7 12 3 3 7-7" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>

                <div>
                  <strong>Entrega completada</strong>

                  <span>
                    La recepción ya fue confirmada.
                  </span>
                </div>
              </div>

              <div
                v-else
                class="no-action"
              >
                <div class="no-action-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>

                <span>
                  No tienes acciones disponibles para el estado actual.
                </span>
              </div>

              <div class="action-note">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5" />
                  <path d="M12 8h.01" />
                </svg>

                <p>
                  Los cambios de estado quedan registrados automáticamente
                  en la trazabilidad de la entrega.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <!-- TRAZABILIDAD -->
        <section class="panel history-panel">
          <header class="panel-header">
            <div>
              <span class="panel-kicker">
                HISTORIAL
              </span>

              <h2>Trazabilidad de la entrega</h2>

              <p>
                Historial de movimientos registrados en esta operación.
              </p>
            </div>

            <span class="events-count">
              {{ delivery.events?.length || 0 }}
              evento{{ delivery.events?.length === 1 ? '' : 's' }}
            </span>
          </header>

          <div
            v-if="!delivery.events?.length"
            class="empty-history"
          >
            <div class="empty-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
            </div>

            <strong>
              No hay movimientos registrados
            </strong>

            <span>
              Los cambios de esta entrega aparecerán aquí.
            </span>
          </div>

          <ol
            v-else
            class="timeline"
          >
            <li
              v-for="(event, index) in reversedEvents"
              :key="`${event.at}-${index}`"
            >
              <div class="timeline-marker">
                <span></span>
              </div>

              <div class="event-card">
                <div class="event-heading">
                  <div>
                    <span class="event-label">
                      MOVIMIENTO
                    </span>

                    <strong>
                      {{ eventTitle(event) }}
                    </strong>
                  </div>

                  <span class="event-date">
                    {{ formatDateTime(event.at) }}
                  </span>
                </div>

                <div class="event-user">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3" />
                    <path d="M6 19c.5-3.4 2.5-5 6-5s5.5 1.6 6 5" />
                  </svg>

                  {{ event.userName || 'Sistema' }}
                </div>
              </div>
            </li>
          </ol>
        </section>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  useRoute
} from 'vue-router'

import AppLayout from '../components/AppLayout.vue'

import {
  confirmReception,
  getDelivery,
  updateDeliveryStatus
} from '../services/deliveries'

import {
  getCurrentUser
} from '../services/auth'

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
  if (!delivery.value || !user) {
    return false
  }

  if (
    elevatedRoles.includes(user.role)
  ) {
    return true
  }

  return (
    user.role === 'Responsable de transporte' &&
    Number(delivery.value.responsableId) ===
      Number(user.id)
  )
})

const canReceive = computed(() =>
  receptionRoles.includes(user?.role)
)

const reversedEvents = computed(() => {
  if (
    !Array.isArray(
      delivery.value?.events
    )
  ) {
    return []
  }

  return [
    ...delivery.value.events
  ].reverse()
})

async function loadDelivery() {
  loading.value = true
  error.value = ''

  try {
    delivery.value =
      await getDelivery(
        route.params.id
      )
  } catch (err) {
    error.value =
      err.message
  } finally {
    loading.value = false
  }
}

async function changeStatus(status) {
  working.value = true
  error.value = ''

  try {
    delivery.value =
      await updateDeliveryStatus(
        route.params.id,
        status
      )
  } catch (err) {
    error.value =
      err.message
  } finally {
    working.value = false
  }
}

async function confirmDeliveryReception() {
  working.value = true
  error.value = ''

  try {
    delivery.value =
      await confirmReception(
        route.params.id
      )
  } catch (err) {
    error.value =
      err.message
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
  if (
    event.type === 'CREATED'
  ) {
    return 'Entrega registrada'
  }

  if (
    event.type === 'STATUS_CHANGED'
  ) {
    return `Estado actualizado a ${event.estado}`
  }

  if (
    event.type === 'RECEIVED'
  ) {
    return 'Recepción confirmada'
  }

  return 'Movimiento registrado'
}

function formatDateTime(value) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'es-CO',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  ).format(
    new Date(value)
  )
}

onMounted(loadDelivery)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.detail-page {
  width: 100%;
}

/* HEADER */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 22px;

  margin-bottom: 24px;
}

.eyebrow {
  display: flex;
  align-items: center;

  gap: 9px;

  margin-bottom: 7px;

  color:
    var(--color-primary);

  font-size: 12px;
  font-weight: 900;

  letter-spacing: 1.15px;
  text-transform: uppercase;
}

.eyebrow > span {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background:
    var(--color-accent);

  box-shadow:
    0 0 0 4px
    rgba(239, 183, 46, 0.12);
}

h1 {
  margin: 0;

  color:
    var(--text-primary);

  font-size:
    clamp(
      28px,
      3vw,
      38px
    );

  font-weight: 850;
  letter-spacing: -0.8px;
}

.subtitle {
  max-width: 700px;

  margin: 9px 0 0;

  color:
    var(--text-muted);

  font-size: 14px;
  line-height: 1.6;
}

.back-link {
  min-height: 44px;

  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 0 13px;

  border:
    1px solid
    var(--border-color);

  border-radius: 11px;

  background:
    var(--bg-surface);

  color:
    var(--color-primary);

  text-decoration: none;

  font-size: 13px;
  font-weight: 800;

  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.back-link:hover {
  background:
    var(--color-primary-soft);

  transform:
    translateX(-2px);
}

.back-link svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* HERO */

.delivery-hero {
  min-height: 155px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 22px;

  position: relative;
  overflow: hidden;

  margin-bottom: 20px;
  padding: 24px 26px;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-xl);

  background:
    var(--bg-surface);

  box-shadow:
    var(--shadow-sm);
}

.hero-background {
  width: 240px;
  height: 240px;

  position: absolute;

  right: -120px;
  top: -135px;

  border-radius: 50%;

  background:
    var(--color-primary-soft);

  opacity: 0.45;
}

.hero-main {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 17px;

  position: relative;
  z-index: 2;
}

.delivery-icon {
  width: 58px;
  height: 58px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 16px;
}

.delivery-icon svg {
  width: 25px;
  height: 25px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.delivery-id {
  display: block;

  color:
    var(--text-muted);

  font-size: 12px;
  font-weight: 750;
}

.hero-copy h2 {
  margin: 4px 0 0;

  color:
    var(--text-primary);

  font-size: 24px;
}

.route-summary {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-top: 13px;
}

.route-summary span,
.route-summary strong {
  display: block;
}

.route-summary span {
  color:
    var(--text-muted);

  font-size: 10px;
  font-weight: 750;

  text-transform: uppercase;
}

.route-summary strong {
  margin-top: 2px;

  color:
    var(--text-secondary);

  font-size: 13px;
}

.route-line {
  min-width: 55px;

  display: flex;
  align-items: center;

  color:
    var(--text-muted);
}

.route-line > span {
  width: 39px;
  height: 1px;

  background:
    var(--border-color);
}

.route-line svg {
  width: 15px;
  height: 15px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.6;
}

.hero-status {
  position: relative;
  z-index: 2;

  flex: 0 0 auto;

  text-align: right;
}

.hero-status > span {
  display: block;

  margin-bottom: 7px;

  color:
    var(--text-muted);

  font-size: 11px;
  font-weight: 750;
}

.status {
  min-height: 30px;

  display: inline-flex;
  align-items: center;

  gap: 7px;

  padding: 0 11px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 850;

  white-space: nowrap;
}

.status-large {
  min-height: 35px;

  padding: 0 13px;

  font-size: 13px;
}

.status i {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    currentColor;
}

.pending {
  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);
}

.preparing {
  background:
    var(--color-accent-soft);

  color:
    var(--color-warning);
}

.transit {
  background:
    var(--color-info-soft);

  color:
    var(--color-info);
}

.delivered {
  background:
    var(--color-success-soft);

  color:
    var(--color-success);
}

.default {
  background:
    var(--bg-surface-secondary);

  color:
    var(--text-muted);
}

/* GRID */

.content-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1.6fr)
    minmax(290px, 0.55fr);

  align-items: start;

  gap: 20px;

  margin-bottom: 20px;
}

/* PANEL */

.panel {
  overflow: hidden;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-lg);

  background:
    var(--bg-surface);

  box-shadow:
    var(--shadow-sm);
}

.panel-header {
  min-height: 96px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  padding: 20px 22px;

  border-bottom:
    1px solid
    var(--border-soft);
}

.panel-kicker {
  display: block;

  margin-bottom: 5px;

  color:
    var(--color-primary);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.2px;
}

.panel-header h2 {
  margin: 0;

  color:
    var(--text-primary);

  font-size: 19px;
}

.panel-header p {
  margin: 5px 0 0;

  color:
    var(--text-muted);

  font-size: 13px;
}

.header-icon {
  width: 43px;
  height: 43px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 12px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.header-icon svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
}

/* INFO */

.info-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;
}

.info-grid article {
  min-height: 105px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding: 20px;

  border-right:
    1px solid
    var(--border-soft);

  border-bottom:
    1px solid
    var(--border-soft);
}

.info-grid article:nth-child(even) {
  border-right: 0;
}

.info-grid article:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.info-icon {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 11px;

  background:
    var(--bg-surface-secondary);

  color:
    var(--color-primary);
}

.info-icon svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.info-grid article > div:last-child {
  min-width: 0;
}

.info-grid span {
  display: block;

  color:
    var(--text-muted);

  font-size: 10px;
  font-weight: 750;

  letter-spacing: 0.45px;
  text-transform: uppercase;
}

.info-grid strong {
  display: block;

  overflow-wrap: anywhere;

  margin-top: 5px;

  color:
    var(--text-primary);

  font-size: 14px;
}

/* ACCIONES */

.action-content {
  padding: 20px;
}

.current-status {
  margin-bottom: 22px;
  padding: 16px;

  border:
    1px solid
    var(--border-color);

  border-radius: 13px;

  background:
    var(--bg-surface-secondary);
}

.current-status > span {
  display: block;

  margin-bottom: 9px;

  color:
    var(--text-muted);

  font-size: 11px;
  font-weight: 750;

  text-transform: uppercase;
}

.flow-preview {
  display: flex;
  align-items: flex-start;

  margin-bottom: 24px;
}

.flow-item {
  width: 46px;

  display: flex;
  flex-direction: column;
  align-items: center;

  flex: 0 0 auto;

  gap: 6px;

  text-align: center;
}

.flow-item > span {
  width: 13px;
  height: 13px;

  border:
    2px solid
    var(--border-color);

  border-radius: 50%;

  background:
    var(--bg-surface);

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.flow-item.active > span {
  border-color:
    var(--color-primary);

  background:
    var(--color-primary);
}

.flow-item small {
  color:
    var(--text-muted);

  font-size: 9px;
  line-height: 1.2;
}

.flow-item.active small {
  color:
    var(--text-secondary);
}

.flow-line {
  height: 2px;

  flex: 1;

  margin-top: 6px;

  background:
    var(--border-color);
}

.flow-line.active {
  background:
    var(--color-primary);
}

.primary,
.receive-button {
  width: 100%;
  min-height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  border: 0;
  border-radius: 11px;

  color: #ffffff;

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.primary {
  background:
    var(--color-primary);
}

.primary:hover {
  background:
    var(--color-primary-hover);

  transform:
    translateY(-1px);
}

.receive-button {
  background:
    var(--color-success);
}

.receive-button:hover {
  filter:
    brightness(1.08);
}

.primary:disabled,
.receive-button:disabled {
  opacity: 0.65;

  cursor: wait;
  transform: none;
}

.primary svg,
.receive-button svg {
  width: 19px;
  height: 19px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.button-loader {
  width: 17px;
  height: 17px;

  border:
    2px solid
    rgba(255, 255, 255, 0.35);

  border-top-color:
    #ffffff;

  border-radius: 50%;

  animation:
    spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

.completed {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 15px;

  border:
    1px solid
    var(--color-success);

  border-radius: 12px;

  background:
    var(--color-success-soft);
}

.completed-icon {
  width: 38px;
  height: 38px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 11px;

  background:
    var(--color-success);

  color: #ffffff;
}

.completed-icon svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.completed strong,
.completed span {
  display: block;
}

.completed strong {
  color:
    var(--text-primary);

  font-size: 13px;
}

.completed span {
  margin-top: 2px;

  color:
    var(--text-secondary);

  font-size: 11px;
}

.no-action {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 14px;

  border:
    1px solid
    var(--border-color);

  border-radius: 12px;

  background:
    var(--bg-surface-secondary);

  color:
    var(--text-secondary);

  font-size: 12px;
  line-height: 1.45;
}

.no-action-icon {
  width: 34px;
  height: 34px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 10px;

  background:
    var(--bg-surface);

  color:
    var(--text-muted);
}

.no-action-icon svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
}

.action-note {
  display: flex;
  align-items: flex-start;

  gap: 8px;

  margin-top: 16px;
}

.action-note svg {
  width: 16px;
  height: 16px;

  flex: 0 0 auto;

  margin-top: 2px;

  fill: none;
  stroke:
    var(--text-muted);

  stroke-width: 1.7;
  stroke-linecap: round;
}

.action-note p {
  margin: 0;

  color:
    var(--text-muted);

  font-size: 11px;
  line-height: 1.5;
}

/* HISTORIAL */

.history-panel {
  margin-bottom: 20px;
}

.events-count {
  min-height: 33px;

  display: inline-flex;
  align-items: center;

  padding: 0 11px;

  border-radius: 999px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);

  font-size: 11px;
  font-weight: 800;
}

.timeline {
  margin: 0;

  padding:
    24px
    25px;

  list-style: none;
}

.timeline li {
  display: grid;

  grid-template-columns:
    22px 1fr;

  gap: 12px;
}

.timeline-marker {
  display: flex;
  justify-content: center;

  position: relative;
}

.timeline-marker::after {
  width: 1px;

  position: absolute;

  top: 17px;
  bottom: -14px;

  background:
    var(--border-color);

  content: "";
}

.timeline li:last-child
.timeline-marker::after {
  display: none;
}

.timeline-marker span {
  width: 11px;
  height: 11px;

  position: relative;
  z-index: 1;

  margin-top: 6px;

  border-radius: 50%;

  background:
    var(--color-primary);

  box-shadow:
    0 0 0 5px
    var(--color-primary-soft);
}

.event-card {
  margin-bottom: 18px;
  padding: 16px;

  border:
    1px solid
    var(--border-color);

  border-radius: 12px;

  background:
    var(--bg-surface-secondary);
}

.event-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 15px;
}

.event-label {
  display: block;

  margin-bottom: 3px;

  color:
    var(--color-primary);

  font-size: 9px;
  font-weight: 900;

  letter-spacing: 1px;
}

.event-heading strong {
  color:
    var(--text-primary);

  font-size: 14px;
}

.event-date {
  flex: 0 0 auto;

  color:
    var(--text-muted);

  font-size: 11px;
}

.event-user {
  display: flex;
  align-items: center;

  gap: 6px;

  margin-top: 9px;

  color:
    var(--text-secondary);

  font-size: 12px;
}

.event-user svg {
  width: 15px;
  height: 15px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.7;
}

.empty-history {
  min-height: 210px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 35px;

  text-align: center;
}

.empty-icon {
  width: 50px;
  height: 50px;

  display: grid;
  place-items: center;

  margin-bottom: 12px;

  border-radius: 14px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.empty-icon svg {
  width: 22px;
  height: 22px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
}

.empty-history strong {
  color:
    var(--text-primary);

  font-size: 14px;
}

.empty-history > span {
  margin-top: 5px;

  color:
    var(--text-muted);

  font-size: 12px;
}

/* CARGA Y ERROR */

.loading-card {
  min-height: 180px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  padding: 30px;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-lg);

  background:
    var(--bg-surface);
}

.loader {
  width: 37px;
  height: 37px;

  flex: 0 0 auto;

  border:
    3px solid
    var(--border-color);

  border-top-color:
    var(--color-primary);

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;
}

.loading-card strong,
.loading-card span {
  display: block;
}

.loading-card strong {
  color:
    var(--text-primary);

  font-size: 14px;
}

.loading-card span {
  margin-top: 3px;

  color:
    var(--text-muted);

  font-size: 12px;
}

.message {
  display: flex;
  align-items: center;

  gap: 11px;

  margin-bottom: 18px;

  padding: 14px 16px;

  border-radius: 12px;
}

.message.error {
  border:
    1px solid
    var(--color-danger);

  background:
    var(--color-danger-soft);

  color:
    var(--color-danger);
}

.message-icon {
  width: 35px;
  height: 35px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 10px;

  background:
    rgba(201, 74, 67, 0.1);

  font-weight: 900;
}

.message strong,
.message span {
  display: block;
}

.message strong {
  color:
    var(--text-primary);

  font-size: 13px;
}

.message span {
  margin-top: 2px;

  color:
    var(--color-danger);

  font-size: 12px;
}

/* RESPONSIVE */

@media (max-width: 950px) {
  .content-grid {
    grid-template-columns:
      1fr;
  }
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .back-link {
    width: 100%;
    justify-content: center;
  }

  .delivery-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-status {
    width: 100%;
    text-align: left;
  }

  .info-grid {
    grid-template-columns:
      1fr;
  }

  .info-grid article,
  .info-grid article:nth-child(even),
  .info-grid article:nth-last-child(-n + 2) {
    border-right: 0;

    border-bottom:
      1px solid
      var(--border-soft);
  }

  .info-grid article:last-child {
    border-bottom: 0;
  }
}

@media (max-width: 520px) {
  h1 {
    font-size: 28px;
  }

  .delivery-hero {
    padding: 20px;
  }

  .hero-main {
    align-items: flex-start;
  }

  .delivery-icon {
    width: 50px;
    height: 50px;
  }

  .hero-copy h2 {
    font-size: 20px;
  }

  .route-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .route-line {
    display: none;
  }

  .flow-preview {
    overflow-x: auto;

    padding-bottom: 5px;
  }

  .event-heading {
    flex-direction: column;
  }

  .event-date {
    flex: auto;
  }
}
</style>