'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, BarChart3, Megaphone, Rocket, Target, GraduationCap,
  PenTool, Palette, Building2, MapPin, Calendar, Search, Plug, HelpCircle,
  ChevronLeft, ChevronRight, LogOut, Phone, DollarSign, FileText, Star,
  Map, Clock, MessageSquare, Users, Crosshair, TrendingUp
} from 'lucide-react'
import { ScoopLogo } from '@/components/ui/ScoopLogo'

const iconMap: Record<string, any> = {
  LayoutDashboard, BarChart3, Megaphone, Rocket, Target, GraduationCap,
  PenTool, Palette, Building2, MapPin, Calendar, Search, Plug, HelpCircle,
  Phone, DollarSign, FileText, Star, Map, Clock, MessageSquare, Users, Crosshair, TrendingUp,
}

const navSections = [
  {
    label: 'OPERATIONS SNAPSHOT',
    items: [
      { name: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
      { name: 'Quick Launch', href: '/dashboard/quick-launch', icon: 'Rocket' },
    ],
  },
  {
    label: 'BUSINESS',
    items: [
      { name: 'My Business', href: '/dashboard/business', icon: 'Building2' },
      { name: 'Revenue & ROI', href: '/dashboard/revenue', icon: 'DollarSign' },
      { name: 'KPIs', href: '/dashboard/kpis', icon: 'BarChart3' },
      { name: 'Service Area', href: '/dashboard/service-area', icon: 'Map' },
      { name: 'Route Optimizer', href: '/dashboard/route-optimizer', icon: 'Map' },
      { name: 'Google Profile', href: '/dashboard/google-profile', icon: 'MapPin' },
      { name: 'Review Requests', href: '/dashboard/reviews', icon: 'Star' },
      { name: 'Rival Radar', href: '/dashboard/competitors', icon: 'Search' },
      { name: 'Growth Goals', href: '/dashboard/growth-goals', icon: 'TrendingUp' },
    ],
  },
  {
    label: 'CREATE',
    items: [

      { name: 'Creative', href: '/dashboard/creative', icon: 'Palette' },
      { name: 'Quote Builder', href: '/dashboard/quotes', icon: 'FileText' },
      { name: 'SMS Templates', href: '/dashboard/sms-templates', icon: 'MessageSquare' },
      { name: 'Post Scheduler', href: '/dashboard/post-scheduler', icon: 'Calendar' },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { name: 'Missions & Coaching', href: '/dashboard/missions', icon: 'Target' },
      { name: 'Lead Response', href: '/dashboard/lead-response', icon: 'Clock' },
      { name: 'Turf Tracker', href: '/dashboard/turf-tracker', icon: 'Crosshair' },
      { name: 'Ad Quick Launch', href: '/dashboard/ad-quick-launch', icon: 'Rocket' },
      { name: 'Campaigns', href: '/dashboard/campaigns', icon: 'Megaphone' },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { name: 'Connections', href: '/dashboard/settings/connections', icon: 'Plug' },
      { name: 'Help', href: '/dashboard/settings/help', icon: 'HelpCircle' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900 text-slate-200 min-h-screen flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700">
        <ScoopLogo size={40} className="flex-shrink-0 rounded-lg" />
        {!collapsed && <span className="text-lg font-bold text-white">PoopScoop HQ</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  {Icon && <Icon size={20} className="flex-shrink-0" />}
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-700 p-4">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 hover:bg-slate-800 rounded-lg p-1.5 -m-1.5 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            U
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">My Account</p>
              <p className="text-xs text-slate-400">Profile & Billing</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white mt-2 ml-11">
            <LogOut size={12} /> Logout
          </button>
        )}
      </div>
    </aside>
  )
}