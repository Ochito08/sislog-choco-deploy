<template>
  <Teleport to="body">
    <Transition name="update-modal">
      <div v-if="available" class="update-overlay" role="dialog" aria-modal="true" aria-labelledby="update-title">
        <section class="update-card">
          <div class="update-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v6h-6"/></svg>
          </div>
          <div>
            <span class="update-kicker">SISLOG-CHOCÓ</span>
            <h2 id="update-title">Nueva versión disponible</h2>
            <p>{{ message }}</p>
          </div>
          <div class="update-actions">
            <button class="update-secondary" type="button" @click="snooze">Recordarme en 5 min</button>
            <button class="update-primary" type="button" @click="reload">Actualizar ahora</button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const POLL_MS = 30000
const SNOOZE_MS = 5 * 60 * 1000
const SESSION_KEY = 'sislog_loaded_version'

const available = ref(false)
const message = ref('Hemos publicado mejoras y nuevas funciones. Actualiza para usar la versión más reciente.')
let timer = null
let snoozedUntil = 0
let pendingVersion = ''

async function fetchVersion() {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!response.ok) return
    const data = await response.json()
    const serverVersion = String(data.version || data.build || '').trim()
    if (!serverVersion) return

    const loadedVersion = sessionStorage.getItem(SESSION_KEY)
    if (!loadedVersion) {
      sessionStorage.setItem(SESSION_KEY, serverVersion)
      return
    }

    if (serverVersion !== loadedVersion && Date.now() >= snoozedUntil) {
      pendingVersion = serverVersion
      message.value = data.message || message.value
      available.value = true
    }
  } catch {
    // La comprobación de versión nunca debe bloquear la aplicación.
  }
}

function reload() {
  if (pendingVersion) sessionStorage.setItem(SESSION_KEY, pendingVersion)
  window.location.reload()
}

function snooze() {
  snoozedUntil = Date.now() + SNOOZE_MS
  available.value = false
}

function handleVisibility() {
  if (document.visibilityState === 'visible') fetchVersion()
}

onMounted(() => {
  fetchVersion()
  timer = window.setInterval(fetchVersion, POLL_MS)
  document.addEventListener('visibilitychange', handleVisibility)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
  document.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<style scoped>
.update-overlay{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(3,22,16,.6);backdrop-filter:blur(10px)}
.update-card{width:min(500px,100%);display:grid;grid-template-columns:auto 1fr;gap:18px;padding:24px;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:linear-gradient(145deg,#123f32,#0a2d25);color:#fff;box-shadow:0 30px 90px rgba(0,0,0,.35)}
.update-icon{width:54px;height:54px;display:grid;place-items:center;border-radius:16px;background:#e9b93f;color:#123f32}.update-icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.update-kicker{color:#e9c867;font-size:10px;font-weight:900;letter-spacing:1.4px}.update-card h2{margin:4px 0 7px;font-size:22px}.update-card p{margin:0;color:rgba(255,255,255,.72);font-size:13px;line-height:1.55}
.update-actions{grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;margin-top:4px}.update-actions button{min-height:44px;padding:0 16px;border-radius:12px;font-weight:800;cursor:pointer}.update-secondary{border:1px solid rgba(255,255,255,.18);background:transparent;color:#fff}.update-primary{border:0;background:#e9b93f;color:#123f32}
.update-modal-enter-active,.update-modal-leave-active{transition:opacity .22s ease}.update-modal-enter-active .update-card,.update-modal-leave-active .update-card{transition:transform .22s ease,opacity .22s ease}.update-modal-enter-from,.update-modal-leave-to{opacity:0}.update-modal-enter-from .update-card,.update-modal-leave-to .update-card{transform:translateY(18px) scale(.97);opacity:0}
@media(max-width:560px){.update-card{grid-template-columns:1fr;text-align:center}.update-icon{margin:auto}.update-actions{grid-column:1;flex-direction:column}.update-actions button{width:100%}}
</style>
