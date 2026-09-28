<template>
  <AppLayout title="Nueva entrega">
    <form class="max-w-md mx-auto bg-white p-6 rounded-md shadow space-y-4">
      <input v-model="delivery.beneficiario" placeholder="Beneficiario" class="w-full border p-2 rounded-md" />
      <input v-model="delivery.tipo" placeholder="Tipo de ayuda" class="w-full border p-2 rounded-md" />
      <input v-model="delivery.cantidad" type="number" placeholder="Cantidad" class="w-full border p-2 rounded-md" />
      <button @click.prevent="save" class="w-full bg-green-700 text-white py-2 rounded-md">Guardar entrega</button>
    </form>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'

const delivery = ref({ beneficiario: '', tipo: '', cantidad: 0 })

function save() {
  console.log('Entrega guardada:', delivery.value)
}
</script>
