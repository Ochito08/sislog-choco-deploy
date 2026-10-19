<template>
  <AppLayout title="Entregas">
    <div class="deliveries-page">
      <!-- ENCABEZADO -->
      <section class="page-header">
        <div>
          <div class="eyebrow">
            <span></span>
            Operación logística
          </div>

          <h1>Gestión de entregas</h1>

          <p class="subtitle">
            Consulta, filtra y realiza seguimiento a las ayudas humanitarias
            registradas en SISLOG-CHOCÓ.
          </p>
        </div>

        <RouterLink
          v-if="canCreate"
          to="/entregas/nueva"
          class="primary"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>

          Nueva entrega
        </RouterLink>
      </section>

      <!-- RESUMEN -->
      <section class="summary-grid">
        <article class="summary-card">
          <div class="summary-icon total">
            <svg viewBox="0 0 24 24">
              <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
              <path d="M4 12l8 4.5 8-4.5" />
              <path d="M4 16.5 12 21l8-4.5" />
            </svg>
          </div>

          <div>
            <span>Total</span>
            <strong>{{ deliveries.length }}</strong>
            <small>Operaciones registradas</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon pending">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v5" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <div>
            <span>Pendientes</span>
            <strong>{{ countStatus('Pendiente') }}</strong>
            <small>Esperando gestión</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon preparing">
            <svg viewBox="0 0 24 24">
              <path d="M5 7h14v10H5z" />
              <path d="M8 4v3" />
              <path d="M16 4v3" />
              <path d="M8 12h8" />
            </svg>
          </div>

          <div>
            <span>En preparación</span>
            <strong>{{ countStatus('Preparando') }}</strong>
            <small>Alistamiento activo</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon transit">
            <svg viewBox="0 0 24 24">
              <path d="M3 7h11v9H3z" />
              <path d="M14 10h3l3 3v3h-6z" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
          </div>

          <div>
            <span>En tránsito</span>
            <strong>{{ countStatus('En tránsito') }}</strong>
            <small>Ayudas en movimiento</small>
          </div>
        </article>
      </section>

      <!-- FILTROS -->
      <section class="panel filters-panel">
        <header class="panel-header">
          <div>
            <span class="panel-kicker">BÚSQUEDA</span>
            <h2>Buscar entregas</h2>
            <p>
              Filtra la información por texto, estado o destino.
            </p>
          </div>

          <div class="filter-icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 6h16" />
              <path d="M7 12h10" />
              <path d="M10 18h4" />
            </svg>
          </div>
        </header>

        <form
          class="filters"
          @submit.prevent="loadDeliveries"
        >
          <label>
            <span>Buscar</span>

            <div class="input-wrap">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                v-model.trim="filters.search"
                type="search"
                placeholder="Tipo de ayuda, origen..."
              />
            </div>
          </label>

          <label>
            <span>Estado</span>

            <select v-model="filters.status">
              <option value="">
                Todos los estados
              </option>

              <option value="Pendiente">
                Pendiente
              </option>

              <option value="Preparando">
                Preparando
              </option>

              <option value="En tránsito">
                En tránsito
              </option>

              <option value="Entregada">
                Entregada
              </option>
            </select>
          </label>

          <label>
            <span>Destino</span>

            <div class="input-wrap">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                <circle cx="12" cy="10" r="2" />
              </svg>

              <input
                v-model.trim="filters.destination"
                placeholder="Ej. Istmina"
              />
            </div>
          </label>

          <div class="filter-actions">
            <button
              type="submit"
              class="primary button"
              :disabled="loading"
            >
              {{
                loading
                  ? 'Consultando...'
                  : 'Aplicar'
              }}
            </button>

            <button
              type="button"
              class="secondary"
              @click="clearFilters"
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <!-- ERROR -->
      <div
        v-if="error"
        class="message error"
      >
        <div>!</div>

        <span>
          {{ error }}
        </span>
      </div>

      <!-- LISTADO -->
      <section class="panel">
        <header class="panel-header list-header">
          <div>
            <span class="panel-kicker">
              OPERACIONES
            </span>

            <h2>Entregas registradas</h2>

            <p>
              {{ deliveries.length }}
              resultado{{ deliveries.length === 1 ? '' : 's' }}
              encontrado{{ deliveries.length === 1 ? '' : 's' }}
            </p>
          </div>

          <div class="result-count">
            {{ deliveries.length }}
          </div>
        </header>

        <div
          v-if="loading"
          class="empty-state"
        >
          <div class="loader"></div>

          <strong>Cargando entregas</strong>

          <span>
            Estamos consultando la información.
          </span>
        </div>

        <div
          v-else-if="!deliveries.length"
          class="empty-state"
        >
          <div class="empty-icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
              <path d="M4 12l8 4.5 8-4.5" />
            </svg>
          </div>

          <strong>
            No hay entregas para mostrar
          </strong>

          <span>
            Prueba cambiando los filtros de búsqueda.
          </span>
        </div>

        <div
          v-else
          class="delivery-list"
        >
          <article
            v-for="delivery in deliveries"
            :key="delivery.id"
            class="delivery-card"
          >
            <div
              class="delivery-icon"
              :class="statusClass(delivery.estado)"
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14" />
                <path d="m15 8 4 4-4 4" />
              </svg>
            </div>

            <div class="delivery-content">
              <div class="delivery-title">
                <div>
                  <span class="delivery-id">
                    Entrega #{{ delivery.id }}
                  </span>

                  <h3>
                    {{
                      delivery.tipo ||
                      'Ayuda humanitaria'
                    }}
                  </h3>
                </div>

                <span
                  class="status"
                  :class="statusClass(delivery.estado)"
                >
                  <i></i>
                  {{ delivery.estado }}
                </span>
              </div>

              <div class="delivery-route">
                <div>
                  <span>Origen</span>
                  <strong>
                    {{ delivery.origen || '—' }}
                  </strong>
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
                  <strong>
                    {{ delivery.destino || '—' }}
                  </strong>
                </div>
              </div>

              <div class="delivery-info">
                <span>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 7h14v12H5z" />
                    <path d="M8 7V5h8v2" />
                  </svg>

                  {{ delivery.cantidad ?? '—' }}
                  unidades
                </span>

                <span>
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3" />
                    <path d="M6 19c.5-3.4 2.5-5 6-5s5.5 1.6 6 5" />
                  </svg>

                  {{
                    delivery.responsable ||
                    'Sin asignar'
                  }}
                </span>
              </div>
            </div>

            <RouterLink
              :to="`/entregas/${delivery.id}`"
              class="detail-link"
            >
              <span>Ver detalle</span>

              <svg viewBox="0 0 24 24">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </RouterLink>
          </article>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import AppLayout from '../components/AppLayout.vue'

