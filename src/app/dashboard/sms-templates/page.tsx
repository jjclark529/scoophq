'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Copy, Send, Pencil, Trash2, Search, Tag, Star, Check, Phone, AlertCircle } from 'lucide-react'

type Template = {
  id: string
  name: string
  category: string
  message: string
  variables: string[]
  useCount: number
  starred: boolean
}

const categories = [
  { key: 'all', label: 'All Templates', count: 0 },
  { key: 'new-lead', label: '🆕 New Lead Response', count: 4 },
  { key: 'followup', label: '🔄 Follow Up', count: 4 },
  { key: 'quote', label: '💰 Quotes', count: 3 },
  { key: 'scheduling', label: '📅 Scheduling', count: 3 },
  { key: 'review', label: '⭐ Reviews', count: 2 },
  { key: 'reactivation', label: '🔁 Reactivation', count: 2 },
  { key: 'seasonal', label: '🌸 Seasonal', count: 3 },
]

const initialTemplates: Template[] = [
  // New Lead
  { id: '1', name: 'Speed Lead Response', category: 'new-lead', message: 'Hi {name}! 👋 Thanks for reaching out to Scoop Doggy Logs. I\'d love to help you with pet waste removal. How many dogs do you have and what\'s your zip code? I\'ll get you a quick quote!', variables: ['name'], useCount: 47, starred: true },
  { id: '2', name: 'After-Hours Lead', category: 'new-lead', message: 'Hi {name}! Thanks for contacting Scoop Doggy Logs. We\'re currently closed but I\'ll get back to you first thing tomorrow morning! In the meantime, check out our services at poopscoophq.com 🐕', variables: ['name'], useCount: 12, starred: false },
  { id: '3', name: 'Google Ads Lead', category: 'new-lead', message: 'Hey {name}! Saw you\'re interested in pet waste removal. We service the {area} area and can usually start within a few days. Want me to put together a quick quote? Just need to know # of dogs and yard size!', variables: ['name', 'area'], useCount: 31, starred: true },
  { id: '4', name: 'Referral Welcome', category: 'new-lead', message: 'Hi {name}! {referrer} mentioned you might need help keeping your yard clean. We\'d love to take care of that for you! As a referred customer, your first cleanup is on us. 🎉', variables: ['name', 'referrer'], useCount: 8, starred: false },

  // Follow Up
  { id: '5', name: 'Gentle Follow Up (Day 2)', category: 'followup', message: 'Hey {name}! Just checking in — did you have any questions about our pet waste removal service? Happy to help! 🐾', variables: ['name'], useCount: 38, starred: true },
  { id: '6', name: 'Value Add Follow Up', category: 'followup', message: 'Hi {name}! Quick reminder — we\'re currently running a special: first cleanup free with any weekly plan. Want me to get you set up? This offer ends {date}. 🍦', variables: ['name', 'date'], useCount: 22, starred: false },
  { id: '7', name: 'Last Chance Follow Up', category: 'followup', message: 'Hey {name}, I wanted to reach out one more time. We\'d love to help keep your yard clean. If you\'re not interested right now, totally understand! Just know we\'re here whenever you need us. 👍', variables: ['name'], useCount: 15, starred: false },
  { id: '8', name: 'No Response Breakup', category: 'followup', message: 'Hi {name} — I\'ve reached out a few times and want to respect your time. I\'ll stop texting, but if you ever need pet waste removal, we\'re just a text away! Have a great day. 🙏', variables: ['name'], useCount: 9, starred: false },

  // Quotes
  { id: '9', name: 'Send Quote', category: 'quote', message: 'Hey {name}! Here\'s your quote:\n\n🐕 {service} — ${price}/{frequency}\n📍 {area}\n🐾 {dogs} dog(s)\n\nFirst cleanup is FREE! Want to get started? Just reply YES and I\'ll schedule you. 🎉', variables: ['name', 'service', 'price', 'frequency', 'area', 'dogs'], useCount: 42, starred: true },
  { id: '10', name: 'Quote Follow Up', category: 'quote', message: 'Hey {name}! Just wanted to check if you had any questions about the quote I sent. Happy to adjust the plan or schedule a call if that\'s easier! 📞', variables: ['name'], useCount: 25, starred: false },
  { id: '11', name: 'Quote Accepted', category: 'quote', message: '🎉 Awesome, {name}! You\'re all set. Your first cleanup is scheduled for {date}. Our team will arrive between {time}. No need to be home — just make sure the gate is accessible. See you then!', variables: ['name', 'date', 'time'], useCount: 33, starred: false },

  // Scheduling
  { id: '12', name: 'Appointment Reminder', category: 'scheduling', message: 'Hi {name}! Friendly reminder — your yard cleanup is scheduled for tomorrow ({date}). Our crew will arrive between {time}. Any special instructions? 🐕', variables: ['name', 'date', 'time'], useCount: 56, starred: true },
  { id: '13', name: 'On The Way', category: 'scheduling', message: 'Hey {name}! Our team is heading your way — we\'ll be there in about {eta} minutes. 🚗💨', variables: ['name', 'eta'], useCount: 44, starred: false },
  { id: '14', name: 'Job Complete', category: 'scheduling', message: 'All done, {name}! Your yard is looking great. 🐕✨ Have a wonderful day! If you ever need anything, just text us here.', variables: ['name'], useCount: 51, starred: false },

  // Reviews
  { id: '15', name: 'Review Request', category: 'review', message: 'Hi {name}! 🐕 Thanks for choosing Scoop Doggy Logs. Would you mind leaving us a quick Google review? It helps other pet owners find us!\n\n⭐ {review_link}\n\nThank you so much!', variables: ['name', 'review_link'], useCount: 87, starred: true },
  { id: '16', name: 'Review Thank You', category: 'review', message: 'Hey {name}! We just saw your review — THANK YOU so much! 🙏 It really means the world to our small team. We\'re lucky to have customers like you! 🍦', variables: ['name'], useCount: 19, starred: false },

  // Reactivation
  { id: '17', name: 'Win Back', category: 'reactivation', message: 'Hey {name}! We miss you at Scoop Doggy Logs! 🐕 We\'ve added some new services and would love to have you back. How about 50% off your first month? Reply DEAL to claim!', variables: ['name'], useCount: 11, starred: false },
  { id: '18', name: 'Season Restart', category: 'reactivation', message: 'Hi {name}! Spring is here and so are we! 🌸 Ready to get your yard back in shape? Your old plan is still available — just say the word and we\'ll get you scheduled this week.', variables: ['name'], useCount: 14, starred: false },

  // Seasonal
  { id: '19', name: 'Spring Cleanup', category: 'seasonal', message: '🌸 Spring is here, {name}! Time to get your yard fresh and clean. Book a Spring Deep Clean + weekly service and get the deep clean FREE. Limited spots — reply to claim yours!', variables: ['name'], useCount: 18, starred: false },
  { id: '20', name: 'Summer Heat Warning', category: 'seasonal', message: '☀️ Hey {name}! Tucson heat means pet waste breaks down faster and smells worse. Don\'t let it bake! Our weekly service keeps your yard fresh all summer. Want to start?', variables: ['name'], useCount: 7, starred: false },
  { id: '21', name: 'Holiday Gift Cards', category: 'seasonal', message: '🎁 Hey {name}! Looking for a unique gift? Scoop Doggy Logs gift cards are perfect for any pet owner. 3 months of service for $499 (save $40!). DM us to grab one!', variables: ['name'], useCount: 5, starred: false },
]

