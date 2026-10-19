<template>
  <div class="app-shell" @keydown.esc="closeMenu">
    <aside
      class="sidebar"
      :class="{ 'sidebar--open': menuOpen }"
      aria-label="Navegación principal"
    >
      <div class="brand">
        <div class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 2.5 14.4 8l5.1 2.2-5.1 2.2L12 18l-2.4-5.6-5.1-2.2L9.6 8 12 2.5Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div class="brand-copy">
          <strong>SISLOG</strong>
          <span>CHOCÓ</span>
        </div>
      </div>

      <div class="sidebar-body">
        <div class="workspace-label">
          <span class="workspace-dot"></span>

          <div>
            <strong>Gestión humanitaria</strong>
            <span>Sistema logístico</span>
          </div>
        </div>

        <nav
          id="primary-navigation"
          class="nav"
          aria-label="Menú principal"
        >
          <p class="nav-title">
            MENÚ PRINCIPAL
          </p>

          <RouterLink
            to="/dashboard"
            class="nav-item"
            @click="closeMenu"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
              </svg>
            </span>

            <span>Dashboard</span>
          </RouterLink>

          <RouterLink
            to="/entregas"
            class="nav-item"
            @click="closeMenu"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 7h13" />
                <path d="m14 4 3 3-3 3" />
                <path d="M20 17H7" />
                <path d="m10 14-3 3 3 3" />
              </svg>
            </span>

            <span>Entregas</span>
          </RouterLink>

          <RouterLink
            v-if="canCreate"
            to="/entregas/nueva"
            class="nav-item"
            @click="closeMenu"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </span>

            <span>Nueva entrega</span>
          </RouterLink>

          <RouterLink
            to="/historial"
            class="nav-item"
            @click="closeMenu"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
            </span>

            <span>Historial</span>
          </RouterLink>

          <RouterLink
            v-if="user?.role === 'Administrador'"
            to="/usuarios"
            class="nav-item"
            @click="closeMenu"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />
                <circle cx="17.5" cy="9.5" r="2" />
                <path d="M16 14.5c2.7 0 4.2 1.4 4.5 4" />
              </svg>
            </span>

            <span>Usuarios</span>
          </RouterLink>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="avatar">
            {{ initials }}
          </div>

          <div class="user-info">
            <strong>
              {{ user?.name || 'Usuario' }}
            </strong>

            <span>
              {{ user?.role || 'Sin rol' }}
            </span>
          </div>

          <button
            type="button"
            class="logout-button"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            @click="signOut"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
              <path d="M14 8l4 4-4 4" />
              <path d="M18 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <button
      v-if="menuOpen"
      type="button"
      class="overlay"
      aria-label="Cerrar menú"
      @click="closeMenu"
    ></button>

    <main class="main">
      <header class="topbar">
        <div class="topbar-left">
          <button
            ref="menuToggle"
            type="button"
            class="menu-toggle"
            :aria-expanded="menuOpen"
            aria-controls="primary-navigation"
            :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
            @click="toggleMenu"
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>

          <div class="page-context">
            <span class="context-label">
              SISLOG-CHOCÓ
            </span>

            <strong>
              {{ title }}
            </strong>
          </div>
        </div>

        <div class="topbar-right">
          <div class="system-status">
            <span class="status-dot"></span>
            Sistema operativo
          </div>

          <button
            type="button"
            class="theme-toggle"
            :aria-label="
              isDark
                ? 'Cambiar a modo claro'
                : 'Cambiar a modo oscuro'
            "
            :title="
              isDark
                ? 'Modo claro'
                : 'Modo oscuro'
            "
            @click="toggleTheme"
          >
            <span class="theme-icon">
              <!-- SOL -->
              <svg
                v-if="isDark"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>

              <!-- LUNA -->
              <svg
                v-else
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"
                />
              </svg>
            </span>

            <span class="theme-label">
              {{ isDark ? 'Claro' : 'Oscuro' }}
            </span>
          </button>

          <div class="top-user">
            <div class="top-user-copy">
              <strong>
                {{ firstName }}
              </strong>

              <span>
                {{ shortRole }}
              </span>
            </div>

            <div class="avatar avatar--top">
              {{ initials }}
            </div>
          </div>
        </div>
      </header>

      <section class="page">
        <slot />
      </section>
    </main>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onMounted,
  ref
} from 'vue'

