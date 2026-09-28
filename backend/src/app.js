const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const deliveryRoutes = require('./routes/deliveries.routes')
const userRoutes = require('./routes/users.routes')

const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'SISLOG-CHOCÓ API', version: '3.0.0' })
})

app.use('/api/auth', authRoutes)
app.use('/api/deliveries', deliveryRoutes)
app.use('/api/users', userRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' })
})

module.exports = app
