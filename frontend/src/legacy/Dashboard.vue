<template>
  <div class="dashboard">

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <!-- LOGO -->
      <div class="sidebar-logo">

        <div class="logo-icon">
          ✦
        </div>

        <div>
          <strong>SISLOG</strong>
          <span>CHOCÓ</span>
        </div>

      </div>


      <!-- MENU -->
      <div class="menu-section">

        <p class="menu-title">
          MENÚ PRINCIPAL
        </p>

        <button class="menu-item active">
          <span>▦</span>
          Dashboard
        </button>

        <button class="menu-item">
          <span>⇄</span>
          Entregas
        </button>

        <button class="menu-item">
          <span>＋</span>
          Nueva entrega

          <span class="menu-badge">
            +
          </span>
        </button>

        <button class="menu-item">
          <span>◷</span>
          Historial
        </button>

        <button class="menu-item">
          <span>♙</span>
          Usuarios
        </button>

        <button class="menu-item">
          <span>⚙</span>
          Configuración
        </button>

      </div>


      <!-- USUARIO -->
      <div class="sidebar-user">

        <div class="avatar">
          CM
        </div>

        <div class="user-info">
          <strong>Carlos Mosquera</strong>
          <span>Coordinador logístico</span>
        </div>

        <button
          class="logout-button"
          @click="$emit('logout')"
          title="Cerrar sesión"
        >
          ↪
        </button>

      </div>

    </aside>


    <!-- CONTENIDO -->
    <main class="main-content">

      <!-- TOPBAR -->
      <header class="topbar">

        <div>
          <span class="breadcrumb">
            Dashboard
          </span>
        </div>

        <div class="topbar-actions">

          <button class="notification">
            ♧
            <span></span>
          </button>

          <div class="top-avatar">
            CM
          </div>

        </div>

      </header>


      <!-- CONTENIDO -->
      <section class="content">

        <!-- ENCABEZADO -->
        <div class="page-header">

          <div>
            <h1>
              Buen día, andres 👋
            </h1>

            <p>
              Domingo 6 de septiembre, 2026 · Semana de respuesta activa
            </p>
          </div>

          <button
            class="new-delivery-button"
            @click="showForm = !showForm"
          >
            <span>＋</span>
            Nueva entrega
          </button>

        </div>


        <!-- FORMULARIO -->
        <div
          v-if="showForm"
          class="form-container"
        >
          <TaskForm
            @new-aid="handleNewAid"
          />
        </div>


        <!-- KPIs -->
        <div class="kpi-grid">

          <div class="kpi-card">

            <div class="kpi-icon total">
              ◈
            </div>

            <div>
              <strong>{{ aids.length }}</strong>
              <span>Total entregas</span>
              <small>Este mes</small>
            </div>

          </div>


          <div class="kpi-card">

            <div class="kpi-icon pending">
              △
            </div>

            <div>
              <strong>{{ pendingCount }}</strong>
              <span>Pendientes</span>
              <small>Requieren atención</small>
            </div>

          </div>


          <div class="kpi-card">

            <div class="kpi-icon transit">
              ⇢
            </div>

            <div>
              <strong>{{ transitCount }}</strong>
              <span>En tránsito</span>
              <small>En camino</small>
            </div>

          </div>


          <div class="kpi-card">

            <div class="kpi-icon delivered">
              ✓
            </div>

            <div>
              <strong>{{ deliveredCount }}</strong>
              <span>Entregadas</span>
              <small>Completadas</small>
            </div>

          </div>

        </div>


        <!-- CONTENIDO INFERIOR -->
        <div class="dashboard-grid">

          <!-- ENTREGAS -->
          <section class="panel deliveries-panel">

            <div class="panel-header">

              <div>
                <h2>Entregas recientes</h2>
                <span>Últimas operaciones registradas</span>
              </div>

              <button class="view-all">
                Ver todas →
              </button>

            </div>


            <TaskList
              :aids="aids"
              @remove-aid="handleRemoveAid"
            />

          </section>


          <!-- RESUMEN -->
          <section class="panel summary-panel">

            <div class="panel-header">
              <div>
                <h2>Resumen por estado</h2>
              </div>
            </div>


            <div class="summary-chart">

              <div class="donut">
                <strong>{{ aids.length }}</strong>
                <span>total</span>
              </div>

            </div>


            <div class="status-list">

              <div class="status-row">
                <span>
                  <i class="dot delivered-dot"></i>
                  Entregadas
                </span>

                <strong>{{ deliveredCount }}</strong>
              </div>


              <div class="status-row">
                <span>
                  <i class="dot transit-dot"></i>
                  En tránsito
                </span>

                <strong>{{ transitCount }}</strong>
              </div>


              <div class="status-row">
                <span>
                  <i class="dot pending-dot"></i>
                  Pendientes
                </span>

                <strong>{{ pendingCount }}</strong>
              </div>

            </div>


            <div
              v-if="incidentCount > 0"
              class="incident-warning"
            >
              ⚠ {{ incidentCount }}
              entrega(s) con incidencia
            </div>

          </section>

        </div>

      </section>

    </main>

  </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import TaskForm from './TaskForm.vue'
