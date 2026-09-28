import { apiRequest } from './api'

export function listUsers({ search = '', role = '', active = '' } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (role) params.set('role', role)
  if (active !== '') params.set('active', active)
  const query = params.toString()
  return apiRequest(`/users${query ? `?${query}` : ''}`)
}

export function listRoles() {
  return apiRequest('/users/roles')
}

export function listResponsibles() {
  return apiRequest('/users/responsibles')
}

export function createUser(data) {
  return apiRequest('/users', { method: 'POST', body: data })
}

export function updateUser(id, data) {
  return apiRequest(`/users/${encodeURIComponent(id)}`, { method: 'PATCH', body: data })
}

export function setUserActive(id, active) {
  return apiRequest(`/users/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: { active }
  })
}
