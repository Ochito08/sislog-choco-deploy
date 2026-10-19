<template>
  <AppLayout title="Editar entrega">
    <div class="edit-page">
      <section class="page-header">
        <div>
          <div class="eyebrow">
            <span></span>
            Gestión logística
          </div>

          <h1>Editar entrega</h1>

          <p class="subtitle">
            Modifica la información de una operación que todavía
            se encuentra en estado pendiente.
          </p>
        </div>

        <RouterLink
          :to="`/entregas/${route.params.id}`"
          class="back-link"
        >
          ← Volver al detalle
        </RouterLink>
      </section>

      <div
        v-if="error"
        class="message error"
      >
        <strong>Error</strong>
        <span>{{ error }}</span>
      </div>

      <div
        v-if="loading"
        class="loading-card"
      >
        <div class="loader"></div>

        <div>
          <strong>Cargando entrega</strong>
          <span>Consultando información...</span>
        </div>
      </div>

      <template v-else-if="delivery">
        <div
          v-if="delivery.estado !== 'Pendiente'"
          class="blocked-card"
        >
          <div class="blocked-icon">
            !
          </div>

          <div>
            <strong>
              Esta entrega ya no puede editarse
            </strong>

            <p>
              Solo las entregas en estado
              <b>Pendiente</b> pueden modificarse.
            </p>

            <RouterLink
              :to="`/entregas/${delivery.id}`"
            >
              Volver al detalle
            </RouterLink>
          </div>
        </div>

        <form
          v-else
          class="form-card"
          @submit.prevent="submitForm"
          novalidate
        >
          <header class="form-header">
            <div>
              <span>EDITANDO</span>

              <h2>
                Entrega #{{ delivery.id }}
              </h2>

              <p>
                Actualiza únicamente la información necesaria.
              </p>
            </div>

            <div class="status">
              <i></i>
              Pendiente
            </div>
          </header>

          <div class="form-grid">
            <label>
              <span>Origen *</span>

              <input
                v-model.trim="form.origen"
                type="text"
                maxlength="80"
                placeholder="Ej. Quibdó"
                :class="{ invalid: fieldErrors.origen }"
              />

              <small v-if="fieldErrors.origen">
                {{ fieldErrors.origen }}
              </small>
            </label>

            <label>
              <span>Destino *</span>

              <input
                v-model.trim="form.destino"
                type="text"
                maxlength="80"
                placeholder="Ej. Istmina"
                :class="{ invalid: fieldErrors.destino }"
              />

              <small v-if="fieldErrors.destino">
                {{ fieldErrors.destino }}
              </small>
            </label>

            <label>
              <span>Tipo de ayuda *</span>

              <input
                v-model.trim="form.tipo"
                type="text"
                maxlength="80"
                placeholder="Ej. Kits alimentarios"
                :class="{ invalid: fieldErrors.tipo }"
              />

              <small v-if="fieldErrors.tipo">
                {{ fieldErrors.tipo }}
              </small>
            </label>

            <label>
              <span>Cantidad *</span>

              <input
                v-model.number="form.cantidad"
                type="number"
                min="1"
                max="1000000"
                step="1"
                :class="{ invalid: fieldErrors.cantidad }"
              />

              <small v-if="fieldErrors.cantidad">
                {{ fieldErrors.cantidad }}
              </small>
            </label>

            <label>
              <span>
                Responsable de transporte *
              </span>

              <select
                v-model="form.responsableId"
                :class="{ invalid: fieldErrors.responsableId }"
              >
                <option value="">
                  Selecciona un responsable
                </option>

                <option
                  v-for="person in responsibles"
                  :key="person.id"
                  :value="String(person.id)"
                >
                  {{ person.name }}
                </option>
              </select>

              <small v-if="fieldErrors.responsableId">
                {{ fieldErrors.responsableId }}
              </small>
            </label>

            <label>
              <span>Transporte *</span>

              <input
                v-model.trim="form.transporte"
                type="text"
                maxlength="100"
                placeholder="Ej. Lancha L-12"
                :class="{ invalid: fieldErrors.transporte }"
              />

              <small v-if="fieldErrors.transporte">
                {{ fieldErrors.transporte }}
              </small>
            </label>
          </div>

          <div class="info-box">
            Los cambios quedarán registrados en la trazabilidad
            de la entrega.
          </div>

          <div class="actions">
            <RouterLink
              :to="`/entregas/${delivery.id}`"
              class="secondary"
            >
              Cancelar
            </RouterLink>

            <button
              type="submit"
              class="primary"
              :disabled="saving"
            >
              {{
                saving
                  ? 'Guardando...'
                  : 'Guardar cambios'
              }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import AppLayout from '../components/AppLayout.vue'

import {
  getDelivery,
  updateDelivery
} from '../services/deliveries'

import {
  listResponsibles
} from '../services/users'

const route = useRoute()
const router = useRouter()

const delivery = ref(null)
const responsibles = ref([])

const loading = ref(true)
const saving = ref(false)

const error = ref('')
const fieldErrors = ref({})

const form = reactive({
  origen: '',
  destino: '',
  tipo: '',
  cantidad: '',
  responsableId: '',
  transporte: ''
})

function fillForm(item) {
  form.origen =
    item.origen || ''

  form.destino =
    item.destino || ''

  form.tipo =
    item.tipo || ''

  form.cantidad =
    item.cantidad ?? ''

  form.responsableId =
    item.responsableId
      ? String(item.responsableId)
      : ''

  form.transporte =
    item.transporte || ''
}

function validateForm() {
  const errors = {}

  if (!form.origen) {
    errors.origen =
      'El origen es obligatorio.'
  } else if (
    form.origen.length < 2
  ) {
    errors.origen =
      'El origen debe tener al menos 2 caracteres.'
  }

  if (!form.destino) {
    errors.destino =
      'El destino es obligatorio.'
  } else if (
    form.destino.length < 2
  ) {
    errors.destino =
      'El destino debe tener al menos 2 caracteres.'
  } else if (
    form.origen &&
    form.destino.toLowerCase() ===
      form.origen.toLowerCase()
  ) {
    errors.destino =
      'El destino debe ser diferente al origen.'
  }

  if (!form.tipo) {
    errors.tipo =
      'El tipo de ayuda es obligatorio.'
  }

  if (
    !Number.isInteger(
      Number(form.cantidad)
    ) ||
    Number(form.cantidad) < 1
  ) {
    errors.cantidad =
      'La cantidad debe ser un número entero mayor que cero.'
  }

  if (!form.responsableId) {
    errors.responsableId =
      'Debes seleccionar un responsable.'
  }

  if (!form.transporte) {
    errors.transporte =
      'El transporte es obligatorio.'
  } else if (
    form.transporte.length < 3
  ) {
    errors.transporte =
      'El transporte debe tener al menos 3 caracteres.'
  }

  fieldErrors.value =
    errors

  return (
    Object.keys(errors).length === 0
  )
}

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [
      deliveryResult,
      responsiblesResult
    ] = await Promise.all([
      getDelivery(
        route.params.id
      ),
      listResponsibles()
    ])

    delivery.value =
      deliveryResult

    responsibles.value =
      responsiblesResult

    fillForm(
      deliveryResult
    )
  } catch (err) {
    error.value =
      err.message
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  error.value = ''

  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    const updated =
      await updateDelivery(
        route.params.id,
        {
          origen:
            form.origen,

          destino:
            form.destino,

          tipo:
            form.tipo,

          cantidad:
            Number(form.cantidad),

          responsableId:
            Number(form.responsableId),

          transporte:
            form.transporte
        }
      )

    await router.push(
      `/entregas/${updated.id}`
    )
  } catch (err) {
    error.value =
      err.message

    fieldErrors.value =
      err.fieldErrors || {}
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.edit-page {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 20px;

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

  letter-spacing: 1.1px;
  text-transform: uppercase;
}

.eyebrow > span {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background:
    var(--color-accent);
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
}

.subtitle {
  max-width: 700px;

  margin: 8px 0 0;

  color:
    var(--text-muted);

  font-size: 14px;
  line-height: 1.6;
}

.back-link {
  min-height: 44px;

  display: inline-flex;
  align-items: center;

  padding: 0 14px;

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
}

.form-card,
.loading-card,
.blocked-card {
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

.form-card {
  overflow: hidden;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 18px;

  padding: 22px 24px;

  border-bottom:
    1px solid
    var(--border-soft);
}

.form-header > div > span {
  color:
    var(--color-primary);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.1px;
}

.form-header h2 {
  margin: 4px 0 0;

  color:
    var(--text-primary);

  font-size: 21px;
}

.form-header p {
  margin: 5px 0 0;

  color:
    var(--text-muted);

  font-size: 13px;
}

.status {
  display: flex;
  align-items: center;

  gap: 7px;

  min-height: 32px;

  padding: 0 11px;

  border-radius: 999px;

  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);

  font-size: 12px;
  font-weight: 850;
}

.status i {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    currentColor;
}

.form-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 20px;

  padding: 24px;
}

