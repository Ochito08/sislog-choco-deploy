const app = require('./src/app')
const { ensureDatabase } = require('./src/data/store')

const PORT = Number(process.env.PORT) || 3000

ensureDatabase()

app.listen(PORT, () => {
  console.log(`SISLOG-CHOCÓ API escuchando en http://localhost:${PORT}`)
  console.log(`Health: http://localhost:${PORT}/api/health`)
})
