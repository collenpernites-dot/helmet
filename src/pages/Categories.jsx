import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { categories as initial } from '../data/categories'
import { useToast } from '../components/Toast'

export default function Categories() {
  const toast = useToast()
  const [items, setItems] = useState(initial)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', description: '', products: 0, status: 'Active' })
  const [err, setErr] = useState('')
  const [del, setDel] = useState(null)

  const openAdd = () => { setForm({ id: 'CAT-' + String(items.length + 1).padStart(3, '0'), name: '', description: '', products: 0, status: 'Active' }); setErr(''); setModal('add') }
  const openEdit = (c) => { setForm({ ...c }); setErr(''); setModal('edit') }

  const save = () => {
    if (!form.name.trim()) { setErr('Category name is required'); return }
    if (modal === 'add') { setItems([...items, form]); toast.success('Category added') }
    else { setItems(items.map((c) => (c.id === form.id ? form : c))); toast.success('Category updated') }
    setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Product Categories</h2>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Category</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead><tr className="border-b border-gray-100 dark:border-gray-700">
            <th className="th">Category</th><th className="th">Description</th><th className="th">Products</th><th className="th">Status</th><th className="th">Actions</th>
          </tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 dark:border-gray-700/50">
                <td className="td font-medium">{c.name}</td>
                <td className="td">{c.description}</td>
                <td className="td">{c.products}</td>
                <td className="td"><StatusBadge status={c.status} /></td>
                <td className="td">
                  <button className="icon-btn" onClick={() => openEdit(c)}><Pencil size={16} /></button>
                  <button className="icon-btn" onClick={() => setDel(c)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} title={modal === 'add' ? 'Add Category' : 'Edit Category'} onClose={() => setModal(null)}>
        <div className="space-y-3">
          <div><label className="label">Category Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="label">Status</label><select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}</select></div>
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!del} message={`Delete category "${del?.name}"?`} onConfirm={() => { setItems(items.filter((c) => c.id !== del.id)); setDel(null); toast.success('Category deleted') }} onCancel={() => setDel(null)} />
    </div>
  )
}
