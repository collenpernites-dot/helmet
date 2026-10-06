import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { suppliers as initial } from '../data/suppliers'
import { useToast } from '../components/Toast'

const EMPTY = { id: '', name: '', contact: '', email: '', phone: '', products: 0, status: 'Active' }

export default function Suppliers() {
  const toast = useToast()
  const [items, setItems] = useState(initial)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [del, setDel] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((s) => s.name.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
  }, [items, search])

  const openAdd = () => { setForm({ ...EMPTY, id: 'SUP-' + String(items.length + 1).padStart(3, '0') }); setModal('add') }
  const openEdit = (s) => { setForm({ ...s }); setModal('edit') }

  const save = () => {
    if (!form.name.trim() || !form.contact.trim()) { toast.error('Name and contact person are required'); return }
    if (modal === 'add') { setItems([...items, form]); toast.success('Supplier added') }
    else { setItems(items.map((s) => (s.id === form.id ? form : s))); toast.success('Supplier updated') }
    setModal(null)
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suppliers</h2>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Supplier</button>
      </div>
      <div className="card">
        <div className="relative mb-4 max-w-sm">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="input pl-9" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="th">ID</th><th className="th">Supplier Name</th><th className="th">Contact Person</th>
              <th className="th">Email</th><th className="th">Phone</th><th className="th">Products</th><th className="th">Status</th><th className="th">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="td font-medium">{s.id}</td><td className="td">{s.name}</td><td className="td">{s.contact}</td>
                  <td className="td">{s.email}</td><td className="td">{s.phone}</td><td className="td">{s.products} Products</td>
                  <td className="td"><StatusBadge status={s.status} /></td>
                  <td className="td">
                    <button className="icon-btn" onClick={() => openEdit(s)}><Pencil size={16} /></button>
                    <button className="icon-btn" onClick={() => setDel(s)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} title={modal === 'add' ? 'Add Supplier' : 'Edit Supplier'} onClose={() => setModal(null)}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[['name', 'Supplier Name'], ['contact', 'Contact Person'], ['email', 'Email'], ['phone', 'Phone']].map(([k, l]) => (
            <div key={k}><label className="label">{l}</label><input className="input" value={form[k]} onChange={set(k)} /></div>
          ))}
          <div><label className="label">Products Supplied</label><input type="number" className="input" value={form.products} onChange={set('products')} /></div>
          <div><label className="label">Status</label><select className="input" value={form.status} onChange={set('status')}>{['Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!del} message={`Delete supplier "${del?.name}"?`} onConfirm={() => { setItems(items.filter((s) => s.id !== del.id)); setDel(null); toast.success('Supplier deleted') }} onCancel={() => setDel(null)} />
    </div>
  )
}
