const express = require('express')
const { readDatabase, publicUser } = require('../data/store')
const { authenticate, signToken } = require('../middleware/auth')
const { verifyPassword } = require('../utils/security')

const router = express.Router()

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: Valida el correo y la contraseña de un usuario activo y retorna un token de autenticación junto con la información pública del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@sislogchoco.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT utilizado para acceder a rutas protegidas.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       example: Administrador
 *                     active:
 *                       type: boolean
 *       400:
 *         description: Faltan datos obligatorios.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Correo y contraseña son obligatorios.
 *       401:
 *         description: Credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Correo o contraseña incorrectos.
 */
router.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')

  if (!email || !password) {
    return res.status(400).json({
      error: 'Correo y contraseña son obligatorios.'
    })
  }

  const db = readDatabase()

  const user = db.users.find(
    item =>
      item.email.toLowerCase() === email &&
      item.active
  )

  if (
    !user ||
    !verifyPassword(password, user.passwordHash)
  ) {
    return res.status(401).json({
      error: 'Correo o contraseña incorrectos.'
    })
  }

  res.json({
    token: signToken(user),
    user: publicUser(user)
  })
})

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Consultar usuario autenticado
 *     description: Retorna la información del usuario correspondiente al token enviado en la cabecera Authorization.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                     active:
 *                       type: boolean
 *       401:
 *         description: Token ausente, inválido o expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    user: req.user
  })
})

module.exports = router