<template>
  <section class="login-page">
    <div class="login-container">

      <!-- PANEL IZQUIERDO -->
      <div class="brand-panel">
        <div class="brand-content">

          <div class="brand-logo">
            <span class="logo-icon">✦</span>
            <span>CHOCÓ</span>
          </div>

          <div class="brand-text">
            <p class="eyebrow">SISTEMA DE GESTIÓN</p>

            <h1>
              SISLOG-<span>CHOCÓ</span>
            </h1>

            <p class="description">
              Gestión logística de ayudas humanitarias
              para comunidades del Chocó.
            </p>
          </div>

          <div class="info-box">
            <div class="info-icon">✓</div>

            <div>
              <strong>Logística organizada</strong>
              <p>
                Registra, asigna y realiza seguimiento
                a las entregas humanitarias.
              </p>
            </div>
          </div>

        </div>

        <div class="brand-footer">
          Sistema de apoyo a la gestión humanitaria
        </div>
      </div>


      <!-- PANEL DERECHO -->
      <div class="form-panel">

        <div class="form-container">

          <div class="mobile-logo">
            <div class="mobile-logo-icon">✦</div>
            <strong>SISLOG-CHOCÓ</strong>
          </div>

          <div class="form-header">
            <p class="welcome">BIENVENIDO</p>

            <h2>Iniciar sesión</h2>

            <p>
              Ingresa tus credenciales para acceder
              al sistema de gestión.
            </p>
          </div>


          <form @submit.prevent="handleLogin">

            <!-- CORREO -->
            <div class="field">

              <label class="label">
                Correo electrónico
              </label>

              <div class="control has-icon">

                <span class="input-icon">✉</span>

                <input
                  v-model="email"
                  class="input custom-input"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                >

              </div>

            </div>


            <!-- CONTRASEÑA -->
            <div class="field">

              <div class="password-label">
                <label class="label">
                  Contraseña
                </label>

                <a href="#" @click.prevent>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div class="control has-icon">

                <span class="input-icon">●</span>

                <input
                  v-model="password"
                  class="input custom-input"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Ingresa tu contraseña"
                  required
                >

                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="
                    showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  "
                >
                  {{ showPassword ? '◉' : '○' }}
                </button>

              </div>

            </div>


            <!-- RECORDAR -->
            <div class="remember-row">

              <label class="checkbox remember">
                <input
                  v-model="remember"
                  type="checkbox"
                >
                <span>Recordar sesión</span>
              </label>

            </div>


            <!-- BOTÓN -->
            <button
              type="submit"
              class="button login-button"
            >
              <span>Ingresar al sistema</span>
              <span class="arrow">→</span>
            </button>

          </form>


          <div class="security-message">
            <span>🔒</span>
            <span>Acceso seguro al sistema</span>
          </div>

          <div class="form-footer">
            SISLOG-CHOCÓ · Sistema de Gestión Logística
          </div>

        </div>

      </div>

    </div>
  </section>
</template>


<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

function handleLogin() {
  emit('login')
}
</script>


<style scoped>

* {
  box-sizing: border-box;
}


/* =========================
   PÁGINA PRINCIPAL
========================= */

.login-page {
  min-height: 100vh;
  background: #F7F8F5;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 24px;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  color: #263238;
}


/* =========================
   CONTENEDOR
========================= */

.login-container {
  width: 100%;
  max-width: 1050px;
  min-height: 650px;

  display: grid;
  grid-template-columns: 44% 56%;

  background: #FFFFFF;

  border-radius: 22px;

  overflow: hidden;

  box-shadow:
    0 20px 60px rgba(22, 74, 58, 0.12),
    0 4px 15px rgba(0, 0, 0, 0.04);
}


/* =========================
   PANEL VERDE
========================= */

.brand-panel {
  position: relative;

  background: #164A3A;

  color: #FFFFFF;

  padding: 52px 46px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow: hidden;
}


/* Decoración */

.brand-panel::before {
  content: "";

  position: absolute;

  width: 320px;
  height: 320px;

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 50%;

  right: -150px;
  top: -110px;
}

.brand-panel::after {
  content: "";

  position: absolute;

  width: 260px;
  height: 260px;

  border: 1px solid rgba(212,167,44,0.12);

  border-radius: 50%;

  left: -150px;
  bottom: -100px;
}


/* =========================
   MARCA
========================= */

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 14px;
  font-weight: 700;

  letter-spacing: 1.5px;

  position: relative;
  z-index: 2;
}

.logo-icon {
  width: 34px;
  height: 34px;

  border-radius: 9px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #D4A72C;

  color: #164A3A;

  font-size: 18px;
}


/* =========================
   TEXTO
========================= */

.brand-text {
  position: relative;
  z-index: 2;

  margin-top: 80px;
}

.eyebrow {
  color: #D4A72C;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 2px;

  margin-bottom: 12px;
}

.brand-text h1 {
  margin: 0;

  font-size: 42px;
  line-height: 1.1;

  font-weight: 800;

  letter-spacing: -1px;
}

.brand-text h1 span {
  color: #D4A72C;
}

.description {
  max-width: 340px;

  margin-top: 22px;

  color: rgba(255,255,255,0.76);

  font-size: 15px;
  line-height: 1.7;
}


/* =========================
   INFO BOX
========================= */

