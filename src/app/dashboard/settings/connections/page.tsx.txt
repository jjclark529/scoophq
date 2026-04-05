'use client'

import { useState } from 'react'
import { Plug, Check, X, Save, ChevronDown, Shield, MapPin, MessageSquare } from 'lucide-react'

const connections = [
  {
    name: 'Google',
    icon: '🔍',
    description: 'Google Ads, Analytics (GA4), Search Console',
    connected: true,
    fields: [
      { label: 'GA4 Property ID', value: '387654321', type: 'text' },
      { label: 'Search Console URL', value: 'https://poopscoophq.com', type: 'text' },
      { label: 'Google Ads Customer ID', value: '123-456-7890', type: 'text' },
    ],
  },
  {
    name: 'Google Business Profile',
    icon: '📍',
    description: 'Google Maps listing URL — powers the "Live on Google" button',
    connected: false,
    fields: [
      { label: 'Google Maps Listing URL', value: '', type: 'text' },
    ],
    storageKey: 'scoophq_google_maps_url',
  },
  {
    name: 'Meta (Facebook / Instagram)',
    icon: '📱',
    description: 'Facebook Ads, Instagram Ads performance',
    connected: true,
    fields: [
      { label: 'Ad Account ID', value: 'act_1234567890', type: 'text' },
      { label: 'Page ID', value: '9876543210', type: 'text' },
    ],
  },
  {
    name: 'Quo',
    icon: '📞',
    description: 'Calls, texts, voicemails, recordings, transcriptions',
    connected: false,
    smsCapable: true,
    fields: [
      { label: 'Quo API Key', value: '', type: 'password' },
    ],
  },
  {
    name: 'Dialpad',
    icon: '☎️',
    description: 'Business phone, SMS messaging, call analytics',
    connected: false,
    smsCapable: true,
    fields: [
      { label: 'Dialpad API Key', value: '', type: 'password' },
      { label: 'Office ID', value: '', type: 'text' },
    ],
  },
  {
    name: 'RingCentral',
    icon: '📱',
    description: 'Cloud phone, SMS, team messaging, video',
    connected: false,
    smsCapable: true,
    fields: [
      { label: 'RingCentral Client ID', value: '', type: 'text' },
      { label: 'RingCentral Client Secret', value: '', type: 'password' },
      { label: 'JWT Token', value: '', type: 'password' },
    ],
  },
  {
    name: 'Sweep&Go',
    icon: '🧹',
    description: 'Client data, subscriptions, jobs, payments',
    connected: false,
    fields: [
      { label: 'Sweep&Go API Token', value: '', type: 'password' },
      { label: 'Organization ID', value: '', type: 'text' },
    ],
  },
  {
    name: 'HubSpot (via Make)',
    icon: '🔗',
    description: 'Customer contacts, deals, pipeline activity',
    connected: false,
    fields: [
      { label: 'Make Webhook URL (Inbound)', value: '', type: 'text' },
      { label: 'Make Webhook URL (Outbound)', value: '', type: 'text' },
    ],
  },
  {
    name: 'Jobber',
    icon: '🔧',
    description: 'Jobs, invoices, clients, quotes, scheduling',
    connected: false,
    fields: [
      { label: 'Jobber API Key', value: '', type: 'password' },
      { label: 'Client ID', value: '', type: 'text' },
    ],
  },
  {
    name: 'Pipeline CRM',
    icon: '📊',
    description: 'Deals, contacts, pipeline stages, activities',
    connected: false,
    fields: [
      { label: 'Pipeline API Key', value: '', type: 'password' },
      { label: 'App Key', value: '', type: 'text' },
    ],
  },
  {
    name: 'GoHighLevel',
    icon: '🚀',
    description: 'Contacts, opportunities, campaigns, conversations',
    connected: false,
    fields: [
      { label: 'GoHighLevel API Key', value: '', type: 'password' },
      { label: 'Location ID', value: '', type: 'text' },
    ],
  },
]

const aiModels = [
  { key: 'chat', label: 'Chat Model', value: 'gpt-4o' },
  { key: 'images', label: 'Images Model', value: 'gpt-4o' },
  { key: 'analysis', label: 'Analysis Model', value: 'o4-mini' },
  { key: 'adBuilder', label: 'Ad Builder Model', value: 'gpt-4o' },
]

const modelOptions = ['gpt-4o', 'gpt-4o-mini', 'o4-mini', 'claude-sonnet', 'claude-opus']

