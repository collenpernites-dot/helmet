import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HardHat, Search, ShoppingCart, Menu, X, Shield, Wind, Award, CheckCircle,
  Star, Heart, Eye, Facebook, Instagram, Youtube, ArrowUp, ChevronDown, User,
} from 'lucide-react'
import { useToast } from '../components/Toast'
import evoHelmet from '../assets/evohelmet.jpg'
import hjcHelmet from '../assets/hjc-helmet.jpg'
import kytHelmet from '../assets/kyt-helmet.jpg'
import spyderHelmet from '../assets/spyder-helmet.jpg'

const featured = [
  { id: 1, name: 'AeroShield X1', category: 'Full Face', price: 4500, rating: 4.9, image: evoHelmet, sizes: ['S', 'M', 'L', 'XL'], colors: ['Matte Black', 'Red', 'White'], description: 'Aerodynamic full-face helmet with advanced visor system and moisture-wicking interior.' },
  { id: 2, name: 'RoadGuard Pro', category: 'Modular', price: 5200, rating: 4.8, image: hjcHelmet, sizes: ['M', 'L', 'XL'], colors: ['Gloss Black', 'Silver'], description: 'Flip-up modular design for commuters who need versatility and style.' },
  { id: 3, name: 'Velocity RS', category: 'Sport', price: 6800, rating: 4.9, image: kytHelmet, sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Neon Yellow', 'Black/Red'], description: 'Track-focused supersport helmet with aggressive aerodynamics.' },
  { id: 4, name: 'Urban Shield', category: 'Open Face', price: 3800, rating: 4.7, image: spyderHelmet, sizes: ['S', 'M', 'L'], colors: ['White', 'Blue'], description: 'Lightweight open-face helmet perfect for daily city commutes.' },
]

const categories = [
  { name: 'Full Face', desc: 'Maximum protection for serious riders.', image: evoHelmet },
  { name: 'Modular', desc: 'Flexibility for everyday riding.', image: hjcHelmet },
  { name: 'Open Face', desc: 'Comfort and freedom for city rides.', image: spyderHelmet },
  { name: 'Off-Road', desc: 'Built for adventure.', image: kytHelmet },
]

const features = [
  { icon: Shield, title: 'Advanced Protection', desc: 'Engineered with high-impact materials and modern safety technology.' },
  { icon: Wind, title: 'Premium Comfort', desc: 'Designed for long rides with comfortable interior padding and ventilation.' },
  { icon: Award, title: 'Modern Design', desc: 'Sporty and stylish designs for today\u2019s riders.' },
  { icon: CheckCircle, title: 'Tested for Safety', desc: 'Every helmet is designed with rider safety as the highest priority.' },
]

const reviews = [
  { name: 'Juan Dela Cruz', role: 'Daily Commuter', quote: 'The helmet feels premium, comfortable, and secure. Perfect for my daily rides.' },
  { name: 'Mark Santos', role: 'Weekend Rider', quote: 'Excellent quality and great design. The ventilation is surprisingly good.' },
  { name: 'Carlo Reyes', role: 'Touring Enthusiast', quote: 'HelmetPro gave me exactly what I was looking for. Highly recommended.' },
]

const php = (n) => '\u20B1' + n.toLocaleString()

function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>
      {children}
    </div>
  )
}

function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.max(1, Math.ceil(value / 40))
    const id = setInterval(() => {
      start += step
      if (start >= value) { setN(value); clearInterval(id) } else setN(start)
    }, 30)
    return () => clearInterval(id)
  }, [inView, value])
  return <span ref={ref}>{n}{suffix}</span>
}

