const express = require('express')
const { readDatabase, writeDatabase } = require('../data/store')
const { authenticate, authorize } = require('../middleware/auth')
const { STATES, validateDelivery } = require('../utils/validation')

const router = express.Router()

router.use(authenticate)

function sortNewest(items) {
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
}

function nextDeliveryId(deliveries) {
  const max = deliveries.reduce(
    (value, item) => {
      const number = Number(
        String(item.id)
          .split('-')
          .pop()
      )

      return Number.isFinite(number)
        ? Math.max(value, number)
        : value
    },
    0
  )

  return `ENT-2026-${String(
    max + 1
  ).padStart(3, '0')}`
}

function canTransportUpdate(
  user,
  delivery
) {
  return (
    user.role ===
      'Responsable de transporte' &&
    delivery.responsableId === user.id
  )
}

function visibleDeliveries(
  db,
  user
) {
  if (
    user.role ===
    'Responsable de transporte'
  ) {
    return db.deliveries.filter(
      item =>
        item.responsableId === user.id
    )
  }

  return db.deliveries
}

function applyFilters(
  items,
  query
) {
  const search = String(
    query.search || ''
  )
    .trim()
    .toLowerCase()

  const status = String(
    query.status || ''
  ).trim()

  const destination = String(
    query.destination || ''
  )
    .trim()
    .toLowerCase()

  const responsibleId = Number(
    query.responsibleId
  )

  let filtered = items

  if (status) {
    filtered = filtered.filter(
      item => item.estado === status
    )
  }

  if (destination) {
    filtered = filtered.filter(
      item =>
        String(item.destino)
          .toLowerCase()
          .includes(destination)
    )
  }

  if (
    Number.isInteger(responsibleId) &&
    responsibleId > 0
  ) {
    filtered = filtered.filter(
      item =>
        item.responsableId ===
        responsibleId
    )
  }

  if (search) {
    filtered = filtered.filter(
      item =>
        [
          item.id,
          item.origen,
          item.destino,
          item.tipo,
          item.responsable,
          item.transporte
        ].some(value =>
          String(value)
            .toLowerCase()
            .includes(search)
        )
    )
  }

  return filtered
}

/* =========================
   LISTADO
========================= */

router.get(
  '/',
  (req, res) => {
    const db = readDatabase()

    const items = applyFilters(
      visibleDeliveries(
        db,
        req.user
      ),
      req.query
    )

    res.json(
      sortNewest(items)
    )
  }
)

/* =========================
   HISTORIAL
========================= */

router.get(
  '/history',
  (req, res) => {
    const db = readDatabase()

    const visible =
      visibleDeliveries(
        db,
        req.user
      ).filter(
        item =>
          item.estado ===
          'Entregada'
      )

    const items =
      applyFilters(
        visible,
        req.query
      )

    res.json(
      sortNewest(items)
    )
  }
)

/* =========================
   DETALLE
========================= */

router.get(
  '/:id',
  (req, res) => {
    const db = readDatabase()

    const delivery =
      db.deliveries.find(
        item =>
          item.id ===
          req.params.id
      )

    if (!delivery) {
      return res
        .status(404)
        .json({
          error:
            'La entrega no existe.'
        })
    }

    if (
      req.user.role ===
        'Responsable de transporte' &&
      delivery.responsableId !==
        req.user.id
    ) {
      return res
        .status(403)
        .json({
          error:
            'Esta entrega no está asignada a tu usuario.'
        })
    }

    res.json(delivery)
  }
)

/* =========================
   CREAR
========================= */

