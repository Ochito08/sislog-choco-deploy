<template>
  <AppLayout title="Dashboard">
    <div class="dashboard">
      <!-- HERO -->
      <section class="hero">
        <div class="hero-decoration hero-decoration--one"></div>
        <div class="hero-decoration hero-decoration--two"></div>

        <div class="hero-content">
          <div class="hero-copy">
            <div class="eyebrow">
              <span class="eyebrow-dot"></span>
              Centro de operaciones
            </div>

            <h1>
              Buen día,
              <span>{{ firstName }}</span>
            </h1>

            <p class="hero-description">
              Supervisa las ayudas humanitarias, consulta el avance de las
              entregas y mantén el control de cada operación logística.
            </p>

            <div class="hero-meta">
              <span>
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="15" rx="2" />
                  <path d="M8 3v4M16 3v4M4 10h16" />
                </svg>

                {{ formattedDate }}
              </span>

              <span>
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4l3 2" />
                </svg>

                Información actualizada
              </span>
            </div>
          </div>

          <div class="hero-actions">
            <RouterLink
              v-if="canCreate"
              to="/entregas/nueva"
              class="hero-primary"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>

              Nueva entrega
            </RouterLink>

            <RouterLink
              to="/entregas"
              class="hero-secondary"
            >
              Ver entregas

              <svg viewBox="0 0 24 24">
                <path d="M5 12h14" />
                <path d="m15 8 4 4-4 4" />
              </svg>
            </RouterLink>
          </div>
        </div>

        <div class="hero-summary">
          <div>
            <span>Operaciones registradas</span>
            <strong>{{ deliveries.length }}</strong>
          </div>

          <div class="hero-separator"></div>

          <div>
            <span>Actualmente en tránsito</span>
            <strong>{{ count('En tránsito') }}</strong>
          </div>

          <div class="hero-separator"></div>

          <div>
            <span>Tasa de entregas</span>
            <strong>{{ deliveredPercentage }}%</strong>
          </div>
        </div>
      </section>

      <!-- MENSAJES -->
      <div
        v-if="error"
        class="alert alert--error"
      >
        <div class="alert-icon">
          !
        </div>

        <div>
          <strong>No pudimos cargar la información</strong>
          <span>{{ error }}</span>
        </div>
      </div>

      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="loader"></div>

        <div>
          <strong>Cargando operaciones</strong>
          <span>
            Estamos consultando los datos del sistema...
          </span>
        </div>
      </div>

      <template v-else>
        <!-- MÉTRICAS -->
        <section class="metrics">
          <article class="metric-card">
            <div class="metric-top">
              <div class="metric-icon metric-icon--total">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
                  <path d="M4 12l8 4.5 8-4.5" />
                  <path d="M4 16.5 12 21l8-4.5" />
                </svg>
              </div>

              <span class="metric-badge">
                General
              </span>
            </div>

            <strong class="metric-value">
              {{ deliveries.length }}
            </strong>

            <div class="metric-copy">
              <strong>Total de entregas</strong>
              <span>Operaciones registradas</span>
            </div>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <div class="metric-icon metric-icon--pending">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v5" />
                  <path d="M12 16h.01" />
                </svg>
              </div>

              <span class="metric-badge">
                Por iniciar
              </span>
            </div>

            <strong class="metric-value">
              {{ count('Pendiente') }}
            </strong>

            <div class="metric-copy">
              <strong>Pendientes</strong>
              <span>Esperando preparación</span>
            </div>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <div class="metric-icon metric-icon--transit">
                <svg viewBox="0 0 24 24">
                  <path d="M3 7h11v9H3z" />
                  <path d="M14 10h3l3 3v3h-6z" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
              </div>

              <span class="metric-badge">
                En movimiento
              </span>
            </div>

            <strong class="metric-value">
              {{ count('En tránsito') }}
            </strong>

            <div class="metric-copy">
              <strong>En tránsito</strong>
              <span>Ayudas en desplazamiento</span>
            </div>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <div class="metric-icon metric-icon--delivered">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                  <path d="m8.5 12 2.2 2.2L16 9" />
                </svg>
              </div>

              <span class="metric-badge metric-badge--success">
                Completadas
              </span>
            </div>

            <strong class="metric-value">
              {{ count('Entregada') }}
            </strong>

            <div class="metric-copy">
              <strong>Entregadas</strong>
              <span>Recepciones confirmadas</span>
            </div>
          </article>
        </section>

        <!-- CONTENIDO PRINCIPAL -->
        <div class="content-grid">
          <section class="card deliveries-card">
            <header class="section-header">
              <div>
                <span class="section-eyebrow">
                  ACTIVIDAD RECIENTE
                </span>

                <h2>Seguimiento de entregas</h2>

                <p>
                  Últimos movimientos registrados en SISLOG-CHOCÓ.
                </p>
              </div>

              <RouterLink
                to="/entregas"
                class="section-link"
              >
                Ver todas

                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m15 8 4 4-4 4" />
                </svg>
              </RouterLink>
            </header>

            <div
              v-if="deliveries.length"
              class="delivery-list"
            >
              <RouterLink
                v-for="delivery in recentDeliveries"
                :key="delivery.id"
                :to="`/entregas/${delivery.id}`"
                class="delivery-row"
              >
                <div
                  class="delivery-symbol"
                  :class="statusClass(delivery.estado)"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14" />
                    <path d="m15 8 4 4-4 4" />
                  </svg>
                </div>

                <div class="delivery-main">
                  <div class="delivery-title-line">
                    <div>
                      <span class="delivery-id">
                        {{
                          delivery.code ||
                          delivery.codigo ||
                          delivery.id
                        }}
                      </span>

                      <h3>
                        {{ delivery.tipo }}
                      </h3>
                    </div>

                    <span
                      class="status-pill"
                      :class="statusClass(delivery.estado)"
                    >
                      <span></span>
                      {{ delivery.estado }}
                    </span>
                  </div>

                  <div class="delivery-route">
                    <div>
                      <span>Origen</span>
                      <strong>
                        {{ delivery.origen }}
                      </strong>
                    </div>

                    <div class="route-arrow">
                      <span></span>

                      <svg viewBox="0 0 24 24">
                        <path d="M5 12h14" />
                        <path d="m15 8 4 4-4 4" />
                      </svg>
                    </div>

                    <div>
                      <span>Destino</span>
                      <strong>
                        {{ delivery.destino }}
                      </strong>
                    </div>
                  </div>

                  <div class="delivery-meta">
                    <span>
                      <svg viewBox="0 0 24 24">
                        <path d="M5 7h14v12H5z" />
                        <path d="M8 7V5h8v2" />
                      </svg>

                      {{ delivery.cantidad }} unidades
                    </span>

                    <span>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="3" />
                        <path d="M6 19c.5-3.4 2.5-5 6-5s5.5 1.6 6 5" />
                      </svg>

                      {{ responsibleName(delivery) }}
                    </span>
                  </div>
                </div>

                <div class="delivery-open">
                  <svg viewBox="0 0 24 24">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </div>
              </RouterLink>
            </div>

            <div
              v-else
              class="empty-state"
            >
              <div class="empty-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
                  <path d="M4 12l8 4.5 8-4.5" />
                </svg>
              </div>

              <strong>
                No hay entregas registradas
              </strong>

              <span>
                Las operaciones aparecerán aquí cuando sean creadas.
              </span>
            </div>
          </section>

          <!-- PANEL DERECHO -->
          <aside class="side-column">
            <section class="card status-card">
              <header class="small-header">
                <div>
                  <span class="section-eyebrow">
                    DISTRIBUCIÓN
                  </span>

                  <h2>
                    Estado operacional
                  </h2>
                </div>

                <div class="status-total">
                  {{ deliveries.length }}
                </div>
              </header>

              <div class="status-progress-list">
                <div
                  v-for="item in statusSummary"
                  :key="item.status"
                  class="progress-item"
                >
                  <div class="progress-label">
                    <span>
                      <i :class="item.className"></i>
                      {{ item.status }}
                    </span>

                    <strong>
                      {{ item.count }}
                    </strong>
                  </div>

                  <div class="progress-track">
                    <span
                      :class="item.className"
                      :style="{ width: `${item.percentage}%` }"
                    ></span>
                  </div>
                </div>
              </div>

              <div class="completion-box">
                <div class="completion-ring">
                  <svg viewBox="0 0 44 44">
                    <circle
                      class="ring-background"
                      cx="22"
                      cy="22"
                      r="18"
                    />

                    <circle
                      class="ring-value"
                      cx="22"
                      cy="22"
                      r="18"
                      pathLength="100"
                      :style="{
                        strokeDasharray:
                          `${deliveredPercentage} ${100 - deliveredPercentage}`
                      }"
                    />
                  </svg>

                  <strong>
                    {{ deliveredPercentage }}%
                  </strong>
                </div>

                <div>
                  <strong>
                    Progreso general
                  </strong>

                  <span>
                    Porcentaje de operaciones entregadas.
                  </span>
                </div>
              </div>
            </section>

            <section class="quick-card">
              <div class="quick-decoration"></div>

              <span class="quick-label">
                ACCESO RÁPIDO
              </span>

              <h2>
                Gestión logística
              </h2>

              <p>
                Consulta el historial completo de operaciones y
                recepciones finalizadas.
              </p>

              <RouterLink to="/historial">
                Abrir historial

                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m15 8 4 4-4 4" />
                </svg>
              </RouterLink>
            </section>
          </aside>
        </div>
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