export default function Landing() {
  const toast = useToast()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [favs, setFavs] = useState([])
  const [cart, setCart] = useState(0)
  const [email, setEmail] = useState('')
  const [quick, setQuick] = useState(null)
  const [qty, setQty] = useState(1)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 20); setShowTop(window.scrollY > 600) }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  const addCart = (name) => { setCart((c) => c + 1); toast.success(`${name} added to cart`) }

  const nav = ['Home', 'Helmets', 'About', 'Safety', 'Reviews', 'Contact']
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen scroll-smooth bg-gray-950 text-gray-100">
      {/* NAV */}
      <header className={`fixed inset-x-0 top-0 z-40 transition ${scrolled ? 'bg-gray-950/90 shadow-lg backdrop-blur' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#home" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="rounded-lg bg-red-600 p-1 text-white"><HardHat size={18} /></span>HelmetPro
          </a>
          <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
            {nav.map((n) => (
              <button key={n} onClick={() => scrollTo(n.toLowerCase())} className="transition hover:text-red-500">{n}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 hover:bg-white/10" aria-label="Search" onClick={() => toast.info('Search coming soon (demo)')}><Search size={18} /></button>
            <button className="relative rounded-lg p-2 hover:bg-white/10" aria-label="Cart" onClick={() => toast.info(`${cart} item(s) in cart`)}>
              <ShoppingCart size={18} />
              {cart > 0 && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-red-600 px-1.5 text-[10px] font-bold">{cart}</span>}
            </button>
            <Link to="/login" className="hidden rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 sm:block">Login</Link>
            <button className="rounded-lg p-2 md:hidden" aria-label="Menu" onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {menu && (
          <nav className="space-y-1 border-t border-white/10 bg-gray-950 px-4 py-3 md:hidden">
            {nav.map((n) => (
              <button key={n} onClick={() => { scrollTo(n.toLowerCase()); setMenu(false) }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10">{n}</button>
            ))}
            <Link to="/login" className="mt-2 block rounded-full bg-red-600 py-2 text-center text-sm font-semibold">Login</Link>
          </nav>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 inline-block rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-500">Premium Safety Gear</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Ride With Confidence.<br /><span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Protection Without Compromise.</span></h1>
            <p className="mt-4 max-w-lg text-gray-400">Discover premium motorcycle helmets engineered for comfort, safety, performance, and style.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => scrollTo('helmets')} className="rounded-full bg-red-600 px-8 py-3 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700">Shop Helmets</button>
              <button onClick={() => scrollTo('safety')} className="rounded-full border border-white/20 px-8 py-3 font-semibold transition hover:bg-white/10">Explore Collection</button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[['10K+', 'Happy Riders', 10000], ['50+', 'Helmet Models', 50], ['99%', 'Customer Satisfaction', 99], ['5', 'Average Rating', 5]].map(([v, label, num], i) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-white"><Counter value={num} suffix={i === 0 ? '+' : i === 1 ? '+' : i === 2 ? '%' : '\u2605'} /></p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="relative">
            <img src={evoHelmet} alt="Premium HelmetPro motorcycle helmet" className="mx-auto w-full max-w-md rounded-3xl shadow-2xl shadow-red-900/30 [animation:float_6s_ease-in-out_infinite]" />
          </Reveal>
        </div>
      </section>

      {/* FEATURED */}
      <section id="helmets" className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold">Featured Helmets</h2>
          <p className="mt-1 text-gray-400">Built for the road. Designed for you.</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Reveal key={p.id}>
              <div className="group overflow-hidden rounded-2xl bg-gray-900 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-red-600/40">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <button aria-label="Favorite" onClick={() => toggleFav(p.id)} className="absolute right-3 top-3 rounded-full bg-black/40 p-2 backdrop-blur transition hover:bg-red-600">
                    <Heart size={16} className={favs.includes(p.id) ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-red-500">{p.category}</p>
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-amber-400">{'\u2605'.repeat(Math.round(p.rating))} <span className="text-gray-500">{p.rating}</span></p>
                  <p className="mt-2 text-lg font-bold">{php(p.price)}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold transition hover:bg-red-700" onClick={() => addCart(p.name)}>Add to Cart</button>
                    <button aria-label="View details" className="rounded-lg border border-white/10 p-2 transition hover:bg-white/10" onClick={() => { setQuick(p); setQty(1) }}><Eye size={16} /></button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="rounded-full border border-white/20 px-8 py-3 font-semibold transition hover:bg-white/10" onClick={() => toast.info('Full catalog coming soon (demo)')}>View All Helmets</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-gray-900/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal><h2 className="text-3xl font-bold">Find Your Perfect Helmet</h2></Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Reveal key={c.name}>
                <div className="group relative h-64 overflow-hidden rounded-2xl">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition group-hover:from-black/95" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-lg font-bold">{c.name}</p>
                    <p className="text-xs text-gray-300 opacity-80 transition group-hover:opacity-100">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <Reveal><h2 className="text-3xl font-bold">Why Riders Choose HelmetPro</h2></Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Reveal key={title}>
              <div className="rounded-2xl bg-gray-900 p-5 ring-1 ring-white/10 transition hover:ring-red-600/40">
                <div className="inline-flex rounded-xl bg-red-600/10 p-3 text-red-500"><Icon size={22} /></div>
                <p className="mt-4 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-gray-400">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SAFETY */}
      <section id="safety" className="bg-gray-900/50 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <Reveal><img src={hjcHelmet} alt="Helmet safety detail" className="w-full rounded-3xl shadow-2xl" /></Reveal>
          <Reveal>
            <h2 className="text-3xl font-bold">Protection Starts With the Right Helmet</h2>
            <p className="mt-3 text-gray-400">Your helmet is your first line of defense. HelmetPro combines modern materials, thoughtful engineering, and rider-focused design to provide protection you can trust.</p>
            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {['Impact-resistant shell', 'Multi-density EPS liner', 'Secure retention system', 'Advanced ventilation', 'Comfortable interior', 'Safety-focused construction'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={16} className="text-red-500" /> {f}</li>
              ))}
            </ul>
            <button className="mt-6 rounded-full bg-red-600 px-8 py-3 font-semibold transition hover:bg-red-700" onClick={() => toast.info('Safety guide coming soon (demo)')}>Learn About Safety</button>
          </Reveal>
        </div>
      </section>

      {/* PROMO */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-red-950 p-10 ring-1 ring-red-600/30">
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-extrabold">Gear Up. Ride Further.</h2>
              <p className="mt-3 text-gray-300">Get 15% OFF your first HelmetPro purchase.</p>
              <button className="mt-6 rounded-full bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700" onClick={() => scrollTo('helmets')}>Shop Now</button>
            </div>
            <img src={kytHelmet} alt="HelmetPro promo" className="absolute -right-10 top-1/2 w-64 -translate-y-1/2 rounded-2xl opacity-70" />
          </div>
        </Reveal>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-gray-900/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal><h2 className="text-3xl font-bold">What Riders Say</h2></Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <Reveal key={r.name}>
                <div className="rounded-2xl bg-gray-900 p-5 ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 font-bold">{r.name[0]}</div>
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-amber-400">{'\u2605\u2605\u2605\u2605\u2605'}</p>
                  <p className="mt-2 text-sm text-gray-300">&ldquo;{r.quote}&rdquo;</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="contact" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold">Stay Ahead of the Ride</h2>
          <p className="mt-2 text-gray-400">Get product updates, riding tips, exclusive offers, and new helmet releases.</p>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); if (!email) return; toast.success('Thanks for subscribing!'); setEmail('') }}>
            <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 rounded-full border border-white/10 bg-gray-900 px-5 py-3 text-sm focus:border-red-500 focus:outline-none" />
            <button className="rounded-full bg-red-600 px-8 py-3 font-semibold transition hover:bg-red-700">Subscribe</button>
          </form>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-gray-950 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="flex items-center gap-2 text-lg font-bold"><span className="rounded-lg bg-red-600 p-1"><HardHat size={16} /></span>HelmetPro</p>
            <p className="mt-3 text-sm text-gray-500">Premium helmets built for riders who refuse to compromise on safety or style.</p>
            <div className="mt-4 flex gap-3 text-gray-400">
              <Facebook size={18} className="hover:text-red-500" /><Instagram size={18} className="hover:text-red-500" /><Youtube size={18} className="hover:text-red-500" />
            </div>
          </div>
          {[['Shop', ['Full Face', 'Modular', 'Open Face', 'Off-Road', 'Accessories']], ['Company', ['About Us', 'Safety', 'Our Story', 'Reviews', 'Contact']], ['Support', ['FAQs', 'Shipping', 'Returns', 'Size Guide', 'Warranty']]].map(([title, items]) => (
            <div key={title}>
              <p className="font-semibold">{title}</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                {items.map((i) => <li key={i} className="cursor-pointer hover:text-red-500">{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-white/10 px-4 pt-6 text-xs text-gray-600 sm:flex-row">
          <p>&copy; 2026 HelmetPro. All rights reserved.</p>
          <p className="flex gap-4"><span className="cursor-pointer hover:text-gray-400">Privacy Policy</span><span className="cursor-pointer hover:text-gray-400">Terms &amp; Conditions</span></p>
        </div>
      </footer>

      {/* QUICK VIEW MODAL */}
      {quick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setQuick(null)}>
          <div className="grid w-full max-w-3xl grid-cols-1 gap-6 rounded-2xl bg-gray-900 p-6 ring-1 ring-white/10 md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
            <img src={quick.image} alt={quick.name} className="h-64 w-full rounded-xl object-cover md:h-full" />
            <div>
              <button aria-label="Close" className="float-right rounded-lg p-1 hover:bg-white/10" onClick={() => setQuick(null)}><X size={18} /></button>
              <p className="text-xs uppercase tracking-wide text-red-500">{quick.category}</p>
              <h3 className="text-2xl font-bold">{quick.name}</h3>
              <p className="mt-1 text-amber-400">{'\u2605'.repeat(Math.round(quick.rating))} <span className="text-gray-500">{quick.rating}</span></p>
              <p className="mt-3 text-sm text-gray-400">{quick.description}</p>
              <p className="mt-4 text-xl font-bold">{php(quick.price)}</p>
              <div className="mt-3">
                <p className="text-xs text-gray-500">Sizes</p>
                <div className="mt-1 flex gap-2">{quick.sizes.map((s) => <span key={s} className="rounded-md border border-white/10 px-2.5 py-1 text-xs">{s}</span>)}</div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500">Colors</p>
                <div className="mt-1 flex flex-wrap gap-2">{quick.colors.map((c) => <span key={c} className="rounded-md border border-white/10 px-2.5 py-1 text-xs">{c}</span>)}</div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button aria-label="Decrease" className="rounded-lg border border-white/10 px-3 py-1" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <span className="font-bold">{qty}</span>
                <button aria-label="Increase" className="rounded-lg border border-white/10 px-3 py-1" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="flex-1 rounded-full bg-red-600 py-2.5 font-semibold transition hover:bg-red-700" onClick={() => { addCart(quick.name); setQuick(null) }}>Add to Cart</button>
                <button className="flex-1 rounded-full border border-white/20 py-2.5 font-semibold transition hover:bg-white/10" onClick={() => { toast.success('Proceeding to checkout (demo)'); setQuick(null) }}>Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCROLL TO TOP */}
      {showTop && (
        <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 rounded-full bg-red-600 p-3 shadow-lg transition hover:bg-red-700">
          <ArrowUp size={18} />
        </button>
      )}

      <style>{`@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }`}</style>
    </div>
  )
}
