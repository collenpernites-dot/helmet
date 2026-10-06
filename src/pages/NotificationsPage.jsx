import { useState } from 'react'
import { AlertTriangle, ShoppingCart, Package, Info } from 'lucide-react'
import { notifications as initial } from '../data/notifications'

const icons = {
  warning: <AlertTriangle size={18} className="text-amber-500" />,
  order: <ShoppingCart size={18} className="text-blue-500" />,
  inventory: <Package size={18} className="text-green-500" />,
  system: <Info size={18} className="text-gray-500" />,
}

export default function NotificationsPage() {
  const [items, setItems] = useState(initial)
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">All Notifications</h2>
        <button className="text-sm text-brand-600" onClick={() => setItems(items.map((n) => ({ ...n, read: true })))}>Mark all as read</button>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {items.map((n) => (
          <li key={n.id} className={`flex items-start gap-3 py-3 ${n.read ? 'opacity-60' : ''}`}>
            <div className="mt-0.5">{icons[n.type]}</div>
            <div className="flex-1">
              <p className="text-sm">{n.title}</p>
              <p className="text-xs text-gray-400">{n.time}</p>
            </div>
            {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />}
          </li>
        ))}
      </ul>
    </div>
  )
}