import AppLayout from '../components/AppLayout.vue'

import {
  listDeliveries
} from '../services/deliveries'

import {
  getCurrentUser
} from '../services/auth'

const deliveries = ref([])
const loading = ref(true)
const error = ref('')

const user = getCurrentUser()

const firstName =
  (user?.name || 'Usuario')
    .split(' ')
    .filter(Boolean)[0]

const canCreate = [
  'Coordinador logístico',
  'Administrador'
].includes(user?.role)

function count(status) {
  return deliveries.value.filter(
    delivery => delivery.estado === status
  ).length
}

const recentDeliveries = computed(() =>
  deliveries.value.slice(0, 4)
)

const deliveredPercentage = computed(() => {
  if (!deliveries.value.length) {
    return 0
  }

  return Math.round(
    (
      count('Entregada') /
      deliveries.value.length
    ) * 100
  )
})

const formattedDate = computed(() => {
  const value =
    new Intl.DateTimeFormat(
      'es-CO',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ).format(new Date())

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
})

const statusSummary = computed(() => {
  const total =
    deliveries.value.length || 1

  const values = [
    {
      status: 'Entregada',
      className: 'green'
    },
    {
      status: 'En tránsito',
      className: 'blue'
    },
    {
      status: 'Preparando',
      className: 'yellow'
    },
    {
      status: 'Pendiente',
      className: 'orange'
    }
  ]

  return values.map(item => {
    const value = count(item.status)

    return {
      ...item,
      count: value,
      percentage: Math.round(
        (value / total) * 100
      )
    }
  })
})

