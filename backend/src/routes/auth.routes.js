const express = require('express')
const { readDatabase, publicUser } = require('../data/store')
const { authenticate, signToken } = require('../middleware/auth')
const { verifyPassword } = require('../utils/security')

const router = express.Router()

router.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  if (!email || !password) return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' })

  const db = readDatabase()
  const user = db.users.find(item => item.email.toLowerCase() === email && item.active)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
  }

  res.json({ token: signToken(user), user: publicUser(user) })
})

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
