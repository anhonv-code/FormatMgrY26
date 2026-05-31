import axios from 'axios'

// In dev: call localhost:8000 directly. In production: same-domain /api/* (Vercel).
const baseURL = import.meta.env.DEV ? 'http://localhost:8000' : ''

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Equipment ──────────────────────────────────────────────
export const getEquipment = () => api.get('/api/equipment').then(r => r.data)
export const createEquipment = (data) => api.post('/api/equipment', data).then(r => r.data)

// ── Downtime ───────────────────────────────────────────────
export const getDowntimeLogs = () => api.get('/api/downtime').then(r => r.data)
export const getDowntimeSummary = () => api.get('/api/downtime/summary').then(r => r.data)
export const getDowntimeByEquipment = () => api.get('/api/downtime/by-equipment').then(r => r.data)
export const createDowntimeLog = (data) => api.post('/api/downtime', data).then(r => r.data)

// ── Sales ──────────────────────────────────────────────────
export const importSalesCSV = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/api/sales/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}
export const getSalesSummary = () => api.get('/api/sales/summary').then(r => r.data)
export const getSalesByShop = () => api.get('/api/sales/by-shop').then(r => r.data)
export const getSalesByCategory = () => api.get('/api/sales/by-category').then(r => r.data)
export const getSalesByChannel = () => api.get('/api/sales/by-channel').then(r => r.data)

// ── Shops ──────────────────────────────────────────────────
export const getShops = () => api.get('/api/shops').then(r => r.data)

export default api
