import { useMemo, useState } from 'react'
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { customers as initial } from '../data/customers'
import { useToast } from '../components/Toast'
import { formatPHP } from '../utils/format'

export default function Customers() {
  const toast = useToast()
  const [items, setItems] = useState(initial)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [view, setView] = useState(null)
  const [edit, setEdit] = useState(null)
  const [add, setAdd] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', email: '', phone: '', totalOrders: 0, totalSpent: 0, lastOrder: '—', status: 'Active' })
  const [err, setErr] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((c) => (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) && (status === 'All' || c.status === status))
  }, [items, search, status])

  const openAdd = () => { setForm({ id: 'CUS-' + String(items.length + 1).padStart(3, '0'), name: '', email: '', phone: '', totalOrders: 0, totalSpent: 0, lastOrder: '—', status: 'Active' }); setErr(''); setAdd(true) }
  const openEdit = (c) => { setForm({ ...c }); setErr(''); setEdit(c.id) }

  const save = (isAdd) => {
    if (!form.name.trim() || !form.email.trim()) { setErr('Name and email are required'); return }
    if (isAdd) { setItems([...items, form]); toast.success('Customer added'); setAdd(false) }
    else { setItems(items.map((c) => (c.id === edit ? form : c))); toast.success('Customer updated'); setEdit(null) }
  }

  const formFields = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      <div><label className="label">Status</label><select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}</select></div>
      {err && <p className="text-xs text-red-600 sm:col-span-2">{err}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button className="btn-secondary" onClick={() => (add ? setAdd(false) : setEdit(null))}>Cancel</button>
        <button className="btn-primary" onClick={() => save(add)}>Save Customer</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Customers</h2>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Customer</button>
      </div>
      <div className="card">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input className="input pl-9" placeholder="Search name, email, ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>{['All', 'Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="th">ID</th><th className="th">Name</th><th className="th">Email</th><th className="th">Phone</th>
              <th className="th">Orders</th><th className="th">Total Spent</th><th className="th">Last Order</th><th className="th">Status</th><th className="th">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="td font-medium">{c.id}</td><td className="td">{c.name}</td><td className="td">{c.email}</td>
                  <td className="td">{c.phone}</td><td className="td">{c.totalOrders}</td><td className="td">{formatPHP(c.totalSpent)}</td>
                  <td className="td">{c.lastOrder}</td><td className="td"><StatusBadge status={c.status} /></td>
                  <td className="td">
                    <button className="icon-btn" onClick={() => setView(c)}><Eye size={16} /></button>
                    <button className="icon-btn" onClick={() => openEdit(c)}><Pencil size={16} /></button>
                    <button className="icon-btn" onClick={() => setDel(c)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="td py-10 text-center text-gray-400">No customers found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!view} title={view?.name} onClose={() => setView(null)}>
        {view && (
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Email:</span> {view.email}</p>
            <p><span className="text-gray-400">Phone:</span> {view.phone}</p>
            <p><span className="text-gray-400">Total Orders:</span> {view.totalOrders}</p>
            <p><span className="text-gray-400">Total Spent:</span> {formatPHP(view.totalSpent)}</p>
            <p><span className="text-gray-400">Last Order:</span> {view.lastOrder}</p>
            <p><span className="text-gray-400">Status:</span> {view.status}</p>
          </div>
        )}
      </Modal>

      <Modal open={add} title="Add Customer" onClose={() => setAdd(false)}>{formFields}</Modal>
      <Modal open={!!edit} title="Edit Customer" onClose={() => setEdit(null)}>{formFields}</Modal>
      <ConfirmDialog open={!!del} message={`Delete customer ${del?.name}?`} onConfirm={() => { setItems(items.filter((c) => c.id !== del.id)); setDel(null); toast.success('Customer deleted') }} onCancel={() => setDel(null)} />
    </div>
  )
}
