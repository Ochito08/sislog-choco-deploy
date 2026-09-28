const fs = require('fs')
const path = require('path')
const { hashPassword } = require('../utils/security')

const DATA_DIR = path.join(__dirname, '../../data')

const DB_FILE =
  process.env.NODE_ENV === 'test'
    ? path.join(DATA_DIR, 'db.test.json')
    : path.join(DATA_DIR, 'db.json')

function createSeed() {
  const passwordHash = hashPassword('123456')
  const users = [
    { id: 1, name: 'Carlos Mosquera', email: 'coordinador@sislog.co', passwordHash, role: 'Coordinador logístico', active: true, createdAt: '2026-09-01T13:00:00.000Z' },
    { id: 2, name: 'Diana Córdoba', email: 'transporte@sislog.co', passwordHash, role: 'Responsable de transporte', active: true, createdAt: '2026-09-01T13:00:00.000Z' },
    { id: 3, name: 'Luis Palacios', email: 'receptor@sislog.co', passwordHash, role: 'Responsable del punto receptor', active: true, createdAt: '2026-09-01T13:00:00.000Z' },
    { id: 4, name: 'Administrador SISLOG', email: 'admin@sislog.co', passwordHash, role: 'Administrador', active: true, createdAt: '2026-09-01T13:00:00.000Z' }
  ]

  return {
    users,
    deliveries: [
      {
        id: 'ENT-2026-001', origen: 'Quibdó', destino: 'Bagadó', tipo: 'Alimentos', cantidad: 250,
        responsableId: 2, responsable: 'Diana Córdoba', transporte: 'Camión CHO-101', estado: 'En tránsito',
        createdAt: '2026-09-18T14:20:00.000Z', updatedAt: '2026-09-18T16:20:00.000Z', createdBy: 1, receivedAt: null, receivedBy: null,
        events: [
          { type: 'CREATED', estado: 'Pendiente', at: '2026-09-18T14:20:00.000Z', userId: 1, userName: 'Carlos Mosquera' },
          { type: 'STATUS_CHANGED', estado: 'Preparando', at: '2026-09-18T15:10:00.000Z', userId: 2, userName: 'Diana Córdoba' },
          { type: 'STATUS_CHANGED', estado: 'En tránsito', at: '2026-09-18T16:20:00.000Z', userId: 2, userName: 'Diana Córdoba' }
        ]
      },
      {
        id: 'ENT-2026-002', origen: 'Quibdó', destino: 'Lloró', tipo: 'Medicamentos', cantidad: 80,
        responsableId: 2, responsable: 'Diana Córdoba', transporte: 'Camioneta CHO-208', estado: 'Entregada',
        createdAt: '2026-09-17T19:10:00.000Z', updatedAt: '2026-09-18T16:45:00.000Z', createdBy: 1, receivedAt: '2026-09-18T16:45:00.000Z', receivedBy: 3, receivedByName: 'Luis Palacios',
        events: [
          { type: 'CREATED', estado: 'Pendiente', at: '2026-09-17T19:10:00.000Z', userId: 1, userName: 'Carlos Mosquera' },
          { type: 'STATUS_CHANGED', estado: 'Preparando', at: '2026-09-18T11:00:00.000Z', userId: 2, userName: 'Diana Córdoba' },
          { type: 'STATUS_CHANGED', estado: 'En tránsito', at: '2026-09-18T13:20:00.000Z', userId: 2, userName: 'Diana Córdoba' },
          { type: 'RECEIVED', estado: 'Entregada', at: '2026-09-18T16:45:00.000Z', userId: 3, userName: 'Luis Palacios' }
        ]
      },
      {
        id: 'ENT-2026-003', origen: 'Istmina', destino: 'Nóvita', tipo: 'Kits de aseo', cantidad: 120,
        responsableId: 2, responsable: 'Diana Córdoba', transporte: 'Camión CHO-315', estado: 'Pendiente',
        createdAt: '2026-09-19T13:00:00.000Z', updatedAt: '2026-09-19T13:00:00.000Z', createdBy: 1, receivedAt: null, receivedBy: null,
        events: [{ type: 'CREATED', estado: 'Pendiente', at: '2026-09-19T13:00:00.000Z', userId: 1, userName: 'Carlos Mosquera' }]
      },
      {
        id: 'ENT-2026-004', origen: 'Quibdó', destino: 'Bojayá', tipo: 'Agua', cantidad: 300,
        responsableId: 2, responsable: 'Diana Córdoba', transporte: 'Lancha L-12', estado: 'Preparando',
        createdAt: '2026-09-20T15:30:00.000Z', updatedAt: '2026-09-20T16:10:00.000Z', createdBy: 1, receivedAt: null, receivedBy: null,
        events: [
          { type: 'CREATED', estado: 'Pendiente', at: '2026-09-20T15:30:00.000Z', userId: 1, userName: 'Carlos Mosquera' },
          { type: 'STATUS_CHANGED', estado: 'Preparando', at: '2026-09-20T16:10:00.000Z', userId: 2, userName: 'Diana Córdoba' }
        ]
      }
    ]
  }
}

function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DB_FILE)) writeDatabase(createSeed())
}

function readDatabase() {
  ensureDatabase()
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

function writeDatabase(data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  const temp = `${DB_FILE}.tmp`
  fs.writeFileSync(temp, JSON.stringify(data, null, 2), 'utf8')
  fs.renameSync(temp, DB_FILE)
}

function publicUser(user) {
  if (!user) return null
  const { passwordHash, ...safe } = user
  return safe
}

module.exports = { DB_FILE, ensureDatabase, readDatabase, writeDatabase, publicUser, createSeed }