export default function ConnectionsPage() {
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')
  const [googleMapsSaved, setGoogleMapsSaved] = useState(false)
  const [smsProvider, setSmsProvider] = useState<string | null>(null)

  // Load saved settings on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scoophq_google_maps_url')
      if (stored) {
        setGoogleMapsUrl(stored)
        setGoogleMapsSaved(true)
      }
      const storedSms = localStorage.getItem('scoophq_sms_provider')
      if (storedSms) setSmsProvider(storedSms)
    }
  })

  const selectSmsProvider = (name: string) => {
    const next = smsProvider === name ? null : name
    setSmsProvider(next)
    if (typeof window !== 'undefined') {
      if (next) localStorage.setItem('scoophq_sms_provider', next)
      else localStorage.removeItem('scoophq_sms_provider')
    }
  }

  const saveGoogleMapsUrl = () => {
    if (typeof window !== 'undefined' && googleMapsUrl.trim()) {
      localStorage.setItem('scoophq_google_maps_url', googleMapsUrl.trim())
      setGoogleMapsSaved(true)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Connections & Settings</h1>
        <p className="text-gray-500">Connect your marketing platforms, CRM, and communication tools</p>
      </div>

      {/* Connection Cards */}
      <div className="space-y-4 mb-8">
        {connections.map((conn, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{conn.icon}</span>
                <div>
                  <h3 className="font-semibold">{conn.name}</h3>
                  <p className="text-sm text-gray-500">{conn.description}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                (conn.storageKey ? googleMapsSaved : conn.connected) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {(conn.storageKey ? googleMapsSaved : conn.connected) ? <><Check size={14} /> Connected</> : <><X size={14} /> Not Connected</>}
              </span>
            </div>
            {conn.storageKey ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Listing URL</label>
                  <input
                    type="text"
                    value={googleMapsUrl}
                    onChange={(e) => { setGoogleMapsUrl(e.target.value); setGoogleMapsSaved(false) }}
                    placeholder="https://maps.google.com/?cid=... or https://goo.gl/maps/..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Paste the URL to your Google Maps business listing. This powers the &quot;Live on Google&quot; button on the Google Profile page.</p>
                </div>
                <button
                  onClick={saveGoogleMapsUrl}
                  disabled={!googleMapsUrl.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save size={14} /> {googleMapsSaved ? 'Saved' : 'Save & Connect'}
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {conn.fields.map((field, f) => (
                    <div key={f}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  {conn.connected ? (
                    <>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Reconnect</button>
                      <button className="border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50">Disconnect</button>
                    </>
                  ) : (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                      <Plug size={14} /> Connect
                    </button>
                  )}
                </div>
                {(conn as any).smsCapable && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => selectSmsProvider(conn.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center ${
                        smsProvider === conn.name
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <MessageSquare size={14} />
                      {smsProvider === conn.name ? '✅ Active SMS Provider' : 'Use for In-App SMS'}
                    </button>
                    {smsProvider === conn.name && (
                      <p className="text-xs text-green-600 mt-1 text-center">SMS messages from PoopScoop HQ will be sent through {conn.name}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Google Drive Sync */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">📁 Google Drive + Sheets Sync</h2>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Ready</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drive Folder ID</label>
            <input type="text" placeholder="Enter Google Drive Folder ID" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Sheet ID</label>
            <input type="text" placeholder="Enter Google Sheet ID" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Save size={14} /> Save Drive Sync Settings
        </button>
      </div>

      {/* What Gets Connected */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold mb-3">What gets connected</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: '📊', name: 'Google Analytics (GA4)', desc: 'Website traffic, conversions, user behavior' },
            { icon: '🔍', name: 'Search Console', desc: 'Search rankings, clicks, impressions' },
            { icon: '💰', name: 'Google Ads', desc: 'Campaign performance, spend, conversions' },
            { icon: '📘', name: 'Facebook Ads', desc: 'Ad performance, reach, engagement' },
            { icon: '📸', name: 'Instagram Ads', desc: 'Story ads, feed ads, reels performance' },
            { icon: '📞', name: 'Quo', desc: 'Calls, texts, voicemails, transcriptions' },
            { icon: '☎️', name: 'Dialpad', desc: 'Business phone, SMS, call analytics' },
            { icon: '📱', name: 'RingCentral', desc: 'Cloud phone, SMS, team messaging' },
            { icon: '🧹', name: 'Sweep&Go', desc: 'Clients, subscriptions, jobs, payments' },
            { icon: '🔗', name: 'HubSpot', desc: 'Contacts, deals, pipeline via Make' },
            { icon: '🔧', name: 'Jobber', desc: 'Jobs, invoices, clients, quotes' },
            { icon: '📊', name: 'Pipeline CRM', desc: 'Deals, contacts, pipeline stages' },
            { icon: '🚀', name: 'GoHighLevel', desc: 'Contacts, opportunities, campaigns' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-400">—</span>
              <span className="text-gray-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-4">🤖 AI Configuration</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
          <div className="flex gap-2">
            <input type="password" placeholder="sk-..." className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
            <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
              <Check size={14} /> Key Configured
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Shield size={12} /> Your API key is stored securely and never shared with other accounts.
          </p>
        </div>

        <h3 className="font-medium text-sm mb-3">Per-Workflow Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiModels.map((m) => (
            <div key={m.key}>
              <label className="block text-sm text-gray-600 mb-1">{m.label}</label>
              <select defaultValue={m.value} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                {modelOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Save size={14} /> Save AI Settings
        </button>
      </div>
    </div>
  )
}