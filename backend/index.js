const app = require('./src/app')
const { ensureDatabase } = require('./src/data/store')

const PORT = Number(process.env.PORT) || 3000

ensureDatabase()

app.listen(PORT, () => {
  console.log('')
  console.log('==============================================')
  console.log('       SISLOG-CHOCÓ API INICIADA')
  console.log('==============================================')
  console.log(`API:     http://localhost:${PORT}`)
  console.log(`Health:  http://localhost:${PORT}/api/health`)
  console.log(`Swagger: http://localhost:${PORT}/api-docs`)
  console.log('==============================================')
  console.log('')
})