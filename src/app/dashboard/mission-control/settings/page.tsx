'use client'

import { useState } from 'react'
import { Bell, CreditCard, MapPinned, Settings, UserCog, Users } from 'lucide-react'
import { fieldTechs } from '@/lib/crm-data'

const tabs = ['Client Onboarding', 'Billing Options', 'Pricing Setup', 'Notifications', 'Service Areas', 'Staff/Techs'] as const

export default function CRMSettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Client Onboarding')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold mb-3"><Settings size={14} /> CRM Settings</div>
        <h1 className="text-3xl font-bold text-gray-900">Configure Mission Control</h1>
        <p className="text-sm text-gray-500 mt-1">Tune onboarding, pricing, notifications, service zones, and your field team.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Client Onboarding' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Users size={18} className="text-emerald-600" /> Intake form configuration</h2>
            <div className="mt-4 space-y-3">
              {['Service address', 'Gate access notes', 'Dog count', 'Billing email', 'Preferred notification channel'].map((field) => (
                <div key={field} className="flex items-center justify-between rounded-xl border border-gray-200 p-4"><span className="text-sm text-gray-700">{field}</span><span className="text-xs font-semibold text-emerald-700">Required</span></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900">Auto-create subscription</p><p className="text-sm text-gray-500 mt-1">Enabled for weekly and bi-weekly plans.</p></div>
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900">Welcome email</p><p className="text-sm text-gray-500 mt-1">Send after payment method is captured.</p></div>
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900">Default onboarding checklist</p><p className="text-sm text-gray-500 mt-1">Quote approved → Payment stored → First scoop scheduled.</p></div>
          </div>
        </div>
      )}

      {activeTab === 'Billing Options' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900 flex items-center gap-2"><CreditCard size={16} className="text-emerald-600" /> Billing mode</p><p className="text-sm text-gray-500 mt-1">Offer prepaid and postpaid plans side-by-side.</p></div>
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900">Billing cycle</p><p className="text-sm text-gray-500 mt-1">Weekly / biweekly / monthly options enabled.</p></div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900">Invoice template</p><p className="text-sm text-gray-500 mt-1">Include service frequency, skip notes, and technician summary.</p></div>
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900">Skip reason charges</p><p className="text-sm text-gray-500 mt-1">Charge customer skips, waive weather or safety holds.</p></div>
          </div>
        </div>
      )}

      {activeTab === 'Pricing Setup' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            ['Regular zone weekly', '$42 / visit'],
            ['Premium zone weekly', '$56 / visit'],
            ['Two-dog add-on', '+$8 / visit'],
            ['Initial cleanup', '$95 flat'],
            ['One-time service', '$79 flat'],
            ['Deodorizer add-on', '+$12 / visit'],
          ].map(([title, value]) => (
            <div key={title} className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900">{title}</p><p className="text-sm text-gray-500 mt-1">{value}</p></div>
          ))}
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['On the way texts', 'Enabled with ETA merge field'],
            ['Job completed notifications', 'Enabled with photo reminder'],
            ['Appointment reminders', '24h and 1h before service'],
            ['Custom email content', 'Welcome and billing reminders active'],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900 flex items-center gap-2"><Bell size={16} className="text-emerald-600" /> {title}</p><p className="text-sm text-gray-500 mt-1">{desc}</p></div>
          ))}
        </div>
      )}

      {activeTab === 'Service Areas' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900 flex items-center gap-2"><MapPinned size={16} className="text-emerald-600" /> North Hills</p><p className="text-sm text-gray-500 mt-1">Regular zone • ZIPs 92501, 92503</p></div>
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900 flex items-center gap-2"><MapPinned size={16} className="text-emerald-600" /> Lakeview</p><p className="text-sm text-gray-500 mt-1">Regular zone • ZIPs 92504, 92506</p></div>
            <div className="rounded-xl border border-gray-200 p-4"><p className="font-semibold text-gray-900 flex items-center gap-2"><MapPinned size={16} className="text-emerald-600" /> Premium East</p><p className="text-sm text-gray-500 mt-1">Premium zone • ZIPs 92507, 92508</p></div>
          </div>
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 min-h-[280px] flex items-center justify-center text-center p-8">
            <div>
              <p className="font-semibold text-gray-900">Map visualization</p>
              <p className="text-sm text-gray-500 mt-2">Zone polygons and route overlays would render here in the connected map view.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Staff/Techs' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><UserCog size={18} className="text-emerald-600" /> Field technicians</h2>
          <div className="mt-4 space-y-4">
            {fieldTechs.map((tech) => (
              <div key={tech.id} className="rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{tech.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{tech.email} • {tech.phone}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div><p className="text-xs text-gray-400">Default zone</p><p className="font-medium text-gray-900">{tech.defaultZone}</p></div>
                  <div><p className="text-xs text-gray-400">Hours</p><p className="font-medium text-gray-900">{tech.workingHours}</p></div>
                  <div><p className="text-xs text-gray-400">Target</p><p className="font-medium text-gray-900">{tech.performanceTarget} stops/day</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
