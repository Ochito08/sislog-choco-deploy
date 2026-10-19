<template>
  <AppLayout title="Nueva entrega">
    <div class="new-delivery-page">
      <section class="page-header">
        <div>
          <div class="eyebrow">
            <span></span>
            Registro logístico
          </div>

          <h1>Nueva entrega</h1>

          <p class="subtitle">
            Registra la ayuda humanitaria, define su recorrido y asigna
            el responsable encargado del transporte.
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

      <div class="form-layout">
        <form
          class="form-card"
          @submit.prevent="submitForm"
          novalidate
        >
          <div class="form-header">
            <div>
              <span class="section-label">
                INFORMACIÓN PRINCIPAL
              </span>

              <h2>Datos de la entrega</h2>

              <p>
                Completa todos los campos requeridos para registrar
                correctamente la operación.
              </p>
            </div>

            <span class="initial-status">
              <i></i>
              Pendiente
            </span>
          </div>

          <div class="form-section">
            <div class="section-title">
              <div class="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m15 8 4 4-4 4" />
                </svg>
              </div>

              <div>
                <strong>Ruta de la entrega</strong>
                <span>
                  Define el punto de origen y el destino.
                </span>
              </div>
            </div>

            <div class="form-grid">
              <label>
                <span>Origen *</span>

                <div
                  class="input-wrap"
                  :class="{ invalid: fieldErrors.origen }"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>

                  <input
                    v-model.trim="form.origen"
                    type="text"
                    maxlength="80"
                    placeholder="Ej. Quibdó"
                  />
                </div>

                <small v-if="fieldErrors.origen">
                  {{ fieldErrors.origen }}
                </small>
              </label>

              <label>
                <span>Destino *</span>

                <div
                  class="input-wrap"
                  :class="{ invalid: fieldErrors.destino }"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>

                  <input
                    v-model.trim="form.destino"
                    type="text"
                    maxlength="80"
                    placeholder="Ej. Istmina"
                  />
                </div>

                <small v-if="fieldErrors.destino">
                  {{ fieldErrors.destino }}
                </small>
              </label>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">
              <div class="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
                  <path d="M4 12l8 4.5 8-4.5" />
                </svg>
              </div>

              <div>
                <strong>Información de la ayuda</strong>
                <span>
                  Especifica qué se transportará y en qué cantidad.
                </span>
              </div>
            </div>

            <div class="form-grid">
              <label>
                <span>Tipo de ayuda *</span>

                <div
                  class="input-wrap"
                  :class="{ invalid: fieldErrors.tipo }"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M5 7h14v12H5z" />
                    <path d="M8 7V5h8v2" />
                  </svg>

                  <input
                    v-model.trim="form.tipo"
                    type="text"
                    maxlength="80"
                    placeholder="Ej. Kits alimentarios"
                  />
                </div>

                <small v-if="fieldErrors.tipo">
                  {{ fieldErrors.tipo }}
                </small>
              </label>

              <label>
                <span>Cantidad *</span>

                <div
                  class="input-wrap"
                  :class="{ invalid: fieldErrors.cantidad }"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
                    <path d="M4 12l8 4.5 8-4.5" />
                  </svg>

                  <input
                    v-model.number="form.cantidad"
                    type="number"
                    min="1"
                    max="1000000"
                    step="1"
                    placeholder="Ej. 100"
                  />
                </div>

                <small v-if="fieldErrors.cantidad">
                  {{ fieldErrors.cantidad }}
                </small>
              </label>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">
              <div class="section-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M6 19c.5-3.4 2.5-5 6-5s5.5 1.6 6 5" />
                </svg>
              </div>

              <div>
                <strong>Asignación de transporte</strong>
                <span>
                  Selecciona quién será responsable y el medio utilizado.
                </span>
              </div>
            </div>

            <div class="form-grid">
              <label>
                <span>Responsable de transporte *</span>

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

                <div
                  class="input-wrap"
                  :class="{ invalid: fieldErrors.transporte }"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M3 7h11v9H3z" />
                    <path d="M14 10h3l3 3v3h-6z" />
                    <circle cx="7" cy="18" r="2" />
                    <circle cx="17" cy="18" r="2" />
                  </svg>

                  <input
                    v-model.trim="form.transporte"
                    type="text"
                    maxlength="100"
                    placeholder="Ej. Lancha L-12"
                  />
                </div>

                <small v-if="fieldErrors.transporte">
                  {{ fieldErrors.transporte }}
                </small>
              </label>
            </div>
          </div>

          <div class="info-box">
            <div class="info-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <path d="M12 8h.01" />
              </svg>
            </div>

            <p>
              La entrega se registrará inicialmente como
              <strong>Pendiente</strong>.
              El seguimiento del estado se realizará posteriormente desde
              el detalle de la entrega.
            </p>
          </div>

          <div class="actions">
            <RouterLink
              to="/entregas"
              class="secondary"
            >
              Cancelar
            </RouterLink>

            <button
              type="submit"
              class="primary"
              :disabled="saving"
            >
              <svg
                v-if="!saving"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>

              <span
                v-if="saving"
                class="button-loader"
              ></span>

              {{
                saving
                  ? 'Registrando...'
                  : 'Registrar entrega'
              }}
            </button>
          </div>
        </form>

        <aside class="side-column">
          <section class="side-card status-card">
            <span class="side-kicker">
              ESTADO INICIAL
            </span>

            <div class="pending-badge">
              <span></span>
              Pendiente
            </div>

            <h3>
              Flujo de la operación
            </h3>

            <div class="timeline">
              <div class="timeline-item active">
                <div class="timeline-dot"></div>

                <div>
                  <strong>Pendiente</strong>
                  <span>Registro inicial</span>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-dot"></div>

                <div>
                  <strong>Preparando</strong>
                  <span>Alistamiento</span>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-dot"></div>

                <div>
                  <strong>En tránsito</strong>
                  <span>Desplazamiento</span>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-dot"></div>

                <div>
                  <strong>Entregada</strong>
                  <span>Recepción confirmada</span>
                </div>
              </div>
            </div>
          </section>

          <section class="quick-card">
            <div class="quick-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
                <path d="M4 12l8 4.5 8-4.5" />
              </svg>
            </div>

            <span>GESTIÓN LOGÍSTICA</span>

            <h3>
              Registro seguro
            </h3>

            <p>
              Verifica cuidadosamente origen, destino, cantidad
              y responsable antes de registrar la entrega.
            </p>
          </section>
        </aside>
      </div>
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
  useRouter
} from 'vue-router'

