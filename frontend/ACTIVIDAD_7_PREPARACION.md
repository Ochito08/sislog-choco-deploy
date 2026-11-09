# SISLOG-CHOCÓ — preparación de frontend para Actividad 7

## Lo que ya queda preparado

- La URL de la API se controla con `VITE_API_URL`.
- En desarrollo, si `VITE_API_URL` está vacía, el frontend usa `/api` y Vite lo redirige a `http://localhost:3000`.
- Vite escucha en la red local (`host: true`) para poder probar el sistema desde un teléfono conectado a la misma red Wi‑Fi.
- El frontend mantiene `npm run build` como compilación de producción.

## Desarrollo local

1. Backend en `http://localhost:3000`.
2. En frontend, deja `VITE_API_URL` vacía o no crees `.env`.
3. Ejecuta `npm run dev`.
4. Para probar desde un celular, usa la URL `Network` que muestre Vite. El celular y el computador deben estar en la misma red.

## Producción

En el hosting del frontend (Vercel, Netlify o equivalente), configura:

`VITE_API_URL=https://TU-BACKEND-PUBLICO/api`

Luego usa:

- Build command: `npm run build`
- Output directory: `dist`

## Falta para completar la Actividad 7

- Desplegar el backend en Render/Railway/VPS o equivalente.
- Configurar CORS del backend para permitir la URL pública del frontend.
- Configurar las variables de entorno del backend.
- Desplegar el frontend y configurar `VITE_API_URL` con la URL real del backend.
- Validar Login + CRUD completo en las URLs públicas.
- Tomar capturas y documentar enlaces, dificultades y soluciones.