import TaskList from './TaskList.vue'

const props = defineProps({
  aids: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'new-aid',
  'remove-aid',
  'logout'
])

const showForm = ref(false)


const pendingCount = computed(() =>
  props.aids.filter(aid => aid.estado === 'Pendiente').length
)


const transitCount = computed(() =>
  props.aids.filter(aid => aid.estado === 'En tránsito').length
)


const deliveredCount = computed(() =>
  props.aids.filter(aid => aid.estado === 'Entregada').length
)


const incidentCount = computed(() =>
  props.aids.filter(aid => aid.estado === 'Incidencia').length
)


function handleNewAid(aid) {
  emit('new-aid', aid)
  showForm.value = false
}


function handleRemoveAid(index) {
  emit('remove-aid', index)
}
</script>


<style scoped>

/* ==============================
   DASHBOARD
============================== */

.dashboard {
  min-height: 100vh;
  display: flex;
  background: #F7F8F5;
  color: #263238;
}


/* ==============================
   SIDEBAR
============================== */

.sidebar {
  width: 235px;
  min-height: 100vh;

  background: #164A3A;

  display: flex;
  flex-direction: column;

  color: white;
}


.sidebar-logo {
  height: 76px;

  padding: 0 20px;

  display: flex;
  align-items: center;
  gap: 10px;

  border-bottom: 1px solid rgba(255,255,255,0.08);
}


.logo-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #D4A72C;
  color: #164A3A;

  font-weight: 800;
}


.sidebar-logo strong {
  display: block;
  font-size: 14px;
}


.sidebar-logo span {
  display: block;

  margin-top: 1px;

  color: #D4A72C;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1.5px;
}


/* ==============================
   MENU
============================== */

.menu-section {
  padding: 24px 12px;
  flex: 1;
}


.menu-title {
  margin: 0 10px 10px;

  color: rgba(255,255,255,0.4);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 1px;
}


.menu-item {
  width: 100%;

  position: relative;

  display: flex;
  align-items: center;

  gap: 11px;

  margin-bottom: 3px;

  padding: 10px 11px;

  border: none;
  border-radius: 7px;

  background: transparent;
  color: rgba(255,255,255,0.68);

  text-align: left;

  font-size: 11px;

  cursor: pointer;

  transition: 0.2s;
}


.menu-item span:first-child {
  width: 18px;

  font-size: 13px;

  text-align: center;
}


.menu-item:hover,
.menu-item.active {
  background: rgba(255,255,255,0.12);
  color: white;
}


.menu-item.active {
  font-weight: 700;
}


.menu-badge {
  margin-left: auto;

  width: 17px;
  height: 17px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 5px;

  background: #D4A72C;
  color: #164A3A;

  font-size: 10px;
  font-weight: 800;
}


/* ==============================
   USUARIO
============================== */

.sidebar-user {
  padding: 14px;

  display: flex;
  align-items: center;

  gap: 9px;

  border-top: 1px solid rgba(255,255,255,0.08);
}


.avatar,
.top-avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #D4A72C;

  color: #164A3A;

  font-size: 9px;
  font-weight: 800;
}


.avatar {
  width: 31px;
  height: 31px;
}


.user-info {
  min-width: 0;
  flex: 1;
}


.user-info strong {
  display: block;

  overflow: hidden;

  color: white;

  font-size: 9px;

  white-space: nowrap;
  text-overflow: ellipsis;
}


.user-info span {
  display: block;

  margin-top: 2px;

  overflow: hidden;

  color: rgba(255,255,255,0.48);

  font-size: 8px;

  white-space: nowrap;
  text-overflow: ellipsis;
}


.logout-button {
  border: none;
  background: transparent;

  color: rgba(255,255,255,0.5);

  cursor: pointer;
}


/* ==============================
   MAIN
============================== */

.main-content {
  min-width: 0;
  flex: 1;
}


/* ==============================
   TOPBAR
============================== */

.topbar {
  height: 56px;

  padding: 0 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: white;

  border-bottom: 1px solid #E8ECEA;
}


.breadcrumb {
  color: #667085;
  font-size: 10px;
}


.topbar-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}


.notification {
  position: relative;

  border: none;
  background: transparent;

  color: #667085;

  cursor: pointer;
}


