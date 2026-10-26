export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const TOKEN_KEY = 'sislog_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body !== undefined && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body: options.body !== undefined && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body
    })
  } catch {
    const error = new Error('No fue posible conectar con el servidor. Verifica la conexión e inténtalo de nuevo.')
    error.status = 0
    throw error
  }

  const contentType = response.headers.get('content-type') || ''
  let data = null
  let invalidJson = false
  if (contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      invalidJson = true
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('sislog_user')
      localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname !== '/login') window.location.assign('/login')
    }
    const messages = {
      400: 'Revisa los datos enviados.',
      401: 'La sesión expiró o no es válida. Inicia sesión de nuevo.',
      403: 'No tienes permisos para realizar esta acción.',
      404: 'El recurso solicitado no existe.',
      409: 'La operación entra en conflicto con los datos actuales.'
    }
    const fallback = response.status >= 500
      ? 'El servidor no pudo completar la solicitud. Inténtalo de nuevo.'
      : messages[response.status] || 'La solicitud no pudo completarse.'
    const error = new Error(typeof data?.error === 'string' ? data.error : fallback)
    error.status = response.status
    error.fieldErrors = data?.fieldErrors || {}
    throw error
  }

  if (invalidJson) {
    const error = new Error('El servidor devolvió una respuesta inválida. Inténtalo de nuevo.')
    error.status = response.status
    throw error
  }
  return data
}
