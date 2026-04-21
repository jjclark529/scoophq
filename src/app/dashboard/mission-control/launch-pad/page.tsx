'use client'

import { useMemo, useState } from 'react'
import { Plus, Phone, Mail, ArrowRightLeft, Rocket } from 'lucide-react'
import { Lead, leads as initialLeads } from '@/lib/crm-data'

const stages: Lead['stage'][] = ['New Lead', 'Quote Sent', 'Follow Up', 'Scheduled', 'Customer', 'Lost Lead']

export default function LaunchPadPage() {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeads[0]?.id)
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'Website', value: '129', address: '', zone: 'North Hills', notes: '' })

  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId), [leads, selectedLeadId])

  const moveLead = (leadId: string) => {
    setLeads((prev) => prev.map((lead) => {
      if (lead.id !== leadId) return lead
      const currentIndex = stages.indexOf(lead.stage)
      const nextStage = stages[(currentIndex + 1) % stages.length]
      return { ...lead, stage: nextStage }
    }))
  }

  const addLead = () => {
    if (!form.name || !form.phone || !form.email) return
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      source: form.source,
      date: 'Today',
      value: Number(form.value),
      stage: 'New Lead',
      address: form.address,
      zone: form.zone,
      notes: form.notes || 'New lead added from Launch Pad.',
    }
    setLeads((prev) => [newLead, ...prev])
    setSelectedLeadId(newLead.id)
    setForm({ name: '', phone: '', email: '', source: 'Website', value: '129', address: '', zone: 'North Hills', notes: '' })
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold mb-3">
            <Rocket size={14} /> Launch Pad
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Lead pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Click a card to inspect details. Click “Move stage” to simulate drag-and-drop progression.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_320px] gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">Add new lead</h2>
          {[
            ['name', 'Name'], ['phone', 'Phone'], ['email', 'Email'], ['address', 'Address'], ['zone', 'Zone'], ['source', 'Source'], ['value', 'Estimated value'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                value={(form as any)[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button onClick={addLead} className="w-full rounded-xl bg-emerald-600 text-white py-3 text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Add lead
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-4 min-w-[1200px]">
            {stages.map((stage) => (
              <div key={stage} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 text-sm">{stage}</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">{leads.filter((lead) => lead.stage === stage).length}</span>
                </div>
                <div className="space-y-3">
                  {leads.filter((lead) => lead.stage === stage).map((lead) => (
                    <button key={lead.id} onClick={() => setSelectedLeadId(lead.id)} className={`w-full text-left bg-white border rounded-xl p-4 hover:border-emerald-300 transition-colors ${selectedLeadId === lead.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{lead.source}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-700">${lead.value}</span>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-gray-500">
                        <p>{lead.phone}</p>
                        <p>{lead.email}</p>
                        <p>{lead.date}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); moveLead(lead.id) }} className="mt-4 w-full rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2 text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-2">
                        <ArrowRightLeft size={14} /> Move stage
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit sticky top-6">
          <h2 className="text-lg font-semibold text-gray-900">Lead details</h2>
          {selectedLead ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xl font-bold text-gray-900">{selectedLead.name}</p>
                <p className="text-sm text-gray-500">{selectedLead.stage} • {selectedLead.zone}</p>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Phone size={14} className="text-emerald-600" /> {selectedLead.phone}</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-emerald-600" /> {selectedLead.email}</div>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Projected value</p>
                <p className="text-2xl font-bold text-gray-900">${selectedLead.value}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Address</p>
                <p className="text-sm text-gray-700">{selectedLead.address}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Notes</p>
                <p className="text-sm text-gray-700 leading-6">{selectedLead.notes}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Send quote</button>
                <button onClick={() => moveLead(selectedLead.id)} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Advance stage</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">Select a lead to review the detail panel.</p>
          )}
        </div>
      </div>
    </div>
  )
}
