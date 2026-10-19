<template>
  <AppLayout title="Historial">
    <div class="history-page">
      <!-- ENCABEZADO -->
      <section class="page-header">
        <div>
          <div class="eyebrow">
            <span></span>
            Trazabilidad
          </div>

          <h1>Historial de entregas</h1>

          <p class="subtitle">
            Consulta las ayudas humanitarias que completaron su recorrido
            logístico y cuya recepción ya fue confirmada.
          </p>
        </div>
      </section>

      <!-- RESUMEN -->
      <section class="summary-grid">
        <article class="summary-card">
          <div class="summary-icon delivered">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="m7 12 3 3 7-7" />
            </svg>
          </div>

          <div>
            <span>Entregas completadas</span>
            <strong>{{ history.length }}</strong>
            <small>Recepciones confirmadas</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon destination">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
          </div>

          <div>
            <span>Con destino visible</span>
            <strong>{{ withDestination }}</strong>
            <small>Operaciones ubicadas</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon responsible">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3" />
              <path d="M6 19c.5-3.4 2.5-5 6-5s5.5 1.6 6 5" />
            </svg>
          </div>

          <div>
            <span>Con responsable</span>
            <strong>{{ withResponsible }}</strong>
            <small>Responsables asignados</small>
          </div>
        </article>
      </section>

      <!-- FILTROS -->
      <section class="panel filters-panel">
        <header class="panel-header">
          <div>
            <span class="panel-kicker">
              BÚSQUEDA
            </span>

            <h2>Buscar en el historial</h2>

            <p>
              Filtra las entregas completadas por texto, destino o responsable.
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
          @submit.prevent="loadHistory"
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
            <span>Destino</span>

            <div class="input-wrap">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                <circle cx="12" cy="10" r="2" />
              </svg>

              <input
                v-model.trim="filters.destination"
                type="text"
                placeholder="Ej. Istmina"
              />
            </div>
          </label>

          <label>
            <span>Responsable</span>

            <select v-model="filters.responsibleId">
              <option value="">
                Todos los responsables
              </option>

              <option
                v-for="person in responsibles"
                :key="person.id"
                :value="String(person.id)"
              >
                {{ person.name }}
              </option>
            </select>
          </label>

          <div class="filter-actions">
            <button
              type="submit"
              class="primary"
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
        <div class="message-icon">
          !
        </div>

        <div>
          <strong>
            No fue posible cargar el historial
          </strong>

          <span>
            {{ error }}
          </span>
        </div>
      </div>

      <!-- LISTADO -->
      <section class="panel history-panel">
        <header class="panel-header list-header">
          <div>
            <span class="panel-kicker">
              OPERACIONES FINALIZADAS
            </span>

            <h2>Entregas completadas</h2>

            <p>
              {{ history.length }}
              registro{{ history.length === 1 ? '' : 's' }}
              encontrado{{ history.length === 1 ? '' : 's' }}
            </p>
          </div>

          <span class="history-badge">
            <i></i>
            Entregadas
          </span>
        </header>

        <!-- CARGANDO -->
        <div
          v-if="loading"
          class="empty-state"
        >
          <div class="loader"></div>

          <strong>
            Cargando historial
          </strong>

          <span>
            Estamos consultando las operaciones completadas.
          </span>
        </div>

        <!-- VACÍO -->
        <div
          v-else-if="!history.length"
          class="empty-state"
        >
          <div class="empty-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="m7 12 3 3 7-7" />
            </svg>
          </div>

          <strong>
            No hay entregas completadas
          </strong>

          <span>
            Prueba cambiando los filtros de búsqueda.
          </span>
        </div>

        <!-- HISTORIAL -->
        <div
          v-else
          class="history-list"
        >
          <article
            v-for="item in history"
            :key="item.id"
            class="history-card"
          >
            <div class="delivery-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="m7 12 3 3 7-7" />
              </svg>
            </div>

            <div class="history-content">
              <div class="history-heading">
                <div>
                  <span class="delivery-id">
                    Entrega #{{ item.id }}
                  </span>

                  <h3>
                    {{ item.tipo || 'Ayuda humanitaria' }}
                  </h3>
                </div>

                <span class="status">
                  <i></i>
                  Entregada
                </span>
              </div>

              <div class="route">
                <div>
                  <span>Origen</span>
                  <strong>
                    {{ item.origen || '—' }}
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
                    {{ item.destino || '—' }}
                  </strong>
                </div>
              </div>

              <div class="meta">
                <span>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 7h14v12H5z" />
                    <path d="M8 7V5h8v2" />
                  </svg>

                  <strong>Cantidad:</strong>
                  {{ item.cantidad ?? '—' }}
                </span>

                <span>
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3" />
                    <path d="M6 19c.5-3.4 2.5-5 6-5s5.5 1.6 6 5" />
                  </svg>

                  <strong>Responsable:</strong>
                  {{ item.responsable || 'Sin asignar' }}
                </span>

                <span>
                  <svg viewBox="0 0 24 24">
                    <path d="M3 7h11v9H3z" />
                    <path d="M14 10h3l3 3v3h-6z" />
                  </svg>

                  <strong>Transporte:</strong>
                  {{ item.transporte || '—' }}
                </span>

                <span>
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v4l3 2" />
                  </svg>

                  <strong>Recepción:</strong>
                  {{ formatDateTime(item.receivedAt || item.updatedAt) }}
                </span>
              </div>
            </div>

            <RouterLink
              :to="`/entregas/${item.id}`"
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
  listHistory
} from '../services/deliveries'

