'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, Brain, ChevronDown, ChevronUp, Star, TrendingUp, TrendingDown, Search, Trophy, Eye } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────
const scorecard = [
  { name: 'Scoop Doggy Logs', you: true, rating: 4.9, reviews: 101, priceRange: '$35–$90', area: 'Tucson Metro', years: 3, threat: null },
  { name: 'DooDoolBros', you: false, rating: 4.7, reviews: 78, priceRange: '$30–$75', area: 'Tucson / Oro Valley', years: 5, threat: 'high' },
  { name: 'Golden Scoopers', you: false, rating: 4.8, reviews: 45, priceRange: '$50–$120', area: 'Catalina Foothills', years: 2, threat: 'watch' },
  { name: 'Poop 911 Tucson', you: false, rating: 4.5, reviews: 156, priceRange: '$40–$95', area: 'Tucson Metro+', years: 8, threat: 'high' },
  { name: 'Pawsitively Clean', you: false, rating: 4.3, reviews: 12, priceRange: '$25–$65', area: 'South Tucson', years: 1, threat: 'low' },
]

const reviewData = [
  { name: 'You', rating: 4.9, total: 101, thisMonth: 8, vsLastMonth: 3, dist: [72, 18, 6, 3, 2] },
  { name: 'DooDoolBros', rating: 4.7, total: 78, thisMonth: 5, vsLastMonth: -1, dist: [50, 16, 7, 3, 2] },
  { name: 'Golden Scoopers', rating: 4.8, total: 45, thisMonth: 3, vsLastMonth: 0, dist: [32, 8, 3, 1, 1] },
  { name: 'Poop 911', rating: 4.5, total: 156, thisMonth: 2, vsLastMonth: -4, dist: [95, 30, 18, 8, 5] },
  { name: 'Pawsitively Clean', rating: 4.3, total: 12, thisMonth: 2, vsLastMonth: 1, dist: [6, 3, 1, 1, 1] },
]

const rivalAlerts = [
  { emoji: '🚨', text: 'Poop 911 posted 3 new Google posts this week', time: '2 days ago' },
  { emoji: '📢', text: 'DooDoolBros launched a new Facebook ad campaign', time: '3 days ago' },
  { emoji: '⭐', text: 'Golden Scoopers received 3 five-star reviews this week', time: '1 day ago' },
]

const searchKeywords = [
  { keyword: 'pet waste removal tucson', you: 1, rivals: [3, 5, 2, null] },
  { keyword: 'pooper scooper tucson', you: 2, rivals: [1, null, 4, null] },
  { keyword: 'dog poop cleanup tucson az', you: 1, rivals: [4, 7, 3, 9] },
  { keyword: 'yard cleanup service tucson', you: 3, rivals: [2, null, 1, null] },
  { keyword: 'pet waste removal oro valley', you: 5, rivals: [1, null, 3, null] },
]

const adActivity = [
  { name: 'DooDoolBros', active: true },
  { name: 'Golden Scoopers', active: false },
  { name: 'Poop 911 Tucson', active: true },
  { name: 'Pawsitively Clean', active: false },
]

const pricingData = [
  { service: 'Weekly (1 dog)', you: 35, rivals: [30, 50, 40, 25] },
  { service: 'Weekly (2 dogs)', you: 40, rivals: [38, 60, 48, 30] },
  { service: 'Bi-Weekly (1 dog)', you: 28, rivals: [25, 40, 32, 20] },
  { service: 'One-Time Cleanup', you: 70, rivals: [65, 95, 75, 50] },
  { service: 'Initial Cleanup', you: 125, rivals: [110, 150, 130, 85] },
]

const rivalNames = ['DooDoolBros', 'Golden Scoopers', 'Poop 911', 'Pawsitively Clean']

const counterMoves = [
  { title: 'Promote enhanced introductory offer', why: 'DooDoolBros offers first cleanup free — match and exceed', how: 'Offer first 2 cleanups free with weekly plan signup', impact: 'Est. 4-6 new signups/month', difficulty: 'Easy' },
  { title: 'Highlight trust and transparency', why: 'Competitor reviews mention hidden fees', how: 'Add "No Hidden Fees" badge to all ads and landing pages', impact: 'Est. 15% CTR improvement', difficulty: 'Easy' },
  { title: 'Target competitor keywords with conquest ads', why: 'Capture competitor search traffic', how: 'Create Google Ads campaign targeting "[competitor] + alternative"', impact: 'Est. 8-12 new leads/month', difficulty: 'Medium' },
  { title: 'Deploy geo-fenced mobile ads', why: 'Reach dog owners in specific Tucson neighborhoods', how: 'Set up Meta ads with 5-mile radius targeting around high-density areas', impact: 'Est. $28 CPL vs current $47', difficulty: 'Hard' },
]