import { useRouter } from 'vue-router'

import {
  getCurrentUser,
  logout
} from '../services/auth'

defineProps({
  title: {
    type: String,
    default: 'SISLOG-CHOCÓ'
  }
})

const router = useRouter()

const menuOpen = ref(false)
const menuToggle = ref(null)
const user = ref(getCurrentUser())

const THEME_KEY = 'sislog_theme'

const isDark = ref(false)

const canCreate = computed(() =>
  [
    'Coordinador logístico',
    'Administrador'
  ].includes(user.value?.role)
)

const initials = computed(() => {
  const name = user.value?.name || 'Usuario'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
})

const firstName = computed(() =>
  (user.value?.name || 'Usuario')
    .split(' ')
    .filter(Boolean)[0]
)

const shortRole = computed(() => {
  const role = user.value?.role || ''

  const names = {
    'Coordinador logístico': 'Coordinador',
    'Responsable de transporte': 'Transporte',
    'Responsable del punto receptor': 'Punto receptor',
    Administrador: 'Administrador'
  }

  return names[role] || role
})

function applyTheme(theme) {
  const value =
    theme === 'dark'
      ? 'dark'
      : 'light'

  document.documentElement.setAttribute(
    'data-theme',
    value
  )

  isDark.value = value === 'dark'
}

function loadTheme() {
  const savedTheme =
    localStorage.getItem(THEME_KEY)

  if (
    savedTheme === 'dark' ||
    savedTheme === 'light'
  ) {
    applyTheme(savedTheme)
    return
  }

  const prefersDark =
    window.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches

  applyTheme(
    prefersDark
      ? 'dark'
      : 'light'
  )
}

function toggleTheme() {
  const newTheme =
    isDark.value
      ? 'light'
      : 'dark'

  localStorage.setItem(
    THEME_KEY,
    newTheme
  )

  applyTheme(newTheme)
}

function closeMenu() {
  if (!menuOpen.value) return

  menuOpen.value = false

  nextTick(() => {
    if (
      menuToggle.value?.getClientRects().length
    ) {
      menuToggle.value.focus()
    }
  })
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu()
    return
  }

  menuOpen.value = true
}

function signOut() {
  logout()
  router.push('/login')
}

