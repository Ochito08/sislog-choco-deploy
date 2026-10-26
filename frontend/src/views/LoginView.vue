<template>
  <section class="login-page">
    <main class="login-shell">
      <aside class="story-panel">
        <div class="story-orbit story-orbit-one" aria-hidden="true"></div>
        <div class="story-orbit story-orbit-two" aria-hidden="true"></div>

        <div class="brand" aria-label="SISLOG-CHOCÓ">
          <span class="brand-icon" aria-hidden="true">✦</span>
          <div class="brand-name"><strong>SISLOG</strong><span>CHOCÓ</span></div>
        </div>

        <div class="story-content">
          <p class="eyebrow"><span class="eyebrow-line"></span> GESTIÓN HUMANITARIA</p>
          <h1>Organizar la ayuda es <em>transformar vidas.</em></h1>
          <p class="story-description">Una plataforma para coordinar, registrar y dar seguimiento a las entregas humanitarias en las comunidades del Chocó.</p>

          <div class="story-highlight">
            <span class="highlight-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5 5L20 6" /></svg>
            </span>
            <div>
              <strong>Ayuda que llega más lejos</strong>
              <p>Información organizada para una logística más eficiente y transparente.</p>
            </div>
          </div>
        </div>

        <div class="story-footer"><span class="footer-dot" aria-hidden="true"></span>Sistema de apoyo a la gestión humanitaria</div>
      </aside>

      <section class="form-panel" aria-labelledby="login-title">
        <div class="mobile-brand" aria-label="SISLOG-CHOCÓ"><span class="mobile-brand-icon" aria-hidden="true">✦</span><strong>SISLOG<span>CHOCÓ</span></strong></div>

        <div class="form-content">
          <div class="access-tag"><span aria-hidden="true"></span> ACCESO AL SISTEMA</div>
          <header class="form-heading">
            <h2 id="login-title">Bienvenido de nuevo<span class="heading-point">.</span></h2>
            <p>Ingresa tus datos para continuar con la gestión de las ayudas humanitarias.</p>
          </header>

          <div v-if="route.query.session === 'unavailable'" class="form-error" role="alert">
            <div>
              <p>No pudimos verificar tu sesión. Puedes reintentarlo sin perderla o iniciar sesión de nuevo.</p>
              <button class="visibility-button session-retry" type="button" :disabled="loading" @click="retrySession">Reintentar sesión</button>
            </div>
          </div>
          <form class="login-form" @submit.prevent="submit" :aria-busy="loading">
            <div class="field">
              <label for="login-email">Correo electrónico</label>
              <div class="input-wrap">
                <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>
                <input id="login-email" v-model.trim="email" type="email" autocomplete="username" inputmode="email" placeholder="nombre@correo.com" required :disabled="loading" />
              </div>
            </div>

            <div class="field">
              <label for="login-password">Contraseña</label>
              <div class="input-wrap password-wrap">
                <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>
                <input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Ingresa tu contraseña" required :disabled="loading" />
                <button class="visibility-button" type="button" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword" :disabled="loading" @click="showPassword = !showPassword">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</button>
              </div>
            </div>

            <p v-if="error" class="form-error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
              {{ error }}
            </p>

            <button class="login-button" type="submit" :disabled="loading">
              <span>{{ loading ? 'Iniciando sesión...' : 'Ingresar al sistema' }}</span>
              <span v-if="loading" class="spinner" aria-hidden="true"></span>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </button>
          </form>

        </div>

        <footer class="form-footer">SISLOG-CHOCÓ <span aria-hidden="true">•</span> Plataforma de gestión humanitaria</footer>
      </section>
    </main>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login, refreshCurrentUser } from '../services/auth'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
async function retrySession() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    await refreshCurrentUser()
    await router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
