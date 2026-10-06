import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, PackagePlus, Star, ShieldCheck, Layers, Ruler, Palette, Truck, HardHat } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { useState } from 'react'
import { helmets } from '../data/helmets'
import { useToast } from '../components/Toast'
import { formatPHP } from '../utils/format'

export default function HelmetDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [del, setDel] = useState(false)
  const h = helmets.find((x) => x.id === id)

  if (!h) {
    return (
      <div className="card text-center">
        <p className="mb-4 text-gray-500">Helmet not found.</p>
        <Link to="/app/helmets" className="btn-primary inline-flex"><ArrowLeft size={16} /> Back to Inventory</Link>
      </div>
    )
  }

  const specs = [
    { icon: Layers, label: 'Material', value: h.material },
    { icon: ShieldCheck, label: 'Certification', value: h.certification },
    { icon: Ruler, label: 'Sizes', value: h.sizes.join(', ') },
    { icon: Palette, label: 'Colors', value: h.colors.join(', ') },
  ]

  return (
    <div className="space-y-5">
      <Link to="/app/helmets" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
        <ArrowLeft size={16} /> Back to Inventory
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        {/* Image card */}
        <div className="card p-3">
          <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
            {h.image ? (
              <img src={h.image} alt={h.name} className="h-80 w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center text-gray-400"><HardHat size={80} /></div>
            )}
            <span className="absolute left-4 top-4"><StatusBadge status={h.status} /></span>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur dark:bg-gray-900/70 dark:text-gray-200">
              {h.category}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-2 text-center">
            <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <p className="text-lg font-bold text-brand-600">{formatPHP(h.price)}</p>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Price</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <p className="text-lg font-bold">{h.stock}</p>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Stock</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <p className="text-lg font-bold">{h.rating}</p>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Rating</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{h.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{h.brand} · {h.category} · <span className="font-mono text-xs">{h.id}</span></p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} className={i < Math.round(h.rating) ? 'fill-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-600'} />
            ))}
            <span className="ml-1 text-sm text-gray-400">{h.rating} / 5</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{h.description}</p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-brand-500/10"><Icon size={16} /></div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 sm:col-span-2 dark:bg-gray-700/50">
              <div className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-brand-500/10"><Truck size={16} /></div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Supplier</p>
                <p className="text-sm font-semibold">{h.supplier}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5 dark:border-gray-700">
            <button className="btn-secondary" onClick={() => toast.success('Product edit opened (mock)')}><Edit size={16} /> Edit Product</button>
            <button className="btn-secondary" onClick={() => toast.success('Stock update saved (mock)')}><PackagePlus size={16} /> Update Stock</button>
            <button className="btn-danger" onClick={() => setDel(true)}><Trash2 size={16} /> Delete</button>
          </div>
        </div>
      </div>
      <ConfirmDialog open={del} message={`Delete ${h.name}?`} onConfirm={() => { toast.success('Product deleted (mock)'); navigate('/app/helmets') }} onCancel={() => setDel(false)} />
    </div>
  )
}
