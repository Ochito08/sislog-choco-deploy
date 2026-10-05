<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Historial de Entregas</h1>
    <ul class="list-disc pl-6">
      <li v-for="item in history" :key="item.id">
        {{ item.fecha }} - {{ item.cliente }} ({{ item.status }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const history = ref([
  { id: 1, fecha: '2026-09-01', cliente: 'Juan Pérez', status: 'Entregada' },
  { id: 2, fecha: '2026-09-05', cliente: 'María Gómez', status: 'Entregada' }
])
</script>
