export default function StatCard({ icon: Icon, title, value, change, comparison, color }) {
  const positive = change && change.startsWith('+')
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${color || 'bg-brand-50 text-brand-600 dark:bg-brand-500/10'}`}>
          <Icon size={22} />
        </div>
      </div>
      {change && (
        <p className="mt-3 text-xs">
          <span className={positive ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>{change}</span>{' '}
          <span className="text-gray-400">{comparison}</span>
        </p>
      )}
    </div>
  )
}
