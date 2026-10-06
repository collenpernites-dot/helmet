import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { employees as initial } from '../data/employees'
import { useToast } from '../components/Toast'

const EMPTY = { id: '', name: '', email: '', phone: '', position: 'Sales Staff', department: 'Sales', status: 'Active', joined: '' }

export default function Employees() {
  const toast = useToast()
  const [items, setItems] = useState(initial)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [del, setDel] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((e) => e.name.toLowerCase().includes(q) || e.position.toLowerCase().includes(q) || e.email.toLowerCase().includes(q))
  }, [items, search])

  const openAdd = () => { setForm({ ...EMPTY, id: 'EMP-' + String(items.length + 1).padStart(3, '0'), joined: 'Oct 06, 2026' }); setModal('add') }
  const openEdit = (e) => { setForm({ ...e }); setModal('edit') }

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email are required'); return }
    if (modal === 'add') { setItems([...items, form]); toast.success('Employee added') }
    else { setItems(items.map((e) => (e.id === form.id ? form : e))); toast.success('Employee updated') }
    setModal(null)
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Employees / Admin Staff</h2>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Employee</button>
      </div>
      <div className="card">
        <div className="relative mb-4 max-w-sm">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="input pl-9" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="th">ID</th><th className="th">Name</th><th className="th">Email</th><th className="th">Phone</th>
              <th className="th">Position</th><th className="th">Department</th><th className="th">Status</th><th className="th">Joined</th><th className="th">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="td font-medium">{e.id}</td>
                  <td className="td"><span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-500/10">{e.name[0]}</span>{e.name}</span></td>
                  <td className="td">{e.email}</td><td className="td">{e.phone}</td>
                  <td className="td">{e.position}</td><td className="td">{e.department}</td>
                  <td className="td"><StatusBadge status={e.status} /></td><td className="td">{e.joined}</td>
                  <td className="td">
                    <button className="icon-btn" onClick={() => openEdit(e)}><Pencil size={16} /></button>
                    <button className="icon-btn" onClick={() => setDel(e)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} title={modal === 'add' ? 'Add Employee' : 'Edit Employee'} onClose={() => setModal(null)}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[['name', 'Full Name'], ['email', 'Email'], ['phone', 'Phone']].map(([k, l]) => (
            <div key={k}><label className="label">{l}</label><input className="input" value={form[k]} onChange={set(k)} /></div>
          ))}
          <div><label className="label">Position</label><select className="input" value={form.position} onChange={set('position')}>{['Administrator', 'Manager', 'Inventory Staff', 'Sales Staff', 'Cashier'].map((p) => <option key={p}>{p}</option>)}</select></div>
          <div><label className="label">Department</label><select className="input" value={form.department} onChange={set('department')}>{['Management', 'Operations', 'Warehouse', 'Sales'].map((d) => <option key={d}>{d}</option>)}</select></div>
          <div><label className="label">Status</label><select className="input" value={form.status} onChange={set('status')}>{['Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!del} message={`Delete employee ${del?.name}?`} onConfirm={() => { setItems(items.filter((e) => e.id !== del.id)); setDel(null); toast.success('Employee deleted') }} onCancel={() => setDel(null)} />
    </div>
  )
}
