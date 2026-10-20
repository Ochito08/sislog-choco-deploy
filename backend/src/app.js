const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const authRoutes = require('./routes/auth.routes')
const deliveryRoutes = require('./routes/deliveries.routes')
const userRoutes = require('./routes/users.routes')

const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

// Documentación Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'SISLOG-CHOCÓ API'
  })
)

// Especificación OpenAPI en formato JSON
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec)
})

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Verificar el estado de la API
 *     description: Comprueba que el servidor de SISLOG-CHOCÓ se encuentra funcionando correctamente.
 *     responses:
 *       200:
 *         description: API funcionando correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   type: string
 *                   example: SISLOG-CHOCÓ API
 *                 version:
 *                   type: string
 *                   example: 3.0.0
 */
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'SISLOG-CHOCÓ API',
    version: '3.0.0'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/deliveries', deliveryRoutes)
app.use('/api/users', userRoutes)

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada.'
  })
})

// Error interno
app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).json({
    error: 'Ocurrió un error interno en el servidor.'
  })
})

module.exports = app