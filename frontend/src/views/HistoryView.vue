<template>
  <AppLayout title="Historial">
    <div class="page-header">
      <div>
        <p class="eyebrow">TRAZABILIDAD</p>

        <h1>Historial de entregas</h1>

        <p class="subtitle">
          Consulta las ayudas que completaron su recorrido logístico
          y cuya recepción ya fue confirmada.
        </p>
      </div>
    </div>

    <section class="summary-grid">
      <article>
        <span>Entregas completadas</span>
        <strong>{{ history.length }}</strong>
      </article>

      <article>
        <span>Con destino visible</span>
        <strong>{{ withDestination }}</strong>
      </article>

      <article>
        <span>Con responsable</span>
        <strong>{{ withResponsible }}</strong>
      </article>
    </section>

    <section class="panel filters-panel">
      <div class="panel-header">
        <div>
          <h2>Buscar en el historial</h2>

          <p>
            Filtra las entregas completadas por texto,
            destino o responsable.
          </p>
        </div>
      </div>

      <form
        class="filters"
        @submit.prevent="loadHistory"
      >
        <label>
          <span>Buscar</span>

          <input
            v-model.trim="filters.search"
            type="search"
            placeholder="Tipo de ayuda, origen..."
          />
        </label>

        <label>
          <span>Destino</span>

          <input
            v-model.trim="filters.destination"
            type="text"
            placeholder="Ej. Istmina"
          />
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
            {{ loading ? 'Consultando...' : 'Aplicar' }}
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

    <p
      v-if="error"
      class="message error"
    >
      {{ error }}
    </p>

    <section class="panel history-panel">
      <div class="panel-header">
        <div>
          <h2>Entregas completadas</h2>

          <p>
            {{ history.length }}
            registro{{ history.length === 1 ? '' : 's' }}
          </p>
        </div>

        <span class="history-badge">
          Entregadas
        </span>
      </div>

      <div
        v-if="loading"
        class="empty-state"
      >
        Cargando historial...
      </div>

      <div
        v-else-if="!history.length"
        class="empty-state"
      >
        <div class="empty-icon">✓</div>

        <strong>
          No hay entregas completadas
        </strong>

        <span>
          Prueba cambiando los filtros de búsqueda.
        </span>
      </div>

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
            ✓
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
                Entregada
              </span>
            </div>

            <div class="route">
              <span>
                {{ item.origen || '—' }}
              </span>

              <span class="arrow">
                →
              </span>

              <span>
                {{ item.destino || '—' }}
              </span>
            </div>

            <div class="meta">
              <span>
                <strong>Cantidad:</strong>
                {{ item.cantidad ?? '—' }}
              </span>

              <span>
                <strong>Responsable:</strong>
                {{ item.responsable || 'Sin asignar' }}
              </span>

              <span>
                <strong>Transporte:</strong>
                {{ item.transporte || '—' }}
              </span>

              <span>
                <strong>Recepción:</strong>
                {{ formatDateTime(item.receivedAt || item.updatedAt) }}
              </span>
            </div>
          </div>

          <RouterLink
            :to="`/entregas/${item.id}`"
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
  history.value.filter(item => item.destino).length
)

const withResponsible = computed(() =>
  history.value.filter(item => item.responsableId).length
)

async function loadHistory() {
  loading.value = true
  error.value = ''

  try {
    history.value = await listHistory(filters)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function loadResponsibles() {
  try {
    responsibles.value = await listResponsibles()
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

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

onMounted(async () => {
  await Promise.all([
    loadHistory(),
    loadResponsibles()
  ])
})
</script>

<style scoped>
.page-header {
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
  max-width: 650px;
  margin: 7px 0 0;
  color: #98a2b3;
  font-size: 11px;
  line-height: 1.5;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.summary-grid article {
  padding: 17px 18px;
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

.filters {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr auto;
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

.primary,
.secondary {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.primary {
  border: 0;
  background: #164a3a;
  color: #fff;
}

.primary:hover {
  background: #28745a;
}

.primary:disabled {
  opacity: .65;
  cursor: wait;
}

.secondary {
  border: 1px solid #dfe7e3;
  background: #fff;
  color: #475467;
}

.secondary:hover {
  background: #f6f8f7;
}

.history-badge {
  padding: 7px 10px;
  border-radius: 999px;
  background: #e8f3ee;
  color: #28745a;
  font-size: 9px;
  font-weight: 800;
}

.history-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-bottom: 1px solid #eef2f0;
}

.history-card:last-child {
  border-bottom: 0;
}

.history-card:hover {
  background: #fbfcfb;
}

.delivery-icon {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #e8f3ee;
  color: #28745a;
  font-size: 16px;
  font-weight: 900;
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
  color: #98a2b3;
  font-size: 9px;
  font-weight: 700;
}

.history-heading h3 {
  margin: 4px 0 0;
  color: #263238;
  font-size: 13px;
}

.status {
  padding: 6px 9px;
  border-radius: 999px;
  background: #e8f3ee;
  color: #28745a;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.route {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #475467;
  font-size: 10px;
  font-weight: 700;
}

.arrow {
  color: #98a2b3;
}

.meta {
  margin-top: 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: #667085;
  font-size: 10px;
}

.meta strong {
  color: #475467;
}

.detail-link {
  flex: 0 0 auto;
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
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 30px;
  color: #98a2b3;
  text-align: center;
  font-size: 11px;
}

.empty-state strong {
  color: #475467;
  font-size: 13px;
}

.empty-icon {
  width: 42px;
  height: 42px;
  margin-bottom: 4px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8f3ee;
  color: #28745a;
  font-size: 17px;
  font-weight: 900;
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
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .history-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .history-heading {
    flex-direction: column;
  }

  .detail-link {
    margin-left: 54px;
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
    flex-direction: column;
  }

  .primary,
  .secondary {
    width: 100%;
  }
}
</style>