export default function SMSTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [smsProvider, setSmsProvider] = useState<string | null>(null)
  const [sendingTemplate, setSendingTemplate] = useState<string | null>(null)
  const [sendTo, setSendTo] = useState('')
  const [sendStatus, setSendStatus] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scoophq_sms_provider')
      if (stored) setSmsProvider(stored)
    }
  }, [])

  const filtered = templates.filter((t) => {
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Update category counts
  categories[0].count = templates.length
  categories.forEach((cat, i) => {
    if (i > 0) cat.count = templates.filter(t => t.category === cat.key).length
  })

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="text-green-500" /> SMS Templates
          </h1>
          <p className="text-gray-500">Pre-written text messages for every customer interaction</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} /> New Template
        </button>
      </div>

      {/* SMS Provider Status */}
      <div className={`rounded-xl p-3 mb-6 flex items-center justify-between ${smsProvider ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        <div className="flex items-center gap-2">
          {smsProvider ? (
            <>
              <Check size={16} className="text-green-600" />
              <span className="text-sm text-green-700">Sending SMS via <strong>{smsProvider}</strong></span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-amber-600" />
              <span className="text-sm text-amber-700">No SMS provider configured. <a href="/dashboard/settings/connections" className="underline font-medium">Set one up in Connections →</a></span>
            </>
          )}
        </div>
        {smsProvider && (
          <a href="/dashboard/settings/connections" className="text-xs text-green-600 hover:underline">Change provider</a>
        )}
      </div>

      {/* Send SMS Modal */}
      {sendingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-1">Send SMS</h3>
            <p className="text-sm text-gray-500 mb-4">via {smsProvider}</p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">{templates.find(t => t.id === sendingTemplate)?.message}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  placeholder="(520) 555-0000"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            {sendStatus && (
              <div className={`rounded-lg p-3 mb-4 text-sm ${sendStatus === 'sent' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {sendStatus === 'sent' ? '✅ Message sent successfully!' : '❌ Failed to send. Check your connection.'}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setSendingTemplate(null); setSendTo(''); setSendStatus(null) }}
                className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => { setSendStatus('sent'); setTimeout(() => { setSendingTemplate(null); setSendTo(''); setSendStatus(null) }, 1500) }}
                disabled={!sendTo.trim()}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={14} /> Send via {smsProvider}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 ${
                    selectedCategory === cat.key ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template List */}
        <div className="lg:col-span-3 space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <MessageSquare className="text-gray-300 mx-auto mb-2" size={32} />
              <p className="text-gray-500">No templates found</p>
            </div>
          )}
          {filtered.map((template) => (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {template.starred && <Star size={14} className="text-amber-400 fill-amber-400" />}
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {categories.find(c => c.key === template.category)?.label.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">Used {template.useCount}x</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{template.message}</p>
                </div>

                {template.variables.length > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Tag size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Variables:</span>
                    {template.variables.map((v) => (
                      <span key={v} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono">{`{${v}}`}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(template.id, template.message)}
                    className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    {copied === template.id ? <><Check size={14} className="text-green-500" /> Copied!</> : <><Copy size={14} /> Copy</>}
                  </button>
                  <button className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 flex items-center gap-1">
                    <Send size={14} /> Use in Followup
                  </button>
                  {smsProvider && (
                    <button
                      onClick={() => setSendingTemplate(template.id)}
                      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Phone size={14} /> Send SMS
                    </button>
                  )}
                  <button className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    <Pencil size={14} /> Edit
                  </button>
                  <button className="text-sm border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}