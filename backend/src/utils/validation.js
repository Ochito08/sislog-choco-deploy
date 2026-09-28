const STATES = ['Pendiente', 'Preparando', 'En tránsito', 'Entregada']
const ROLES = [
  'Coordinador logístico',
  'Responsable de transporte',
  'Responsable del punto receptor',
  'Administrador'
]

function cleanText(value) {
  return String(value ?? '').trim()
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateDelivery(body) {
  const data = {
    origen: cleanText(body.origen),
    destino: cleanText(body.destino),
    tipo: cleanText(body.tipo),
    cantidad: Number(body.cantidad),
    responsableId: Number(body.responsableId),
    transporte: cleanText(body.transporte)
  }
  const errors = {}

  if (!data.origen) errors.origen = 'El origen es obligatorio.'
  else if (data.origen.length < 2) errors.origen = 'El origen debe tener al menos 2 caracteres.'
  else if (data.origen.length > 80) errors.origen = 'El origen no puede superar 80 caracteres.'

  if (!data.destino) errors.destino = 'El destino es obligatorio.'
  else if (data.destino.length < 2) errors.destino = 'El destino debe tener al menos 2 caracteres.'
  else if (data.destino.length > 80) errors.destino = 'El destino no puede superar 80 caracteres.'
  else if (data.origen && data.destino.toLowerCase() === data.origen.toLowerCase()) errors.destino = 'El destino debe ser diferente al origen.'

  if (!data.tipo) errors.tipo = 'El tipo de ayuda es obligatorio.'
  else if (data.tipo.length > 80) errors.tipo = 'El tipo de ayuda no puede superar 80 caracteres.'

  if (!Number.isInteger(data.cantidad) || data.cantidad < 1) errors.cantidad = 'La cantidad debe ser un número entero mayor que cero.'
  else if (data.cantidad > 1000000) errors.cantidad = 'La cantidad no puede superar 1.000.000 de unidades.'

  if (!Number.isInteger(data.responsableId) || data.responsableId < 1) errors.responsableId = 'Debes seleccionar un responsable.'

  if (!data.transporte) errors.transporte = 'El transporte es obligatorio.'
  else if (data.transporte.length < 3) errors.transporte = 'El transporte debe tener al menos 3 caracteres.'
  else if (data.transporte.length > 100) errors.transporte = 'El transporte no puede superar 100 caracteres.'

  return { data, errors }
}

function validateUser(body, { partial = false } = {}) {
  const has = key => Object.prototype.hasOwnProperty.call(body || {}, key)
  const data = {}
  const errors = {}

  if (!partial || has('name')) {
    data.name = cleanText(body.name)
    if (!data.name) errors.name = 'El nombre es obligatorio.'
    else if (data.name.length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.'
    else if (data.name.length > 100) errors.name = 'El nombre no puede superar 100 caracteres.'
  }

  if (!partial || has('email')) {
    data.email = cleanText(body.email).toLowerCase()
    if (!data.email) errors.email = 'El correo es obligatorio.'
    else if (!isValidEmail(data.email)) errors.email = 'Ingresa un correo válido.'
    else if (data.email.length > 120) errors.email = 'El correo no puede superar 120 caracteres.'
  }

  if (!partial || has('role')) {
    data.role = cleanText(body.role)
    if (!ROLES.includes(data.role)) errors.role = 'Selecciona un rol válido.'
  }

  if (!partial || has('password')) {
    data.password = String(body.password ?? '')
    if (!partial && !data.password) errors.password = 'La contraseña es obligatoria.'
    else if (data.password && data.password.length < 6) errors.password = 'La contraseña debe tener mínimo 6 caracteres.'
    else if (data.password.length > 72) errors.password = 'La contraseña no puede superar 72 caracteres.'
  }

  return { data, errors }
}

module.exports = { STATES, ROLES, cleanText, validateDelivery, validateUser }
