const express = require('express')
const { readDatabase, writeDatabase, publicUser } = require('../data/store')
const { authenticate, authorize } = require('../middleware/auth')
const { hashPassword } = require('../utils/security')
const { ROLES, validateUser } = require('../utils/validation')

const router = express.Router()

function nextUserId(users) {
  return users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1
}

function isDuplicateEmail(users, email, ignoreId = null) {
  return users.some(user => user.id !== ignoreId && user.email.toLowerCase() === email.toLowerCase())
}

function activeAdminCount(users) {
  return users.filter(user => user.active && user.role === 'Administrador').length
}

router.get('/roles', authenticate, (req, res) => {
  res.json(ROLES)
})

router.get('/responsibles', authenticate, (req, res) => {
  const db = readDatabase()
  const users = db.users
    .filter(user => user.active && user.role === 'Responsable de transporte')
    .map(publicUser)
  res.json(users)
})

router.get('/', authenticate, authorize('Administrador'), (req, res) => {
  const db = readDatabase()
  const search = String(req.query.search || '').trim().toLowerCase()
  const role = String(req.query.role || '').trim()
  const active = String(req.query.active || '').trim()

  let users = db.users
  if (search) users = users.filter(user => [user.name, user.email].some(value => value.toLowerCase().includes(search)))
  if (role) users = users.filter(user => user.role === role)
  if (active === 'true' || active === 'false') users = users.filter(user => user.active === (active === 'true'))

  res.json(users.map(publicUser))
})

router.post('/', authenticate, authorize('Administrador'), (req, res) => {
  const { data, errors } = validateUser(req.body)
  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'Revisa los datos del usuario.', fieldErrors: errors })
  }

  const db = readDatabase()
  if (isDuplicateEmail(db.users, data.email)) {
    return res.status(409).json({ error: 'Ya existe un usuario con ese correo.', fieldErrors: { email: 'Este correo ya está registrado.' } })
  }

  const user = {
    id: nextUserId(db.users),
    name: data.name,
    email: data.email,
    passwordHash: hashPassword(data.password),
    role: data.role,
    active: true,
    createdAt: new Date().toISOString()
  }
  db.users.push(user)
  writeDatabase(db)
  res.status(201).json(publicUser(user))
})

router.patch('/:id', authenticate, authorize('Administrador'), (req, res) => {
  const userId = Number(req.params.id)
  if (!Number.isInteger(userId)) return res.status(400).json({ error: 'Identificador de usuario inválido.' })

  const { data, errors } = validateUser(req.body, { partial: true })
  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'Revisa los datos del usuario.', fieldErrors: errors })
  }

  const db = readDatabase()
  const user = db.users.find(item => item.id === userId)
  if (!user) return res.status(404).json({ error: 'El usuario no existe.' })

  if (data.email && isDuplicateEmail(db.users, data.email, user.id)) {
    return res.status(409).json({ error: 'Ya existe un usuario con ese correo.', fieldErrors: { email: 'Este correo ya está registrado.' } })
  }

  if (user.id === req.user.id && data.role && data.role !== user.role) {
    return res.status(409).json({ error: 'No puedes cambiar tu propio rol mientras tienes la sesión iniciada.', fieldErrors: { role: 'Usa otro administrador para cambiar este rol.' } })
  }

  if (data.role && user.role === 'Administrador' && data.role !== 'Administrador' && user.active && activeAdminCount(db.users) === 1) {
    return res.status(409).json({ error: 'Debe existir al menos un administrador activo.' })
  }

  const previousName = user.name
  if (data.name !== undefined) user.name = data.name
  if (data.email !== undefined) user.email = data.email
  if (data.role !== undefined) user.role = data.role
  if (data.password) user.passwordHash = hashPassword(data.password)
  user.updatedAt = new Date().toISOString()

  if (data.name && data.name !== previousName) {
    db.deliveries.forEach(delivery => {
      if (delivery.responsableId === user.id) delivery.responsable = data.name
    })
  }

  writeDatabase(db)
  res.json(publicUser(user))
})

router.patch('/:id/status', authenticate, authorize('Administrador'), (req, res) => {
  const userId = Number(req.params.id)
  const active = req.body.active
  if (!Number.isInteger(userId)) return res.status(400).json({ error: 'Identificador de usuario inválido.' })
  if (typeof active !== 'boolean') return res.status(400).json({ error: 'El estado del usuario debe ser verdadero o falso.' })

  const db = readDatabase()
  const user = db.users.find(item => item.id === userId)
  if (!user) return res.status(404).json({ error: 'El usuario no existe.' })
  if (user.id === req.user.id && !active) return res.status(409).json({ error: 'No puedes desactivar tu propio usuario mientras tienes la sesión iniciada.' })
  if (!active && user.role === 'Administrador' && user.active && activeAdminCount(db.users) === 1) {
    return res.status(409).json({ error: 'Debe existir al menos un administrador activo.' })
  }

  user.active = active
  user.updatedAt = new Date().toISOString()
  writeDatabase(db)
  res.json(publicUser(user))
})

module.exports = router
