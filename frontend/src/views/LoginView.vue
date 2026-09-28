<template>
  <section class="login-page">
    <div class="login-container">
      <div class="brand-panel">
        <div>
          <div class="brand-logo"><span>✦</span><strong>CHOCÓ</strong></div>
          <div class="brand-text"><p>SISTEMA DE GESTIÓN</p><h1>SISLOG-<span>CHOCÓ</span></h1><div>Gestión logística de ayudas humanitarias para comunidades del Chocó.</div></div>
          <div class="info-box"><b>✓</b><div><strong>Logística organizada</strong><p>Registra, asigna y realiza seguimiento a las entregas humanitarias.</p></div></div>
        </div>
        <small>Sistema de apoyo a la gestión humanitaria</small>
      </div>

      <div class="form-panel">
        <div class="form-container">
          <div class="mobile-logo">✦ <strong>SISLOG-CHOCÓ</strong></div>
          <header><p>BIENVENIDO</p><h2>Iniciar sesión</h2><div>Ingresa tus credenciales para acceder al sistema de gestión.</div></header>
          <form @submit.prevent="submit">
            <label>Correo electrónico<input v-model.trim="email" type="email" placeholder="ejemplo@correo.com" required :disabled="loading" /></label>
            <label>Contraseña<div class="password"><input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Ingresa tu contraseña" required :disabled="loading"/><button type="button" @click="showPassword=!showPassword">{{ showPassword ? 'Ocultar' : 'Ver' }}</button></div></label>
            <p v-if="error" class="error">{{ error }}</p>
            <button class="login-button" type="submit" :disabled="loading">{{ loading ? 'Conectando...' : 'Ingresar al sistema' }} <span>→</span></button>
          </form>
          <div class="demo"><strong>Acceso de demostración:</strong><span>coordinador@sislog.co · 123456</span></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth'
const router = useRouter(); const email=ref(''); const password=ref(''); const showPassword=ref(false); const error=ref(''); const loading=ref(false)
async function submit(){ error.value=''; loading.value=true; try{ await login(email.value,password.value); router.push('/dashboard') }catch(e){ error.value=e.message }finally{ loading.value=false } }
</script>
<style scoped>
.login-page{min-height:100vh;display:grid;place-items:center;padding:36px 22px;background:#f7f8f5}.login-container{width:100%;max-width:1040px;min-height:620px;display:grid;grid-template-columns:44% 56%;overflow:hidden;border-radius:22px;background:#fff;box-shadow:0 20px 60px rgba(22,74,58,.12)}.brand-panel{padding:52px 46px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;background:#164a3a;color:#fff}.brand-logo{display:flex;align-items:center;gap:10px;font-size:14px}.brand-logo span{width:34px;height:34px;display:grid;place-items:center;border-radius:9px;background:#d4a72c;color:#164a3a}.brand-text{margin-top:95px}.brand-text>p{margin:0;color:#d4a72c;font-size:10px;font-weight:800;letter-spacing:2px}.brand-text h1{margin:12px 0 15px;font-size:40px;line-height:1}.brand-text h1 span{color:#d4a72c}.brand-text div{max-width:330px;color:rgba(255,255,255,.72);font-size:14px;line-height:1.6}.info-box{margin-top:38px;padding:16px;display:flex;gap:12px;border-radius:10px;background:rgba(255,255,255,.08)}.info-box>b{color:#d4a72c}.info-box strong{font-size:12px}.info-box p{margin:4px 0 0;color:rgba(255,255,255,.6);font-size:10px;line-height:1.5}.brand-panel small{color:rgba(255,255,255,.38);font-size:9px}.form-panel{display:grid;place-items:center;padding:48px}.form-container{width:100%;max-width:390px}.mobile-logo{display:none;color:#164a3a}header>p{margin:0;color:#28745a;font-size:10px;font-weight:800;letter-spacing:1.7px}header h2{margin:8px 0 9px;font-size:28px}header div{color:#7c8884;font-size:12px;line-height:1.5}form{margin-top:30px}label{display:block;margin-bottom:17px;color:#263238;font-size:11px;font-weight:800}input{width:100%;height:45px;margin-top:7px;padding:0 13px;border:1px solid #d9e2dd;border-radius:8px;background:#fafcfb;outline:none;font-size:12px}input:focus{border-color:#28745a;box-shadow:0 0 0 3px rgba(40,116,90,.08)}.password{position:relative}.password button{position:absolute;right:9px;top:17px;border:0;background:transparent;color:#28745a;font-size:10px;cursor:pointer}.error{margin:-5px 0 14px;padding:9px 11px;border-radius:7px;background:#fff0f0;color:#b33a3a;font-size:10px}.login-button{width:100%;height:45px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border:0;border-radius:8px;background:#164a3a;color:#fff;font-size:11px;font-weight:800;cursor:pointer}.login-button:hover{background:#28745a}.login-button:disabled{opacity:.65;cursor:wait}.demo{margin-top:22px;padding:12px;border-radius:8px;background:#f4f7f5;color:#697873;font-size:9px}.demo strong,.demo span{display:block}.demo span{margin-top:4px}@media(max-width:760px){.login-page{padding:0}.login-container{min-height:100vh;display:block;border-radius:0}.brand-panel{display:none}.form-panel{min-height:100vh;padding:30px 22px}.mobile-logo{display:flex;gap:8px;margin-bottom:50px}}
</style>
