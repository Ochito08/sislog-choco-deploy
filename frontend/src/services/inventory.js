import { apiRequest } from './api'

export const inventorySummary = () => apiRequest('/inventory/summary')
export const listInventoryStock = () => apiRequest('/inventory/stock')
export const listInventoryProducts = () => apiRequest('/inventory/products')
export const listInventoryWarehouses = () => apiRequest('/inventory/warehouses')
export const listInventoryLots = () => apiRequest('/inventory/lots')
export const listFefoLots = () => apiRequest('/inventory/fefo')
export const listInventoryAlerts = () => apiRequest('/inventory/alerts')
export const createInventoryProduct = data => apiRequest('/inventory/products', { method: 'POST', body: data })
export const createInventoryWarehouse = data => apiRequest('/inventory/warehouses', { method: 'POST', body: data })
export const createInventoryLot = data => apiRequest('/inventory/lots', { method: 'POST', body: data })
