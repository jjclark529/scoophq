'use client'

import { useState } from 'react'
import { Zap, CheckCircle, Circle, ChevronDown, ChevronUp, Trophy, Star, GraduationCap, Lightbulb, Clock, TrendingUp } from 'lucide-react'

const completedMissions = [
  { title: 'Review Underperforming Campaigns', xp: 100, completedDate: 'Mar 15' },
  { title: 'Enable Revenue Tracking for True ROAS', xp: 100, completedDate: 'Mar 12' },
]

const activeMissions = [
  {
    title: 'Optimize Conversion Funnel',
    description: 'Your conversion rate is 2.02% — below the 3% industry average. Review your landing page load speed, form fields, and CTA placement.',
    metric: 'Conv rate: 2.02%',
    xp: 150,
    difficulty: 3,
    timeEstimate: '15-30 min',
    steps: ['Audit landing page load time (target <3s)', 'Reduce form fields to essentials', 'A/B test CTA button copy', 'Add social proof near form'],
  },
  {
    title: 'Lower Google Ads Cost Per Click',
    description: 'Your avg CPC of $7.48 is 22% above the industry benchmark. Negative keyword audit and bid adjustments recommended.',
    metric: 'CPC: $7.48',
    xp: 150,
    difficulty: 2,
    timeEstimate: '15-30 min',
    steps: ['Run search terms report', 'Add 10+ negative keywords', 'Lower bids on broad match terms', 'Increase bids on high-converting exact matches'],
  },
  {
    title: 'Reduce Google Ads Cost Per Lead',
    description: 'CPL is running at $47.15 vs your $42 target. Focus on pausing underperforming ad groups.',
    metric: 'CPL: $47.15',
    xp: 150,
    difficulty: 2,
    timeEstimate: '15-30 min',
    steps: ['Identify ad groups with CPL >$60', 'Pause lowest performing ads', 'Reallocate budget to top converters', 'Test new ad copy variants'],
  },
  {
    title: 'Tune Underperforming Google Ads Campaigns',
    description: '2 campaigns have CPL above $100. These need restructuring or pausing.',
    metric: '2 campaigns flagged',
    xp: 150,
    difficulty: 3,
    timeEstimate: '30-45 min',
    steps: ['Review Display Retargeting Q1 campaign', 'Review Leads Campaign 3-8-26', 'Pause or restructure each', 'Set up conversion tracking verification'],
  },
]

const coachingTips = [
  {
    category: 'Budget',
    title: 'Redistribute Budget from Display to Meta',
    insight: 'Your Google Display campaign is spending $312/mo with a $156 CPL. Meanwhile, your Meta Lead Gen is producing leads at $32 each.',
    action: 'Move $200 from Display to Meta Lead Gen and monitor for 2 weeks.',
    impact: 'Estimated 5-6 additional leads per month',
    priority: 'high',
  },
  {
    category: 'Creative',
    title: 'Refresh Your Top Ad Creative',
    insight: 'Your best-performing Meta ad has been running for 45 days. Ad fatigue typically sets in around day 30.',
    action: 'Create 2-3 new ad variations using your recent testimonials.',
    impact: 'Prevent CTR decline and maintain lead flow',
    priority: 'medium',
  },
  {
    category: 'Landing Page',
    title: 'Reduce Form Fields',
    insight: 'Your landing page form has 7 fields. Industry data shows reducing to 3-4 fields can increase conversions by 25-50%.',
    action: 'Remove company name, address, and "how did you hear about us" fields.',
    impact: 'Potential 25% increase in conversion rate',
    priority: 'high',
  },
  {
    category: 'SEO',
    title: 'Add Location Pages for Neighboring Areas',
    insight: 'You rank well for "pet waste removal Tucson" but have no pages for Marana, Oro Valley, or Green Valley.',
    action: 'Create dedicated landing pages for each neighboring city.',
    impact: 'Capture organic traffic from adjacent markets',
    priority: 'low',
  },
]

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
}

export default function MissionsPage() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const totalPP = 250
  const completedCount = 2
  const totalCount = 20
  const currentLevel = 'Apprentice'
  const ppToNext = 55

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-amber-500" /> Mission Control
        </h1>
        <p className="text-gray-500">Complete Marketing Missions. Earn PooPower (PP). Out-scoop the competition.</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">{currentLevel}</span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{totalPP} PP</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{completedCount}/{totalCount} missions</p>
          </div>
          <div className="text-sm text-gray-500">
            {ppToNext} PP to next level
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all" style={{ width: '25%' }} />
        </div>
      </div>

      {/* Completed Missions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <CheckCircle className="text-green-500" size={20} /> Completed
        </h2>
        <div className="space-y-2">
          {completedMissions.map((m, i) => (
            <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-medium text-green-800">{m.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-600">{m.completedDate}</span>
                <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-sm font-bold">+{m.xp} PP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Missions */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="text-amber-500" size={20} /> Active Missions
        </h2>
        <div className="space-y-3">
          {activeMissions.map((m, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Circle className="text-gray-300" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{m.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{m.metric}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{m.timeEstimate}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 3 }).map((_, d) => (
                          <span key={d} className={`w-2 h-2 rounded-full ${d < m.difficulty ? 'bg-amber-500' : 'bg-gray-200'}`} />
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm font-bold">+{m.xp} PP</span>
                  {expanded === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600 mb-3">{m.description}</p>
                  <div className="space-y-2">
                    {m.steps.map((step, s) => (
                      <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        {step}
                      </label>
                    ))}
                  </div>
                  <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                    ✅ Mark Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Coaching Tips */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 mb-6 text-white">
          <h2 className="font-bold text-lg mb-2">📋 This Week&apos;s Focus</h2>
          <p className="text-blue-100">
            Your CPL is 12% above target. The two biggest opportunities this week are pausing your underperforming Display campaign
            and refreshing your Meta ad creative. Combined, these moves could save you $380/mo and bring CPL back under target.
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <GraduationCap className="text-blue-500" size={20} /> AI Coaching Tips
        </h2>

        <div className="space-y-4">
          {coachingTips.map((tip, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[tip.priority]}`}>
                  {tip.priority} priority
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tip.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1"><Lightbulb size={12} /> INSIGHT</p>
                  <p className="text-sm text-blue-900">{tip.insight}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1"><TrendingUp size={12} /> ACTION</p>
                  <p className="text-sm text-green-900">{tip.action}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-purple-800 mb-1 flex items-center gap-1"><Clock size={12} /> IMPACT</p>
                  <p className="text-sm text-purple-900">{tip.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}