onMounted(() => {
  loadTheme()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-shell {
  --sidebar-width: 282px;

  min-height: 100vh;
  display: flex;

  background:
    radial-gradient(
      circle at 82% 0%,
      rgba(31, 119, 88, 0.045),
      transparent 30%
    ),
    var(--bg-app);

  color: var(--text-primary);

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

/* ===============================
   SIDEBAR
   =============================== */

.sidebar {
  width: var(--sidebar-width);
  min-height: 100vh;

  position: fixed;
  inset: 0 auto 0 0;
  z-index: 40;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  background: var(--sidebar-bg);
  color: #ffffff;

  box-shadow:
    14px 0 40px rgba(12, 42, 32, 0.08);
}

.brand {
  min-height: 94px;

  display: flex;
  align-items: center;

  gap: 14px;

  padding: 0 24px;

  border-bottom:
    1px solid rgba(255, 255, 255, 0.08);
}

.brand-mark {
  width: 46px;
  height: 46px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 14px;

  background:
    linear-gradient(
      145deg,
      #f1c249,
      #d99e15
    );

  color: #104a38;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.15);
}

.brand-mark svg {
  width: 25px;
  height: 25px;
}

.brand-copy strong,
.brand-copy span {
  display: block;
}

.brand-copy strong {
  font-size: 19px;
  font-weight: 900;
  letter-spacing: 0.4px;
}

.brand-copy span {
  margin-top: 2px;

  color: #f4c94e;

  font-size: 12px;
  font-weight: 900;

  letter-spacing: 1.7px;
}

.sidebar-body {
  flex: 1;
  padding: 22px 14px;
}

.workspace-label {
  min-height: 58px;

  display: flex;
  align-items: center;

  gap: 11px;

  margin: 0 7px 24px;
  padding: 10px 13px;

  border:
    1px solid rgba(255, 255, 255, 0.08);

  border-radius: 13px;

  background:
    rgba(255, 255, 255, 0.055);
}

.workspace-label > div {
  min-width: 0;
}

.workspace-label strong,
.workspace-label span {
  display: block;
}

.workspace-label strong {
  color:
    rgba(255, 255, 255, 0.84);

  font-size: 13px;
  font-weight: 750;
}

.workspace-label span {
  margin-top: 2px;

  color:
    rgba(255, 255, 255, 0.43);

  font-size: 11px;
}

.workspace-dot {
  width: 9px;
  height: 9px;

  flex: 0 0 auto;

  border-radius: 50%;

  background: #63d9a5;

  box-shadow:
    0 0 0 5px rgba(99, 217, 165, 0.11);
}

.nav-title {
  margin: 0 13px 11px;

  color:
    rgba(255, 255, 255, 0.4);

  font-size: 11px;
  font-weight: 900;

  letter-spacing: 1.3px;
}

.nav-item {
  min-height: 52px;

  display: flex;
  align-items: center;

  gap: 13px;

  position: relative;

  margin-bottom: 6px;
  padding: 0 14px;

  border-radius: 12px;

  color:
    rgba(255, 255, 255, 0.72);

  text-decoration: none;

  font-size: 15px;
  font-weight: 600;

  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.nav-item:hover {
  background:
    rgba(255, 255, 255, 0.075);

  color: #ffffff;

  transform: translateX(2px);
}

.nav-item.router-link-active {
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.08)
    );

  color: #ffffff;

  font-weight: 750;

  box-shadow:
    inset 0 0 0 1px
    rgba(255, 255, 255, 0.035);
}

.nav-item.router-link-active::before {
  width: 4px;

  position: absolute;

  inset:
    10px auto
    10px 0;

  border-radius:
    0 5px 5px 0;

  background:
    var(--color-accent);

  content: "";
}

.nav-icon {
  width: 31px;
  height: 31px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 9px;

  color:
    rgba(255, 255, 255, 0.64);
}

.nav-icon svg {
  width: 19px;
  height: 19px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-item.router-link-active .nav-icon {
  background:
    rgba(255, 255, 255, 0.08);

  color: #f6ca4d;
}

/* ===============================
   USUARIO SIDEBAR
   =============================== */

.sidebar-footer {
  padding: 14px;

  border-top:
    1px solid rgba(255, 255, 255, 0.08);
}

.user-card {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 11px;

  border:
    1px solid rgba(255, 255, 255, 0.07);

  border-radius: 14px;

  background:
    rgba(255, 255, 255, 0.055);
}

.avatar {
  width: 41px;
  height: 41px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border-radius: 12px;

  background:
    linear-gradient(
      145deg,
      #efbf42,
      #d79d15
    );

  color: #114936;

  font-size: 12px;
  font-weight: 900;

  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.11);
}

.user-info {
  min-width: 0;
  flex: 1;
}

.user-info strong,
.user-info span {
  display: block;

  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-info strong {
  color: #ffffff;

  font-size: 13px;
  font-weight: 800;
}

.user-info span {
  margin-top: 3px;

  color:
    rgba(255, 255, 255, 0.5);

  font-size: 11px;
}

.logout-button {
  width: 39px;
  height: 39px;

  display: grid;
  place-items: center;

  flex: 0 0 auto;

  border: 0;
  border-radius: 10px;

  background: transparent;

  color:
    rgba(255, 255, 255, 0.58);

  cursor: pointer;

  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.logout-button:hover {
  background:
    rgba(255, 255, 255, 0.1);

  color: #ffffff;
}

.logout-button svg {
  width: 19px;
  height: 19px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ===============================
   MAIN
   =============================== */

.main {
  width:
    calc(
      100% - var(--sidebar-width)
    );

  min-height: 100vh;

  margin-left:
    var(--sidebar-width);
}

/* ===============================
   TOPBAR
   =============================== */

.topbar {
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  position: sticky;
  top: 0;

  z-index: 25;

  padding: 0 30px;

  border-bottom:
    1px solid var(--border-color);

  background:
    var(--topbar-bg);

  backdrop-filter: blur(16px);

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.topbar-left,
.topbar-right,
.top-user {
  display: flex;
  align-items: center;
}

.topbar-left {
  min-width: 0;
  gap: 13px;
}

.topbar-right {
  gap: 14px;
}

.page-context {
  min-width: 0;
}

.context-label {
  display: block;

  margin-bottom: 2px;

  color: var(--text-muted);

  font-size: 11px;
  font-weight: 850;

  letter-spacing: 1.05px;
}

.page-context strong {
  display: block;

  overflow: hidden;

  color: var(--text-primary);

  font-size: 15px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===============================
   ESTADO SISTEMA
   =============================== */

.system-status {
  display: flex;
  align-items: center;

  gap: 8px;

  min-height: 38px;

  padding: 0 12px;

  border:
    1px solid var(--border-color);

  border-radius: 999px;

  background:
    var(--bg-surface-secondary);

  color:
    var(--text-secondary);

  font-size: 12px;
  font-weight: 650;
}

.status-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #2aab75;

  box-shadow:
    0 0 0 4px
    rgba(42, 171, 117, 0.1);
}

/* ===============================
   BOTÓN TEMA
   =============================== */

.theme-toggle {
  min-height: 42px;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 0 12px;

  border:
    1px solid var(--border-color);

  border-radius: 11px;

  background:
    var(--bg-surface);

  color:
    var(--text-secondary);

  cursor: pointer;

  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.theme-toggle:hover {
  background:
    var(--bg-surface-secondary);

  color:
    var(--text-primary);

  transform: translateY(-1px);
}

.theme-icon {
  width: 26px;
  height: 26px;

  display: grid;
  place-items: center;

  border-radius: 8px;

  background:
    var(--color-primary-soft);

  color:
    var(--color-primary);
}

.theme-icon svg {
  width: 16px;
  height: 16px;

  fill: none;
  stroke: currentColor;

  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.theme-label {
  font-size: 12px;
  font-weight: 750;
}

/* ===============================
   USUARIO TOPBAR
   =============================== */

.top-user {
  gap: 10px;
}

.top-user-copy {
  text-align: right;
}

.top-user-copy strong,
.top-user-copy span {
  display: block;
}

.top-user-copy strong {
  color:
    var(--text-primary);

  font-size: 13px;
  font-weight: 800;
}

.top-user-copy span {
  margin-top: 2px;

  color:
    var(--text-muted);

  font-size: 11px;
}

.avatar--top {
  width: 40px;
  height: 40px;

  border-radius: 12px;
}

/* ===============================
   BOTÓN MENÚ MÓVIL
   =============================== */

.menu-toggle {
  width: 42px;
  height: 42px;

  display: none;
  place-items: center;

  border:
    1px solid var(--border-color);

  border-radius: 11px;

  background:
    var(--bg-surface);

  color:
    var(--color-primary);

  cursor: pointer;
}

.menu-toggle:hover {
  background:
    var(--bg-surface-secondary);
}

.menu-toggle svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;

  stroke-width: 2;
  stroke-linecap: round;
}

/* ===============================
   CONTENIDO
   =============================== */

.page {
  width: 100%;

  max-width: 1500px;

  margin: 0 auto;

  padding:
    34px
    36px
    46px;
}

.overlay {
  display: none;
}

:focus-visible {
  outline:
    3px solid
    rgba(75, 151, 218, 0.55);

  outline-offset: 3px;
}

/* ===============================
   RESPONSIVE
   =============================== */

@media (max-width: 1100px) {
  .system-status {
    display: none;
  }
}

@media (max-width: 900px) {
  .sidebar {
    transform:
      translateX(-105%);

    transition:
      transform 0.22s ease;
  }

  .sidebar--open {
    transform:
      translateX(0);
  }

  .main {
    width: 100%;
    margin-left: 0;
  }

  .menu-toggle {
    display: grid;
  }

  .overlay {
    display: block;

    position: fixed;
    inset: 0;

    z-index: 35;

    border: 0;

    background:
      rgba(11, 31, 24, 0.52);

    backdrop-filter:
      blur(3px);
  }

  .page {
    padding:
      26px
      20px
      38px;
  }

  .topbar {
    padding:
      0 20px;
  }
}

@media (max-width: 650px) {
  .topbar {
    height: 68px;

    padding:
      0 13px;
  }

  .theme-label {
    display: none;
  }

  .theme-toggle {
    width: 42px;
    padding: 0;
    justify-content: center;
  }

  .top-user-copy {
    display: none;
  }

  .context-label {
    display: none;
  }

  .page {
    padding:
      22px
      13px
      34px;
  }

  .sidebar {
    width:
      min(
        290px,
        88vw
      );
  }
}

@media (max-width: 430px) {
  .topbar-right {
    gap: 8px;
  }

  .avatar--top {
    width: 37px;
    height: 37px;
  }
}
</style>