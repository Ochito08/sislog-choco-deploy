<template>
  <AppLayout title="Nueva entrega">
    <div class="page-header">
      <div>
        <p class="eyebrow">REGISTRO LOGÍSTICO</p>
        <h1>Nueva entrega</h1>
        <p class="subtitle">
          Registra la ayuda humanitaria, su destino y el responsable del transporte.
        </p>
      </div>

      <RouterLink to="/entregas" class="back-link">
        ← Volver a entregas
      </RouterLink>
    </div>

    <p v-if="error" class="message error">
      {{ error }}
    </p>

    <form class="form-card" @submit.prevent="submitForm" novalidate>
      <div class="form-header">
        <div>
          <h2>Información de la entrega</h2>
          <p>Completa todos los datos requeridos para registrar la operación.</p>
        </div>

        <span class="initial-status">
          Estado inicial: Pendiente
        </span>
      </div>

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
            placeholder="Ej. 100"
            :class="{ invalid: fieldErrors.cantidad }"
          />

          <small v-if="fieldErrors.cantidad">
            {{ fieldErrors.cantidad }}
          </small>
        </label>

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
        <div class="info-icon">i</div>

        <p>
          La entrega se registrará inicialmente como
          <strong>Pendiente</strong>.
          El seguimiento del estado se realizará posteriormente desde
          el detalle de la entrega.
        </p>
      </div>

      <div class="actions">
        <RouterLink to="/entregas" class="secondary">
          Cancelar
        </RouterLink>

        <button
          type="submit"
          class="primary"
          :disabled="saving"
        >
          {{ saving ? 'Registrando...' : 'Registrar entrega' }}
        </button>
      </div>
    </form>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppLayout from '../components/AppLayout.vue'
import { createDelivery } from '../services/deliveries'
import { listResponsibles } from '../services/users'

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
    errors.origen = 'El origen es obligatorio.'
  } else if (form.origen.length < 2) {
    errors.origen = 'El origen debe tener al menos 2 caracteres.'
  }

  if (!form.destino) {
    errors.destino = 'El destino es obligatorio.'
  } else if (form.destino.length < 2) {
    errors.destino = 'El destino debe tener al menos 2 caracteres.'
  } else if (
    form.origen &&
    form.destino.toLowerCase() === form.origen.toLowerCase()
  ) {
    errors.destino = 'El destino debe ser diferente al origen.'
  }

  if (!form.tipo) {
    errors.tipo = 'El tipo de ayuda es obligatorio.'
  }

  if (
    !Number.isInteger(Number(form.cantidad)) ||
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
    errors.transporte = 'El transporte es obligatorio.'
  } else if (form.transporte.length < 3) {
    errors.transporte =
      'El transporte debe tener al menos 3 caracteres.'
  }

  fieldErrors.value = errors

  return Object.keys(errors).length === 0
}

async function submitForm() {
  error.value = ''

  if (!validateForm()) return

  saving.value = true

  try {
    const delivery = await createDelivery({
      origen: form.origen,
      destino: form.destino,
      tipo: form.tipo,
      cantidad: Number(form.cantidad),
      responsableId: Number(form.responsableId),
      transporte: form.transporte
    })

    await router.push(`/entregas/${delivery.id}`)
  } catch (err) {
    error.value = err.message
    fieldErrors.value = err.fieldErrors || {}
  } finally {
    saving.value = false
  }
}

async function loadResponsibles() {
  try {
    responsibles.value = await listResponsibles()
  } catch (err) {
    error.value = err.message
  }
}

onMounted(loadResponsibles)
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

.form-card {
  overflow: hidden;
  border: 1px solid #e4eae7;
  border-radius: 10px;
  background: #fff;
}

.form-header {
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #eef2f0;
}

.form-header h2 {
  margin: 0;
  color: #263238;
  font-size: 15px;
}

.form-header p {
  margin: 5px 0 0;
  color: #98a2b3;
  font-size: 10px;
}

.initial-status {
  padding: 7px 11px;
  border-radius: 999px;
  background: #fff3e5;
  color: #b86718;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 19px;
  padding: 22px 20px;
}

label span {
  display: block;
  margin-bottom: 7px;
  color: #475467;
  font-size: 10px;
  font-weight: 800;
}

input,
select {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
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

input.invalid,
select.invalid {
  border-color: #d92d20;
}

small {
  display: block;
  margin-top: 6px;
  color: #b42318;
  font-size: 9px;
}

.info-box {
  margin: 0 20px 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 14px;
  border: 1px solid #dceae3;
  border-radius: 8px;
  background: #f4f9f6;
}

.info-icon {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #28745a;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
}

.info-box p {
  margin: 2px 0 0;
  color: #557067;
  font-size: 10px;
  line-height: 1.5;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  padding: 16px 20px;
  border-top: 1px solid #eef2f0;
  background: #fbfcfb;
}

.primary,
.secondary {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 17px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
}

.primary {
  border: 0;
  background: #164a3a;
  color: #fff;
  cursor: pointer;
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

@media (max-width: 520px) {
  h1 {
    font-size: 23px;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .primary,
  .secondary {
    width: 100%;
  }
}
</style>
