export default function StatCard({ title, value, subtitle, icon, color = 'blue', trend }) {
  const colorMap = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    green:  'bg-green-50 text-green-700 border-green-100',
    red:    'bg-red-50 text-red-700 border-red-100',
    amber:  'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  }
  const iconBg = {
    blue:   'bg-blue-100 text-blue-600',
    green:  'bg-green-100 text-green-600',
    red:    'bg-red-100 text-red-600',
    amber:  'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium opacity-75 truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight truncate">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs opacity-60 truncate">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`ml-3 flex-shrink-0 rounded-lg p-2 ${iconBg[color]}`}>
            <span className="text-xl leading-none">{icon}</span>
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 text-xs font-medium opacity-75">
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
        </div>
      )}
    </div>
  )
}
