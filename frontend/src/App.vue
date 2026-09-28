<template>
  <div class="app">

    <!-- LOGIN -->
    <Login
      v-if="!loggedIn"
      @login="handleLogin"
    />

    <!-- SISTEMA -->
    <template v-else>

      <Dashboard
        :aids="aids"
        @new-aid="addAid"
        @remove-aid="removeAid"
        @logout="handleLogout"
      />

    </template>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

const loggedIn = ref(false)

const aids = ref([
  {
    id: 'ENT-2024-001',
    origen: 'Quibdó',
    destino: 'Bagadó',
    tipo: 'Alimentos',
    cantidad: 250,
    estado: 'En tránsito'
  },
  {
    id: 'ENT-2024-002',
    origen: 'Quibdó',
    destino: 'Lloró',
    tipo: 'Medicamentos',
    cantidad: 80,
    estado: 'Entregada'
  },
  {
    id: 'ENT-2024-003',
    origen: 'Istmina',
    destino: 'Nóvita',
    tipo: 'Kits de aseo',
    cantidad: 120,
    estado: 'Pendiente'
  }
])


function handleLogin() {
  loggedIn.value = true
}


function handleLogout() {
  loggedIn.value = false
}


function addAid(aid) {
  aids.value.push({
    id: `ENT-2024-${String(aids.value.length + 1).padStart(3, '0')}`,
    ...aid,
    estado: 'Pendiente'
  })
}


function removeAid(index) {
  aids.value.splice(index, 1)
}
</script>


<style>
html,
body,
#app {
  margin: 0;
  min-height: 100%;
}

body {
  background: #F7F8F5;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

button,
input,
select,
textarea {
  font-family: inherit;
}
</style>