import AppLayout from '../components/AppLayout.vue'

import {
  createDelivery
} from '../services/deliveries'

import {
  listResponsibles
} from '../services/users'

const router = useRouter()

const responsibles = ref([])
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

function validateForm() {
  const errors = {}

  if (!form.origen) {
    errors.origen =
      'El origen es obligatorio.'
  } else if (form.origen.length < 2) {
    errors.origen =
      'El origen debe tener al menos 2 caracteres.'
  }

  if (!form.destino) {
    errors.destino =
      'El destino es obligatorio.'
  } else if (form.destino.length < 2) {
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

  fieldErrors.value = errors

  return (
    Object.keys(errors).length === 0
  )
}

async function submitForm() {
  error.value = ''

  if (!validateForm()) return

  saving.value = true

  try {
    const delivery =
      await createDelivery({
        origen: form.origen,
        destino: form.destino,
        tipo: form.tipo,
        cantidad:
          Number(form.cantidad),
        responsableId:
          Number(form.responsableId),
        transporte:
          form.transporte
      })

    await router.push(
      `/entregas/${delivery.id}`
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

async function loadResponsibles() {
  try {
    responsibles.value =
      await listResponsibles()
  } catch (err) {
    error.value =
      err.message
  }
}

onMounted(loadResponsibles)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.new-delivery-page {
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

/* LAYOUT */

.form-layout {
  display: grid;

  grid-template-columns:
    minmax(0, 1.65fr)
    minmax(270px, 0.55fr);

  align-items: start;

  gap: 20px;
}

/* FORM */

.form-card {
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

.form-header {
  min-height: 100px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 18px;

  padding: 22px 24px;

  border-bottom:
    1px solid
    var(--border-soft);
}

.section-label {
  display: block;

  margin-bottom: 5px;

  color:
    var(--color-primary);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.2px;
}

.form-header h2 {
  margin: 0;

  color:
    var(--text-primary);

  font-size: 20px;
}

.form-header p {
  margin: 5px 0 0;

  color:
    var(--text-muted);

  font-size: 13px;
}

.initial-status {
  min-height: 32px;

  display: inline-flex;
  align-items: center;

  gap: 7px;

  flex: 0 0 auto;

  padding: 0 11px;

  border-radius: 999px;

  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);

  font-size: 12px;
  font-weight: 850;
}

.initial-status i {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    currentColor;
}

.form-section {
  padding:
    23px
    24px;

  border-bottom:
    1px solid
    var(--border-soft);
}

.section-title {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 20px;
}

.section-icon {
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

.section-icon svg {
  width: 19px;
  height: 19px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.section-title strong,
.section-title span {
  display: block;
}

.section-title strong {
  color:
    var(--text-primary);

  font-size: 15px;
}

.section-title span {
  margin-top: 2px;

  color:
    var(--text-muted);

  font-size: 12px;
}

/* CAMPOS */

.form-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 20px;
}

label > span {
  display: block;

  margin-bottom: 8px;

  color:
    var(--text-secondary);

  font-size: 13px;
  font-weight: 800;
}

.input-wrap {
  position: relative;

  border:
    1px solid
    var(--border-color);

  border-radius: 11px;

  background:
    var(--bg-surface-secondary);

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.input-wrap:focus-within {
  border-color:
    var(--color-primary);

  box-shadow:
    0 0 0 3px
    rgba(39, 116, 90, 0.12);
}

.input-wrap.invalid {
  border-color:
    var(--color-danger);
}

.input-wrap > svg {
  width: 18px;
  height: 18px;

  position: absolute;

  left: 13px;
  top: 50%;

  transform:
    translateY(-50%);

  fill: none;
  stroke:
    var(--text-muted);

  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;

  pointer-events: none;
}

input,
select {
  width: 100%;
  min-height: 50px;

  padding:
    0 14px;

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
  padding-left: 42px;

  border: 0;

  background: transparent;
}

select:focus {
  border-color:
    var(--color-primary);

  box-shadow:
    0 0 0 3px
    rgba(39, 116, 90, 0.12);
}

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

  margin-top: 7px;

  color:
    var(--color-danger);

  font-size: 11px;
  font-weight: 650;
}

/* INFO */

.info-box {
  display: flex;
  align-items: flex-start;

  gap: 12px;

  margin:
    22px
    24px;

  padding: 15px 16px;

  border:
    1px solid
    var(--border-color);

  border-radius: 13px;

  background:
    var(--color-primary-soft);
}

.info-icon {
  width: 34px;
  height: 34px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 10px;

  background:
    var(--color-primary);

  color: #ffffff;
}

.info-icon svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
}

.info-box p {
  margin: 1px 0 0;

  color:
    var(--text-secondary);

  font-size: 13px;
  line-height: 1.6;
}

.info-box strong {
  color:
    var(--text-primary);
}

/* BOTONES */

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

  gap: 8px;

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

  color: #ffffff;

  cursor: pointer;

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

.primary svg {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
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

.secondary:hover {
  background:
    var(--bg-surface-secondary);
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

/* SIDE */

.side-column {
  display: grid;
  gap: 18px;
}

.side-card {
  padding: 22px;

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

.side-kicker {
  display: block;

  margin-bottom: 10px;

  color:
    var(--color-primary);

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.2px;
}

.pending-badge {
  width: fit-content;

  min-height: 31px;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 0 10px;

  border-radius: 999px;

  background:
    var(--color-warning-soft);

  color:
    var(--color-warning);

  font-size: 12px;
  font-weight: 850;
}

.pending-badge > span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    currentColor;
}

.status-card h3 {
  margin:
    19px 0 17px;

  color:
    var(--text-primary);

  font-size: 17px;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: flex-start;

  gap: 11px;

  position: relative;

  min-height: 58px;
}

.timeline-item::after {
  width: 1px;

  position: absolute;

  top: 15px;
  bottom: -3px;
  left: 5px;

  background:
    var(--border-color);

  content: "";
}

.timeline-item:last-child::after {
  display: none;
}

.timeline-dot {
  width: 11px;
  height: 11px;

  position: relative;
  z-index: 2;

  flex: 0 0 auto;

  margin-top: 3px;

  border:
    2px solid
    var(--text-faint);

  border-radius: 50%;

  background:
    var(--bg-surface);
}

.timeline-item.active .timeline-dot {
  border-color:
    var(--color-warning);

  background:
    var(--color-warning);
}

.timeline-item strong,
.timeline-item span {
  display: block;
}

.timeline-item strong {
  color:
    var(--text-primary);

  font-size: 13px;
}

.timeline-item span {
  margin-top: 2px;

  color:
    var(--text-muted);

  font-size: 11px;
}

/* QUICK */

.quick-card {
  overflow: hidden;

  position: relative;

  padding: 24px;

  border-radius:
    var(--radius-lg);

  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(239, 183, 46, 0.18),
      transparent 40%
    ),
    #123f32;

  color: #ffffff;

  box-shadow:
    var(--shadow-md);
}

.quick-icon {
  width: 43px;
  height: 43px;

  display: grid;
  place-items: center;

  margin-bottom: 17px;

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.1);

  color:
    #efbd3f;
}

.quick-icon svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
}

.quick-card > span {
  color:
    #efbd3f;

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.2px;
}

.quick-card h3 {
  margin:
    7px 0 0;

  color: #ffffff;

  font-size: 20px;
}

.quick-card p {
  margin:
    10px 0 0;

  color:
    rgba(255, 255, 255, 0.63);

  font-size: 13px;
  line-height: 1.65;
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

/* DARK */

:global(html[data-theme="dark"]) .quick-card {
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(239, 189, 63, 0.12),
      transparent 40%
    ),
    #0d3328;
}

/* RESPONSIVE */

@media (max-width: 1000px) {
  .form-layout {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(250px, 0.55fr);
  }
}

@media (max-width: 850px) {
  .form-layout {
    grid-template-columns: 1fr;
  }

  .side-column {
    grid-template-columns:
      1fr 1fr;
  }
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  h1 {
    font-size: 28px;
  }

  .back-link {
    width: 100%;
    justify-content: center;
  }

  .form-header,
  .form-section {
    padding:
      20px 16px;
  }

  .info-box {
    margin:
      18px 16px;
  }

  .actions {
    flex-direction: column-reverse;

    padding:
      16px;
  }

  .primary,
  .secondary {
    width: 100%;
  }

  .side-column {
    grid-template-columns: 1fr;
  }
}
</style>