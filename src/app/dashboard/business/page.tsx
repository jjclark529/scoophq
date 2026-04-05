'use client'

import { useState } from 'react'
import { Upload, Palette, Save, Trash2, Pencil } from 'lucide-react'

const logoVariants = [
  { name: 'Primary', active: true },
  { name: 'Stacked', active: false },
  { name: 'Icon Only', active: false },
]

export default function BusinessPage() {
  const [colors, setColors] = useState({ primary: '#d9731d', secondary: '#23997d', secondaryDark: '#8b4513' })
  const [targets, setTargets] = useState({ cpa: '42', leads: '15', roas: '8.0', callTracking: '' })

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Business Profile</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
          </div>
          <span className="text-sm text-gray-500">85% complete</span>
        </div>
      </div>

      {/* Logo & Brand Colors */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette size={20} /> Logo & Brand Colors
        </h2>
        <p className="text-sm text-gray-500 mb-4">Used in AI-generated creatives and ad copy</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload logo</p>
              <p className="text-xs text-gray-400">PNG, JPG, SVG</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Saved Logo Variants</h3>
              <div className="space-y-2">
                {logoVariants.map((logo, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                      <span className="text-sm font-medium">{logo.name}</span>
                      {logo.active && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Active</span>}
                    </div>
                    <div className="flex gap-1">
                      <button className="text-xs text-blue-600 hover:underline">Use</button>
                      <button className="p-1 text-gray-400 hover:text-gray-600"><Pencil size={12} /></button>
                      <button className="p-1 text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="space-y-3">
            {Object.entries(colors).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <input type="color" value={val} onChange={(e) => setColors({ ...colors, [key]: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
                <div>
                  <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-xs text-gray-500">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Voice & Identity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">🤖 Brand Voice & Identity <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded ml-2">AI-Powered</span></h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Voice & Tone</label>
            <textarea rows={3} placeholder="Describe your brand's voice (e.g., friendly, professional, humorous...)" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" defaultValue="Friendly, reliable, community-focused. We use humor when appropriate but always maintain professionalism. We're the neighbors you can count on." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Active Offers & Promotions</label>
            <textarea rows={2} placeholder="Current deals, discounts, seasonal offers..." className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" defaultValue="First cleanup free with any weekly plan. $10 off monthly plans for new customers." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <textarea rows={2} placeholder="Who are your ideal customers?" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" defaultValue="Homeowners with dogs in Tucson, AZ metro area. Busy professionals, families, and elderly pet owners who value a clean yard." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Notes</label>
            <textarea rows={2} placeholder="Any notes for AI to consider when generating reports..." className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      {/* Performance Targets */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">🎯 Performance Targets <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded ml-2">Tracked</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target CPA ($/lead)</label>
            <input type="text" value={targets.cpa} onChange={(e) => setTargets({ ...targets, cpa: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Leads (monthly)</label>
            <input type="text" value={targets.leads} onChange={(e) => setTargets({ ...targets, leads: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target ROAS</label>
            <input type="text" value={targets.roas} onChange={(e) => setTargets({ ...targets, roas: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call Tracking Number</label>
            <input type="text" value={targets.callTracking} onChange={(e) => setTargets({ ...targets, callTracking: e.target.value })} placeholder="(555) 123-4567" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  )
}