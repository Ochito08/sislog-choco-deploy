<template>
  <AppLayout title="Detalle de entrega">
    <div v-if="loading" class="text-gray-500">Cargando entrega...</div>
    <div v-else-if="error && !delivery" class="text-red-600">{{ error }}</div>
    <div v-else-if="delivery" class="space-y-4">
      <div class="flex items-center justify-between">
        <RouterLink to="/entregas" class="text-blue-600 hover:underline">← Volver a entregas</RouterLink>
        <StatusBadge :status="delivery.estado" />
      </div>
      <section class="bg-white p-4 rounded-md shadow">
        <h2 class="font-semibold text-lg mb-2">Información de la entrega</h2>
        <dl class="space-y-2">
          <div><dt class="font-medium">Tipo de ayuda</dt><dd>{{ delivery.tipo }}</dd></div>
          <div><dt class="font-medium">Cantidad</dt><dd>{{ delivery.cantidad }} unidades</dd></div>
          <div><dt class="font-medium">Responsable</dt><dd>{{ delivery.responsable }}</dd></div>
        </dl>
      </section>
    </div>
  </AppLayout>
</template>
