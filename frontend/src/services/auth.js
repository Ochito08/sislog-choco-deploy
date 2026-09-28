import { apiRequest, setToken, getToken } from './api'

const STORAGE_KEY = 'sislog_user'

export async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: String(email || '').trim(), password }
  })
  setToken(data.token)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
  return data.user
}

export async function refreshCurrentUser() {
  const data = await apiRequest('/auth/me')
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
  return data.user
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  setToken(null)
}

export function isAuthenticated() {
  return Boolean(getCurrentUser() && getToken())
}
