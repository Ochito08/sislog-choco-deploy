<template>
  <div class="app-layout" @keydown.esc="closeMenu">
    <aside class="sidebar" :class="{ open: menuOpen }">
      <div class="brand">
        <div class="brand-icon">✦</div>
        <div><strong>SISLOG</strong><span>CHOCÓ</span></div>
      </div>

      <nav id="primary-navigation" class="nav" aria-label="Navegación principal">
        <p>MENÚ PRINCIPAL</p>
        <RouterLink to="/dashboard" class="nav-item" @click="closeMenu"><span aria-hidden="true">▦</span> Dashboard</RouterLink>
        <RouterLink to="/entregas" class="nav-item" @click="closeMenu"><span aria-hidden="true">⇄</span> Entregas</RouterLink>
        <RouterLink v-if="canCreate" to="/entregas/nueva" class="nav-item" @click="closeMenu"><span aria-hidden="true">＋</span> Nueva entrega</RouterLink>
        <RouterLink to="/historial" class="nav-item" @click="closeMenu"><span aria-hidden="true">◷</span> Historial</RouterLink>
        <RouterLink v-if="user?.role === 'Administrador'" to="/usuarios" class="nav-item" @click="closeMenu"><span aria-hidden="true">♙</span> Usuarios</RouterLink>
      </nav>

      <div class="user-box">
        <div class="avatar">{{ initials }}</div>
        <div class="user-text"><strong>{{ user?.name }}</strong><span>{{ user?.role }}</span></div>
        <button class="logout" title="Cerrar sesión" @click="signOut">↪</button>
      </div>
    </aside>

    <div v-if="menuOpen" class="overlay" @click="closeMenu"></div>

    <main class="main">
      <header class="topbar">
        <button ref="menuToggle" class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="primary-navigation" :aria-label="menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'" @click="toggleMenu">☰</button>
        <span>{{ title }}</span>
        <div class="top-user"><div class="avatar small">{{ initials }}</div></div>
      </header>
      <section class="page"><slot /></section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../services/auth'

const props = defineProps({ title: { type: String, default: 'SISLOG-CHOCÓ' } })
const router = useRouter()
const menuOpen = ref(false)
const menuToggle = ref(null)
const user = ref(getCurrentUser())
const canCreate = computed(() => ['Coordinador logístico', 'Administrador'].includes(user.value?.role))
const initials = computed(() => (user.value?.name || 'US').split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase())

function closeMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  nextTick(() => {
    if (menuToggle.value?.getClientRects().length) menuToggle.value.focus()
  })
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu()
    return
  }
  menuOpen.value = true
}

function signOut() { logout(); router.push('/login') }
</script>

<style scoped>
.app-layout { min-height:100vh; display:flex; background:#f7f8f5; color:#263238; }
.sidebar { width:240px; min-height:100vh; position:fixed; inset:0 auto 0 0; z-index:30; display:flex; flex-direction:column; background:#164a3a; color:#fff; }
.brand { height:78px; display:flex; align-items:center; gap:11px; padding:0 20px; border-bottom:1px solid rgba(255,255,255,.09); }
.brand-icon,.avatar { display:grid; place-items:center; flex:0 0 auto; background:#d4a72c; color:#164a3a; font-weight:800; }
.brand-icon { width:35px; height:35px; border-radius:9px; }
.brand strong { display:block; font-size:14px; letter-spacing:.5px; }.brand span { display:block; color:#d4a72c; font-size:10px; font-weight:800; letter-spacing:1.5px; }
.nav { flex:1; padding:24px 12px; }.nav p { margin:0 10px 10px; color:rgba(255,255,255,.4); font-size:9px; font-weight:800; letter-spacing:1px; }
.nav-item { display:flex; align-items:center; gap:11px; margin-bottom:4px; padding:11px 12px; border-radius:8px; color:rgba(255,255,255,.72); text-decoration:none; font-size:12px; transition:.18s; }.nav-item:hover,.nav-item.router-link-active { background:rgba(255,255,255,.12); color:#fff; font-weight:700; }.nav-item span { width:18px; text-align:center; }
.user-box { display:flex; align-items:center; gap:9px; padding:14px; border-top:1px solid rgba(255,255,255,.09); }.avatar { width:34px; height:34px; border-radius:50%; font-size:10px; }.avatar.small { width:30px; height:30px; }.user-text { min-width:0; flex:1; }.user-text strong,.user-text span { display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }.user-text strong { font-size:10px; }.user-text span { margin-top:2px; color:rgba(255,255,255,.5); font-size:8px; }.logout { border:0; background:transparent; color:rgba(255,255,255,.6); cursor:pointer; font-size:17px; }
.main { width:calc(100% - 240px); min-height:100vh; margin-left:240px; }.topbar { height:58px; padding:0 24px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:20; background:#fff; border-bottom:1px solid #e4eae7; color:#667085; font-size:11px; }.menu-toggle { display:none; border:0; background:transparent; font-size:20px; }.page { width:100%; max-width:1280px; padding:28px; }.overlay { display:none; }
@media (max-width:800px){.sidebar{transform:translateX(-100%);transition:.2s}.sidebar.open{transform:translateX(0)}.main{width:100%;margin-left:0}.menu-toggle{display:block}.overlay{display:block;position:fixed;inset:0;z-index:25;background:rgba(0,0,0,.35)}.page{padding:20px 14px}.topbar{padding:0 14px}}
.nav-item{position:relative;min-height:42px;transition:background .18s ease,color .18s ease}
.nav-item.router-link-active{background:rgba(255,255,255,.14);color:#fff;font-weight:700}
.nav-item.router-link-active::before{position:absolute;inset:9px auto 9px 0;width:3px;border-radius:0 3px 3px 0;background:#d4a72c;content:""}
.menu-toggle{width:40px;height:40px;display:none;place-items:center;border-radius:7px;color:#164a3a;cursor:pointer}
.menu-toggle:hover{background:#f4f7f5}
.logout{width:36px;height:36px;border-radius:7px}
.logout:hover{background:rgba(255,255,255,.1);color:#fff}
.sidebar{overflow-y:auto}
.page{margin:0 auto}
:focus-visible{outline:3px solid #6aa4dc;outline-offset:3px}
@media(max-width:800px){.menu-toggle{display:grid}.sidebar{overflow-y:auto}}
@media(max-width:520px){.brand{height:70px}.nav{padding:18px 12px}.topbar{height:54px}.page{padding:18px 12px}}
</style>
