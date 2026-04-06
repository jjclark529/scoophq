'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Users, CreditCard, Settings, ChevronLeft,
  Shield, DollarSign, UserCircle, LogOut
} from 'lucide-react'

type AdminUser = {
  id: string
  email: string
  name: string
  role: string
  loginAt: string
}

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Feature Gates', href: '/admin/features', icon: Shield },
  { name: 'Billing', href: '/admin/billing', icon: DollarSign },
  { name: 'Profile & Admins', href: '/admin/profile', icon: UserCircle },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Skip auth check on the login page itself
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }

    const stored = localStorage.getItem('scoophq_admin')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AdminUser
        // Session valid for 24 hours
        const loginTime = new Date(parsed.loginAt).getTime()
        const now = Date.now()
        if (now - loginTime < 24 * 60 * 60 * 1000) {
          setAdmin(parsed)
          setChecking(false)
          return
        }
      } catch {}
    }

    // Not authenticated — redirect to admin login
    localStorage.removeItem('scoophq_admin')
    router.replace('/admin/login')
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('scoophq_admin')
    router.replace('/admin/login')
  }

  // Render the login page without the admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Loading state while checking auth
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!admin) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-200 min-h-screen flex flex-col flex-shrink-0">
        <div className="px-4 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-red-400" />
            <div>
              <h1 className="text-lg font-bold text-white">PoopScoop HQ Admin</h1>
              <p className="text-xs text-slate-400">Backoffice Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {adminNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-red-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Admin User Section */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin.name}</p>
              <p className="text-xs text-slate-400 truncate">{admin.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white py-1.5 rounded border border-slate-700 hover:border-slate-600">
              <ChevronLeft size={12} /> App
            </Link>
            <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300 py-1.5 rounded border border-slate-700 hover:border-red-700">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}