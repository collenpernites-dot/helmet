import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HardHat, Lock, Mail } from 'lucide-react'
import { useToast } from '../components/Toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  const submit = (e) => {
    e.preventDefault()
    if (email === 'admin@helmetpro.com' && password === 'admin123') {
      localStorage.setItem('hp_auth', 'true')
      if (remember) localStorage.setItem('hp_remember', email)
      toast.success('Welcome back, Admin!')
      navigate('/app/dashboard')
    } else {
      setError('Invalid email or password. Use admin@helmetpro.com / admin123')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800 md:grid-cols-2">
        <div className="hidden flex-col items-center justify-center bg-gradient-to-br from-brand-600 to-brand-700 p-10 text-white md:flex">
          <HardHat size={72} strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-bold">HelmetPro</h1>
          <p className="mt-2 text-center text-sm text-orange-100">Admin Management System for helmet inventory, sales, and staff operations.</p>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-bold">Sign in to your account</h2>
          <p className="mt-1 text-sm text-gray-500">System Administrator access</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input id="email" type="email" required className="input pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@helmetpro.com" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input id="password" type="password" required className="input pl-9" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-gray-300" />
                Remember me
              </label>
              <button type="button" className="text-brand-600" onClick={() => toast.info('Password reset link sent (mock).')}>Forgot password?</button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
          <p className="mt-4 text-xs text-gray-400">Demo: admin@helmetpro.com / admin123</p>
        </div>
      </div>
    </div>
  )
}
