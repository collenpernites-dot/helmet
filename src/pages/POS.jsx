import { useMemo, useState } from 'react'
import { Search, Plus, Minus, Trash2, ShoppingCart, Receipt, X, CreditCard, Banknote, Smartphone, Landmark, Wallet } from 'lucide-react'
import { helmets } from '../data/helmets'
import { useToast } from '../components/Toast'
import { formatPHP } from '../utils/format'

export default function POS() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)
  const [method, setMethod] = useState('Cash')

  const categories = ['All', ...new Set(helmets.map((h) => h.category))]
  const products = useMemo(
    () =>
      helmets.filter(
        (h) =>
          h.stock > 0 &&
          (category === 'All' || h.category === category) &&
          (h.name.toLowerCase().includes(search.toLowerCase()) || h.brand.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, category]
  )

  const addToCart = (h) => {
    setCart((c) => {
      const found = c.find((i) => i.id === h.id)
      if (found) {
        if (found.qty >= h.stock) { toast.info(`Only ${h.stock} in stock`); return c }
        return c.map((i) => (i.id === h.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...c, { ...h, qty: 1 }]
    })
  }
  const setQty = (id, qty) => {
    if (qty <= 0) return setCart((c) => c.filter((i) => i.id !== id))
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, i.stock) } : i)))
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const discountAmt = Math.min(subtotal * (Number(discount) / 100 || 0), subtotal)
  const total = subtotal - discountAmt
  const count = cart.reduce((s, i) => s + i.qty, 0)

  const checkout = () => {
    if (cart.length === 0) return toast.info('Cart is empty')
    toast.success(`Sale completed — ${formatPHP(total)} via ${method}`)
    setCart([])
    setDiscount(0)
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
      {/* Products */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Point of Sale</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select helmets to add them to the current sale.</p>
        </div>
        <div className="card space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3 text-gray-400" />
            <input className="input rounded-full py-2.5 pl-11" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${category === c ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((h) => (
            <button key={h.id} onClick={() => addToCart(h)} className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 dark:ring-gray-700">
              <div className="relative h-28 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {h.image && <img src={h.image} alt={h.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />}
                <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold dark:bg-gray-900/70">{h.stock} left</span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{h.name}</p>
                <p className="text-[11px] text-gray-500">{h.brand}</p>
                <p className="mt-1 font-bold text-brand-600">{formatPHP(h.price)}</p>
              </div>
            </button>
          ))}
          {products.length === 0 && <p className="col-span-full py-10 text-center text-gray-400">No products available.</p>}
        </div>
      </div>

      {/* Cart */}
      <div className="card flex h-fit flex-col space-y-4 xl:sticky xl:top-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold"><ShoppingCart size={18} /> Current Sale</h3>
          {count > 0 && <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white">{count}</span>}
        </div>

        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {cart.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
              <img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{i.name}</p>
                <p className="text-xs text-gray-500">{formatPHP(i.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="icon-btn" onClick={() => setQty(i.id, i.qty - 1)}><Minus size={14} /></button>
                <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                <button className="icon-btn" onClick={() => setQty(i.id, i.qty + 1)}><Plus size={14} /></button>
              </div>
              <button className="icon-btn text-red-500" onClick={() => setQty(i.id, 0)}><Trash2 size={14} /></button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              <Receipt size={32} className="mx-auto text-gray-300" />
              <p className="mt-2 text-sm">Cart is empty</p>
            </div>
          )}
        </div>

        <div className="space-y-2 border-t border-gray-100 pt-3 text-sm dark:border-gray-700">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">{formatPHP(subtotal)}</span></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Discount (%)</span>
            <input type="number" min="0" max="100" className="input w-20 py-1 text-right" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </div>
          {discountAmt > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPHP(discountAmt)}</span></div>}
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-brand-600">{formatPHP(total)}</span></div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Payment Method</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[['Cash', Banknote], ['Card', CreditCard], ['E-Wallet', Smartphone], ['Home Credit', Landmark], ['Salmon', Wallet]].map(([m, Icon]) => (
              <button key={m} onClick={() => setMethod(m)} className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition ${method === m ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10' : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700'}`}>
                <Icon size={18} /> {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn-secondary flex-1" onClick={() => { setCart([]); setDiscount(0) }}><X size={16} /> Clear</button>
          <button className="btn-primary flex-1" onClick={checkout}><Receipt size={16} /> Charge {formatPHP(total)}</button>
        </div>
      </div>
    </div>
  )
}
