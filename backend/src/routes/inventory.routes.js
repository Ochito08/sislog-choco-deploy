const express = require('express')
const { query } = require('../config/db')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()
router.use(authenticate)

const managers = authorize('Coordinador logístico', 'Administrador')

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

router.get('/summary', asyncRoute(async (req, res) => {
  const [products, warehouses, critical, alerts] = await Promise.all([
    query(`SELECT count(*)::int AS value FROM products WHERE active = true`),
    query(`SELECT count(*)::int AS value FROM warehouses WHERE active = true`),
    query(`SELECT count(*)::int AS value FROM inventory_stock WHERE available_stock < minimum_stock`),
    query(`SELECT count(*)::int AS value FROM inventory_alerts WHERE resolved = false`)
  ])

  res.json({
    products: products.rows[0].value,
    warehouses: warehouses.rows[0].value,
    criticalStock: critical.rows[0].value,
    openAlerts: alerts.rows[0].value
  })
}))

router.get('/stock', asyncRoute(async (req, res) => {
  const { rows } = await query(`
    SELECT * FROM inventory_stock
    ORDER BY product_name, warehouse_name
  `)
  res.json(rows)
}))

router.get('/products', asyncRoute(async (req, res) => {
  const { rows } = await query(`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.name
  `)
  res.json(rows)
}))

router.post('/products', managers, asyncRoute(async (req, res) => {
  const { sku, barcode = null, name, description = null, categoryId = null, unit = 'unidad', minimumStock = 0, estimatedUnitCost = 0, requiresExpiry = false, requiresColdChain = false, quarantineRequired = false } = req.body || {}
  if (!String(sku || '').trim() || !String(name || '').trim()) {
    return res.status(400).json({ error: 'SKU y nombre son obligatorios.' })
  }

  const { rows } = await query(`
    INSERT INTO products(sku, barcode, name, description, category_id, unit, minimum_stock, estimated_unit_cost, requires_expiry, requires_cold_chain, quarantine_required)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `, [String(sku).trim(), barcode || null, String(name).trim(), description || null, categoryId || null, unit || 'unidad', Number(minimumStock || 0), Number(estimatedUnitCost || 0), Boolean(requiresExpiry), Boolean(requiresColdChain), Boolean(quarantineRequired)])

  res.status(201).json(rows[0])
}))

router.get('/warehouses', asyncRoute(async (req, res) => {
  const { rows } = await query(`SELECT * FROM warehouses ORDER BY name`)
  res.json(rows)
}))

router.post('/warehouses', managers, asyncRoute(async (req, res) => {
  const { code, name, warehouseType = 'Centro de acopio', municipality = null, address = null } = req.body || {}
  if (!String(code || '').trim() || !String(name || '').trim()) {
    return res.status(400).json({ error: 'Código y nombre son obligatorios.' })
  }
  const { rows } = await query(`
    INSERT INTO warehouses(code, name, warehouse_type, municipality, address)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `, [String(code).trim(), String(name).trim(), warehouseType, municipality || null, address || null])
  res.status(201).json(rows[0])
}))

router.get('/lots', asyncRoute(async (req, res) => {
  const { rows } = await query(`
    SELECT l.*, p.sku, p.name AS product_name, p.unit, w.code AS warehouse_code, w.name AS warehouse_name
    FROM lots l
    JOIN products p ON p.id = l.product_id
    JOIN warehouses w ON w.id = l.warehouse_id
    ORDER BY l.expiry_date NULLS LAST, l.created_at DESC
  `)
  res.json(rows)
}))

router.post('/lots', managers, asyncRoute(async (req, res) => {
  const { lotCode, productId, warehouseId, donationId = null, manufactureDate = null, expiryDate = null, quantity, status = 'Disponible', unitCost = 0 } = req.body || {}
  const qty = Number(quantity)
  if (!String(lotCode || '').trim() || !productId || !warehouseId || !Number.isFinite(qty) || qty < 0) {
    return res.status(400).json({ error: 'Lote, producto, almacén y cantidad válida son obligatorios.' })
  }

  const client = await require('../config/db').pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(`
      INSERT INTO lots(lot_code, product_id, donation_id, warehouse_id, manufacture_date, expiry_date, quantity_received, quantity_available, status, unit_cost)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8,$9)
      RETURNING *
    `, [String(lotCode).trim(), productId, donationId || null, warehouseId, manufactureDate || null, expiryDate || null, qty, status, Number(unitCost || 0)])

    await client.query(`
      INSERT INTO inventory_movements(movement_type, product_id, lot_id, destination_warehouse_id, quantity, reference_type, reference_id, reason, performed_by)
      VALUES ('ENTRADA',$1,$2,$3,$4,'LOTE',$2,'Registro inicial de lote',$5)
    `, [productId, result.rows[0].id, warehouseId, qty, req.user?.name || String(req.user?.id || 'Sistema')])

    await client.query('COMMIT')
    res.status(201).json(result.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}))

router.get('/fefo', asyncRoute(async (req, res) => {
  const { rows } = await query(`
    SELECT f.*, p.sku, p.name AS product_name, p.unit, w.code AS warehouse_code, w.name AS warehouse_name
    FROM fefo_available_lots f
    JOIN products p ON p.id = f.product_id
    JOIN warehouses w ON w.id = f.warehouse_id
    ORDER BY p.name, w.name, f.fefo_priority
  `)
  res.json(rows)
}))

router.get('/alerts', asyncRoute(async (req, res) => {
  const { rows } = await query(`
    SELECT a.*, p.name AS product_name, w.name AS warehouse_name
    FROM inventory_alerts a
    LEFT JOIN products p ON p.id = a.product_id
    LEFT JOIN warehouses w ON w.id = a.warehouse_id
    WHERE a.resolved = false
    ORDER BY CASE a.severity WHEN 'critica' THEN 1 WHEN 'alta' THEN 2 WHEN 'media' THEN 3 ELSE 4 END, a.created_at DESC
  `)
  res.json(rows)
}))

router.use((error, req, res, next) => {
  console.error('[WMS]', error)
  if (error.code === '23505') {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos únicos.' })
  }
  res.status(500).json({ error: 'No fue posible completar la operación de inventario.' })
})

module.exports = router
