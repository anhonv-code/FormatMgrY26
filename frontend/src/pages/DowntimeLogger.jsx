import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEquipment, createDowntimeLog } from '../api/client'

export default function DowntimeLogger() {
  const navigate = useNavigate()
  const [equipment, setEquipment] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    equipment_id: '',
    breakdown_datetime: '',
    repair_datetime: '',
    root_cause: '',
    maintenance_cost: '',
    notes: '',
  })

  useEffect(() => {
    getEquipment().then(setEquipment).catch(() => {})
  }, [])

  // Auto-calculate downtime hours for display
  const downtimeHours = (() => {
    if (!form.breakdown_datetime || !form.repair_datetime) return null
    const diff = (new Date(form.repair_datetime) - new Date(form.breakdown_datetime)) / 3600000
    return diff > 0 ? diff.toFixed(2) : null
  })()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.equipment_id) { setError('Please select equipment.'); return }
    if (!form.breakdown_datetime) { setError('Please enter breakdown date/time.'); return }
    if (!form.repair_datetime) { setError('Please enter repair date/time.'); return }
    if (!form.root_cause.trim()) { setError('Please enter root cause.'); return }
    if (!downtimeHours || Number(downtimeHours) <= 0) {
      setError('Repair time must be after breakdown time.')
      return
    }

    setSubmitting(true)
    try {
      await createDowntimeLog({
        equipment_id: form.equipment_id,
        breakdown_datetime: new Date(form.breakdown_datetime).toISOString(),
        repair_datetime: new Date(form.repair_datetime).toISOString(),
        root_cause: form.root_cause,
        maintenance_cost: parseFloat(form.maintenance_cost) || 0,
        notes: form.notes || null,
      })
      setSuccess('Incident logged successfully!')
      setForm({
        equipment_id: '',
        breakdown_datetime: '',
        repair_datetime: '',
        root_cause: '',
        maintenance_cost: '',
        notes: '',
      })
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedEquip = equipment.find(e => e.equipment_id === form.equipment_id)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Log Downtime Incident</h1>
        <p className="text-sm text-gray-500 mt-0.5">Record a coffee machine breakdown event</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm flex items-center gap-2">
          <span>✅</span> {success}
          <button onClick={() => navigate('/downtime')} className="ml-auto text-green-600 underline text-xs">
            View Dashboard
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipment <span className="text-red-500">*</span>
          </label>
          <select
            name="equipment_id"
            value={form.equipment_id}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select equipment…</option>
            {equipment.map(e => (
              <option key={e.equipment_id} value={e.equipment_id}>
                {e.equipment_id} — {e.shop_name} / {e.machine_type}
              </option>
            ))}
          </select>
          {selectedEquip && (
            <p className="mt-1 text-xs text-gray-400">
              Shop: {selectedEquip.shop_name} | Type: {selectedEquip.machine_type} | Status: {selectedEquip.status}
            </p>
          )}
        </div>

        {/* Datetimes */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breakdown Date/Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="breakdown_datetime"
              value={form.breakdown_datetime}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repair Date/Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="repair_datetime"
              value={form.repair_datetime}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Auto-calculated downtime */}
        {downtimeHours !== null && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-sm text-blue-700 flex items-center gap-2">
            <span>⏱</span>
            <span>Calculated downtime: <strong>{downtimeHours} hours</strong></span>
            <span className="text-blue-400">|</span>
            <span>Est. revenue loss: <strong>฿{(downtimeHours * 3500).toLocaleString()}</strong></span>
          </div>
        )}

        {/* Root Cause */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Root Cause <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="root_cause"
            value={form.root_cause}
            onChange={handleChange}
            placeholder="e.g. Pump failure, Boiler issue…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Maintenance Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maintenance Cost (฿)
          </label>
          <input
            type="number"
            name="maintenance_cost"
            value={form.maintenance_cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional observations or technician notes…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? 'Saving…' : 'Save Incident'}
          </button>
          <button type="button" onClick={() => navigate('/downtime')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
