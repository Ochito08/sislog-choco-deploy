const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')

const app = require('../src/app')

const {
  DB_FILE,
  createSeed,
  writeDatabase
} = require('../src/data/store')


// ======================================================
// PREPARACIÓN DE LA BASE DE DATOS DE PRUEBAS
// ======================================================

// Antes de cada prueba restauramos los datos iniciales
test.beforeEach(() => {
  writeDatabase(createSeed())
})

// Cuando terminen todas las pruebas eliminamos db.test.json
test.after(() => {
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE)
  }
})


// ======================================================
// FUNCIONES AUXILIARES
// ======================================================

// Inicia Express en un puerto temporal
async function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address()

      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`
      })
    })
  })
}


// Inicia sesión y devuelve usuario + token
async function login(baseUrl, email, password = '123456') {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  assert.equal(response.status, 200)

  return response.json()
}


// ======================================================
// PRUEBA 1
// LOGIN CORRECTO DEL COORDINADOR
// ======================================================

test('POST /api/auth/login permite iniciar sesión al coordinador', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'coordinador@sislog.co',
        password: '123456'
      })
    })

    assert.equal(response.status, 200)

    const data = await response.json()

    assert.ok(data.token)

    assert.equal(
      data.user.email,
      'coordinador@sislog.co'
    )

    assert.equal(
      data.user.role,
      'Coordinador logístico'
    )

    assert.equal(
      data.user.active,
      true
    )
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 2
// CONTRASEÑA INCORRECTA
// ======================================================

test('POST /api/auth/login rechaza contraseña incorrecta', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'coordinador@sislog.co',
        password: 'contraseña-mala'
      })
    })

    assert.equal(response.status, 401)

    const data = await response.json()

    assert.equal(
      data.error,
      'Correo o contraseña incorrectos.'
    )
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 3
// RUTA PROTEGIDA SIN TOKEN
// ======================================================

test('GET /api/auth/me rechaza solicitudes sin token', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const response = await fetch(
      `${baseUrl}/api/auth/me`
    )

    assert.equal(response.status, 401)
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 4
// EL ADMINISTRADOR PUEDE CONSULTAR USUARIOS
// ======================================================

test('GET /api/users permite acceso al administrador', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const session = await login(
      baseUrl,
      'admin@sislog.co'
    )

    const response = await fetch(
      `${baseUrl}/api/users`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    )

    assert.equal(response.status, 200)

    const users = await response.json()

    assert.ok(Array.isArray(users))
    assert.ok(users.length >= 4)
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 5
// EL TRANSPORTADOR NO PUEDE ADMINISTRAR USUARIOS
// ======================================================

test('GET /api/users rechaza al responsable de transporte', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const session = await login(
      baseUrl,
      'transporte@sislog.co'
    )

    const response = await fetch(
      `${baseUrl}/api/users`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    )

    assert.equal(response.status, 403)

    const data = await response.json()

    assert.equal(
      data.error,
      'No tienes permisos para realizar esta acción.'
    )
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 6
// EL COORDINADOR PUEDE CREAR UNA ENTREGA
// ======================================================

test('POST /api/deliveries permite al coordinador crear una entrega', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const session = await login(
      baseUrl,
      'coordinador@sislog.co'
    )

    const response = await fetch(
      `${baseUrl}/api/deliveries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({
          origen: 'Quibdó',
          destino: 'Tadó',
          tipo: 'Alimentos',
          cantidad: 150,
          responsableId: 2,
          transporte: 'Camión CHO-500'
        })
      }
    )

    assert.equal(response.status, 201)

    const delivery = await response.json()

    assert.ok(delivery.id)

    assert.equal(
      delivery.origen,
      'Quibdó'
    )

    assert.equal(
      delivery.destino,
      'Tadó'
    )

    assert.equal(
      delivery.tipo,
      'Alimentos'
    )

    assert.equal(
      delivery.cantidad,
      150
    )

    assert.equal(
      delivery.responsableId,
      2
    )

    assert.equal(
      delivery.responsable,
      'Diana Córdoba'
    )

    assert.equal(
      delivery.transporte,
      'Camión CHO-500'
    )

    assert.equal(
      delivery.estado,
      'Pendiente'
    )

    assert.ok(
      Array.isArray(delivery.events)
    )

    assert.equal(
      delivery.events[0].type,
      'CREATED'
    )
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 7
// EL TRANSPORTADOR NO PUEDE CREAR ENTREGAS
// ======================================================