function statusClass(status) {
  const classes = {
    Entregada: 'status--delivered',
    'En tránsito': 'status--transit',
    Preparando: 'status--preparing',
    Pendiente: 'status--pending'
  }

  return (
    classes[status] ||
    'status--default'
  )
}

function responsibleName(delivery) {
  if (
    typeof delivery.responsable === 'string'
  ) {
    return delivery.responsable
  }

  return (
    delivery.responsable?.name ||
    delivery.responsable?.nombre ||
    delivery.responsible?.name ||
    'Sin responsable'
  )
}

onMounted(async () => {
  try {
    deliveries.value =
      await listDeliveries()
  } catch (err) {
    error.value =
      err?.message ||
      'No fue posible consultar las entregas.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard {
  width: 100%;
  animation: dashboard-enter 0.3s ease;
}

@keyframes dashboard-enter {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* HERO */

.hero {
  overflow: hidden;
  position: relative;
  margin-bottom: 24px;
  border-radius: 24px;

  background:
    radial-gradient(
      circle at 82% 5%,
      rgba(255, 210, 77, 0.22),
      transparent 27%
    ),
    linear-gradient(
      120deg,
      #0a4635 0%,
      #0d5d45 55%,
      #126c50 100%
    );

  color: #ffffff;

  box-shadow:
    0 18px 45px rgba(14, 72, 54, 0.14);
}

.hero-decoration {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.hero-decoration--one {
  width: 150px;
  height: 150px;
  top: -65px;
  right: 22%;

  border:
    30px solid
    rgba(255, 255, 255, 0.04);
}

.hero-decoration--two {
  width: 45px;
  height: 45px;

  right: 8%;
  top: 34%;

  background:
    rgba(240, 186, 47, 0.12);
}

.hero-content {
  min-height: 270px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 40px;

  position: relative;
  z-index: 2;

  padding:
    38px
    42px
    30px;
}

.hero-copy {
  max-width: 700px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;

  gap: 10px;

  margin-bottom: 14px;

  color: #c3dfd5;

  font-size: 13px;
  font-weight: 850;

  letter-spacing: 1.25px;
  text-transform: uppercase;
}

.eyebrow-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #f0ba2f;

  box-shadow:
    0 0 0 5px
    rgba(240, 186, 47, 0.12);
}

.hero h1 {
  margin: 0;

  color: #ffffff;

  font-size:
    clamp(
      36px,
      4vw,
      50px
    );

  font-weight: 850;
  letter-spacing: -1.5px;
  line-height: 1.05;
}

.hero h1 span {
  color: #f4c84e;
}

.hero-description {
  max-width: 640px;

  margin: 18px 0 0;

  color:
    rgba(255, 255, 255, 0.75);

  font-size: 15px;
  line-height: 1.7;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;

  gap: 20px;

  margin-top: 24px;
}

.hero-meta > span {
  display: flex;
  align-items: center;

  gap: 8px;

  color:
    rgba(255, 255, 255, 0.68);

  font-size: 12px;
  font-weight: 600;
}

.hero-meta svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-actions {
  width: 190px;

  display: flex;
  flex: 0 0 auto;
  flex-direction: column;

  gap: 11px;
}

.hero-primary,
.hero-secondary {
  min-height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  border-radius: 13px;

  text-decoration: none;

  font-size: 14px;
  font-weight: 800;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.hero-primary {
  background: #f0b92d;
  color: #154c3a;

  box-shadow:
    0 10px 24px
    rgba(6, 28, 21, 0.16);
}

.hero-primary:hover {
  transform: translateY(-2px);
  background: #f7c442;
}

.hero-secondary {
  border:
    1px solid
    rgba(255, 255, 255, 0.17);

  background:
    rgba(255, 255, 255, 0.08);

  color: #ffffff;
}

.hero-secondary:hover {
  background:
    rgba(255, 255, 255, 0.14);
}

.hero-primary svg,
.hero-secondary svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-summary {
  min-height: 82px;

  display: flex;
  align-items: center;

  gap: 32px;

  position: relative;
  z-index: 2;

  padding: 0 42px;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.09);

  background:
    rgba(5, 36, 27, 0.18);
}

.hero-summary > div:not(.hero-separator) {
  min-width: 150px;
}

.hero-summary span,
.hero-summary strong {
  display: block;
}

.hero-summary span {
  color:
    rgba(255, 255, 255, 0.57);

  font-size: 12px;
  font-weight: 650;
}

.hero-summary strong {
  margin-top: 3px;

  color: #ffffff;

  font-size: 21px;
}

.hero-separator {
  width: 1px;
  height: 34px;

  background:
    rgba(255, 255, 255, 0.12);
}

/* MENSAJES */

.alert,
.loading-state {
  display: flex;
  align-items: center;

  gap: 14px;

  margin-bottom: 20px;
  padding: 16px;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-md);

  background:
    var(--bg-surface);

  color:
    var(--text-primary);
}

.alert--error {
  border-color:
    var(--color-danger);

  background:
    var(--color-danger-soft);
}

.alert-icon {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  border-radius: 11px;

  background:
    var(--color-danger-soft);

  color:
    var(--color-danger);

  font-size: 16px;
  font-weight: 900;
}

.alert strong,
.alert span,
.loading-state strong,
.loading-state span {
  display: block;
}

.alert strong,
.loading-state strong {
  color:
    var(--text-primary);

  font-size: 14px;
}

.alert span,
.loading-state span {
  margin-top: 3px;

  color:
    var(--text-muted);

  font-size: 12px;
}

.loader {
  width: 34px;
  height: 34px;

  border:
    3px solid
    var(--border-color);

  border-top-color:
    var(--color-primary);

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* MÉTRICAS */

.metrics {
  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: 16px;

  margin-bottom: 20px;
}

.metric-card {
  min-width: 0;
  min-height: 180px;

  position: relative;
  overflow: hidden;

  padding: 20px;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-lg);

  background:
    var(--bg-surface);

  color:
    var(--text-primary);

  box-shadow:
    var(--shadow-sm);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.metric-card:hover {
  transform:
    translateY(-3px);

  box-shadow:
    var(--shadow-md);
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 8px;
}

.metric-icon {
  width: 44px;
  height: 44px;

  display: grid;
  place-items: center;

  border-radius: 12px;
}

.metric-icon svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.metric-icon--total {
  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.metric-icon--pending {
  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);
}

.metric-icon--transit {
  background:
    var(--color-info-soft);

  color:
    var(--color-info);
}

.metric-icon--delivered {
  background:
    var(--color-success-soft);

  color:
    var(--color-success);
}

.metric-badge {
  padding: 6px 9px;

  border-radius: 999px;

  background:
    var(--bg-surface-secondary);

  color:
    var(--text-muted);

  font-size: 10px;
  font-weight: 850;

  text-transform: uppercase;
}

.metric-badge--success {
  background:
    var(--color-success-soft);

  color:
    var(--color-success);
}

.metric-value {
  display: block;

  margin-top: 19px;

  color:
    var(--text-primary);

  font-size: 34px;
  font-weight: 850;

  line-height: 1;
}

.metric-copy {
  margin-top: 10px;
}

.metric-copy strong,
.metric-copy span {
  display: block;
}

.metric-copy strong {
  color:
    var(--text-primary);

  font-size: 15px;
  font-weight: 800;
}

.metric-copy span {
  margin-top: 4px;

  color:
    var(--text-muted);

  font-size: 12px;
}

/* CONTENIDO */

.content-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1.7fr)
    minmax(300px, 0.7fr);

  align-items: start;

  gap: 20px;
}

.card {
  min-width: 0;
  overflow: hidden;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-lg);

  background:
    var(--bg-surface);

  color:
    var(--text-primary);

  box-shadow:
    var(--shadow-sm);

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.section-header,
.small-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
}

