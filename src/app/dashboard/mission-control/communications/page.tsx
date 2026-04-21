'use client'

import { useMemo, useState } from 'react'
import { Camera, Clock3, Mail, MessageCircle, Send, Settings2 } from 'lucide-react'
import { communications as initialCommunications, crmTemplates, customers } from '@/lib/crm-data'

const tabs = ['SMS', 'Email', 'Auto-Reminders', 'Templates'] as const

export default function CommunicationCenterPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('SMS')
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id)
  const [eta, setEta] = useState('15')
  const [message, setMessage] = useState('')
  const [communications, setCommunications] = useState(initialCommunications)

  const conversation = useMemo(() => communications.filter((item) => item.customerId === selectedCustomerId && item.channel === 'sms'), [communications, selectedCustomerId])

  const sendSms = (body: string) => {
    if (!body.trim()) return
    const customer = customers.find((item) => item.id === selectedCustomerId)
    if (!customer) return
    setCommunications((prev) => [...prev, { id: `comm-${Date.now()}`, customerId: customer.id, customerName: customer.name, channel: 'sms', direction: 'outbound', body, timestamp: 'Just now', status: 'sent' }])
    setMessage('')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold mb-3"><MessageCircle size={14} /> Communication Center</div>
        <h1 className="text-3xl font-bold text-gray-900">Customer messaging hub</h1>
        <p className="text-sm text-gray-500 mt-1">Manage SMS, email, automated reminders, and reusable templates.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'SMS' && (
        <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customers</h2>
            <div className="space-y-2">
              {customers.slice(0, 5).map((customer) => (
                <button key={customer.id} onClick={() => setSelectedCustomerId(customer.id)} className={`w-full text-left rounded-xl border p-3 ${selectedCustomerId === customer.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{customer.phone}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">SMS conversation</h2>
                <p className="text-sm text-gray-500">Send quick ETAs or completion messages with a photo attachment option.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <select value={eta} onChange={(e) => setEta(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  {['15', '30', '45', '60'].map((minutes) => <option key={minutes} value={minutes}>{minutes} min ETA</option>)}
                </select>
                <button onClick={() => sendSms(`On the way — your scoop tech will arrive in about ${eta} minutes.`)} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 flex items-center gap-2"><Clock3 size={14} /> On the way</button>
                <button onClick={() => sendSms('Job completed — your yard is all set. Photo attached.')} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Camera size={14} /> Job completed</button>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {conversation.map((item) => (
                <div key={item.id} className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${item.direction === 'outbound' ? 'ml-auto bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <p>{item.body}</p>
                  <p className={`text-[11px] mt-2 ${item.direction === 'outbound' ? 'text-emerald-100' : 'text-gray-400'}`}>{item.timestamp}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              <button onClick={() => sendSms(message)} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 flex items-center gap-2"><Send size={14} /> Send</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Email' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Mail size={18} className="text-emerald-600" /> Template-based email sends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {crmTemplates.filter((template) => template.channel === 'email').map((template) => (
              <div key={template.id} className="rounded-xl border border-gray-200 p-4">
                <p className="font-semibold text-gray-900">{template.name}</p>
                <p className="text-sm text-gray-500 mt-2">{template.content}</p>
                <button className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Use template</button>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-gray-300 p-4 bg-gray-50">
              <p className="font-semibold text-gray-900">Send history</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Welcome sequence sent to Tina Alvarez</li>
                <li>• Receipt email sent to Lisa Chen</li>
                <li>• Service pause ending reminder queued for Amy Johnson</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Auto-Reminders' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Settings2 size={18} className="text-emerald-600" /> Automated reminder rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Appointment reminder', '24h before service', true],
              ['Appointment reminder', '1h before service', true],
              ['Payment due notice', 'Morning of due date', true],
              ['Service pause ending', '48h before resume', false],
              ['Welcome sequence', 'Immediately after signup', true],
            ].map(([title, desc, enabled]) => (
              <div key={`${title}-${desc}`} className="rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
                <div className={`w-12 h-7 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-gray-300'} relative`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${enabled ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Templates' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message templates</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {crmTemplates.map((template) => (
              <div key={template.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{template.name}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{template.channel}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{template.content}</p>
                <p className="text-xs text-emerald-700 mt-3">Merge fields: {'{customer_name}'}, {'{service_date}'}, {'{eta}'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
