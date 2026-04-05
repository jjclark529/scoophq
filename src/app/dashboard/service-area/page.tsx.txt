'use client'

import { useState } from 'react'
import { MapPin, Users, Target, TrendingUp, Plus, Layers } from 'lucide-react'

const zones = [
  { name: 'Central Tucson', customers: 89, leads: 12, revenue: '$4,200', density: 'high', color: 'bg-red-500' },
  { name: 'Oro Valley', customers: 45, leads: 8, revenue: '$2,100', density: 'high', color: 'bg-red-400' },
  { name: 'Marana', customers: 32, leads: 5, revenue: '$1,500', density: 'medium', color: 'bg-amber-500' },
  { name: 'Catalina Foothills', customers: 28, leads: 4, revenue: '$1,800', density: 'medium', color: 'bg-amber-400' },
  { name: 'Rita Ranch', customers: 18, leads: 3, revenue: '$850', density: 'medium', color: 'bg-amber-400' },
  { name: 'Sahuarita', customers: 12, leads: 2, revenue: '$560', density: 'low', color: 'bg-green-400' },
  { name: 'Green Valley', customers: 8, leads: 1, revenue: '$380', density: 'low', color: 'bg-green-400' },
  { name: 'Vail', customers: 5, leads: 0, revenue: '$230', density: 'low', color: 'bg-green-300' },
  { name: 'Tanque Verde', customers: 15, leads: 6, revenue: '$710', density: 'medium', color: 'bg-amber-500' },
  { name: 'South Tucson', customers: 3, leads: 1, revenue: '$140', density: 'low', color: 'bg-green-300' },
]

const densityLabels: Record<string, { label: string; color: string }> = {
  high: { label: '🔥 High Density', color: 'text-red-600' },
  medium: { label: '🟡 Medium', color: 'text-amber-600' },
  low: { label: '🟢 Low / Opportunity', color: 'text-green-600' },
}

const insights = [
  { type: 'opportunity', text: 'Tanque Verde has 6 leads but only 15 customers — high conversion potential. Consider targeted Meta ads.', zone: 'Tanque Verde' },
  { type: 'optimize', text: 'Sahuarita + Green Valley could be combined into one route day to improve efficiency.', zone: 'Sahuarita / Green Valley' },
  { type: 'gap', text: 'No presence in Dove Mountain area despite being adjacent to your Marana coverage. 12,000+ households with dogs.', zone: 'Dove Mountain' },
  { type: 'winner', text: 'Oro Valley is your most efficient zone — highest revenue per customer at $46.67/mo avg.', zone: 'Oro Valley' },
]

export default function ServiceAreaPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'customers' | 'leads' | 'revenue'>('customers')

  const totalCustomers = zones.reduce((s, z) => s + z.customers, 0)
  const totalLeads = zones.reduce((s, z) => s + z.leads, 0)

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="text-red-500" /> Service Area Map
          </h1>
          <p className="text-gray-500">Visualize customer density, lead sources, and coverage gaps</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('customers')} className={`px-3 py-2 text-sm ${viewMode === 'customers' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Customers</button>
          <button onClick={() => setViewMode('leads')} className={`px-3 py-2 text-sm ${viewMode === 'leads' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Leads</button>
          <button onClick={() => setViewMode('revenue')} className={`px-3 py-2 text-sm ${viewMode === 'revenue' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Revenue</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold">{totalCustomers}</p>
          <p className="text-xs text-gray-500">Active Customers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
          <p className="text-xs text-gray-500">Active Leads</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold">{zones.length}</p>
          <p className="text-xs text-gray-500">Service Zones</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">15 mi</p>
          <p className="text-xs text-gray-500">Service Radius</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-green-100 via-green-50 to-blue-50 h-[500px] relative flex items-center justify-center">
              {/* Simulated map with zone bubbles */}
              <div className="absolute inset-0 p-8">
                {zones.map((zone, i) => {
                  const size = viewMode === 'customers' ? zone.customers : viewMode === 'leads' ? zone.leads * 5 : parseInt(zone.revenue.replace(/[$,]/g, '')) / 50
                  const clampedSize = Math.max(30, Math.min(size, 90))
                  // Rough positions for Tucson area
                  const positions = [
                    { top: '45%', left: '45%' }, // Central Tucson
                    { top: '20%', left: '40%' }, // Oro Valley
                    { top: '15%', left: '25%' }, // Marana
                    { top: '30%', left: '55%' }, // Catalina Foothills
                    { top: '65%', left: '65%' }, // Rita Ranch
                    { top: '80%', left: '40%' }, // Sahuarita
                    { top: '90%', left: '30%' }, // Green Valley
                    { top: '70%', left: '75%' }, // Vail
                    { top: '40%', left: '70%' }, // Tanque Verde
                    { top: '55%', left: '35%' }, // South Tucson
                  ]
                  const pos = positions[i]
                  return (
                    <button
                      key={zone.name}
                      onClick={() => setSelectedZone(selectedZone === zone.name ? null : zone.name)}
                      className={`absolute rounded-full flex items-center justify-center text-white text-xs font-bold opacity-80 hover:opacity-100 transition-all hover:scale-110 ${
                        selectedZone === zone.name ? 'ring-4 ring-blue-500 opacity-100 scale-110' : ''
                      } ${zone.color}`}
                      style={{
                        width: `${clampedSize}px`,
                        height: `${clampedSize}px`,
                        top: pos.top,
                        left: pos.left,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={zone.name}
                    >
                      {viewMode === 'customers' ? zone.customers : viewMode === 'leads' ? zone.leads : zone.revenue}
                    </button>
                  )
                })}
              </div>
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-2 text-xs space-y-1">
                <p className="font-semibold">Density</p>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> High</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> Medium</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400" /> Low</div>
              </div>
              <p className="absolute top-4 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">📍 Tucson, AZ Metro • Connect Google Maps API for interactive map</p>
            </div>
          </div>
        </div>

        {/* Zone List */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-sm">Service Zones</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[460px] overflow-y-auto">
              {zones.sort((a, b) => b.customers - a.customers).map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => setSelectedZone(selectedZone === zone.name ? null : zone.name)}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${selectedZone === zone.name ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${zone.color}`} />
                      <span className="text-sm font-medium">{zone.name}</span>
                    </div>
                    <span className={`text-xs ${densityLabels[zone.density].color}`}>{densityLabels[zone.density].label}</span>
                  </div>
                  <div className="flex gap-4 mt-1 ml-5 text-xs text-gray-500">
                    <span><Users size={10} className="inline" /> {zone.customers}</span>
                    <span><Target size={10} className="inline" /> {zone.leads} leads</span>
                    <span>{zone.revenue}/mo</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          🍦 Captain Scoop&apos;s Area Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <div key={i} className={`rounded-xl border p-4 ${
              insight.type === 'opportunity' ? 'bg-blue-50 border-blue-200' :
              insight.type === 'optimize' ? 'bg-purple-50 border-purple-200' :
              insight.type === 'gap' ? 'bg-amber-50 border-amber-200' :
              'bg-green-50 border-green-200'
            }`}>
              <p className="text-xs font-semibold uppercase mb-1 opacity-70">
                {insight.type === 'opportunity' ? '🎯 Opportunity' :
                 insight.type === 'optimize' ? '⚡ Optimization' :
                 insight.type === 'gap' ? '📍 Coverage Gap' : '🏆 Winner'}
              </p>
              <p className="text-sm">{insight.text}</p>
              <p className="text-xs text-gray-500 mt-1">{insight.zone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}