router.post(
  '/',
  authorize(
    'Coordinador logístico',
    'Administrador'
  ),
  (req, res) => {
    const {
      data,
      errors
    } = validateDelivery(
      req.body
    )

    if (
      Object.keys(errors).length
    ) {
      return res
        .status(400)
        .json({
          error:
            'Revisa los datos del formulario.',
          fieldErrors:
            errors
        })
    }

    const db = readDatabase()

    const responsible =
      db.users.find(
        user =>
          user.id ===
            data.responsableId &&
          user.active &&
          user.role ===
            'Responsable de transporte'
      )

    if (!responsible) {
      return res
        .status(400)
        .json({
          error:
            'El responsable de transporte seleccionado no es válido.',
          fieldErrors: {
            responsableId:
              'Selecciona un responsable válido.'
          }
        })
    }

    const now =
      new Date().toISOString()

    const delivery = {
      id:
        nextDeliveryId(
          db.deliveries
        ),

      origen:
        data.origen,

      destino:
        data.destino,

      tipo:
        data.tipo,

      cantidad:
        data.cantidad,

      responsableId:
        responsible.id,

      responsable:
        responsible.name,

      transporte:
        data.transporte,

      estado:
        'Pendiente',

      createdAt:
        now,

      updatedAt:
        now,

      createdBy:
        req.user.id,

      receivedAt:
        null,

      receivedBy:
        null,

      events: [
        {
          type:
            'CREATED',

          estado:
            'Pendiente',

          at:
            now,

          userId:
            req.user.id,

          userName:
            req.user.name
        }
      ]
    }

    db.deliveries.push(
      delivery
    )

    writeDatabase(db)

    res
      .status(201)
      .json(delivery)
  }
)

/* =========================
   EDITAR
========================= */

router.patch(
  '/:id',
  authorize(
    'Coordinador logístico',
    'Administrador'
  ),
  (req, res) => {
    const db =
      readDatabase()

    const delivery =
      db.deliveries.find(
        item =>
          item.id ===
          req.params.id
      )

    if (!delivery) {
      return res
        .status(404)
        .json({
          error:
            'La entrega no existe.'
        })
    }

    if (
      delivery.estado !==
      'Pendiente'
    ) {
      return res
        .status(409)
        .json({
          error:
            'Solo se pueden editar entregas que estén en estado Pendiente.'
        })
    }

    const {
      data,
      errors
    } = validateDelivery(
      req.body
    )

    if (
      Object.keys(errors).length
    ) {
      return res
        .status(400)
        .json({
          error:
            'Revisa los datos del formulario.',
          fieldErrors:
            errors
        })
    }

    const responsible =
      db.users.find(
        user =>
          user.id ===
            data.responsableId &&
          user.active &&
          user.role ===
            'Responsable de transporte'
      )

    if (!responsible) {
      return res
        .status(400)
        .json({
          error:
            'El responsable de transporte seleccionado no es válido.',
          fieldErrors: {
            responsableId:
              'Selecciona un responsable válido.'
          }
        })
    }

    const now =
      new Date().toISOString()

    delivery.origen =
      data.origen

    delivery.destino =
      data.destino

    delivery.tipo =
      data.tipo

    delivery.cantidad =
      data.cantidad

    delivery.responsableId =
      responsible.id

    delivery.responsable =
      responsible.name

    delivery.transporte =
      data.transporte

    delivery.updatedAt =
      now

    delivery.events =
      Array.isArray(
        delivery.events
      )
        ? delivery.events
        : []

    delivery.events.push({
      type:
        'UPDATED',

      estado:
        delivery.estado,

      at:
        now,

      userId:
        req.user.id,

      userName:
        req.user.name
    })

    writeDatabase(db)

    res.json(
      delivery
    )
  }
)

/* =========================
   ELIMINAR
========================= */

router.delete(
  '/:id',
  authorize(
    'Coordinador logístico',
    'Administrador'
  ),
  (req, res) => {
    const db =
      readDatabase()

    const index =
      db.deliveries.findIndex(
        item =>
          item.id ===
          req.params.id
      )

    if (index === -1) {
      return res
        .status(404)
        .json({
          error:
            'La entrega no existe.'
        })
    }

    const delivery =
      db.deliveries[index]

    if (
      delivery.estado !==
      'Pendiente'
    ) {
      return res
        .status(409)
        .json({
          error:
            'Solo se pueden eliminar entregas que estén en estado Pendiente.'
        })
    }

    db.deliveries.splice(
      index,
      1
    )

    writeDatabase(db)

    res.json({
      message:
        'Entrega eliminada correctamente.',
      id:
        delivery.id
    })
  }
)

