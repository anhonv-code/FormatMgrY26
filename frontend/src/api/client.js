import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// ── Equipment ──────────────────────────────────────────────
export const getEquipment = () => api.get('/equipment').then(r => r.data)
export const createEquipment = (data) => api.post('/equipment', data).then(r => r.data)

// ── Downtime ───────────────────────────────────────────────
export const getDowntimeLogs = () => api.get('/downtime').then(r => r.data)
export const getDowntimeSummary = () => api.get('/downtime/summary').then(r => r.data)
export const getDowntimeByEquipment = () => api.get('/downtime/by-equipment').then(r => r.data)
export const createDowntimeLog = (data) => api.post('/downtime', data).then(r => r.data)

// ── Sales ──────────────────────────────────────────────────
export const importSalesCSV = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/sales/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}
export const getSalesSummary = () => api.get('/sales/summary').then(r => r.data)
export const getSalesByShop = () => api.get('/sales/by-shop').then(r => r.data)
export const getSalesByCategory = () => api.get('/sales/by-category').then(r => r.data)
export const getSalesByChannel = () => api.get('/sales/by-channel').then(r => r.data)

// ── Shops ──────────────────────────────────────────────────
export const getShops = () => api.get('/shops').then(r => r.data)

export default api
