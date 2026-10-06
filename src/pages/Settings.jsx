import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/Toast'

export default function Settings() {
  const { dark, setDark } = useTheme()
  const toast = useToast()
  const [profile, setProfile] = useState({ name: 'Carlo Mendoza', email: 'admin@helmetpro.com', phone: '0917-100-2000' })
  const [company, setCompany] = useState({ company: 'HelmetPro Trading Corp.', address: '123 Rizal St, Makati City', contact: '(02) 8123-4567', currency: 'PHP (₱)' })
  const [twoFA, setTwoFA] = useState(true)

  const save = (label) => toast.success(`${label} saved successfully`)

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 font-semibold">Profile Settings</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label className="label">Full Name</label><input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
          <div><label className="label">Profile Image</label><input type="file" accept="image/*" className="input" /></div>
        </div>
        <button className="btn-primary mt-4" onClick={() => save('Profile')}>Save Profile</button>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">System Settings</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label className="label">Company Name</label><input className="input" value={company.company} onChange={(e) => setCompany({ ...company, company: e.target.value })} /></div>
          <div><label className="label">Address</label><input className="input" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} /></div>
          <div><label className="label">Contact Number</label><input className="input" value={company.contact} onChange={(e) => setCompany({ ...company, contact: e.target.value })} /></div>
          <div><label className="label">Currency</label><select className="input" value={company.currency} onChange={(e) => setCompany({ ...company, currency: e.target.value })}><option>PHP (₱)</option><option>USD ($)</option></select></div>
        </div>
        <button className="btn-primary mt-4" onClick={() => save('System settings')}>Save Settings</button>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Security</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label className="label">New Password</label><input type="password" className="input" placeholder="••••••••" /></div>
          <div><label className="label">Confirm Password</label><input type="password" className="input" placeholder="••••••••" /></div>
        </div>
        <button className="btn-primary mt-4" onClick={() => save('Password')}>Change Password</button>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div>
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-xs text-gray-400">Require a code in addition to your password.</p>
          </div>
          <button
            role="switch"
            aria-checked={twoFA}
            onClick={() => setTwoFA((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition ${twoFA ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${twoFA ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Appearance</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm">Dark mode</p>
          <button
            role="switch"
            aria-checked={dark}
            onClick={() => setDark(!dark)}
            className={`relative h-6 w-11 rounded-full transition ${dark ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${dark ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
