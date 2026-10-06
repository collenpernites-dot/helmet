import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, UserCog, BarChart3,
  Bell, Settings, LogOut, HardHat, Tag, Boxes, Store,
} from 'lucide-react'

const links = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/helmets', label: 'Helmet Inventory', icon: HardHat },
  { to: '/app/products', label: 'Products', icon: Package },
  { to: '/app/pos', label: 'POS', icon: Store },
  { to: '/app/categories', label: 'Categories', icon: Tag },
  { to: '/app/orders', label: 'Sales / Orders', icon: ShoppingCart },
  { to: '/app/customers', label: 'Customers', icon: Users },
  { to: '/app/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/app/employees', label: 'Employees', icon: UserCog },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapse }) {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('hp_auth')
    navigate('/login')
  }

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onCloseMobile} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-lg transition-all duration-200 dark:bg-gray-800 lg:static lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 p-4 dark:border-gray-700">
          <div className="rounded-lg bg-brand-600 p-1.5 text-white"><HardHat size={20} /></div>
          {!collapsed && <span className="text-lg font-bold text-brand-600">HelmetPro</span>}
          <button className="icon-btn ml-auto lg:hidden" onClick={onCloseMobile}>✕</button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-500' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">A</div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">Carlo Mendoza</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
            {!collapsed && (
              <button className="icon-btn" title="Logout" onClick={logout}>
                <LogOut size={17} />
              </button>
            )}
          </div>
          <button className="btn-secondary mt-3 hidden w-full text-xs lg:flex" onClick={onToggleCollapse}>
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </aside>
    </>
  )
}