test('POST /api/deliveries rechaza creación por responsable de transporte', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const session = await login(
      baseUrl,
      'transporte@sislog.co'
    )

    const response = await fetch(
      `${baseUrl}/api/deliveries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({
          origen: 'Quibdó',
          destino: 'Tadó',
          tipo: 'Alimentos',
          cantidad: 150,
          responsableId: 2,
          transporte: 'Camión CHO-500'
        })
      }
    )

    assert.equal(response.status, 403)

    const data = await response.json()

    assert.equal(
      data.error,
      'No tienes permisos para realizar esta acción.'
    )
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 8
// FLUJO COMPLETO DE UNA ENTREGA
// ======================================================

test(
  'Flujo completo: Pendiente → Preparando → En tránsito → Entregada',
  async () => {
    const { server, baseUrl } = await startServer()

    try {
      // --------------------------------------------------
      // El transportador inicia sesión
      // --------------------------------------------------

      const transporte = await login(
        baseUrl,
        'transporte@sislog.co'
      )

      // Esta entrega comienza en estado Pendiente
      const deliveryId = 'ENT-2026-003'


      // --------------------------------------------------
      // Pendiente → Preparando
      // --------------------------------------------------

      let response = await fetch(
        `${baseUrl}/api/deliveries/${deliveryId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${transporte.token}`
          },
          body: JSON.stringify({
            estado: 'Preparando'
          })
        }
      )

      assert.equal(response.status, 200)

      let delivery = await response.json()

      assert.equal(
        delivery.estado,
        'Preparando'
      )


      // --------------------------------------------------
      // Preparando → En tránsito
      // --------------------------------------------------

      response = await fetch(
        `${baseUrl}/api/deliveries/${deliveryId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${transporte.token}`
          },
          body: JSON.stringify({
            estado: 'En tránsito'
          })
        }
      )

      assert.equal(response.status, 200)

      delivery = await response.json()

      assert.equal(
        delivery.estado,
        'En tránsito'
      )


      // --------------------------------------------------
      // El transportador NO puede marcar Entregada
      // directamente
      // --------------------------------------------------

      response = await fetch(
        `${baseUrl}/api/deliveries/${deliveryId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${transporte.token}`
          },
          body: JSON.stringify({
            estado: 'Entregada'
          })
        }
      )

      assert.equal(response.status, 400)


      // --------------------------------------------------
      // El responsable receptor inicia sesión
      // --------------------------------------------------

      const receptor = await login(
        baseUrl,
        'receptor@sislog.co'
      )


      // --------------------------------------------------
      // El receptor confirma la recepción
      // --------------------------------------------------

      response = await fetch(
        `${baseUrl}/api/deliveries/${deliveryId}/reception`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${receptor.token}`
          }
        }
      )

      assert.equal(response.status, 200)

      delivery = await response.json()


      // --------------------------------------------------
      // Verificamos el resultado final
      // --------------------------------------------------

      assert.equal(
        delivery.estado,
        'Entregada'
      )

      assert.equal(
        delivery.receivedBy,
        3
      )

      assert.equal(
        delivery.receivedByName,
        'Luis Palacios'
      )

      assert.ok(
        delivery.receivedAt
      )


      // --------------------------------------------------
      // Verificamos la trazabilidad
      // --------------------------------------------------

      const lastEvent =
        delivery.events[
          delivery.events.length - 1
        ]

      assert.equal(
        lastEvent.type,
        'RECEIVED'
      )

      assert.equal(
        lastEvent.estado,
        'Entregada'
      )
    } finally {
      server.close()
    }
  }
)


// ======================================================
// PRUEBA 9
// NO SE PUEDE CONFIRMAR RECEPCIÓN ANTES DE TIEMPO
// ======================================================

test(
  'No permite confirmar recepción antes de que la entrega esté en tránsito',
  async () => {
    const { server, baseUrl } = await startServer()

    try {
      const receptor = await login(
        baseUrl,
        'receptor@sislog.co'
      )

      // ENT-2026-003 comienza en Pendiente
      const response = await fetch(
        `${baseUrl}/api/deliveries/ENT-2026-003/reception`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${receptor.token}`
          }
        }
      )

      assert.equal(response.status, 409)

      const data = await response.json()

      assert.equal(
        data.error,
        'Solo se puede confirmar la recepción de una entrega que esté en tránsito.'
      )
    } finally {
      server.close()
    }
  }
)

// ======================================================
// PRUEBA 10
// FILTRAR ENTREGAS POR ESTADO Y DESTINO
// ======================================================

test('GET /api/deliveries filtra entregas por estado y destino', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const session = await login(
      baseUrl,
      'coordinador@sislog.co'
    )

    const params = new URLSearchParams({
      status: 'Pendiente',
      destination: 'Nóvita'
    })

    const response = await fetch(
      `${baseUrl}/api/deliveries?${params}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    )

    assert.equal(response.status, 200)

    const deliveries = await response.json()

    assert.ok(Array.isArray(deliveries))
    assert.equal(deliveries.length, 1)

    assert.equal(
      deliveries[0].id,
      'ENT-2026-003'
    )

    assert.equal(
      deliveries[0].estado,
      'Pendiente'
    )

    assert.equal(
      deliveries[0].destino,
      'Nóvita'
    )
  } finally {
    server.close()
  }
})


// ======================================================
// PRUEBA 11
// HISTORIAL SOLO MUESTRA ENTREGAS FINALIZADAS
// ======================================================

test('GET /api/deliveries/history muestra únicamente entregas entregadas', async () => {
  const { server, baseUrl } = await startServer()

  try {
    const session = await login(
      baseUrl,
      'coordinador@sislog.co'
    )

    const response = await fetch(
      `${baseUrl}/api/deliveries/history`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    )

    assert.equal(response.status, 200)

    const deliveries = await response.json()

    assert.ok(Array.isArray(deliveries))
    assert.ok(deliveries.length >= 1)

    assert.ok(
      deliveries.every(
        delivery => delivery.estado === 'Entregada'
      )
    )

    assert.ok(
      deliveries.some(
        delivery => delivery.id === 'ENT-2026-002'
      )
    )
  } finally {
    server.close()
  }
})