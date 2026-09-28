<template>

  <div class="delivery-list">

    <div
      v-if="aids.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        📦
      </div>

      <strong>
        No hay entregas registradas
      </strong>

      <span>
        Las nuevas entregas aparecerán aquí.
      </span>
    </div>


    <div
      v-for="(aid, index) in aids"
      :key="aid.id || index"
      class="delivery-row"
    >

      <!-- INFORMACIÓN -->
      <div class="delivery-main">

        <div class="delivery-id">
          {{ aid.id || `ENT-${index + 1}` }}

          <span
            class="status"
            :class="statusClass(aid.estado)"
          >
            <i></i>
            {{ aid.estado }}
          </span>
        </div>

        <div class="route">
          {{ aid.origen }}
          <span>→</span>
          {{ aid.destino }}
        </div>

      </div>


      <!-- AYUDA -->
      <div class="delivery-type">

        <strong>
          {{ aid.tipo }}
        </strong>

        <span>
          {{ aid.cantidad }} unidades
        </span>

      </div>


      <!-- ACCIÓN -->
      <button
        class="view-button"
        @click="$emit('remove-aid', index)"
        title="Eliminar"
      >
        ×
      </button>

    </div>

  </div>

</template>


<script setup>

defineProps({
  aids: {
    type: Array,
    required: true
  }
})


defineEmits([
  'remove-aid'
])


function statusClass(status) {

  switch (status) {

    case 'Entregada':
      return 'delivered'

    case 'En tránsito':
      return 'transit'

    case 'Preparando':
      return 'preparing'

    case 'Incidencia':
      return 'incident'

    default:
      return 'pending'
  }

}

</script>


<style scoped>

.delivery-list {
  width: 100%;
}


.delivery-row {
  min-height: 64px;

  padding: 11px 15px;

  display: grid;

  grid-template-columns:
    1fr 150px 25px;

  align-items: center;

  gap: 12px;

  border-bottom: 1px solid #EEF2F0;
}


.delivery-row:last-child {
  border-bottom: none;
}


.delivery-main {
  min-width: 0;
}


.delivery-id {
  display: flex;
  align-items: center;

  gap: 8px;

  color: #667085;

  font-size: 8px;
  font-weight: 600;
}


.status {
  display: inline-flex;

  align-items: center;

  gap: 4px;

  padding: 3px 6px;

  border-radius: 20px;

  font-size: 7px;
  font-weight: 700;
}


.status i {
  width: 5px;
  height: 5px;

  border-radius: 50%;
}


.status.delivered {
  background: #E8F3EE;
  color: #28745A;
}

.status.delivered i {
  background: #28745A;
}


.status.transit {
  background: #EAF2FB;
  color: #3578C7;
}

.status.transit i {
  background: #3578C7;
}


.status.preparing {
  background: #EAF2FB;
  color: #3578C7;
}

.status.preparing i {
  background: #3578C7;
}


.status.pending {
  background: #FFF3E5;
  color: #E58A32;
}

.status.pending i {
  background: #E58A32;
}


.status.incident {
  background: #FFF0F0;
  color: #D64545;
}

.status.incident i {
  background: #D64545;
}


.route {
  margin-top: 5px;

  color: #263238;

  font-size: 9px;
  font-weight: 600;
}


.route span {
  margin: 0 4px;

  color: #98A2B3;
}


.delivery-type {
  display: flex;
  flex-direction: column;

  text-align: right;
}


.delivery-type strong {
  color: #263238;

  font-size: 9px;
}


.delivery-type span {
  margin-top: 3px;

  color: #98A2B3;

  font-size: 7px;
}


.view-button {
  width: 23px;
  height: 23px;

  border: none;
  border-radius: 6px;

  background: #F4F6F5;

  color: #667085;

  cursor: pointer;
}


.view-button:hover {
  background: #FFF0F0;
  color: #D64545;
}


/* SIN DATOS */

.empty-state {
  min-height: 150px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 6px;

  color: #667085;

  text-align: center;
}


.empty-icon {
  font-size: 24px;
}


.empty-state strong {
  color: #263238;

  font-size: 11px;
}


.empty-state span {
  font-size: 9px;
}


@media (max-width: 650px) {

  .delivery-row {
    grid-template-columns: 1fr 25px;
  }

  .delivery-type {
    display: none;
  }

}

</style>