label > span {
  display: block;

  margin-bottom: 8px;

  color:
    var(--text-secondary);

  font-size: 13px;
  font-weight: 800;
}

input,
select {
  width: 100%;
  min-height: 50px;

  padding: 0 14px;

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
}

input:focus,
select:focus {
  border-color:
    var(--color-primary);

  box-shadow:
    0 0 0 3px
    rgba(39, 116, 90, 0.12);
}

input.invalid,
select.invalid {
  border-color:
    var(--color-danger);
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

small {
  display: block;

  margin-top: 6px;

  color:
    var(--color-danger);

  font-size: 11px;
}

.info-box {
  margin:
    0 24px 22px;

  padding: 14px 16px;

  border:
    1px solid
    var(--border-color);

  border-radius: 12px;

  background:
    var(--color-primary-soft);

  color:
    var(--text-secondary);

  font-size: 13px;
}

.actions {
  display: flex;
  justify-content: flex-end;

  gap: 10px;

  padding: 18px 24px;

  border-top:
    1px solid
    var(--border-soft);

  background:
    var(--bg-surface-secondary);
}

.primary,
.secondary {
  min-height: 48px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0 18px;

  border-radius: 11px;

  font-size: 14px;
  font-weight: 800;

  text-decoration: none;
}

.primary {
  border: 0;

  background:
    var(--color-primary);

  color: #fff;

  cursor: pointer;
}

.primary:hover {
  background:
    var(--color-primary-hover);
}

.primary:disabled {
  opacity: 0.65;
  cursor: wait;
}

.secondary {
  border:
    1px solid
    var(--border-color);

  background:
    var(--bg-surface);

  color:
    var(--text-secondary);
}

.loading-card {
  min-height: 180px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  padding: 30px;
}

.loader {
  width: 38px;
  height: 38px;

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

.loading-card strong,
.loading-card span {
  display: block;
}

.loading-card strong {
  color:
    var(--text-primary);
}

.loading-card span {
  margin-top: 3px;

  color:
    var(--text-muted);

  font-size: 12px;
}

.blocked-card {
  display: flex;
  align-items: flex-start;

  gap: 15px;

  padding: 24px;
}

.blocked-icon {
  width: 42px;
  height: 42px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 12px;

  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);

  font-weight: 900;
}

.blocked-card strong {
  color:
    var(--text-primary);

  font-size: 16px;
}

.blocked-card p {
  margin:
    7px 0 12px;

  color:
    var(--text-secondary);

  font-size: 13px;
}

.blocked-card a {
  color:
    var(--color-primary);

  font-size: 13px;
  font-weight: 800;
}

.message {
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

.message strong,
.message span {
  display: block;
}

.message span {
  margin-top: 3px;

  font-size: 12px;
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

  .form-grid {
    grid-template-columns:
      1fr;
  }

  .form-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .form-grid {
    padding:
      20px 16px;
  }

  .info-box {
    margin:
      0 16px 18px;
  }

  .actions {
    flex-direction: column-reverse;

    padding: 16px;
  }

  .primary,
  .secondary {
    width: 100%;
  }
}
</style>