.notification span {
  position: absolute;

  width: 5px;
  height: 5px;

  top: 1px;
  right: 1px;

  border-radius: 50%;

  background: #D4A72C;
}


.top-avatar {
  width: 29px;
  height: 29px;
}


/* ==============================
   CONTENT
============================== */

.content {
  padding: 26px 28px;
  max-width: 1250px;
}


/* HEADER */

.page-header {
  margin-bottom: 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}


.page-header h1 {
  margin: 0;

  font-size: 19px;
  font-weight: 800;
}


.page-header p {
  margin: 5px 0 0;

  color: #98A2B3;

  font-size: 10px;
}


.new-delivery-button {
  height: 37px;

  padding: 0 15px;

  border: none;
  border-radius: 7px;

  background: #164A3A;
  color: white;

  font-size: 10px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}


.new-delivery-button:hover {
  background: #28745A;
}


/* ==============================
   KPI
============================== */

.kpi-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 11px;

  margin-bottom: 14px;
}


.kpi-card {
  min-height: 78px;

  padding: 13px;

  display: flex;
  align-items: center;

  gap: 12px;

  background: white;

  border: 1px solid #E4EAE7;

  border-radius: 9px;
}


.kpi-icon {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  font-size: 13px;
}


.kpi-icon.total {
  background: #E8F3EE;
  color: #28745A;
}


.kpi-icon.pending {
  background: #FFF3E5;
  color: #E58A32;
}


.kpi-icon.transit {
  background: #EAF2FB;
  color: #3578C7;
}


.kpi-icon.delivered {
  background: #E8F3EE;
  color: #28745A;
}


.kpi-card strong {
  display: block;

  font-size: 18px;
  line-height: 1;
}


.kpi-card span {
  display: block;

  margin-top: 4px;

  font-size: 9px;
  font-weight: 700;
}


.kpi-card small {
  display: block;

  margin-top: 2px;

  color: #98A2B3;

  font-size: 8px;
}


/* ==============================
   GRID
============================== */

.dashboard-grid {
  display: grid;

  grid-template-columns: 2fr 0.8fr;

  gap: 12px;
}


.panel {
  background: white;

  border: 1px solid #E4EAE7;

  border-radius: 9px;

  overflow: hidden;
}


.panel-header {
  padding: 15px 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #EEF2F0;
}


.panel-header h2 {
  margin: 0;

  font-size: 11px;
  font-weight: 800;
}


.panel-header span {
  display: block;

  margin-top: 3px;

  color: #98A2B3;

  font-size: 8px;
}


.view-all {
  border: none;
  background: transparent;

  color: #28745A;

  font-size: 8px;
  font-weight: 700;

  cursor: pointer;
}


/* ==============================
   FORM
============================== */

.form-container {
  margin-bottom: 14px;
}


/* ==============================
   RESUMEN
============================== */

.summary-panel {
  padding-bottom: 14px;
}


.summary-chart {
  display: flex;
  justify-content: center;

  padding: 20px 0 14px;
}


.donut {
  width: 94px;
  height: 94px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    conic-gradient(
      #28745A 0 43%,
      #3578C7 43% 58%,
      #E58A32 58% 78%,
      #D64545 78% 100%
    );

  position: relative;
}


.donut::after {
  content: "";

  position: absolute;

  width: 65px;
  height: 65px;

  border-radius: 50%;

  background: white;
}


.donut strong,
.donut span {
  position: relative;
  z-index: 1;
}


.donut strong {
  font-size: 18px;
}


.donut span {
  margin-top: 1px;

  color: #98A2B3;

  font-size: 8px;
}


.status-list {
  padding: 0 17px;
}


.status-row {
  display: flex;
  justify-content: space-between;

  margin-bottom: 9px;

  color: #667085;

  font-size: 9px;
}


.status-row span {
  display: flex;
  align-items: center;
  gap: 7px;
}


.status-row strong {
  color: #263238;
}


.dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;
}


.delivered-dot {
  background: #28745A;
}


.transit-dot {
  background: #3578C7;
}


.pending-dot {
  background: #E58A32;
}


.incident-warning {
  margin: 13px 15px 0;

  padding: 8px;

  border-radius: 6px;

  background: #FFF0F0;

  color: #D64545;

  font-size: 8px;
}


/* ==============================
   RESPONSIVE
============================== */

@media (max-width: 950px) {

  .sidebar {
    width: 200px;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 650px) {

  .dashboard {
    display: block;
  }

  .sidebar {
    width: 100%;
    min-height: auto;
  }

  .sidebar-logo {
    height: 60px;
  }

  .menu-section {
    display: none;
  }

  .sidebar-user {
    display: none;
  }

  .content {
    padding: 20px 15px;
  }

  .page-header {
    align-items: flex-start;
    gap: 15px;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 17px;
  }

}

</style>