import {
  getCurrentUser
} from '../services/auth'

import {
  listDeliveries
} from '../services/deliveries'

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
  [
    'Coordinador logístico',
    'Administrador'
  ].includes(user?.role)
)

function countStatus(status) {
  return deliveries.value.filter(
    item => item.estado === status
  ).length
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
    deliveries.value =
      await listDeliveries(filters)
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
* {
  box-sizing: border-box;
}

.deliveries-page {
  width: 100%;
}

/* ENCABEZADO */

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
  max-width: 680px;

  margin: 9px 0 0;

  color:
    var(--text-muted);

  font-size: 14px;
  line-height: 1.6;
}

.primary {
  min-height: 48px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 0 18px;

  border: 0;
  border-radius: 12px;

  background:
    var(--color-primary);

  color: #ffffff;

  text-decoration: none;

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.primary:hover {
  background:
    var(--color-primary-hover);

  transform:
    translateY(-1px);

  box-shadow:
    var(--shadow-sm);
}

.primary svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
}

/* RESUMEN */

.summary-grid {
  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: 16px;

  margin-bottom: 20px;
}

.summary-card {
  min-width: 0;
  min-height: 128px;

  display: flex;
  align-items: center;

  gap: 15px;

  padding: 19px;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-lg);

  background:
    var(--bg-surface);

  box-shadow:
    var(--shadow-sm);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.2s ease;
}

