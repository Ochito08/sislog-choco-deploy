import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const publicDir = resolve('public')
await mkdir(publicDir, { recursive: true })
const payload = {
  version: new Date().toISOString(),
  message: process.env.SISLOG_RELEASE_MESSAGE || 'SISLOG-CHOCÓ tiene una nueva actualización disponible.'
}
await writeFile(resolve(publicDir, 'version.json'), JSON.stringify(payload, null, 2))
console.log(`SISLOG version: ${payload.version}`)
