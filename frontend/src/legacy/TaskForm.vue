<template>
  <div class="form-card">

    <div class="form-header">
      <div>
        <h2>Registrar nueva entrega</h2>
        <p>
          Completa la información de la ayuda humanitaria.
        </p>
      </div>

      <button
        type="button"
        class="close-button"
        @click="resetForm"
      >
        ×
      </button>
    </div>


    <form @submit.prevent="submitForm">

      <div class="form-grid">

        <!-- ORIGEN -->
        <div class="field">
          <label class="label">
            Punto de acopio
          </label>

          <div class="control">
            <input
              v-model="origen"
              class="input"
              type="text"
              placeholder="Ej. Quibdó"
              required
            >
          </div>
        </div>


        <!-- DESTINO -->
        <div class="field">
          <label class="label">
            Comunidad / destino
          </label>

          <div class="control">
            <input
              v-model="destino"
              class="input"
              type="text"
              placeholder="Ej. Bagadó"
              required
            >
          </div>
        </div>


        <!-- TIPO -->
        <div class="field">
          <label class="label">
            Tipo de ayuda
          </label>

          <div class="control">
            <div class="select-wrapper">

              <select
                v-model="tipo"
                required
              >
                <option value="" disabled>
                  Seleccionar tipo
                </option>

                <option>
                  Alimentos
                </option>

                <option>
                  Medicamentos
                </option>

                <option>
                  Kits de aseo
                </option>

                <option>
                  Utensilios de cocina
                </option>

                <option>
                  Agua
                </option>

                <option>
                  Ropa
                </option>

                <option>
                  Otro
                </option>
              </select>

            </div>
          </div>
        </div>


        <!-- CANTIDAD -->
        <div class="field">
          <label class="label">
            Cantidad
          </label>

          <div class="control">
            <input
              v-model="cantidad"
              class="input"
              type="number"
              min="1"
              placeholder="Ej. 100"
              required
            >
          </div>
        </div>


        <!-- RESPONSABLE -->
        <div class="field">
          <label class="label">
            Responsable
          </label>

          <div class="control">
            <input
              v-model="responsable"
              class="input"
              type="text"
              placeholder="Nombre del responsable"
              required
            >
          </div>
        </div>


        <!-- TRANSPORTE -->
        <div class="field">
          <label class="label">
            Transporte
          </label>

          <div class="control">
            <input
              v-model="transporte"
              class="input"
              type="text"
              placeholder="Ej. Camión CHO-123"
              required
            >
          </div>
        </div>

      </div>


      <div class="form-actions">

        <button
          type="button"
          class="button cancel"
          @click="resetForm"
        >
          Limpiar
        </button>

        <button
          type="submit"
          class="button save"
        >
          ✓ Registrar entrega
        </button>

      </div>

    </form>

  </div>
</template>


<script setup>
import { ref } from 'vue'

const emit = defineEmits(['new-aid'])

const origen = ref('')
const destino = ref('')
const tipo = ref('')
const cantidad = ref('')
const responsable = ref('')
const transporte = ref('')


function submitForm() {

  if (
    !origen.value ||
    !destino.value ||
    !tipo.value ||
    !cantidad.value ||
    !responsable.value ||
    !transporte.value
  ) {
    return
  }

  emit('new-aid', {
    origen: origen.value,
    destino: destino.value,
    tipo: tipo.value,
    cantidad: cantidad.value,
    responsable: responsable.value,
    transporte: transporte.value
  })

  resetForm()
}


function resetForm() {
  origen.value = ''
  destino.value = ''
  tipo.value = ''
  cantidad.value = ''
  responsable.value = ''
  transporte.value = ''
}
</script>


<style scoped>

.form-card {
  padding: 20px;

  background: white;

  border: 1px solid #E4EAE7;

  border-radius: 10px;
}


.form-header {
  display: flex;
  justify-content: space-between;

  margin-bottom: 20px;
}


.form-header h2 {
  margin: 0;

  color: #263238;

  font-size: 14px;
  font-weight: 800;
}


.form-header p {
  margin: 4px 0 0;

  color: #98A2B3;

  font-size: 9px;
}


.close-button {
  width: 28px;
  height: 28px;

  border: none;
  border-radius: 6px;

  background: #F3F5F4;

  color: #667085;

  cursor: pointer;
}


.form-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 14px;
}


.field {
  margin: 0;
}


.label {
  display: block;

  margin-bottom: 6px;

  color: #263238;

  font-size: 10px;
  font-weight: 700;
}


.input,
select {
  width: 100%;
  height: 40px;

  padding: 0 11px;

  border: 1px solid #D9E2DD;
  border-radius: 7px;

  background: #FAFCFB;

  color: #263238;

  font-size: 10px;

  outline: none;

  transition: 0.2s;
}


.input:focus,
select:focus {
  border-color: #28745A;

  background: white;

  box-shadow:
    0 0 0 3px rgba(40,116,90,0.08);
}


.select-wrapper {
  position: relative;
}


select {
  appearance: auto;
}


.form-actions {
  margin-top: 20px;
  padding-top: 15px;

  display: flex;
  justify-content: flex-end;

  gap: 8px;

  border-top: 1px solid #EEF2F0;
}


.button {
  height: 38px;

  padding: 0 15px;

  border-radius: 7px;

  font-size: 10px;
  font-weight: 700;

  cursor: pointer;
}


.cancel {
  border: 1px solid #D9E2DD;

  background: white;

  color: #667085;
}


.save {
  border: none;

  background: #164A3A;

  color: white;
}


.save:hover {
  background: #28745A;
}


@media (max-width: 650px) {

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

}

</style>