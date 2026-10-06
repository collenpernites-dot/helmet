import { Link } from 'react-router-dom'
import { HardHat, Package, AlertTriangle, ShoppingCart, Users, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { monthlySales } from '../data/sales'
import { orders } from '../data/orders'
import { formatPHP } from '../utils/format'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={HardHat} title="Total Helmets" value="1,248" change="+4.2%" comparison="vs last month" />
        <StatCard icon={Package} title="Available Stock" value="982" change="+2.1%" comparison="vs last month" color="bg-green-50 text-green-600 dark:bg-green-500/10" />
        <StatCard icon={AlertTriangle} title="Low Stock Items" value="18" change="-3.4%" comparison="vs last month" color="bg-amber-50 text-amber-600 dark:bg-amber-500/10" />
        <StatCard icon={ShoppingCart} title="Sold This Month" value="266" change="+8.7%" comparison="vs last month" color="bg-blue-50 text-blue-600 dark:bg-blue-500/10" />
        <StatCard icon={Users} title="Total Customers" value="524" change="+5.3%" comparison="vs last month" color="bg-purple-50 text-purple-600 dark:bg-purple-500/10" />
        <StatCard icon={DollarSign} title="Total Sales" value={formatPHP(428560)} change="+12.4%" comparison="vs last month" color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" />
      </div>

      <div className="card">
        <h2 className="mb-4 text-base font-semibold">Monthly Sales Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₱${v / 1000}k`} />
              <Tooltip formatter={(v) => formatPHP(v)} />
              <Line type="monotone" dataKey="sales" stroke="#e64a19" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Orders</h2>
          <Link to="/app/orders" className="text-sm text-brand-600">View all</Link>
        </div>
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="th">Order ID</th><th className="th">Customer</th><th className="th">Helmet</th>
              <th className="th">Qty</th><th className="th">Amount</th><th className="th">Payment</th>
              <th className="th">Status</th><th className="th">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id} className="border-b border-gray-50 dark:border-gray-700/50">
                <td className="td font-medium">{o.id}</td>
                <td className="td">{o.customer}</td>
                <td className="td">{o.helmet}</td>
                <td className="td">{o.quantity}</td>
                <td className="td">{formatPHP(o.amount)}</td>
                <td className="td"><StatusBadge status={o.payment} /></td>
                <td className="td"><StatusBadge status={o.status} /></td>
                <td className="td">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
