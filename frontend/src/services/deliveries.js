import { apiRequest } from './api'

function buildQuery({
  search = '',
  status = '',
  destination = '',
  responsibleId = ''
} = {}) {
  const params = new URLSearchParams()

  if (search) {
    params.set('search', search)
  }

  if (status) {
    params.set('status', status)
  }

  if (destination) {
    params.set('destination', destination)
  }

  if (responsibleId) {
    params.set(
      'responsibleId',
      responsibleId
    )
  }

  const query =
    params.toString()

  return query
    ? `?${query}`
    : ''
}

export function listDeliveries(
  filters = {}
) {
  return apiRequest(
    `/deliveries${buildQuery(filters)}`
  )
}

export function listHistory(
  filters = {}
) {
  return apiRequest(
    `/deliveries/history${buildQuery(filters)}`
  )
}

export function getDelivery(id) {
  return apiRequest(
    `/deliveries/${encodeURIComponent(id)}`
  )
}

export function createDelivery(data) {
  return apiRequest(
    '/deliveries',
    {
      method: 'POST',
      body: data
    }
  )
}

export function updateDelivery(
  id,
  data
) {
  return apiRequest(
    `/deliveries/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: data
    }
  )
}

export function deleteDelivery(id) {
  return apiRequest(
    `/deliveries/${encodeURIComponent(id)}`,
    {
      method: 'DELETE'
    }
  )
}

export function updateDeliveryStatus(
  id,
  estado
) {
  return apiRequest(
    `/deliveries/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: {
        estado
      }
    }
  )
}

export function confirmReception(id) {
  return apiRequest(
    `/deliveries/${encodeURIComponent(id)}/reception`,
    {
      method: 'POST'
    }
  )
}