button.session-retry{position:static;transform:none;padding:6px 10px;background:#fff}
.login-page{--ink:#173d32;--green:#164a3a;--gold:#d4a72c;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:clamp(16px,4vw,48px);background:radial-gradient(circle at 7% 12%,#e1efe7 0,transparent 34%),radial-gradient(circle at 90% 88%,#eee9d5 0,transparent 34%),#f5f7f3;color:#1b3029}
.login-shell{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.02fr);width:min(1100px,100%);min-height:min(700px,calc(100dvh - 56px));overflow:hidden;border:1px solid #e6ebe6;border-radius:26px;background:#fff;box-shadow:0 30px 90px rgba(21,61,45,.13),0 4px 18px rgba(21,61,45,.04)}
.story-panel{position:relative;isolation:isolate;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;padding:clamp(34px,4.3vw,58px);background:linear-gradient(152deg,#164a3a 0%,#113c30 58%,#0c2b26 100%);color:#fff}
.story-panel::after{position:absolute;inset:auto -110px -210px auto;width:440px;height:440px;border:1px solid rgba(218,191,91,.18);border-radius:50%;content:"";z-index:-1}
.story-orbit{position:absolute;z-index:-1;border:1px solid rgba(255,255,255,.09);border-radius:50%;pointer-events:none}
.story-orbit-one{right:-180px;top:16%;width:410px;height:410px}.story-orbit-two{right:-108px;top:23%;width:295px;height:295px}
.brand{display:flex;align-items:center;gap:12px;width:max-content}.brand-icon,.mobile-brand-icon{display:grid;place-items:center;flex:none;width:42px;height:42px;border-radius:13px;background:#d4a72c;color:#164a3a;font-size:25px;box-shadow:0 4px 18px rgba(0,0,0,.09)}
.brand-name{display:grid;gap:1px}.brand-name strong{font-size:18px;letter-spacing:.06em;line-height:1}.brand-name span{font-size:11px;letter-spacing:.22em;color:#d9c46e;font-weight:800}
.story-content{position:relative;margin:48px 0 30px;max-width:430px}.eyebrow{display:flex;align-items:center;gap:11px;margin:0 0 22px;color:#dfc76f;letter-spacing:.18em;font-size:11px;font-weight:800}.eyebrow-line{width:28px;height:2px;background:#d4a72c}
.story-content h1{margin:0;font-size:clamp(37px,4vw,55px);font-weight:800;line-height:1.13;letter-spacing:-.045em}.story-content h1 em{color:#dfc76f;font-style:normal}
.story-description{max-width:385px;margin:24px 0 0;color:#c4d7cc;font-size:15px;line-height:1.8}
.story-highlight{display:flex;align-items:flex-start;gap:14px;margin-top:44px;padding:20px 21px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.075);backdrop-filter:blur(8px)}
.highlight-icon{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:rgba(219,184,77,.17);color:#f0d579}.highlight-icon svg{width:20px;height:20px}.story-highlight strong{font-size:14px}.story-highlight p{margin:6px 0 0;font-size:12px;line-height:1.7;color:#c4d7cc}
.story-footer{display:flex;align-items:center;gap:10px;font-size:11px;color:#b2cbc0}.footer-dot,.access-tag>span{width:7px;height:7px;border-radius:50%;background:#d4a72c}
.form-panel{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:0;padding:44px clamp(32px,5.1vw,72px) 24px}.form-content{width:100%;max-width:405px;margin:auto 0}.mobile-brand{display:none}
.access-tag{display:flex;align-items:center;gap:9px;width:max-content;padding:9px 13px;border-radius:999px;background:#eaf3ee;color:#286d52;font-weight:800;font-size:10px;letter-spacing:.11em}.access-tag>span{background:#2f936b}
.form-heading{margin-top:27px}.form-heading h2{margin:0;max-width:420px;font-size:clamp(29px,3vw,37px);letter-spacing:-.04em;line-height:1.2;color:#183b30}.heading-point{color:#d4a72c}.form-heading p{margin:14px 0 0;color:#718078;font-size:14px;line-height:1.75}
.login-form{margin-top:32px}.field+.field{margin-top:21px}.field label{display:block;margin-bottom:9px;font-size:13px;font-weight:750;color:#24463a}.input-wrap{position:relative}.field-icon{position:absolute;left:15px;top:50%;width:19px;height:19px;color:#8ea49a;transform:translateY(-50%);pointer-events:none}.input-wrap input{display:block;width:100%;height:53px;padding:0 16px 0 46px;border:1px solid #dce5df;border-radius:11px;outline:none;background:#fbfcfa;color:#183b30;font-size:14px;transition:border-color .16s,box-shadow .16s,background .16s}.input-wrap input::placeholder{color:#a3afa7}.input-wrap input:hover{border-color:#b8ccc1}.input-wrap input:focus{border-color:#29815f;background:#fff;box-shadow:0 0 0 4px rgba(41,129,95,.11)}.input-wrap input:disabled{opacity:.65}.password-wrap input{padding-right:92px}
.visibility-button{position:absolute;top:50%;right:9px;transform:translateY(-50%);min-width:66px;min-height:36px;border:0;border-radius:7px;background:transparent;color:#28745a;font-size:12px;font-weight:750;cursor:pointer}.visibility-button:hover{background:#eaf3ee}.visibility-button:disabled{opacity:.5;cursor:not-allowed}
.form-error{display:flex;gap:9px;align-items:flex-start;margin:20px 0 0;padding:13px 14px;border:1px solid #f5c9c7;border-radius:10px;background:#fff5f3;color:#a63831;font-size:13px;line-height:1.5}.form-error svg{flex:none;width:19px;height:19px;margin-top:1px}
.login-button{display:flex;align-items:center;justify-content:space-between;width:100%;height:53px;margin-top:26px;padding:0 19px;border:0;border-radius:11px;background:#164a3a;color:#fff;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 10px 25px rgba(22,74,58,.18);transition:background .16s,transform .16s,box-shadow .16s}.login-button svg{width:21px;height:21px}.login-button:not(:disabled):hover{background:#23775a;transform:translateY(-1px);box-shadow:0 13px 27px rgba(22,74,58,.21)}.login-button:disabled{opacity:.7;cursor:wait}.spinner{width:19px;height:19px;border:2px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.form-footer{align-self:center;margin-top:36px;color:#98a59b;text-align:center;font-size:11px;line-height:1.6}.form-footer span{margin:0 5px}
:focus-visible{outline:3px solid #d4a72c;outline-offset:3px}
@media(max-width:860px){.story-panel{padding:35px 29px}.story-content h1{font-size:36px}.form-panel{padding:40px 28px 22px}}
@media(max-width:720px){.login-page{display:block;padding:0;background:#fff}.login-shell{display:block;min-height:100dvh;border:0;border-radius:0;box-shadow:none}.story-panel{display:none}.form-panel{min-height:100dvh;align-items:stretch;padding:28px clamp(23px,7vw,48px) 22px}.mobile-brand{display:flex;align-items:center;gap:11px;margin-bottom:42px;color:#164a3a}.mobile-brand-icon{width:38px;height:38px;border-radius:11px;font-size:22px}.mobile-brand strong{display:grid;font-size:15px;line-height:1.1;letter-spacing:.05em}.mobile-brand strong span{font-size:10px;letter-spacing:.19em;color:#b59128}.form-content{max-width:430px;margin:0 auto}.form-footer{margin-top:auto;padding-top:40px}}
@media(max-width:380px){.form-panel{padding:24px 20px 18px}.mobile-brand{margin-bottom:30px}.form-heading{margin-top:20px}.form-heading h2{font-size:28px}.form-heading p{font-size:13px}.login-form{margin-top:26px}}
@media(prefers-reduced-motion:reduce){.spinner{animation:none}.login-button,.input-wrap input{transition:none}}
</style>