const swotData: Record<string, { s: string[]; w: string[]; o: string[]; t: string[] }> = {
  DooDoolBros: {
    s: ['5 years in market — established brand', 'Aggressive pricing undercuts most competitors', 'Strong presence in Oro Valley'],
    w: ['Reviews mention inconsistent service quality', 'No online booking system', 'Website is outdated'],
    o: ['They don\'t serve Marana or Green Valley yet', 'No social media presence beyond Facebook', 'No premium tier offering'],
    t: ['Growing fast in your core Tucson market', 'Recently started running Google Ads', 'Offering free first cleanup to new customers'],
  },
  'Poop 911 Tucson': {
    s: ['National franchise with strong brand recognition', 'Highest review count (156)', 'Large ad budget from corporate'],
    w: ['Generic franchise marketing, not local feel', 'Higher prices than independents', 'Recent reviews trending negative (4.5 avg)'],
    o: ['Their review velocity is slowing (-4 vs last month)', 'Franchise model limits local customization', 'Customers mention wanting more personal service'],
    t: ['Deep pockets for sustained ad campaigns', 'Could expand into your strongest zones', 'Brand awareness advantage with new customers'],
  },
  'Golden Scoopers': {
    s: ['Premium positioning with 4.8 rating', 'Excellent creative and branding', 'Strong Instagram presence'],
    w: ['Only 45 reviews — thin social proof', 'Limited to Catalina Foothills area', 'Premium pricing limits market size'],
    o: ['Small service area means room to expand before they do', 'Could capture their overflow when they\'re booked', 'Target their audience with mid-tier pricing'],
    t: ['If they expand to broader Tucson, strong competitor', 'Their review quality is very high', 'Could attract your premium customers'],
  },
}


const threatColors: Record<string, string> = { high: 'bg-red-100 text-red-700', watch: 'bg-amber-100 text-amber-700', low: 'bg-green-100 text-green-700' }
const threatLabels: Record<string, string> = { high: '🔴 High', watch: '🟡 Watch', low: '🟢 Low' }
const difficultyColors: Record<string, string> = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-amber-100 text-amber-700', Hard: 'bg-red-100 text-red-700' }

function RankBadge({ rank }: { rank: number | null }) {
  if (rank === null) return <span className="text-gray-300">—</span>
  const color = rank <= 3 ? 'bg-green-100 text-green-700' : rank <= 10 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>#{rank}</span>
}