.section-header {
  min-height: 105px;

  padding: 22px 24px;

  border-bottom:
    1px solid
    var(--border-soft);
}

.section-eyebrow {
  display: block;

  margin-bottom: 6px;

  color:
    var(--color-primary);

  font-size: 11px;
  font-weight: 900;

  letter-spacing: 1.2px;
}

.section-header h2,
.small-header h2 {
  margin: 0;

  color:
    var(--text-primary);

  font-size: 19px;
}

.section-header p {
  margin: 6px 0 0;

  color:
    var(--text-muted);

  font-size: 13px;
}

.section-link {
  min-height: 40px;

  display: flex;
  align-items: center;

  gap: 7px;

  flex: 0 0 auto;

  padding: 0 13px;

  border-radius: 10px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);

  text-decoration: none;

  font-size: 12px;
  font-weight: 850;
}

.section-link:hover {
  filter: brightness(1.05);
}

.section-link svg {
  width: 16px;
  height: 16px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
}

/* ENTREGAS */

.delivery-list {
  padding: 10px;
}

.delivery-row {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 15px;

  position: relative;

  margin-bottom: 6px;

  padding: 17px 15px;

  border:
    1px solid transparent;

  border-radius: 14px;

  color: inherit;
  text-decoration: none;

  transition:
    background 0.17s ease,
    border-color 0.17s ease,
    transform 0.17s ease;
}