/* =========================
   CAMBIAR ESTADO
========================= */

router.patch(
  '/:id/status',
  (req, res) => {
    const requested =
      String(
        req.body.estado || ''
      ).trim()

    if (
      !STATES.includes(
        requested
      ) ||
      requested ===
        'Entregada'
    ) {
      return res
        .status(400)
        .json({
          error:
            'Estado no permitido. La entrega se confirma mediante la recepción.'
        })
    }

    const db =
      readDatabase()

    const delivery =
      db.deliveries.find(
        item =>
          item.id ===
          req.params.id
      )

    if (!delivery) {
      return res
        .status(404)
        .json({
          error:
            'La entrega no existe.'
        })
    }

    const elevated =
      [
        'Coordinador logístico',
        'Administrador'
      ].includes(
        req.user.role
      )

    if (
      !elevated &&
      !canTransportUpdate(
        req.user,
        delivery
      )
    ) {
      return res
        .status(403)
        .json({
          error:
            'No tienes permisos para actualizar esta entrega.'
        })
    }

    if (
      delivery.estado ===
      'Entregada'
    ) {
      return res
        .status(409)
        .json({
          error:
            'Una entrega recibida ya no puede cambiar de estado.'
        })
    }

    const allowedTransitions = {
      Pendiente: [
        'Preparando'
      ],

      Preparando: [
        'En tránsito'
      ],

      'En tránsito': []
    }

    if (
      !allowedTransitions[
        delivery.estado
      ]?.includes(
        requested
      )
    ) {
      return res
        .status(409)
        .json({
          error:
            `La transición de "${delivery.estado}" a "${requested}" no está permitida.`
        })
    }

    const now =
      new Date().toISOString()

    delivery.estado =
      requested

    delivery.updatedAt =
      now

    delivery.events =
      Array.isArray(
        delivery.events
      )
        ? delivery.events
        : []

    delivery.events.push({
      type:
        'STATUS_CHANGED',

      estado:
        requested,

      at:
        now,

      userId:
        req.user.id,

      userName:
        req.user.name
    })

    writeDatabase(db)

    res.json(
      delivery
    )
  }
)

/* =========================
   CONFIRMAR RECEPCIÓN
========================= */

router.post(
  '/:id/reception',
  authorize(
    'Responsable del punto receptor',
    'Coordinador logístico',
    'Administrador'
  ),
  (req, res) => {
    const db =
      readDatabase()

    const delivery =
      db.deliveries.find(
        item =>
          item.id ===
          req.params.id
      )

    if (!delivery) {
      return res
        .status(404)
        .json({
          error:
            'La entrega no existe.'
        })
    }

    if (
      delivery.estado ===
      'Entregada'
    ) {
      return res
        .status(409)
        .json({
          error:
            'La recepción de esta entrega ya fue confirmada.'
        })
    }

    if (
      delivery.estado !==
      'En tránsito'
    ) {
      return res
        .status(409)
        .json({
          error:
            'Solo se puede confirmar la recepción de una entrega que esté en tránsito.'
        })
    }

    const now =
      new Date().toISOString()

    delivery.estado =
      'Entregada'

    delivery.updatedAt =
      now

    delivery.receivedAt =
      now

    delivery.receivedBy =
      req.user.id

    delivery.receivedByName =
      req.user.name

    delivery.events =
      Array.isArray(
        delivery.events
      )
        ? delivery.events
        : []

    delivery.events.push({
      type:
        'RECEIVED',

      estado:
        'Entregada',

      at:
        now,

      userId:
        req.user.id,

      userName:
        req.user.name
    })

    writeDatabase(db)

    res.json(
      delivery
    )
  }
)

module.exports = router