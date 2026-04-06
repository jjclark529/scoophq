'use client'

import { useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

const campaigns = [
  {
    name: 'Meta Lead Gen Spring 2026',
    platform: 'meta',
    status: 'active',
    spend: '$856',
    leads: 12,
    cpl: '$32.10',
    ctr: '3.2%',
    verdict: { color: 'green', label: 'Strong Performer', action: 'Scale budget by 20%', impact: 'Increase lead volume' },
  },
  {
    name: 'Google Search — Brand Terms',
    platform: 'google',
    status: 'active',
    spend: '$420',
    leads: 6,
    cpl: '$70.00',
    ctr: '8.1%',
    verdict: { color: 'yellow', label: 'High CTR but expensive', action: 'Tighten keyword match types', impact: 'Lower CPC by 15%' },
  },
  {
    name: 'SDL Static Testimonial Ads',
    platform: 'meta',
    status: 'active',
    spend: '$380',
    leads: 3,
    cpl: '$126.67',
    ctr: '0.9%',
    verdict: { color: 'red', label: 'High CPA — industry avg is $45', action: 'Optimize creative or pause', impact: 'Save $380/mo' },
  },
  {
    name: 'Google Display Retargeting Q1',
    platform: 'google',
    status: 'active',
    spend: '$312',
    leads: 2,
    cpl: '$156.00',
    ctr: '0.4%',
    verdict: { color: 'red', label: 'Very low CTR and high CPL', action: 'Pause and reallocate budget', impact: 'Redirect $312 to Meta' },
  },
  {
    name: 'Scoop Hyper-Local Blitz',
    platform: 'meta',
    status: 'active',
    spend: '$0',
    leads: 0,
    cpl: '-',
    ctr: '-',
    verdict: { color: 'orange', label: 'Active but not spending', action: 'Increase daily budget to $15', impact: 'Begin generating leads' },
  },
  {
    name: 'Leads Campaign 3-8-26',
    platform: 'google',
    status: 'active',
    spend: '$135',
    leads: 1,
    cpl: '$135.00',
    ctr: '2.8%',
    verdict: { color: 'red', label: 'Low conversions despite decent CTR', action: 'Revise landing page', impact: 'Increase conversion rate' },
  },
  {
    name: 'June 2025 Evergreen',
    platform: 'meta',
    status: 'paused',
    spend: '$0',
    leads: 0,
    cpl: '-',
    ctr: '4.1%',
    verdict: { color: 'yellow', label: 'High CTR historically, no conversions', action: 'Reactivate with revised landing page', impact: 'Potential $35 CPL' },
  },
]

const verdictColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red: 'bg-red-100 text-red-800 border-red-200',
}

const platformBadge: Record<string, { label: string; color: string }> = {
  google: { label: 'Google', color: 'bg-blue-100 text-blue-700' },
  meta: { label: 'Meta', color: 'bg-indigo-100 text-indigo-700' },
}

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = filterPlatform === 'all' || c.platform === filterPlatform
    return matchesSearch && matchesPlatform
  })

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Ad Campaigns</h1>
          <p className="text-gray-500">View, manage, and create campaigns across all platforms</p>
        </div>
        <Link
          href="/dashboard/quick-launch"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Create Campaign
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Platforms</option>
          <option value="google">Google</option>
          <option value="meta">Meta</option>
        </select>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {filtered.map((campaign, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-1 rounded ${platformBadge[campaign.platform].color}`}>
                  {platformBadge[campaign.platform].label}
                </span>
                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Spend: <strong className="text-gray-900">{campaign.spend}</strong></span>
                <span>Leads: <strong className="text-gray-900">{campaign.leads}</strong></span>
                <span>CPL: <strong className="text-gray-900">{campaign.cpl}</strong></span>
                <span>CTR: <strong className="text-gray-900">{campaign.ctr}</strong></span>
              </div>
            </div>

            {/* AI Verdict */}
            <div className={`rounded-lg border p-3 ${verdictColors[campaign.verdict.color]}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">🍦</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{campaign.verdict.label}</p>
                  <div className="flex gap-6 mt-1 text-xs">
                    <span><strong>Action:</strong> {campaign.verdict.action}</span>
                    <span><strong>Expected Impact:</strong> {campaign.verdict.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}