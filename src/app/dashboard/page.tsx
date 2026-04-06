'use client'

import Link from 'next/link'
import { TrendingUp, TrendingDown, Target, Zap, ArrowRight, Sparkles } from 'lucide-react'

const performanceCards = [
  { label: 'Cost Per Lead', value: '$47.15', target: '$42.00', status: 'off-target', trend: '+12%', icon: TrendingUp },
  { label: 'Total Leads', value: '16', target: '15', status: 'beating', trend: '+7%', icon: TrendingUp },
  { label: 'Ad Spend', value: '$2,103', target: '$2,500', status: 'beating', trend: '-8%', icon: TrendingDown },
  { label: 'ROAS', value: '6.2x', target: '8.0x', status: 'off-target', trend: '-4%', icon: TrendingDown },
]

const topMoves = [
  { title: 'Optimize Conversion Funnel', description: 'Your conversion rate is 2.02% — below the 3% industry average. Quick wins available on your landing page.', urgency: 'high' },
  { title: 'Review Underperforming Campaigns', description: '2 campaigns have CPL above $80. Pausing or restructuring could save $400/mo.', urgency: 'high' },
  { title: 'Lower Google Ads Cost Per Click', description: 'Your avg CPC of $7.48 is 22% above target. Negative keyword audit recommended.', urgency: 'medium' },
  { title: 'Increase Meta Ad Frequency', description: 'Your top Meta campaign has room to scale — audience saturation is only at 35%.', urgency: 'low' },
]

export default function DashboardOverview() {
  return (
    <div className="p-6 max-w-6xl">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-500">Here&apos;s your marketing performance for March 2026</p>
      </div>

      {/* AI Call-out Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-5 mb-6 text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-lg">Captain Scoop&apos;s Call</h2>
            <p className="text-purple-100 mt-1">
              Your leads are beating target this month (16 vs 15) but CPL is running hot at $47.15 vs your $42 target.
              The biggest drag is your Google Display campaign — it&apos;s spending $380 with only 3 conversions.
              I recommend pausing it and redirecting budget to your Meta Lead Gen which is converting at $32/lead.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {performanceCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{card.label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                card.status === 'beating' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {card.status === 'beating' ? '✅ Beating Target' : '⚠️ Off Target'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-400">Target: {card.target}</span>
              <span className={`text-sm font-medium flex items-center gap-1 ${
                card.status === 'beating' ? 'text-green-600' : 'text-red-600'
              }`}>
                <card.icon size={14} /> {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Moves */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Top Moves This Month</h2>
          <Link href="/dashboard/missions" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            Missions &amp; Coaching <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {topMoves.map((move, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                move.urgency === 'high' ? 'bg-red-500' : move.urgency === 'medium' ? 'bg-amber-500' : 'bg-green-500'
              }`} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{move.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{move.description}</p>
              </div>
              <Link href="/dashboard/missions" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0">
                View in Missions →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/quick-launch" className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">
          + New Campaign
        </Link>
      </div>
    </div>
  )
}