import {
  listResponsibles
} from '../services/users'

const history = ref([])
const responsibles = ref([])
const loading = ref(false)
const error = ref('')

const filters = reactive({
  search: '',
  destination: '',
  responsibleId: ''
})

const withDestination = computed(() =>
  history.value.filter(
    item => item.destino
  ).length
)

const withResponsible = computed(() =>
  history.value.filter(
    item => item.responsableId
  ).length
)

async function loadHistory() {
  loading.value = true
  error.value = ''

  try {
    history.value =
      await listHistory(filters)
  } catch (err) {
    error.value =
      err.message
  } finally {
    loading.value = false
  }
}

async function loadResponsibles() {
  try {
    responsibles.value =
      await listResponsibles()
  } catch {
    responsibles.value = []
  }
}

async function clearFilters() {
  filters.search = ''
  filters.destination = ''
  filters.responsibleId = ''

  await loadHistory()
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

onMounted(async () => {
  await Promise.all([
    loadHistory(),
    loadResponsibles()
  ])
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.history-page {
  width: 100%;
}

/* HEADER */

.page-header {
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
  max-width: 720px;

  margin: 9px 0 0;

  color:
    var(--text-muted);

  font-size: 14px;
  line-height: 1.6;
}

/* RESUMEN */

.summary-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 16px;

  margin-bottom: 20px;
}

.summary-card {
  min-height: 125px;

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
    box-shadow 0.18s ease;
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

.summary-icon.delivered {
  background:
    var(--color-success-soft);

  color:
    var(--color-success);
}

.summary-icon.destination {
  background:
    var(--color-info-soft);

  color:
    var(--color-info);
}

.summary-icon.responsible {
  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
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
}

.panel-header {
  min-height: 94px;

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
    1.2fr
    1fr
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
    background 0.18s ease;
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

.primary,
.secondary {
  min-height: 48px;

  padding: 0 16px;

  border-radius: 11px;

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;
}

.primary {
  border: 0;

  background:
    var(--color-primary);

  color: #ffffff;

  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.primary:hover {
  background:
    var(--color-primary-hover);

  transform:
    translateY(-1px);
}

.primary:disabled {
  opacity: 0.65;

  cursor: wait;
  transform: none;
}

.secondary {
  border:
    1px solid
    var(--border-color);

  background:
    var(--bg-surface-secondary);

  color:
    var(--text-secondary);
}

.secondary:hover {
  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

/* BADGE */

.history-badge {
  min-height: 34px;

  display: inline-flex;
  align-items: center;

  gap: 7px;

  padding: 0 11px;

  border-radius: 999px;

  background:
    var(--color-success-soft);

  color:
    var(--color-success);

  font-size: 12px;
  font-weight: 850;
}

.history-badge i {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    currentColor;
}

/* LISTA */

.history-list {
  padding: 10px;
}

.history-card {
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

.history-card:hover {
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

  background:
    var(--color-success-soft);

  color:
    var(--color-success);
}

.delivery-icon svg {
  width: 22px;
  height: 22px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.history-content {
  min-width: 0;
  flex: 1;
}

.history-heading {
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

.history-heading h3 {
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

  flex: 0 0 auto;

  padding: 0 10px;

  border-radius: 999px;

  background:
    var(--color-success-soft);

  color:
    var(--color-success);

  font-size: 11px;
  font-weight: 850;
}

.status i {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    currentColor;
}

/* RUTA */

.route {
  display: flex;
  align-items: center;

  gap: 11px;

  margin-top: 11px;
}

.route > div:not(.route-line) {
  min-width: 0;
}

.route span,
.route strong {
  display: block;
}

.route span {
  color:
    var(--text-muted);

  font-size: 10px;
  font-weight: 750;

  text-transform: uppercase;
}

.route strong {
  margin-top: 2px;

  color:
    var(--text-secondary);

  font-size: 13px;
}

.route-line {
  min-width: 50px;

  display: flex;
  align-items: center;

  color:
    var(--text-muted);
}

.route-line > span {
  width: 34px;
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

/* META */

.meta {
  display: flex;
  flex-wrap: wrap;

  gap: 9px 18px;

  margin-top: 12px;
}

.meta > span {
  display: flex;
  align-items: center;

  gap: 5px;

  color:
    var(--text-muted);

  font-size: 12px;
}

.meta strong {
  color:
    var(--text-secondary);
}

.meta svg {
  width: 14px;
  height: 14px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.7;
}

/* DETALLE */

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

/* VACÍO */

.empty-state {
  min-height: 220px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 35px;

  text-align: center;
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

.empty-icon {
  width: 54px;
  height: 54px;

  display: grid;
  place-items: center;

  margin-bottom: 6px;

  border-radius: 15px;

  background:
    var(--color-success-soft);

  color:
    var(--color-success);
}

.empty-icon svg {
  width: 24px;
  height: 24px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.loader {
  width: 38px;
  height: 38px;

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

@media (max-width: 1000px) {
  .filters {
    grid-template-columns:
      1fr 1fr;
  }

  .filter-actions {
    grid-column:
      1 / -1;
  }
}

@media (max-width: 760px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .history-card {
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

  .filters {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    grid-column: auto;
    flex-direction: column;
  }

  .primary,
  .secondary {
    width: 100%;
  }

  .history-heading {
    flex-direction: column;
  }

  .delivery-icon {
    display: none;
  }

  .route {
    flex-wrap: wrap;
  }

  .detail-link {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }

  .list-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>