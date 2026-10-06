import { useMemo, useState } from 'react'
import { Search, Eye, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { orders as initial } from '../data/orders'
import { useToast } from '../components/Toast'
import { formatPHP } from '../utils/format'

export default function Orders() {
  const toast = useToast()
  const [items, setItems] = useState(initial)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [view, setView] = useState(null)
  const [edit, setEdit] = useState(null)
  const [del, setDel] = useState(null)
  const PER = 8

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter(
      (o) =>
        (o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.helmet.toLowerCase().includes(q)) &&
        (status === 'All' || o.status === status || o.payment === status)
    )
  }, [items, search, status])
  const pages = Math.max(1, Math.ceil(filtered.length / PER))
  const rows = filtered.slice((page - 1) * PER, page * PER)

  const saveStatus = () => {
    setItems(items.map((o) => (o.id === edit.id ? edit : o)))
    toast.success('Order updated')
    setEdit(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sales / Orders</h2>
      <div className="card">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input className="input pl-9" placeholder="Search order, customer, helmet..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <select className="input w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
            {['All', 'Paid', 'Pending', 'Cancelled', 'Completed', 'Processing', 'Shipped'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="th">Order ID</th><th className="th">Customer</th><th className="th">Helmet</th>
                <th className="th">Qty</th><th className="th">Amount</th><th className="th">Payment</th>
                <th className="th">Status</th><th className="th">Date</th><th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="td font-medium">{o.id}</td>
                  <td className="td">{o.customer}</td>
                  <td className="td">{o.helmet}</td>
                  <td className="td">{o.quantity}</td>
                  <td className="td">{formatPHP(o.amount)}</td>
                  <td className="td"><StatusBadge status={o.payment} /></td>
                  <td className="td"><StatusBadge status={o.status} /></td>
                  <td className="td">{o.date}</td>
                  <td className="td">
                    <button className="icon-btn" title="View" onClick={() => setView(o)}><Eye size={16} /></button>
                    <button className="icon-btn" title="Edit" onClick={() => setEdit({ ...o })}><Pencil size={16} /></button>
                    <button className="icon-btn" title="Delete" onClick={() => setDel(o)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={9} className="td py-10 text-center text-gray-400">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>

      <Modal open={!!view} title={`Order ${view?.id}`} onClose={() => setView(null)}>
        {view && (
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Customer:</span> {view.customer}</p>
            <p><span className="text-gray-400">Helmet:</span> {view.helmet}</p>
            <p><span className="text-gray-400">Quantity:</span> {view.quantity}</p>
            <p><span className="text-gray-400">Amount:</span> {formatPHP(view.amount)}</p>
            <p><span className="text-gray-400">Payment:</span> {view.payment}</p>
            <p><span className="text-gray-400">Status:</span> {view.status}</p>
            <p><span className="text-gray-400">Date:</span> {view.date}</p>
          </div>
        )}
      </Modal>

      <Modal open={!!edit} title={`Edit ${edit?.id}`} onClose={() => setEdit(null)}>
        {edit && (
          <div className="space-y-3">
            <div><label className="label">Order Status</label>
              <select className="input" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                {['Processing', 'Shipped', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="label">Payment Status</label>
              <select className="input" value={edit.payment} onChange={(e) => setEdit({ ...edit, payment: e.target.value })}>
                {['Paid', 'Pending', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setEdit(null)}>Cancel</button>
              <button className="btn-primary" onClick={saveStatus}>Save</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!del} message={`Delete order ${del?.id}?`} onConfirm={() => { setItems(items.filter((o) => o.id !== del.id)); setDel(null); toast.success('Order deleted') }} onCancel={() => setDel(null)} />
    </div>
  )
}