.delivery-row:last-child {
  margin-bottom: 0;
}

.delivery-row:hover {
  border-color:
    var(--border-color);

  background:
    var(--bg-surface-secondary);

  transform:
    translateX(2px);
}

.delivery-symbol {
  width: 46px;
  height: 46px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 13px;
}

.delivery-symbol svg {
  width: 19px;
  height: 19px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.delivery-main {
  min-width: 0;
  flex: 1;
}

.delivery-title-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.delivery-id {
  color:
    var(--text-muted);

  font-size: 11px;
  font-weight: 750;
}

.delivery-title-line h3 {
  margin: 3px 0 0;

  color:
    var(--text-primary);

  font-size: 16px;
}

.status-pill {
  min-height: 27px;

  display: inline-flex;
  align-items: center;

  gap: 6px;

  flex: 0 0 auto;

  padding: 0 10px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 850;
}

.status-pill > span {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    currentColor;
}

.status--delivered {
  background:
    var(--color-success-soft);

  color:
    var(--color-success);
}

.status--transit {
  background:
    var(--color-info-soft);

  color:
    var(--color-info);
}

.status--preparing {
  background:
    var(--color-accent-soft);

  color:
    var(--color-warning);
}

.status--pending {
  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);
}

.status--default {
  background:
    var(--bg-surface-secondary);

  color:
    var(--text-muted);
}

