import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Eye, Package } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { helmets } from '../data/helmets'
import { formatPHP } from '../utils/format'

export default function Products() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(helmets.map((h) => h.category))]
  const list = useMemo(
    () =>
      helmets.filter(
        (h) =>
          (category === 'All' || h.category === category) &&
          (h.name.toLowerCase().includes(search.toLowerCase()) || h.brand.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, category]
  )

  const inStock = helmets.filter((h) => h.status === 'In Stock').length
  const lowStock = helmets.filter((h) => h.status === 'Low Stock').length
  const outStock = helmets.filter((h) => h.status === 'Out of Stock').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Catalog</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse, search and manage all helmet products.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-medium">
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 dark:bg-green-900/40 dark:text-green-400">{inStock} In Stock</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">{lowStock} Low Stock</span>
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 dark:bg-red-900/40 dark:text-red-400">{outStock} Out of Stock</span>
        </div>
      </div>

      {/* Search + Category pills */}
      <div className="card space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            className="input rounded-full py-2.5 pl-11"
            placeholder="Search by product name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((h) => (
          <Link
            key={h.id}
            to={`/app/helmets/${h.id}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
              {h.image ? (
                <img src={h.image} alt={h.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400"><Package size={40} /></div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-gray-700 backdrop-blur dark:bg-gray-900/70 dark:text-gray-200">
                {h.category}
              </span>
              <span className="absolute right-3 top-3">
                <StatusBadge status={h.status} />
              </span>
            </div>
            <div className="p-4">
              <p className="font-semibold leading-tight group-hover:text-brand-600">{h.name}</p>
              <p className="mt-0.5 text-xs text-gray-500">{h.brand}</p>
              <div className="mt-2 flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < Math.round(h.rating) ? 'fill-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-600'} />
                ))}
                <span className="ml-1 text-xs text-gray-400">{h.rating}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                <span className="text-lg font-bold text-brand-600">{formatPHP(h.price)}</span>
                <span className="text-xs text-gray-500">{h.stock} in stock</span>
              </div>
            </div>
          </Link>
        ))}
        {list.length === 0 && (
          <div className="col-span-full card py-16 text-center">
            <Search size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 text-gray-400">No products match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
