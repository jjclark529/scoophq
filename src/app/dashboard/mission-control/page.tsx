'use client'

import { CalendarDays, CircleDollarSign, Command, Route, Users, UserPlus, ClipboardList, ArrowRight } from 'lucide-react'
import { crmActivity, customers, leads, routes, jobs } from '@/lib/crm-data'

const todayJobs = jobs.filter((job) => job.scheduledAt.startsWith('2026-04-22'))
const activeCustomers = customers.filter((customer) => customer.status === 'active')
const monthlyRevenue = customers.filter((customer) => customer.status === 'active').reduce((sum, customer) => sum + customer.monthlyValue, 0)

const kpis = [
  { label: 'Total Active Customers', value: activeCustomers.length, detail: '4 on recurring service', icon: Users },
  { label: 'Upcoming Scoops', value: `${todayJobs.length} today`, detail: '5 this week scheduled', icon: ClipboardList },
  { label: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, detail: 'Projected recurring revenue', icon: CircleDollarSign },
  { label: 'Leads Waiting', value: leads.filter((lead) => lead.stage !== 'Customer' && lead.stage !== 'Lost Lead').length, detail: 'Need follow-up this week', icon: UserPlus },
  { label: 'Routes Today', value: routes.filter((route) => route.day === 'Tuesday').length, detail: '2 techs rolling today', icon: Route },
]

export default function MissionControlDashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-xs font-semibold mb-3">
            <Command size={14} /> Mission Control
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CRM command center</h1>
          <p className="text-sm text-gray-500 mt-1">Keep leads, routes, billing, and customer communication moving from one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">Add new lead</button>
          <button className="px-4 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">Dispatch route</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-2">{kpi.detail}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
                <p className="text-sm text-gray-500">Live updates across leads, routing, referrals, and billing.</p>
              </div>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">Open activity log <ArrowRight size={15} /></button>
            </div>
            <div className="space-y-4">
              {crmActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-gray-400">{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['Create invoice', 'Prepare a new bill tied to a customer subscription.'],
                ['Send on-the-way text', 'Alert the next stop with ETA and assigned tech.'],
                ['Pause service', 'Apply a vacation hold with resume date.'],
                ['Review leads', 'Move pending quotes forward before the week closes.'],
              ].map(([title, desc]) => (
                <button key={title} className="text-left rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors p-4">
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={18} className="text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Today&apos;s schedule</h2>
            </div>
            <div className="space-y-3">
              {todayJobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{job.customerName}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{job.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{job.techName} • ETA {job.etaMinutes} min</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(job.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} • {job.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline snapshot</h2>
            <div className="space-y-3">
              {['New Lead', 'Quote Sent', 'Follow Up', 'Scheduled', 'Customer', 'Lost Lead'].map((stage) => (
                <div key={stage} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{stage}</span>
                  <span className="font-semibold text-gray-900">{leads.filter((lead) => lead.stage === stage).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
