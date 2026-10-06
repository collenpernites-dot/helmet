import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, Pencil, Trash2, HardHat, ArrowUpDown } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { helmets as initialHelmets } from '../data/helmets'
import { useToast } from '../components/Toast'
import { formatPHP } from '../utils/format'

const EMPTY = {
  id: '', name: '', brand: '', category: 'Full Face', size: 'M', color: '',
  stock: 0, price: 0, status: 'In Stock', material: '', certification: '',
  supplier: '', description: '',
}

export default function Helmets() {
  const toast = useToast()
  const [items, setItems] = useState(initialHelmets)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [brand, setBrand] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState({ key: 'name', dir: 1 })
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [del, setDel] = useState(null)
  const PER = 8

  const brands = useMemo(() => ['All', ...new Set(items.map((h) => h.brand))], [items])
  const categories = useMemo(() => ['All', ...new Set(items.map((h) => h.category))], [items])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = items.filter(
      (h) =>
        (h.name.toLowerCase().includes(q) || h.brand.toLowerCase().includes(q) || h.category.toLowerCase().includes(q) || h.id.toLowerCase().includes(q)) &&
        (category === 'All' || h.category === category) &&
        (brand === 'All' || h.brand === brand) &&
        (status === 'All' || h.status === status)
    )
    list = [...list].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key]
      return (typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))) * sort.dir
    })
    return list
  }, [items, search, category, brand, status, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PER))
  const rows = filtered.slice((page - 1) * PER, page * PER)

  const toggleSort = (key) => { setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 })); setPage(1) }

  const openAdd = () => { setForm({ ...EMPTY, id: 'HLM-' + String(items.length + 1).padStart(3, '0') }); setErrors({}); setModal('add') }
  const openEdit = (h) => { setForm({ ...h }); setErrors({}); setModal('edit') }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.brand.trim()) e.brand = 'Required'
    if (!form.color.trim()) e.color = 'Required'
    if (Number(form.price) <= 0) e.price = 'Must be > 0'
    if (Number(form.stock) < 0) e.stock = 'Cannot be negative'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = () => {
    if (!validate()) return
    const qty = Number(form.stock)
    const status = qty === 0 ? 'Out of Stock' : qty <= 10 ? 'Low Stock' : 'In Stock'
    if (modal === 'add') {
      setItems([...items, { ...form, stock: qty, price: Number(form.price), status }])
      toast.success('Helmet added successfully')
    } else {
      setItems(items.map((h) => (h.id === form.id ? { ...form, stock: qty, price: Number(form.price), status } : h)))
      toast.success('Helmet updated successfully')
    }
    setModal(null)
  }

  const remove = () => {
    setItems(items.filter((h) => h.id !== del.id))
    setDel(null)
    toast.success('Helmet deleted')
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Helmet Inventory</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your helmet stock, pricing and availability.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Helmet</button>
      </div>

      <div className="card">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input className="input pl-9" placeholder="Search name, brand, category, ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <select className="input w-auto" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="input w-auto" value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1) }}>{brands.map((b) => <option key={b}>{b}</option>)}</select>
          <select className="input w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>{['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((s) => <option key={s}>{s}</option>)}</select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {[['id', 'Helmet ID'], ['name', 'Name'], ['brand', 'Brand'], ['category', 'Category'], ['size', 'Size'], ['color', 'Color'], ['stock', 'Stock'], ['price', 'Price']].map(([k, l]) => (
                  <th key={k} className="th cursor-pointer" onClick={() => toggleSort(k)}>
                    <span className="inline-flex items-center gap-1">{l} <ArrowUpDown size={12} /></span>
                  </th>
                ))}
                <th className="th">Status</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.id} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="td font-medium">{h.id}</td>
                  <td className="td">
                    <span className="flex items-center gap-2">
                      <span className="block overflow-hidden rounded-lg ring-1 ring-gray-200 dark:ring-gray-600">
                        {h.image ? <img src={h.image} alt={h.name} className="h-9 w-9 object-cover" /> : <span className="p-2 text-brand-600"><HardHat size={16} /></span>}
                      </span>
                      {h.name}
                    </span>
                  </td>
                  <td className="td">{h.brand}</td>
                  <td className="td">{h.category}</td>
                  <td className="td">{h.size}</td>
                  <td className="td">{h.color}</td>
                  <td className="td">{h.stock}</td>
                  <td className="td">{formatPHP(h.price)}</td>
                  <td className="td"><StatusBadge status={h.status} /></td>
                  <td className="td">
                    <Link className="icon-btn" title="View" to={`/app/helmets/${h.id}`}><Eye size={16} /></Link>
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(h)}><Pencil size={16} /></button>
                    <button className="icon-btn" title="Delete" onClick={() => setDel(h)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={10} className="td py-10 text-center text-gray-400">No helmets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>

      <Modal open={!!modal} title={modal === 'add' ? 'Add Helmet' : 'Edit Helmet'} onClose={() => setModal(null)} wide>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[['name', 'Helmet Name'], ['brand', 'Brand'], ['category', 'Category'], ['size', 'Size'], ['color', 'Color'], ['material', 'Material'], ['certification', 'Safety Certification'], ['supplier', 'Supplier']].map(([k, l]) => (
            <div key={k}>
              <label className="label">{l}</label>
              {k === 'category' ? (
                <select className="input" value={form.category} onChange={set('category')}>
                  {['Full Face', 'Modular', 'Open Face', 'Half Helmet', 'Off-Road', 'Dual Sport', 'Kids Helmet'].map((c) => <option key={c}>{c}</option>)}
                </select>
              ) : k === 'size' ? (
                <select className="input" value={form.size} onChange={set('size')}>{['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => <option key={s}>{s}</option>)}</select>
              ) : (
                <input className="input" value={form[k]} onChange={set(k)} />
              )}
              {errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>}
            </div>
          ))}
          <div>
            <label className="label">Price (₱)</label>
            <input type="number" className="input" value={form.price} onChange={set('price')} />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>
          <div>
            <label className="label">Stock Quantity</label>
            <input type="number" className="input" value={form.stock} onChange={set('stock')} />
            {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={set('description')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Product Image</label>
            <input type="file" className="input" accept="image/*" onChange={() => toast.info('Image selected (mock upload)')} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save Helmet</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} message={`Delete ${del?.name}? This action cannot be undone.`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  )
}
