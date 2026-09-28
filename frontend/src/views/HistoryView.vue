<template>
  <AppLayout title="Historial">
    <div class="header"><h1>Historial de entregas</h1><p>Entregas finalizadas con recepción confirmada.</p></div>
    <section class="panel filters-panel">
      <form class="filters" @submit.prevent="load">
        <input v-model.trim="filters.search" placeholder="Buscar por ID, origen, ayuda o transporte" />
        <input v-model.trim="filters.destination" placeholder="Filtrar por destino" />
        <select v-if="user?.role !== 'Responsable de transporte'" v-model="filters.responsibleId"><option value="">Todos los responsables</option><option v-for="person in responsibles" :key="person.id" :value="person.id">{{ person.name }}</option></select>
        <button type="submit">Aplicar</button><button type="button" class="secondary" @click="clearFilters">Limpiar</button>
      </form>
    </section>
    <section class="panel">
      <p v-if="error" class="error">{{ error }}</p>
      <div v-if="loading" class="empty">Consultando historial...</div>
      <template v-else><DeliveryCard v-for="item in delivered" :key="item.id" :delivery="item"/><div v-if="!delivered.length" class="empty">No hay entregas finalizadas con esos filtros.</div></template>
    </section>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import DeliveryCard from '../components/DeliveryCard.vue'
import { listHistory } from '../services/deliveries'
import { listResponsibles } from '../services/users'
import { getCurrentUser } from '../services/auth'

const delivered=ref([]), responsibles=ref([]), loading=ref(true), error=ref('')
const user=getCurrentUser()
const filters=reactive({search:'',destination:'',responsibleId:''})
async function load(){loading.value=true;error.value='';try{delivered.value=await listHistory(filters)}catch(e){error.value=e.message}finally{loading.value=false}}
function clearFilters(){filters.search='';filters.destination='';filters.responsibleId='';load()}
onMounted(async()=>{try{responsibles.value=await listResponsibles()}catch{responsibles.value=[]}await load()})
</script>

<style scoped>
.header{margin-bottom:18px}.header h1{margin:0;font-size:22px}.header p{margin:5px 0 0;color:#98a2b3;font-size:11px}.panel{overflow:hidden;background:#fff;border:1px solid #e4eae7;border-radius:10px}.filters-panel{margin-bottom:12px;padding:14px}.filters{display:grid;grid-template-columns:minmax(190px,1.2fr) minmax(150px,.8fr) 220px auto auto;gap:8px}.filters input,.filters select{height:40px;padding:0 10px;border:1px solid #d9e2dd;border-radius:7px;background:#fafcfb;outline:none;font-size:10px}.filters button{padding:0 13px;border:0;border-radius:7px;background:#164a3a;color:#fff;font-size:10px;font-weight:800;cursor:pointer}.filters .secondary{border:1px solid #d9e2dd;background:#fff;color:#667085}.empty{padding:40px;text-align:center;color:#7d8b86;font-size:11px}.error{margin:12px;padding:10px;border-radius:7px;background:#fff0f0;color:#a83b3b;font-size:10px}@media(max-width:800px){.filters{grid-template-columns:1fr 1fr}.filters input:first-child{grid-column:1/-1}}@media(max-width:550px){.filters{grid-template-columns:1fr}.filters input:first-child{grid-column:auto}.filters button{height:40px}}
</style>
