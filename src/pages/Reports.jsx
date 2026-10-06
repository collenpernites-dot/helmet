import { FileText, FileSpreadsheet, Printer } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { monthlySales } from '../data/sales'
import { useToast } from '../components/Toast'
import { formatPHP } from '../utils/format'

const inventory = [
  { label: 'Total Inventory', value: '1,248 units' },
  { label: 'Low Stock', value: '18 items' },
  { label: 'Out of Stock', value: '2 items' },
  { label: 'Most Popular', value: 'AeroShield X1' },
]
const customers = [
  { label: 'New Customers (30d)', value: '42' },
  { label: 'Returning', value: '118' },
  { label: 'Top Customer', value: 'Jose Reyes — ₱41,200' },
]

export default function Reports() {
  const toast = useToast()
  const mock = (what) => toast.success(`${what} generated successfully (mock)`)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => mock('CSV export')}><FileSpreadsheet size={16} /> Export CSV</button>
        <button className="btn-secondary" onClick={() => mock('PDF export')}><FileText size={16} /> Export PDF</button>
        <button className="btn-secondary" onClick={() => mock('Print report')}><Printer size={16} /> Print Report</button>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Sales Report</h2>
        <div className="mb-4 flex flex-wrap gap-6 text-sm">
          <div><p className="text-gray-400">Daily Sales</p><p className="text-lg font-bold">{formatPHP(18450)}</p></div>
          <div><p className="text-gray-400">Weekly Sales</p><p className="text-lg font-bold">{formatPHP(122300)}</p></div>
          <div><p className="text-gray-400">Monthly Sales</p><p className="text-lg font-bold">{formatPHP(428560)}</p></div>
          <div><p className="text-gray-400">Annual Sales</p><p className="text-lg font-bold">{formatPHP(4358000)}</p></div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" /><YAxis tickFormatter={(v) => `₱${v / 1000}k`} />
              <Tooltip formatter={(v) => formatPHP(v)} />
              <Bar dataKey="sales" fill="#e64a19" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-semibold">Inventory Report</h2>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {inventory.map((i) => (
              <li key={i.label} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-500">{i.label}</span><span className="font-semibold">{i.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="mb-4 font-semibold">Customer Report</h2>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {customers.map((i) => (
              <li key={i.label} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-500">{i.label}</span><span className="font-semibold">{i.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
