import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import StatCard from '../components/StatCard'
import {
  getSalesSummary,
  getSalesByShop,
  getSalesByCategory,
  getSalesByChannel,
} from '../api/client'

const COLORS = ['#0066CC', '#00B050', '#FFA500', '#9333ea', '#ef4444']

function fmt(num, digits = 0) {
  if (num === undefined || num === null) return '—'
  return Number(num).toLocaleString('en-US', { maximumFractionDigits: digits })
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: ฿{fmt(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0]
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold" style={{ color: d.payload.fill }}>{d.name}</p>
        <p>฿{fmt(d.value)} ({d.payload.percentage?.toFixed(1)}%)</p>
      </div>
    )
  }
  return null
}

export default function SalesDashboard() {
  const [summary, setSummary] = useState(null)
  const [byShop, setByShop] = useState([])
  const [byCategory, setByCategory] = useState([])
  const [byChannel, setByChannel] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getSalesSummary(), getSalesByShop(), getSalesByCategory(), getSalesByChannel()])
      .then(([s, sh, c, ch]) => {
        setSummary(s)
        setByShop(sh)
        setByCategory(c)
        setByChannel(ch)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading sales data…
    </div>
  )
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>

  // Prepare shop chart data with target
  const shopChartData = byShop.map(s => ({
    name: s.shop_name.replace('Shell Cafe ', ''),
    'Actual Sales': s.total_sales,
    'Target': s.target,
    achievement: s.achievement_pct,
  }))

  // Category pie data
  const catPieData = byCategory.map((c, i) => ({
    name: c.category,
    value: c.total_sales,
    percentage: c.percentage,
    fill: COLORS[i % COLORS.length],
  }))

  // Channel bar data
  const channelData = byChannel.map((c, i) => ({
    name: c.channel,
    Sales: c.total_sales,
    pct: c.percentage,
    fill: COLORS[i],
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Sales Report Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">February 2024 — Shell Cafe Network</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          value={`฿${fmt(summary?.total_sales)}`}
          subtitle="All shops combined"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Avg per Transaction"
          value={`฿${fmt(summary?.avg_per_transaction, 1)}`}
          subtitle="Per sale record"
          icon="🧾"
          color="blue"
        />
        <StatCard
          title="Total Transactions"
          value={fmt(summary?.total_transactions, 0)}
          subtitle="Sale records"
          icon="📋"
          color="purple"
        />
        <StatCard
          title="Achievement %"
          value={`${fmt(summary?.achievement_pct, 1)}%`}
          subtitle="vs monthly target"
          icon="🎯"
          color={summary?.achievement_pct >= 100 ? 'green' : summary?.achievement_pct >= 80 ? 'amber' : 'red'}
        />
      </div>

      {/* Charts Row 1: Sales by Shop */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Sales by Shop vs Target</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={shopChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={v => `฿${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Actual Sales" fill="#0066CC" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Shop table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header text-left pb-2 pr-4">Shop</th>
                <th className="table-header text-right pb-2 pr-4">Actual (฿)</th>
                <th className="table-header text-right pb-2 pr-4">Target (฿)</th>
                <th className="table-header text-right pb-2">Achievement</th>
              </tr>
            </thead>
            <tbody>
              {byShop.map(row => (
                <tr key={row.shop_name} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 pr-4 font-medium text-gray-800">{row.shop_name}</td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-blue-700">{fmt(row.total_sales)}</td>
                  <td className="py-2.5 pr-4 text-right text-gray-500">{fmt(row.target)}</td>
                  <td className="py-2.5 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      row.achievement_pct >= 100 ? 'bg-green-100 text-green-700' :
                      row.achievement_pct >= 80 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {fmt(row.achievement_pct, 1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row 2: Category + Channel side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Pie */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Sales by Category</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={catPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {catPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {catPieData.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.fill }} />
                  <span className="text-gray-700 flex-1">{c.name}</span>
                  <span className="font-semibold text-gray-800">฿{fmt(c.value)}</span>
                  <span className="text-gray-400">({c.percentage?.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Bar */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Dine-in vs Takeaway</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={channelData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => `฿${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val, name) => [`฿${fmt(val)}`, name]}
                contentStyle={{ fontSize: 12 }}
              />
              {channelData.map((entry, index) => (
                <Bar
                  key={entry.name}
                  dataKey="Sales"
                  data={[entry]}
                  fill={COLORS[index]}
                  radius={[6, 6, 0, 0]}
                  name={entry.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1">
            {byChannel.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-700">{c.channel}</span>
                </div>
                <span className="font-semibold text-gray-800">
                  ฿{fmt(c.total_sales)} <span className="text-gray-400 font-normal">({fmt(c.percentage, 1)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
