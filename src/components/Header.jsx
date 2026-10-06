import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Bell, AlertTriangle, ShoppingCart, Package, Info } from 'lucide-react'
import { notifications } from '../data/notifications'

const icons = {
  warning: <AlertTriangle size={16} className="text-amber-500" />,
  order: <ShoppingCart size={16} className="text-blue-500" />,
  inventory: <Package size={16} className="text-green-500" />,
  system: <Info size={16} className="text-gray-500" />,
}

export default function Header({ onMenu, title }) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
      <button className="icon-btn lg:hidden" onClick={onMenu} aria-label="Menu"><Menu size={20} /></button>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="relative ml-auto">
        <button className="icon-btn relative" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
          <Bell size={20} />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">{unread}</span>}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white p-2 shadow-xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-sm font-semibold">Notifications</p>
              <Link to="/app/notifications" className="text-xs text-brand-600" onClick={() => setOpen(false)}>View all</Link>
            </div>
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="mt-0.5">{icons[n.type]}</div>
                <div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{n.title}</p>
                  <p className="text-[11px] text-gray-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