.summary-card:hover {
  transform:
    translateY(-2px);

  box-shadow:
    var(--shadow-md);
}

.summary-icon {
  width: 48px;
  height: 48px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 14px;
}

.summary-icon svg {
  width: 22px;
  height: 22px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.summary-icon.total {
  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.summary-icon.pending {
  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);
}

.summary-icon.preparing {
  background:
    var(--color-accent-soft);

  color:
    var(--color-warning);
}

.summary-icon.transit {
  background:
    var(--color-info-soft);

  color:
    var(--color-info);
}

.summary-card span,
.summary-card strong,
.summary-card small {
  display: block;
}

.summary-card span {
  color:
    var(--text-secondary);

  font-size: 13px;
  font-weight: 750;
}

.summary-card strong {
  margin-top: 3px;

  color:
    var(--text-primary);

  font-size: 29px;
  line-height: 1.1;
}

.summary-card small {
  margin-top: 4px;

  color:
    var(--text-muted);

  font-size: 11px;
}

/* PANEL */

.panel {
  overflow: hidden;

  margin-bottom: 20px;

  border:
    1px solid
    var(--border-color);

  border-radius:
    var(--radius-lg);

  background:
    var(--bg-surface);

  box-shadow:
    var(--shadow-sm);

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.panel-header {
  min-height: 92px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 14px;

  padding: 19px 22px;

  border-bottom:
    1px solid
    var(--border-soft);
}

.panel-kicker {
  display: block;

  margin-bottom: 4px;

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

.filter-icon {
  width: 42px;
  height: 42px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 12px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.filter-icon svg {
  width: 19px;
  height: 19px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.9;
  stroke-linecap: round;
}

/* FILTROS */

.filters {
  display: grid;

  grid-template-columns:
    1.3fr
    0.8fr
    1fr
    auto;

  gap: 14px;

  padding: 20px 22px;

  align-items: end;
}

label > span {
  display: block;

  margin-bottom: 7px;

  color:
    var(--text-secondary);

  font-size: 13px;
  font-weight: 750;
}

.input-wrap {
  position: relative;
}

.input-wrap svg {
  width: 17px;
  height: 17px;

  position: absolute;

  left: 13px;
  top: 50%;

  transform:
    translateY(-50%);

  fill: none;
  stroke:
    var(--text-muted);

  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;

  pointer-events: none;
}

input,
select {
  width: 100%;
  min-height: 48px;

  padding: 0 13px;

  border:
    1px solid
    var(--border-color);

  border-radius: 11px;

  background:
    var(--bg-surface-secondary);

  color:
    var(--text-primary);

  font-size: 14px;

  outline: none;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.2s ease;
}

.input-wrap input {
  padding-left: 40px;
}

input::placeholder {
  color:
    var(--text-faint);
}

select option {
  background:
    var(--bg-surface);

  color:
    var(--text-primary);
}

input:focus,
select:focus {
  border-color:
    var(--color-primary);

  box-shadow:
    0 0 0 3px
    rgba(39, 116, 90, 0.12);
}

.filter-actions {
  display: flex;
  gap: 9px;
}

.button {
  min-width: 95px;
}

.secondary {
  min-height: 48px;

  padding: 0 16px;

  border:
    1px solid
    var(--border-color);

  border-radius: 11px;

  background:
    var(--bg-surface-secondary);

  color:
    var(--text-secondary);

  font-size: 14px;
  font-weight: 750;

  cursor: pointer;

  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.secondary:hover {
  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

/* RESULTADO */

.result-count {
  min-width: 45px;
  height: 45px;

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

/* LISTADO */

.delivery-list {
  padding: 10px;
}

.delivery-card {
  display: flex;
  align-items: center;

  gap: 16px;

  padding: 18px 16px;

  border:
    1px solid transparent;

  border-radius: 14px;

  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.delivery-card:hover {
  border-color:
    var(--border-color);

  background:
    var(--bg-surface-secondary);

  transform:
    translateX(2px);
}

.delivery-icon {
  width: 48px;
  height: 48px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 14px;
}

.delivery-icon svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.delivery-content {
  min-width: 0;
  flex: 1;
}

.delivery-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 14px;
}

.delivery-id {
  color:
    var(--text-muted);

  font-size: 11px;
  font-weight: 750;
}

.delivery-title h3 {
  margin: 3px 0 0;

  color:
    var(--text-primary);

  font-size: 17px;
}

.status {
  min-height: 29px;

  display: inline-flex;
  align-items: center;

  gap: 6px;

  padding: 0 10px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 850;

  white-space: nowrap;
}

.status i {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    currentColor;
}

.delivery-route {
  display: flex;
  align-items: center;

  gap: 11px;

  margin-top: 11px;
}

.delivery-route > div:not(.route-line) {
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
  margin-top: 2px;

  color:
    var(--text-secondary);

  font-size: 13px;
}

.route-line {
  min-width: 48px;

  display: flex;
  align-items: center;

  color:
    var(--text-muted);
}

.route-line > span {
  width: 33px;
  height: 1px;

  background:
    var(--border-color);
}

.route-line svg {
  width: 14px;
  height: 14px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.6;
}

.delivery-info {
  display: flex;
  flex-wrap: wrap;

  gap: 14px;

  margin-top: 11px;
}

.delivery-info > span {
  display: flex;
  align-items: center;

  gap: 5px;

  color:
    var(--text-muted);

  font-size: 12px;
}

.delivery-info svg {
  width: 14px;
  height: 14px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.7;
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

.detail-link {
  min-height: 40px;

  display: flex;
  align-items: center;

  gap: 5px;

  flex: 0 0 auto;

  padding: 0 10px;

  border-radius: 10px;

  color:
    var(--color-primary);

  text-decoration: none;

  font-size: 13px;
  font-weight: 850;
}

.detail-link:hover {
  background:
    var(--color-primary-soft);
}

.detail-link svg {
  width: 16px;
  height: 16px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* VACÍO Y CARGA */

.empty-state {
  min-height: 220px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 35px;

  color:
    var(--text-muted);

  text-align: center;
}

.empty-icon {
  width: 52px;
  height: 52px;

  display: grid;
  place-items: center;

  margin-bottom: 5px;

  border-radius: 14px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.empty-icon svg {
  width: 23px;
  height: 23px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
}

.empty-state strong {
  color:
    var(--text-primary);

  font-size: 15px;
}

.empty-state span {
  color:
    var(--text-muted);

  font-size: 13px;
}

.loader {
  width: 37px;
  height: 37px;

  margin-bottom: 7px;

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
    transform:
      rotate(360deg);
  }
}

/* ERROR */

.message {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-bottom: 18px;

  padding: 14px 16px;

  border-radius: 12px;

  font-size: 13px;
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

.message.error > div {
  width: 30px;
  height: 30px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 9px;

  background:
    rgba(201, 74, 67, 0.1);

  font-weight: 900;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .filters {
    grid-template-columns:
      1fr 1fr;
  }

  .filter-actions {
    grid-column:
      1 / -1;
  }
}

@media (max-width: 720px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .primary {
    align-self: flex-start;
  }

  .delivery-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .detail-link {
    margin-left: 64px;
  }
}

@media (max-width: 560px) {
  h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 13px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    grid-column: auto;
    flex-direction: column;
  }

  .filter-actions button {
    width: 100%;
  }

  .primary {
    width: 100%;
  }

  .delivery-icon {
    display: none;
  }

  .delivery-title {
    flex-direction: column;
  }

  .status {
    align-self: flex-start;
  }

  .delivery-route {
    flex-wrap: wrap;
  }

  .detail-link {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }
}
</style>