// ─── Component ────────────────────────────────────────────────────
export default function CompetitorsPage() {
  const [expandedCounter, setExpandedCounter] = useState<number | null>(null)
  const [expandedSwot, setExpandedSwot] = useState<string | null>(null)

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="text-blue-500" /> Rival Radar
          </h1>
          <p className="text-gray-500">Track competitors, monitor reviews, spy on ads, and get AI counter-strategies</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} /> Add Competitor
        </button>
      </div>

      {/* 1. Competitor Scorecard */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> Competitor Scorecard</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-600">Rating</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-600">Reviews</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-600">Price Range</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-600">Service Area</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-600">Years</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-600">Threat</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.map((c, i) => (
                <tr key={i} className={`border-b border-gray-100 ${c.you ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="py-3 px-3 font-medium">{c.you && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded mr-2">YOU</span>}{c.name}</td>
                  <td className="py-3 px-3 text-center"><span className="font-bold">{c.rating}</span> <Star size={12} className="inline text-amber-400 fill-amber-400" /></td>
                  <td className="py-3 px-3 text-center">{c.reviews}</td>
                  <td className="py-3 px-3 text-center">{c.priceRange}</td>
                  <td className="py-3 px-3 text-center text-xs">{c.area}</td>
                  <td className="py-3 px-3 text-center">{c.years}</td>
                  <td className="py-3 px-3 text-center">
                    {c.threat ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${threatColors[c.threat]}`}>{threatLabels[c.threat]}</span> : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. This Week's Rival Moves */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-amber-800 mb-3 text-sm">🔔 This Week&apos;s Rival Moves</h3>
        <div className="space-y-2">
          {rivalAlerts.map((a, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-amber-900">{a.emoji} {a.text}</span>
              <span className="text-xs text-amber-600">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Review Monitoring */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Star size={18} className="text-amber-500" /> Review Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviewData.map((r, i) => {
            const reviewLead = r.total - 101
            return (
              <div key={i} className={`rounded-xl border p-4 ${i === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{r.name}</span>
                  {i > 0 && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${reviewLead > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {reviewLead > 0 ? `They lead by ${reviewLead}` : reviewLead === 0 ? 'Tied' : `You lead by ${Math.abs(reviewLead)}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold">{r.rating}</span>
                  <div className="flex">{Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} className={s < Math.round(r.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}</div>
                </div>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <span className="text-gray-600">{r.total} total</span>
                  <span className="text-green-600 font-medium">+{r.thisMonth} this mo</span>
                  <span className={`flex items-center gap-0.5 font-medium ${r.vsLastMonth > 0 ? 'text-green-600' : r.vsLastMonth < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {r.vsLastMonth > 0 ? <TrendingUp size={12} /> : r.vsLastMonth < 0 ? <TrendingDown size={12} /> : null}
                    {r.vsLastMonth > 0 ? '+' : ''}{r.vsLastMonth} vs last
                  </span>
                </div>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((stars, si) => {
                    const count = r.dist[si]
                    const pct = r.total > 0 ? (count / r.total) * 100 : 0
                    return (
                      <div key={stars} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-gray-500">{stars}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-gray-400">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

{/* 3. Ad Spy / Search Presence */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Search size={18} className="text-blue-500" /> Ad Spy &amp; Search Presence</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Keyword</th>
                <th className="text-center py-3 px-3 font-semibold text-blue-600">You</th>
                {rivalNames.map(n => <th key={n} className="text-center py-3 px-3 font-semibold text-gray-600">{n}</th>)}
              </tr>
            </thead>
            <tbody>
              {searchKeywords.map((kw, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-700">{kw.keyword}</td>
                  <td className="py-3 px-3 text-center"><RankBadge rank={kw.you} /></td>
                  {kw.rivals.map((r, ri) => <td key={ri} className="py-3 px-3 text-center"><RankBadge rank={r} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Active Google Ads</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> <span className="font-medium">You</span> <span className="text-green-600 text-xs">Running</span></div>
            {adActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${a.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="font-medium">{a.name}</span>
                <span className={`text-xs ${a.active ? 'text-green-600' : 'text-gray-400'}`}>{a.active ? 'Running' : 'Not detected'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Pricing Intelligence */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">💲 Pricing Intelligence</h3>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-600">Service</th>
                <th className="text-center py-3 px-3 font-semibold text-blue-600">You</th>
                {rivalNames.map(n => <th key={n} className="text-center py-3 px-3 font-semibold text-gray-600">{n}</th>)}
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row, i) => {
                const allPrices = [row.you, ...row.rivals]
                const minPrice = Math.min(...allPrices)
                const maxPrice = Math.max(...allPrices)
                return (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">{row.service}</td>
                    <td className={`py-3 px-3 text-center font-medium ${row.you === minPrice ? 'text-green-600 bg-green-50' : row.you === maxPrice ? 'text-red-600 bg-red-50' : ''}`}>${row.you}</td>
                    {row.rivals.map((p, pi) => (
                      <td key={pi} className={`py-3 px-3 text-center ${p === minPrice ? 'text-green-600 bg-green-50 font-medium' : p === maxPrice ? 'text-red-600 bg-red-50' : ''}`}>${p}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">📊 <strong>Your Position:</strong> You are the 2nd most affordable for weekly service. Pawsitively Clean undercuts on price but has far fewer reviews (12 vs your 101). Your value proposition is strong.</p>
      </div>

      {/* 6. AI Counter-Strategies */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Brain className="text-purple-500" size={20} />
          <h3 className="font-semibold">AI Counter-Strategies</h3>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded ml-2">Captain Scoop</span>
        </div>
        <div className="divide-y divide-gray-100">
          {counterMoves.map((move, i) => (
            <div key={i} className="p-4">
              <button onClick={() => setExpandedCounter(expandedCounter === i ? null : i)} className="w-full flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{move.title}</h4>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[move.difficulty]}`}>{move.difficulty}</span>
                </div>
                {expandedCounter === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedCounter === i && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs font-semibold text-amber-800 mb-1">WHY</p><p className="text-sm text-amber-900">{move.why}</p></div>
                  <div className="bg-green-50 rounded-lg p-3"><p className="text-xs font-semibold text-green-800 mb-1">HOW</p><p className="text-sm text-green-900">{move.how}</p></div>
                  <div className="bg-purple-50 rounded-lg p-3"><p className="text-xs font-semibold text-purple-800 mb-1">IMPACT</p><p className="text-sm text-purple-900">{move.impact}</p></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. SWOT per Competitor */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Brain size={18} className="text-blue-500" /> Competitor SWOT Analysis</h3>
        <div className="space-y-3">
          {Object.entries(swotData).map(([name, swot]) => (
            <div key={name} className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setExpandedSwot(expandedSwot === name ? null : name)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <span className="font-medium">{name}</span>
                {expandedSwot === name ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSwot === name && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 pt-0">
                  <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs font-bold text-blue-800 mb-2">💪 STRENGTHS</p>{swot.s.map((s, i) => <p key={i} className="text-sm text-blue-900 mb-1">• {s}</p>)}</div>
                  <div className="bg-red-50 rounded-lg p-3"><p className="text-xs font-bold text-red-800 mb-2">⚠️ WEAKNESSES</p>{swot.w.map((w, i) => <p key={i} className="text-sm text-red-900 mb-1">• {w}</p>)}</div>
                  <div className="bg-green-50 rounded-lg p-3"><p className="text-xs font-bold text-green-800 mb-2">🎯 OPPORTUNITIES</p>{swot.o.map((o, i) => <p key={i} className="text-sm text-green-900 mb-1">• {o}</p>)}</div>
                  <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs font-bold text-amber-800 mb-2">🔥 THREATS</p>{swot.t.map((t, i) => <p key={i} className="text-sm text-amber-900 mb-1">• {t}</p>)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}