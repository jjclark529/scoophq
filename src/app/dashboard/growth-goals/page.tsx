'use client'

import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'
import {
  TrendingUp, Users, DollarSign, Target, Calendar,
  Zap, ArrowUpRight, Clock, BarChart3, Lightbulb,
  ChevronRight, AlertTriangle,
} from 'lucide-react'

/* ── demo current metrics ─────────────────────────────── */
const CURRENT = {
  clients: 425,
  revenue: 12800,
  avgRevenuePerClient: 30.12,
  clientGrowthRate: 0.052,   // 5.2 % / month
  revenueGrowthRate: 0.113,  // 11.3 % / month
}

/* ── helpers ──────────────────────────────────────────── */
function monthsBetween(a: Date, b: Date) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
}

function monthLabel(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0)
}

function fmtDollar(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${n.toFixed(0)}`
}

function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

/* ── types ────────────────────────────────────────────── */
interface ChartPoint {
  label: string
  currentClients: number
  goalClients: number | null
  currentRevenue: number
  goalRevenue: number | null
}

interface GapData {
  clientsNeededPerMonth: number
  revenueNeededPerMonth: number
  requiredClientGrowthRate: number
  requiredRevenueGrowthRate: number
  estimatedClientDate: string
  estimatedRevenueDate: string
  clientMonthsAtPace: number
  revenueMonthsAtPace: number
}

interface Strategy {
  title: string
  description: string
  impact: string
  icon: React.ReactNode
}

/* ── page ─────────────────────────────────────────────── */
export default function GrowthGoalsPage() {
  const [targetClients, setTargetClients] = useState('')
  const [targetRevenue, setTargetRevenue] = useState('')
  const [goalDate, setGoalDate] = useState('')
  const [showResults, setShowResults] = useState(false)

  /* ── calculations ────────────────────────────────────── */
  const { chartData, gap, strategies } = useMemo(() => {
    if (!showResults) return { chartData: [] as ChartPoint[], gap: null, strategies: [] as Strategy[] }

    const tClients = parseInt(targetClients) || CURRENT.clients
    const tRevenue = parseFloat(targetRevenue) || CURRENT.revenue
    const now = new Date()
    const goal = goalDate ? new Date(goalDate) : new Date(now.getFullYear(), now.getMonth() + 12, 1)
    const months = Math.max(monthsBetween(now, goal), 1)

    // build projection data with at least 12 points
    const points = Math.max(months + 2, 14)
    const data: ChartPoint[] = []
    for (let i = 0; i <= points; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const projClients = CURRENT.clients * Math.pow(1 + CURRENT.clientGrowthRate, i)
      const projRevenue = CURRENT.revenue * Math.pow(1 + CURRENT.revenueGrowthRate, i)
      const goalFracClients = i <= months
        ? CURRENT.clients + (tClients - CURRENT.clients) * (i / months)
        : null
      const goalFracRevenue = i <= months
        ? CURRENT.revenue + (tRevenue - CURRENT.revenue) * (i / months)
        : null

      data.push({
        label: monthLabel(d),
        currentClients: Math.round(projClients),
        goalClients: goalFracClients !== null ? Math.round(goalFracClients) : null,
        currentRevenue: Math.round(projRevenue),
        goalRevenue: goalFracRevenue !== null ? Math.round(goalFracRevenue) : null,
      })
    }

    // gap analysis
    const clientsNeededPerMonth = Math.max(0, (tClients - CURRENT.clients) / months)
    const revenueNeededPerMonth = Math.max(0, (tRevenue - CURRENT.revenue) / months)
    const requiredClientGrowthRate = months > 0 ? Math.pow(tClients / CURRENT.clients, 1 / months) - 1 : 0
    const requiredRevenueGrowthRate = months > 0 ? Math.pow(tRevenue / CURRENT.revenue, 1 / months) - 1 : 0

    // months to reach goal at current pace (compound growth)
    const clientMonthsAtPace = tClients > CURRENT.clients
      ? Math.ceil(Math.log(tClients / CURRENT.clients) / Math.log(1 + CURRENT.clientGrowthRate))
      : 0
    const revenueMonthsAtPace = tRevenue > CURRENT.revenue
      ? Math.ceil(Math.log(tRevenue / CURRENT.revenue) / Math.log(1 + CURRENT.revenueGrowthRate))
      : 0

    const estClientDate = new Date(now.getFullYear(), now.getMonth() + clientMonthsAtPace, 1)
    const estRevenueDate = new Date(now.getFullYear(), now.getMonth() + revenueMonthsAtPace, 1)

    const gapData: GapData = {
      clientsNeededPerMonth,
      revenueNeededPerMonth,
      requiredClientGrowthRate,
      requiredRevenueGrowthRate,
      estimatedClientDate: estClientDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      estimatedRevenueDate: estRevenueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      clientMonthsAtPace,
      revenueMonthsAtPace,
    }

    // dynamic strategies
    const clientGap = Math.max(0, requiredClientGrowthRate - CURRENT.clientGrowthRate)
    const extraClientsPerMonth = Math.max(0, clientsNeededPerMonth - CURRENT.clients * CURRENT.clientGrowthRate)
    const strats: Strategy[] = []

    if (clientGap > 0) {
      const adBoost = Math.ceil(clientGap / CURRENT.clientGrowthRate * 100)
      strats.push({
        title: `Increase ad spend by ~${adBoost}%`,
        description: `Scaling paid acquisition can generate ~${Math.ceil(extraClientsPerMonth * 0.4)} additional leads/month through higher impression volume.`,
        impact: `+${Math.ceil(extraClientsPerMonth * 0.4)} clients/mo`,
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
      })
    }

    const conversionLift = Math.min(2, (extraClientsPerMonth * 0.3) / Math.max(1, CURRENT.clients * 0.01))
    strats.push({
      title: `Improve conversion rate by ${conversionLift.toFixed(1)} percentage points`,
      description: `Optimising landing pages, follow-up speed, and offer clarity can convert ${Math.ceil(extraClientsPerMonth * 0.3)} more visitors into clients each month.`,
      impact: `+${Math.ceil(extraClientsPerMonth * 0.3)} clients/mo`,
      icon: <ArrowUpRight className="w-5 h-5 text-green-500" />,
    })

    const referralsNeeded = Math.ceil(extraClientsPerMonth * 0.2)
    strats.push({
      title: `Launch a referral program targeting ${Math.max(referralsNeeded, 3)} referrals/month`,
      description: 'Incentivise existing happy clients with discounts or credits for every successful referral they bring in.',
      impact: `+${Math.max(referralsNeeded, 3)} clients/mo`,
      icon: <Users className="w-5 h-5 text-blue-500" />,
    })

    strats.push({
      title: 'Expand service area or add new service tiers',
      description: 'Broadening geographic reach or offering premium/budget tiers opens new market segments and increases average revenue per client.',
      impact: `+${fmtDollar(revenueNeededPerMonth * 0.15)}/mo revenue`,
      icon: <Target className="w-5 h-5 text-purple-500" />,
    })

    return { chartData: data, gap: gapData, strategies: strats }
  }, [showResults, targetClients, targetRevenue, goalDate])

  const handleCalculate = () => {
    if (!targetClients && !targetRevenue) return
    setShowResults(true)
  }

  /* ── default date (6 months from now) ─────────────── */
  const defaultGoalDate = useMemo(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 6)
    return d.toISOString().split('T')[0]
  }, [])

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Growth Goals
        </h1>
        <p className="text-gray-500">Set targets and get an AI-powered growth plan</p>
      </div>

      {/* ── Current Metrics ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Clients', value: CURRENT.clients.toLocaleString(), sub: `${fmtPct(CURRENT.clientGrowthRate)}/mo growth`, icon: <Users className="w-5 h-5 text-blue-600" />, positive: true },
          { label: 'Monthly Revenue', value: `$${CURRENT.revenue.toLocaleString()}`, sub: `${fmtPct(CURRENT.revenueGrowthRate)}/mo growth`, icon: <DollarSign className="w-5 h-5 text-green-600" />, positive: true },
          { label: 'Avg Rev / Client', value: `$${CURRENT.avgRevenuePerClient.toFixed(2)}`, sub: 'per month', icon: <BarChart3 className="w-5 h-5 text-purple-600" />, positive: true },
          { label: 'Growth Trajectory', value: 'Healthy', sub: 'Compound growth active', icon: <TrendingUp className="w-5 h-5 text-green-600" />, positive: true },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              {kpi.icon}
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className={`text-sm mt-1 ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Goal Setting Form ────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Set Your Growth Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Clients</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={targetClients}
                onChange={(e) => { setTargetClients(e.target.value); setShowResults(false) }}
                placeholder="e.g. 750"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Monthly Income</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={targetRevenue}
                onChange={(e) => { setTargetRevenue(e.target.value); setShowResults(false) }}
                placeholder="e.g. 25000"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={goalDate || defaultGoalDate}
                onChange={(e) => { setGoalDate(e.target.value); setShowResults(false) }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleCalculate}
          disabled={!targetClients && !targetRevenue}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Calculate Growth Plan
        </button>
      </div>

      {/* ── Results ──────────────────────────────────── */}
      {showResults && gap && (
        <>
          {/* Timeline Projection Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Growth Projection
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Current trajectory (blue) vs goal pace (green) — {targetClients ? 'clients' : 'revenue'}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clients Chart */}
              {targetClients && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Client Projection</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="currentClients"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        name="Current Pace"
                      />
                      <Line
                        type="monotone"
                        dataKey="goalClients"
                        stroke="#16a34a"
                        strokeWidth={2}
                        strokeDasharray="6 3"
                        dot={false}
                        name="Goal Pace"
                        connectNulls={false}
                      />
                      <ReferenceLine
                        y={parseInt(targetClients)}
                        stroke="#dc2626"
                        strokeDasharray="4 4"
                        label={{ value: 'Target', position: 'right', fill: '#dc2626', fontSize: 12 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Revenue Chart */}
              {targetRevenue && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Revenue Projection</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="currentRevenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        name="Current Pace"
                      />
                      <Line
                        type="monotone"
                        dataKey="goalRevenue"
                        stroke="#16a34a"
                        strokeWidth={2}
                        strokeDasharray="6 3"
                        dot={false}
                        name="Goal Pace"
                        connectNulls={false}
                      />
                      <ReferenceLine
                        y={parseFloat(targetRevenue)}
                        stroke="#dc2626"
                        strokeDasharray="4 4"
                        label={{ value: 'Target', position: 'right', fill: '#dc2626', fontSize: 12 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Gap Analysis Cards */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Gap Analysis
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {targetClients && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium">Clients Needed / Month</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    +{Math.ceil(gap.clientsNeededPerMonth)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    vs current +{Math.round(CURRENT.clients * CURRENT.clientGrowthRate)}/mo
                  </p>
                </div>
              )}
              {targetRevenue && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium">Revenue Needed / Month</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    +{fmtDollar(gap.revenueNeededPerMonth)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    vs current +{fmtDollar(CURRENT.revenue * CURRENT.revenueGrowthRate)}/mo
                  </p>
                </div>
              )}
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 font-medium">Required Growth Rate</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {targetClients ? fmtPct(gap.requiredClientGrowthRate) : fmtPct(gap.requiredRevenueGrowthRate)}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  vs current {targetClients ? fmtPct(CURRENT.clientGrowthRate) : fmtPct(CURRENT.revenueGrowthRate)}/mo
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-700 font-medium">ETA at Current Pace</p>
                </div>
                <p className="text-lg font-bold text-amber-900 mt-1">
                  {targetClients ? gap.estimatedClientDate : gap.estimatedRevenueDate}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {(() => {
                    const m = targetClients ? gap.clientMonthsAtPace : gap.revenueMonthsAtPace
                    const goalM = goalDate
                      ? monthsBetween(new Date(), new Date(goalDate))
                      : 6
                    if (m <= goalM) return '✅ On track to hit goal early!'
                    return `⚠️ ${m - goalM} months behind target`
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Strategies */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Recommended Strategies
            </h2>
            <div className="space-y-3">
              {strategies.map((s, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5 p-2 bg-gray-50 rounded-lg">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 flex items-center gap-1">
                      {s.title}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>
                  </div>
                  <span className="flex-shrink-0 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {s.impact}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                These projections use compound growth modelling based on your current metrics.
                Actual results will vary based on market conditions, seasonality, and execution.
                Update your metrics regularly for more accurate forecasts.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}