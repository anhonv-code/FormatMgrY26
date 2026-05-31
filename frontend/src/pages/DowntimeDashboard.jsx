import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import {
  getDowntimeSummary,
  getDowntimeByEquipment,
  getDowntimeLogs,
} from '../api/client'

function fmt(num, digits = 1) {
  if (num === undefined || num === null) return '—'
  return Number(num).toLocaleString('en-US', { maximumFractionDigits: digits })
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DowntimeDashboard() {
  const [summary, setSummary] = useState(null)
  const [byEquip, setByEquip] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getDowntimeSummary(), getDowntimeByEquipment(), getDowntimeLogs()])
      .then(([s, e, l]) => { setSummary(s); setByEquip(e); setLogs(l) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading dashboard…
    </div>
  )
  if (error) return (
    <div className="p-6 text-red-600">Error: {error}</div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Equipment Downtime Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Coffee machine maintenance & reliability tracker</p>
        </div>
        <Link to="/downtime/log" className="btn-primary inline-flex items-center gap-2">
          <span>➕</span> Log Incident
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Downtime Hours"
          value={`${fmt(summary?.total_hours)} hrs`}
          subtitle="All recorded incidents"
          icon="⏱"
          color="red"
        />
        <StatCard
          title="Total Incidents"
          value={fmt(summary?.total_incidents, 0)}
          subtitle="Machine breakdowns"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Maintenance Cost"
          value={`฿${fmt(summary?.total_cost, 0)}`}
          subtitle="Total repair spend"
          icon="🔧"
          color="blue"
        />
        <StatCard
          title="Estimated Revenue Loss"
          value={`฿${fmt(summary?.revenue_loss, 0)}`}
          subtitle="@ ฿3,500/hr"
          icon="📉"
          color="red"
        />
      </div>

      {/* Equipment Reliability Table */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Equipment Reliability</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left pb-2 pr-4">Equipment ID</th>
                <th className="table-header text-left pb-2 pr-4">Shop</th>
                <th className="table-header text-left pb-2 pr-4">Machine Type</th>
                <th className="table-header text-right pb-2 pr-4">Incidents</th>
                <th className="table-header text-right pb-2 pr-4">Total Hours</th>
                <th className="table-header text-left pb-2">Last Incident</th>
              </tr>
            </thead>
            <tbody>
              {byEquip.map(row => (
                <tr key={row.equipment_id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 pr-4 font-mono font-medium text-blue-700">{row.equipment_id}</td>
                  <td className="py-2.5 pr-4 text-gray-700">{row.shop_name}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{row.machine_type}</td>
                  <td className="py-2.5 pr-4 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      row.total_incidents >= 3 ? 'bg-red-100 text-red-700' :
                      row.total_incidents === 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {row.total_incidents}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-medium">{fmt(row.total_hours)}</td>
                  <td className="py-2.5 text-gray-500 text-xs">{fmtDate(row.last_incident)}</td>
                </tr>
              ))}
              {byEquip.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No incidents recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Recent Incidents</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left pb-2 pr-4">Log ID</th>
                <th className="table-header text-left pb-2 pr-4">Equipment</th>
                <th className="table-header text-left pb-2 pr-4">Shop</th>
                <th className="table-header text-left pb-2 pr-4">Breakdown</th>
                <th className="table-header text-right pb-2 pr-4">Hours</th>
                <th className="table-header text-left pb-2 pr-4">Root Cause</th>
                <th className="table-header text-right pb-2">Cost (฿)</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map(log => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{log.log_id}</td>
                  <td className="py-2.5 pr-4 font-medium text-blue-700">{log.equipment_id}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{log.shop_name}</td>
                  <td className="py-2.5 pr-4 text-xs text-gray-500">{fmtDate(log.breakdown_datetime)}</td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-red-600">{fmt(log.downtime_hours)}</td>
                  <td className="py-2.5 pr-4 text-gray-700">{log.root_cause}</td>
                  <td className="py-2.5 text-right text-gray-700">{fmt(log.maintenance_cost, 0)}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No incidents recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