.delivery-route {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-top: 12px;
}

.delivery-route > div:not(.route-arrow) {
  min-width: 0;
}

.delivery-route span,
.delivery-route strong {
  display: block;
}

.delivery-route span {
  color:
    var(--text-muted);

  font-size: 10px;
  font-weight: 750;

  text-transform: uppercase;
}

.delivery-route strong {
  overflow: hidden;

  max-width: 140px;

  margin-top: 2px;

  color:
    var(--text-secondary);

  font-size: 13px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-arrow {
  min-width: 50px;

  display: flex;
  align-items: center;

  color:
    var(--text-muted);
}

.route-arrow > span {
  width: 34px;
  height: 1px;

  background:
    var(--border-color);
}

.route-arrow svg {
  width: 14px;
  height: 14px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.5;
}

.delivery-meta {
  display: flex;
  flex-wrap: wrap;

  gap: 14px;

  margin-top: 11px;
}

.delivery-meta > span {
  display: flex;
  align-items: center;

  gap: 5px;

  color:
    var(--text-muted);

  font-size: 12px;
  font-weight: 600;
}

.delivery-meta svg {
  width: 14px;
  height: 14px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.6;
}

.delivery-open {
  width: 35px;
  height: 35px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 10px;

  color:
    var(--text-muted);
}

.delivery-row:hover .delivery-open {
  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.delivery-open svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* PANEL DERECHO */

.side-column {
  display: grid;
  gap: 20px;
}

.status-card {
  padding: 22px;
}

.small-header {
  margin-bottom: 28px;
}

.status-total {
  min-width: 44px;
  height: 44px;

  display: grid;
  place-items: center;

  border-radius: 13px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);

  font-size: 16px;
  font-weight: 900;
}

.status-progress-list {
  display: grid;
  gap: 20px;
}

.progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 8px;
}

.progress-label > span {
  display: flex;
  align-items: center;

  gap: 8px;

  color:
    var(--text-secondary);

  font-size: 13px;
  font-weight: 700;
}

.progress-label strong {
  color:
    var(--text-primary);

  font-size: 13px;
}

.progress-label i {
  width: 8px;
  height: 8px;

  display: block;

  border-radius: 50%;
}

.green {
  background:
    var(--color-success);
}

.blue {
  background:
    var(--color-info);
}

.yellow {
  background:
    var(--color-accent);
}

.orange {
  background:
    var(--color-warning);
}

.progress-track {
  width: 100%;
  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background:
    var(--border-soft);
}

.progress-track > span {
  height: 100%;

  display: block;

  min-width: 2px;

  border-radius: inherit;

  transition:
    width 0.4s ease;
}

.completion-box {
  display: flex;
  align-items: center;

  gap: 15px;

  margin-top: 28px;
  padding: 16px;

  border:
    1px solid
    var(--border-color);

  border-radius: 14px;

  background:
    var(--bg-surface-secondary);
}

.completion-ring {
  width: 58px;
  height: 58px;

  position: relative;

  flex: 0 0 auto;
}

.completion-ring svg {
  width: 58px;
  height: 58px;

  transform:
    rotate(-90deg);
}

.completion-ring circle {
  fill: none;
  stroke-width: 4;
}

.ring-background {
  stroke:
    var(--border-color);
}

.ring-value {
  stroke:
    var(--color-success);

  stroke-linecap: round;
}

.completion-ring > strong {
  position: absolute;
  inset: 0;

  display: grid;
  place-items: center;

  color:
    var(--color-success);

  font-size: 12px;
}

.completion-box > div:last-child strong,
.completion-box > div:last-child span {
  display: block;
}

.completion-box > div:last-child strong {
  color:
    var(--text-primary);

  font-size: 13px;
}