.info-box {
  position: relative;
  z-index: 2;

  display: flex;
  gap: 14px;

  margin-top: 48px;

  padding: 17px;

  border-radius: 12px;

  background: rgba(255,255,255,0.07);

  border: 1px solid rgba(255,255,255,0.09);
}

.info-icon {
  min-width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #28745A;

  font-size: 13px;
}

.info-box strong {
  font-size: 13px;
}

.info-box p {
  margin-top: 4px;

  color: rgba(255,255,255,0.62);

  font-size: 11px;
  line-height: 1.5;
}


/* =========================
   FOOTER VERDE
========================= */

.brand-footer {
  position: relative;
  z-index: 2;

  color: rgba(255,255,255,0.45);

  font-size: 10px;

  letter-spacing: 0.3px;
}


/* =========================
   PANEL FORMULARIO
========================= */

.form-panel {
  background: #FFFFFF;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 50px;
}

.form-container {
  width: 100%;
  max-width: 410px;
}


/* =========================
   HEADER
========================= */

.form-header {
  margin-bottom: 35px;
}

.welcome {
  margin-bottom: 7px;

  color: #28745A;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.5px;
}

.form-header h2 {
  margin: 0;

  color: #263238;

  font-size: 30px;
  font-weight: 800;

  letter-spacing: -0.6px;
}

.form-header p:last-child {
  margin-top: 10px;

  color: #667085;

  font-size: 13px;
  line-height: 1.6;
}


/* =========================
   CAMPOS
========================= */

.field {
  margin-bottom: 23px;
}

.label {
  margin-bottom: 8px;

  color: #263238;

  font-size: 13px;
  font-weight: 700;
}

.password-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.password-label a {
  color: #28745A;

  font-size: 11px;
  font-weight: 600;

  text-decoration: none;
}

.password-label a:hover {
  text-decoration: underline;
}


/* =========================
   INPUTS
========================= */

.has-icon {
  position: relative;
}

.custom-input {
  height: 50px;

  padding-left: 44px;
  padding-right: 44px;

  border: 1px solid #D9E2DD;

  border-radius: 10px;

  background: #FAFCFB;

  color: #263238;

  font-size: 13px;

  box-shadow: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.custom-input::placeholder {
  color: #98A2B3;
}

.custom-input:hover {
  border-color: #B9CBC2;
}

.custom-input:focus {
  border-color: #28745A;

  background: #FFFFFF;

  box-shadow:
    0 0 0 3px rgba(40,116,90,0.10);
}


/* Icono */

.input-icon {
  position: absolute;

  left: 16px;
  top: 50%;

  transform: translateY(-50%);

  z-index: 2;

  color: #667085;

  font-size: 14px;
}


/* Mostrar contraseña */

.password-toggle {
  position: absolute;

  right: 13px;
  top: 50%;

  transform: translateY(-50%);

  border: none;
  background: transparent;

  color: #667085;

  cursor: pointer;

  font-size: 15px;
}

.password-toggle:hover {
  color: #28745A;
}


/* =========================
   RECORDAR
========================= */

.remember-row {
  margin-top: -5px;
  margin-bottom: 24px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #667085;

  font-size: 12px;
}

.remember input {
  accent-color: #28745A;
}


/* =========================
   BOTÓN
========================= */

.login-button {
  width: 100%;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  border: none;
  border-radius: 10px;

  background: #164A3A;
  color: #FFFFFF;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 7px 18px rgba(22,74,58,0.18);

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.login-button:hover {
  background: #28745A;

  transform: translateY(-1px);

  box-shadow:
    0 9px 22px rgba(22,74,58,0.22);
}

.login-button:active {
  transform: translateY(0);
}

.arrow {
  font-size: 18px;
}


/* =========================
   SEGURIDAD
========================= */

.security-message {
  margin-top: 25px;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: 7px;

  color: #98A2B3;

  font-size: 10px;
}


/* =========================
   FOOTER FORMULARIO
========================= */

.form-footer {
  margin-top: 35px;

  padding-top: 18px;

  border-top: 1px solid #EEF2F0;

  text-align: center;

  color: #98A2B3;

  font-size: 9px;
}


/* =========================
   LOGO MÓVIL
========================= */

.mobile-logo {
  display: none;
}


/* =========================
   TABLET
========================= */

@media (max-width: 850px) {

  .login-container {
    grid-template-columns: 1fr;

    max-width: 550px;
  }

  .brand-panel {
    display: none;
  }

  .form-panel {
    min-height: 650px;

    padding: 45px 40px;
  }

  .mobile-logo {
    display: flex;

    align-items: center;
    justify-content: center;

    gap: 10px;

    margin-bottom: 45px;

    color: #164A3A;

    font-size: 15px;
  }

  .mobile-logo-icon {
    width: 34px;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 9px;

    background: #D4A72C;

    color: #164A3A;
  }
}


/* =========================
   MÓVIL
========================= */

@media (max-width: 480px) {

  .login-page {
    padding: 0;

    align-items: stretch;
  }

  .login-container {
    min-height: 100vh;

    border-radius: 0;

    box-shadow: none;
  }

  .form-panel {
    min-height: 100vh;

    padding: 30px 24px;
  }

  .mobile-logo {
    margin-bottom: 35px;
  }

  .form-header h2 {
    font-size: 27px;
  }

  .form-header {
    margin-bottom: 30px;
  }

  .custom-input {
    height: 52px;
  }

  .login-button {
    height: 53px;
  }
}

</style>