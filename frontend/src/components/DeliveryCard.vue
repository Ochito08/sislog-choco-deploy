<template>
  <article class="delivery-card">
    <div class="delivery-icon" aria-hidden="true">
      ↗
    </div>

    <div class="delivery-content">
      <div class="heading">
        <div>
          <span class="delivery-id">
            Entrega #{{ delivery.id }}
          </span>

          <h3>
            {{ delivery.tipo || 'Ayuda humanitaria' }}
          </h3>
        </div>

        <StatusBadge :status="delivery.estado" />
      </div>

      <div class="meta">
        <span>
          <strong>Origen:</strong>
          {{ delivery.origen || '—' }}
        </span>

        <span>
          <strong>Destino:</strong>
          {{ delivery.destino || '—' }}
        </span>

        <span>
          <strong>Cantidad:</strong>
          {{ delivery.cantidad ?? '—' }}
        </span>

        <span>
          <strong>Responsable:</strong>
          {{ delivery.responsable || 'Sin asignar' }}
        </span>
      </div>
    </div>

    <RouterLink
      :to="`/entregas/${delivery.id}`"
      class="detail-link"
    >
      Ver detalle →
    </RouterLink>
  </article>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({
  delivery: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.delivery-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 18px;
  border-bottom: 1px solid #eef2f0;
  background: #fff;
}

.delivery-card:last-child {
  border-bottom: 0;
}

.delivery-card:hover {
  background: #fbfcfb;
}

.delivery-icon {
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #e8f3ee;
  color: #28745a;
  font-size: 15px;
  font-weight: 900;
}

.delivery-content {
  min-width: 0;
  flex: 1;
}

.heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.delivery-id {
  display: block;
  color: #98a2b3;
  font-size: 8px;
  font-weight: 700;
}

h3 {
  margin: 3px 0 0;
  color: #263238;
  font-size: 12px;
}

.meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  color: #667085;
  font-size: 9px;
}

.meta strong {
  color: #475467;
}

.detail-link {
  flex: 0 0 auto;
  color: #28745a;
  text-decoration: none;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.detail-link:hover {
  text-decoration: underline;
}

@media (max-width: 650px) {
  .delivery-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .heading {
    flex-direction: column;
  }

  .detail-link {
    margin-left: 49px;
  }
}
</style>