.completion-box > div:last-child span {
  margin-top: 4px;

  color:
    var(--text-muted);

  font-size: 11px;

  line-height: 1.45;
}

/* ACCESO RÁPIDO */

.quick-card {
  overflow: hidden;
  position: relative;

  padding: 25px;

  border-radius:
    var(--radius-lg);

  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(240, 186, 47, 0.18),
      transparent 38%
    ),
    #123f32;

  color: #ffffff;

  box-shadow:
    var(--shadow-md);
}

.quick-decoration {
  width: 120px;
  height: 120px;

  position: absolute;

  right: -52px;
  bottom: -58px;

  border:
    23px solid
    rgba(255, 255, 255, 0.035);

  border-radius: 50%;
}

.quick-label {
  color: #e8bd3a;

  font-size: 11px;
  font-weight: 900;

  letter-spacing: 1.2px;
}

.quick-card h2 {
  margin: 8px 0 0;

  color: #ffffff;

  font-size: 20px;
}

.quick-card p {
  max-width: 280px;

  margin: 11px 0 18px;

  color:
    rgba(255, 255, 255, 0.62);

  font-size: 13px;

  line-height: 1.6;
}

.quick-card a {
  display: inline-flex;
  align-items: center;

  gap: 7px;

  color: #ffffff;

  text-decoration: none;

  font-size: 13px;
  font-weight: 850;
}

.quick-card a:hover {
  color: #f0c347;
}

.quick-card a svg {
  width: 16px;
  height: 16px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
}

/* VACÍO */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 60px 20px;

  text-align: center;
}

.empty-icon {
  width: 54px;
  height: 54px;

  display: grid;
  place-items: center;

  margin-bottom: 14px;

  border-radius: 15px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.empty-icon svg {
  width: 24px;
  height: 24px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.7;
}

.empty-state strong {
  color:
    var(--text-primary);

  font-size: 14px;
}

.empty-state span {
  margin-top: 6px;

  color:
    var(--text-muted);

  font-size: 12px;
}

/* MODO OSCURO */

:global(html[data-theme="dark"]) .hero {
  background:
    radial-gradient(
      circle at 82% 5%,
      rgba(239, 189, 63, 0.13),
      transparent 27%
    ),
    linear-gradient(
      120deg,
      #0b3328 0%,
      #0d4434 55%,
      #10523e 100%
    );
}

:global(html[data-theme="dark"]) .quick-card {
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(239, 189, 63, 0.12),
      transparent 38%
    ),
    #0d3328;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .metrics {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .content-grid {
    grid-template-columns:
      minmax(0, 1.4fr)
      minmax(270px, 0.7fr);
  }
}

@media (max-width: 900px) {
  .hero-content {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-actions {
    width: 100%;
    flex-direction: row;
  }

  .hero-primary,
  .hero-secondary {
    flex: 1;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 650px) {
  .hero {
    border-radius: 18px;
  }

  .hero-content {
    min-height: auto;

    padding:
      28px
      21px
      24px;
  }

  .hero h1 {
    font-size: 34px;
  }

  .hero-description {
    font-size: 14px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-summary {
    align-items: stretch;
    flex-direction: column;

    gap: 0;

    padding: 11px 21px;
  }

  .hero-summary > div:not(.hero-separator) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 10px 0;
  }

  .hero-summary strong {
    margin-top: 0;
  }

  .hero-separator {
    width: 100%;
    height: 1px;
  }

  .metrics {
    grid-template-columns:
      1fr 1fr;

    gap: 10px;
  }

  .metric-card {
    min-height: 165px;

    padding: 16px;
  }

  .metric-value {
    margin-top: 16px;

    font-size: 30px;
  }

  .side-column {
    grid-template-columns: 1fr;
  }

  .delivery-row {
    align-items: flex-start;
  }

  .delivery-symbol,
  .delivery-open {
    display: none;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .section-link {
    align-self: stretch;
    justify-content: center;
  }
}

@media (max-width: 430px) {
  .metrics {
    grid-template-columns: 1fr;
  }

  .metric-card {
    min-height: 150px;
  }

  .delivery-title-line {
    align-items: flex-start;
    flex-direction: column;
  }

  .status-pill {
    align-self: flex-start;
  }

  .delivery-route strong {
    max-width: 90px;
  }
}
</style>