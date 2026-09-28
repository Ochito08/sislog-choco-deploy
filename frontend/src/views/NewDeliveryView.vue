<template>
  <AppLayout title="Nueva entrega">
    <div class="header"><h1>Registrar nueva entrega</h1><p>Completa los datos mínimos definidos para el envío humanitario.</p></div>
    <form class="card" @submit.prevent="save" novalidate>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="grid">
        <label>Origen
          <input v-model.trim="form.origen" maxlength="80" placeholder="Ej. Quibdó" :class="{ invalid: fieldErrors.origen }" />
          <small v-if="fieldErrors.origen">{{ fieldErrors.origen }}</small>
        </label>
        <label>Destino
          <input v-model.trim="form.destino" maxlength="80" placeholder="Ej. Bagadó" :class="{ invalid: fieldErrors.destino }" />
          <small v-if="fieldErrors.destino">{{ fieldErrors.destino }}</small>
        </label>
        <label>Tipo de ayuda
          <select v-model="form.tipo" :class="{ invalid: fieldErrors.tipo }"><option value="" disabled>Seleccionar</option><option>Alimentos</option><option>Medicamentos</option><option>Kits de aseo</option><option>Agua</option><option>Ropa</option><option>Otro</option></select>
          <small v-if="fieldErrors.tipo">{{ fieldErrors.tipo }}</small>
        </label>
        <label>Cantidad
          <input v-model.number="form.cantidad" type="number" min="1" max="1000000" placeholder="Ej. 100" :class="{ invalid: fieldErrors.cantidad }" />
          <small v-if="fieldErrors.cantidad">{{ fieldErrors.cantidad }}</small>
        </label>
        <label>Responsable
          <select v-model.number="form.responsableId" :class="{ invalid: fieldErrors.responsableId }"><option :value="null" disabled>{{ loadingUsers ? 'Cargando responsables...' : 'Seleccionar responsable' }}</option><option v-for="person in responsibles" :key="person.id" :value="person.id">{{ person.name }}</option></select>
          <small v-if="fieldErrors.responsableId">{{ fieldErrors.responsableId }}</small>
        </label>
        <label>Transporte
          <input v-model.trim="form.transporte" maxlength="100" placeholder="Ej. Camión CHO-123" :class="{ invalid: fieldErrors.transporte }" />
          <small v-if="fieldErrors.transporte">{{ fieldErrors.transporte }}</small>
        </label>
      </div>
      <div class="actions"><RouterLink to="/entregas" class="cancel">Cancelar</RouterLink><button type="submit" :disabled="saving || loadingUsers">{{ saving ? 'Guardando...' : 'Guardar entrega' }}</button></div>
    </form>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { createDelivery } from '../services/deliveries'
import { listResponsibles } from '../services/users'

const router=useRouter()
const form=reactive({origen:'',destino:'',tipo:'',cantidad:'',responsableId:null,transporte:''})
const responsibles=ref([]), loadingUsers=ref(true), saving=ref(false), error=ref(''), fieldErrors=ref({})

onMounted(async()=>{try{responsibles.value=await listResponsibles();if(!responsibles.value.length)error.value='No hay responsables de transporte activos. Un administrador debe crear o activar uno.'}catch(e){error.value=e.message}finally{loadingUsers.value=false}})

function validateClient(){
  const errors={}
  if(!form.origen) errors.origen='El origen es obligatorio.'
  if(!form.destino) errors.destino='El destino es obligatorio.'
  if(form.origen && form.destino && form.origen.toLowerCase()===form.destino.toLowerCase()) errors.destino='El destino debe ser diferente al origen.'
  if(!form.tipo) errors.tipo='El tipo de ayuda es obligatorio.'
  if(!Number.isInteger(Number(form.cantidad)) || Number(form.cantidad)<1) errors.cantidad='La cantidad debe ser un número entero mayor que cero.'
  if(!form.responsableId) errors.responsableId='Debes seleccionar un responsable.'
  if(!form.transporte || form.transporte.length<3) errors.transporte='El transporte debe tener al menos 3 caracteres.'
  fieldErrors.value=errors
  return Object.keys(errors).length===0
}

async function save(){
  error.value='';fieldErrors.value={}
  if(!validateClient()){error.value='Revisa los campos marcados antes de guardar.';return}
  saving.value=true
  try{const created=await createDelivery(form);router.push(`/entregas/${created.id}`)}
  catch(e){error.value=e.message;fieldErrors.value=e.fieldErrors||{}}
  finally{saving.value=false}
}
</script>

<style scoped>
.header{margin-bottom:18px}.header h1{margin:0;font-size:22px}.header p{margin:5px 0 0;color:#98a2b3;font-size:11px}.card{max-width:850px;padding:22px;background:#fff;border:1px solid #e4eae7;border-radius:10px}.error{margin:0 0 16px;padding:10px;border-radius:7px;background:#fff0f0;color:#a83b3b;font-size:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}label{font-size:10px;font-weight:800}label small{display:block;margin-top:5px;color:#b33a3a;font-weight:500}input,select{width:100%;height:42px;margin-top:7px;padding:0 11px;border:1px solid #d9e2dd;border-radius:7px;background:#fafcfb;outline:none;font-size:11px}input:focus,select:focus{border-color:#28745a;box-shadow:0 0 0 3px rgba(40,116,90,.08)}input.invalid,select.invalid{border-color:#cf6a6a;background:#fffafa}.actions{margin-top:22px;display:flex;justify-content:flex-end;gap:10px}.actions a,.actions button{padding:11px 16px;border-radius:8px;text-decoration:none;font-size:11px;font-weight:800}.cancel{border:1px solid #d9e2dd;color:#667085}.actions button{border:0;background:#164a3a;color:#fff;cursor:pointer}.actions button:disabled{opacity:.65;cursor:wait}@media(max-width:620px){.grid{grid-template-columns:1fr}.actions{flex-direction:column-reverse}.actions a,.actions button{text-align:center}}
</style>
