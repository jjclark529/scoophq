'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Users, ArrowUpRight, ArrowDownRight, PieChart as PieIcon, CalendarRange } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts'

const monthlyRevenue = [
  { month: 'Oct', revenue: 8200, adSpend: 1200, profit: 7000, newCustomers: 6 },
  { month: 'Nov', revenue: 9400, adSpend: 1400, profit: 8000, newCustomers: 8 },
  { month: 'Dec', revenue: 8800, adSpend: 1300, profit: 7500, newCustomers: 5 },
  { month: 'Jan', revenue: 10200, adSpend: 1800, profit: 8400, newCustomers: 10 },
  { month: 'Feb', revenue: 11500, adSpend: 1950, profit: 9550, newCustomers: 12 },
  { month: 'Mar', revenue: 13520, adSpend: 2103, profit: 11417, newCustomers: 17 },
]

const revenueBySource = [
  { name: 'Sweep&Go', value: 5800, color: '#2563eb' },
  { name: 'HubSpot', value: 3200, color: '#7c3aed' },
  { name: 'Jobber', value: 2400, color: '#059669' },
  { name: 'Pipeline', value: 900, color: '#d97706' },
  { name: 'GoHighLevel', value: 500, color: '#dc2626' },
  { name: 'Door Knocks', value: 720, color: '#8b5cf6' },
]

const conversionFunnel = [
  { stage: 'Impressions', count: 142847, pct: 100 },
  { stage: 'Clicks', count: 3421, pct: 2.4 },
  { stage: 'Leads', count: 19, pct: 0.47 },
  { stage: 'Quotes Sent', count: 12, pct: 63.2 },
  { stage: 'Customers Won', count: 11, pct: 91.7 },
]

const customersByPlatform = [
  { platform: 'Sweep&Go', active: 234, new: 6, churned: 2, mrr: '$5,800' },
  { platform: 'HubSpot', active: 89, new: 4, churned: 1, mrr: '$3,200' },
  { platform: 'Jobber', active: 67, new: 3, churned: 0, mrr: '$2,400' },
  { platform: 'Pipeline', active: 23, new: 1, churned: 0, mrr: '$900' },
  { platform: 'GoHighLevel', active: 12, new: 0, churned: 1, mrr: '$500' },

]

const roiMetrics = [
  { label: 'Total Monthly Revenue', value: '$12,800', change: '+11.3%', positive: true, icon: DollarSign },
  { label: 'Ad Spend (Total)', value: '$2,103', change: '+7.8%', positive: false, icon: TrendingUp },
  { label: 'Net Profit', value: '$10,697', change: '+12.0%', positive: true, icon: TrendingUp },
  { label: 'Overall ROI', value: '508%', change: '+15pts', positive: true, icon: ArrowUpRight },
  { label: 'Customer LTV', value: '$1,840', change: '+$120', positive: true, icon: Users },
  { label: 'Payback Period', value: '1.2 mo', change: '-0.3 mo', positive: true, icon: TrendingDown },
  { label: 'Cost Per Acquisition', value: '$47.15', change: '+$5.15', positive: false, icon: DollarSign },
  { label: 'Active Customers', value: '428', change: '+17', positive: true, icon: Users },
]

// ─── Year-over-Year Data ──────────────────────────────────────────
type YearlyData = {
  year: number
  color: string
  monthly: { month: string; revenue: number; adSpend: number; profit: number; customers: number }[]
  totals: { revenue: number; adSpend: number; profit: number; newCustomers: number; avgCpl: number; endingCustomers: number }
}

const yearlyData: YearlyData[] = [
  {
    year: 2024,
    color: '#94a3b8',
    monthly: [
      { month: 'Jan', revenue: 3200, adSpend: 600, profit: 2600, customers: 85 },
      { month: 'Feb', revenue: 3400, adSpend: 650, profit: 2750, customers: 90 },
      { month: 'Mar', revenue: 3600, adSpend: 700, profit: 2900, customers: 96 },
      { month: 'Apr', revenue: 3900, adSpend: 750, profit: 3150, customers: 105 },
      { month: 'May', revenue: 4100, adSpend: 800, profit: 3300, customers: 112 },
      { month: 'Jun', revenue: 4400, adSpend: 850, profit: 3550, customers: 120 },
      { month: 'Jul', revenue: 4600, adSpend: 900, profit: 3700, customers: 130 },
      { month: 'Aug', revenue: 4800, adSpend: 900, profit: 3900, customers: 140 },
      { month: 'Sep', revenue: 5000, adSpend: 950, profit: 4050, customers: 150 },
      { month: 'Oct', revenue: 5200, adSpend: 950, profit: 4250, customers: 162 },
      { month: 'Nov', revenue: 5500, adSpend: 1000, profit: 4500, customers: 175 },
      { month: 'Dec', revenue: 5800, adSpend: 1000, profit: 4800, customers: 188 },
    ],
    totals: { revenue: 53500, adSpend: 10050, profit: 43450, newCustomers: 103, avgCpl: 97.57, endingCustomers: 188 },
  },
  {
    year: 2025,
    color: '#3b82f6',
    monthly: [
      { month: 'Jan', revenue: 6000, adSpend: 1000, profit: 5000, customers: 198 },
      { month: 'Feb', revenue: 6200, adSpend: 1050, profit: 5150, customers: 210 },
      { month: 'Mar', revenue: 6500, adSpend: 1100, profit: 5400, customers: 225 },
      { month: 'Apr', revenue: 6800, adSpend: 1100, profit: 5700, customers: 240 },
      { month: 'May', revenue: 7200, adSpend: 1150, profit: 6050, customers: 258 },
      { month: 'Jun', revenue: 7500, adSpend: 1200, profit: 6300, customers: 275 },
      { month: 'Jul', revenue: 7800, adSpend: 1200, profit: 6600, customers: 295 },
      { month: 'Aug', revenue: 7600, adSpend: 1250, profit: 6350, customers: 310 },
      { month: 'Sep', revenue: 7900, adSpend: 1200, profit: 6700, customers: 328 },
      { month: 'Oct', revenue: 8200, adSpend: 1200, profit: 7000, customers: 345 },
      { month: 'Nov', revenue: 9400, adSpend: 1400, profit: 8000, customers: 368 },
      { month: 'Dec', revenue: 8800, adSpend: 1300, profit: 7500, customers: 385 },
    ],
    totals: { revenue: 89900, adSpend: 14150, profit: 75750, newCustomers: 197, avgCpl: 71.83, endingCustomers: 385 },
  },
  {
    year: 2026,
    color: '#16a34a',
    monthly: [
      { month: 'Jan', revenue: 10200, adSpend: 1800, profit: 8400, customers: 397 },
      { month: 'Feb', revenue: 11500, adSpend: 1950, profit: 9550, customers: 411 },
      { month: 'Mar', revenue: 13520, adSpend: 2103, profit: 11417, customers: 428 },
      { month: 'Apr', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'May', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'Jun', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'Jul', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'Aug', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'Sep', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'Oct', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'Nov', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
      { month: 'Dec', revenue: 0, adSpend: 0, profit: 0, customers: 0 },
    ],
    totals: { revenue: 35220, adSpend: 5853, profit: 29367, newCustomers: 43, avgCpl: 43.98, endingCustomers: 428 },
  },
]

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState('6months')
  const [selectedYears, setSelectedYears] = useState<number[]>([2025, 2026])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(customersByPlatform.map(c => c.platform))
  const [newCustYear, setNewCustYear] = useState(2026)

  const toggleYear = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort()
    )
  }

  const selectedYearData = yearlyData.filter(y => selectedYears.includes(y.year))

  // Build chart data for YoY comparison
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const yoyChartData = months.map((month, i) => {
    const point: Record<string, any> = { month }
    selectedYearData.forEach(yd => {
      const m = yd.monthly[i]
      if (m && m.revenue > 0) {
        point[`revenue_${yd.year}`] = m.revenue
      }
    })
    return point
  }).filter(p => Object.keys(p).length > 1) // only months with data

  const totalRevenue = revenueBySource.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="text-green-500" /> Revenue & ROI
          </h1>
          <p className="text-gray-500">Unified view of revenue, conversions, and ROI from all CRM integrations</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          {[
            { key: '3months', label: '3M' },
            { key: '6months', label: '6M' },
            { key: '12months', label: '1Y' },
            { key: 'all', label: 'All' },
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === range.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {roiMetrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{metric.label}</span>
              <metric.icon size={16} className={metric.positive ? 'text-green-500' : 'text-red-500'} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className={`text-sm mt-1 flex items-center gap-1 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
              {metric.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue vs Spend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold mb-4">Revenue vs Ad Spend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#16a34a" fill="#16a34a" fillOpacity={0.3} name="Revenue" />
            <Area type="monotone" dataKey="adSpend" stackId="2" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} name="Ad Spend" />
            <Area type="monotone" dataKey="profit" stackId="3" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} name="Net Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold mb-4">Conversion Funnel</h3>
        <div className="flex items-end justify-between gap-2">
          {conversionFunnel.map((stage, i) => {
            const height = Math.max(20, (stage.pct / conversionFunnel[0].pct) * 100)
            const widthPct = 100 - (i * 15)
            return (
              <div key={stage.stage} className="flex-1 text-center">
                <div className="relative mx-auto" style={{ width: `${widthPct}%` }}>
                  <div
                    className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg mx-auto transition-all"
                    style={{ height: `${Math.max(40, 200 - i * 35)}px` }}
                  />
                </div>
                <div className="mt-2">
                  <p className="text-lg font-bold text-gray-900">{stage.count.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{stage.stage}</p>
                  {i > 0 && (
                    <p className="text-xs text-blue-600 font-medium">{stage.pct}% conv.</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CRM Platform Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Customer Metrics by Platform</h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedPlatforms(
                selectedPlatforms.length === customersByPlatform.length ? [] : customersByPlatform.map(c => c.platform)
              )}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedPlatforms.length === customersByPlatform.length
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              All
            </button>
            {customersByPlatform.map(p => (
              <button
                key={p.platform}
                onClick={() => setSelectedPlatforms(prev =>
                  prev.includes(p.platform) ? prev.filter(x => x !== p.platform) : [...prev, p.platform]
                )}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedPlatforms.includes(p.platform)
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                }`}
              >
                {p.platform}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Platform</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Active Customers</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">New This Month</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Churned</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Monthly Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Net Growth</th>
              </tr>
            </thead>
            <tbody>
              {customersByPlatform.filter(r => selectedPlatforms.includes(r.platform)).map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{row.platform}</td>
                  <td className="py-3 px-4 text-right">{row.active}</td>
                  <td className="py-3 px-4 text-right text-green-600">+{row.new}</td>
                  <td className="py-3 px-4 text-right text-red-600">{row.churned > 0 ? `-${row.churned}` : '0'}</td>
                  <td className="py-3 px-4 text-right font-medium">{row.mrr}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${row.new - row.churned > 0 ? 'text-green-600' : row.new - row.churned < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {row.new - row.churned > 0 ? '+' : ''}{row.new - row.churned}
                    </span>
                  </td>
                </tr>
              ))}
              {selectedPlatforms.length > 1 && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-right">{customersByPlatform.filter(r => selectedPlatforms.includes(r.platform)).reduce((s, r) => s + r.active, 0)}</td>
                  <td className="py-3 px-4 text-right text-green-600">+{customersByPlatform.filter(r => selectedPlatforms.includes(r.platform)).reduce((s, r) => s + r.new, 0)}</td>
                  <td className="py-3 px-4 text-right text-red-600">-{customersByPlatform.filter(r => selectedPlatforms.includes(r.platform)).reduce((s, r) => s + r.churned, 0)}</td>
                  <td className="py-3 px-4 text-right">${customersByPlatform.filter(r => selectedPlatforms.includes(r.platform)).reduce((s, r) => s + parseInt(r.mrr.replace(/[$,]/g, '')), 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-green-600">+{customersByPlatform.filter(r => selectedPlatforms.includes(r.platform)).reduce((s, r) => s + r.new - r.churned, 0)}</td>
                </tr>
              )}
              {selectedPlatforms.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-sm text-gray-400">Select at least one platform</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year-over-Year Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CalendarRange size={18} className="text-blue-500" /> Year-over-Year Comparison
          </h3>
          <div className="flex items-center gap-2">
            {yearlyData.map(yd => (
              <button
                key={yd.year}
                onClick={() => toggleYear(yd.year)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  selectedYears.includes(yd.year)
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedYears.includes(yd.year) ? yd.color : '#d1d5db' }} />
                {yd.year}
              </button>
            ))}
          </div>
        </div>

        {selectedYears.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Select at least one year to view data</p>
        ) : (
          <>
            {/* Revenue Overlay Chart */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">Monthly Revenue by Year</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={yoyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  {selectedYearData.map(yd => (
                    <Line
                      key={yd.year}
                      type="monotone"
                      dataKey={`revenue_${yd.year}`}
                      stroke={yd.color}
                      strokeWidth={yd.year === 2026 ? 3 : 2}
                      strokeDasharray={yd.year === Math.max(...selectedYears) ? undefined : '6 3'}
                      dot={{ fill: yd.color, r: 3 }}
                      name={`${yd.year}`}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Annual Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Metric</th>
                    {selectedYearData.map(yd => (
                      <th key={yd.year} className="text-right py-3 px-4 font-semibold" style={{ color: yd.color }}>
                        {yd.year}{yd.year === 2026 && <span className="text-xs text-gray-400 font-normal ml-1">(YTD)</span>}
                      </th>
                    ))}
                    {selectedYears.length >= 2 && (
                      <th className="text-right py-3 px-4 font-semibold text-gray-600">YoY Change</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Total Revenue', key: 'revenue', fmt: (v: number) => `$${v.toLocaleString()}` },
                    { label: 'Total Ad Spend', key: 'adSpend', fmt: (v: number) => `$${v.toLocaleString()}` },
                    { label: 'Net Profit', key: 'profit', fmt: (v: number) => `$${v.toLocaleString()}` },
                    { label: 'New Customers', key: 'newCustomers', fmt: (v: number) => v.toString() },
                    { label: 'Avg Cost Per Lead', key: 'avgCpl', fmt: (v: number) => `$${v.toFixed(2)}` },
                    { label: 'Ending Customers', key: 'endingCustomers', fmt: (v: number) => v.toString() },
                    { label: 'ROI', key: 'roi', fmt: (v: number) => `${v.toFixed(0)}%` },
                  ].map(row => {
                    const values = selectedYearData.map(yd => {
                      if (row.key === 'roi') {
                        return yd.totals.adSpend > 0 ? ((yd.totals.profit / yd.totals.adSpend) * 100) : 0
                      }
                      return (yd.totals as any)[row.key] as number
                    })
                    const yoyChange = values.length >= 2
                      ? ((values[values.length - 1] - values[values.length - 2]) / Math.max(values[values.length - 2], 1)) * 100
                      : null

                    return (
                      <tr key={row.label} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-700">{row.label}</td>
                        {values.map((v, vi) => (
                          <td key={vi} className="py-3 px-4 text-right font-medium">{row.fmt(v)}</td>
                        ))}
                        {selectedYears.length >= 2 && yoyChange !== null && (
                          <td className="py-3 px-4 text-right">
                            <span className={`font-semibold ${
                              (row.key === 'adSpend' || row.key === 'avgCpl')
                                ? (yoyChange <= 0 ? 'text-green-600' : 'text-red-600')
                                : (yoyChange >= 0 ? 'text-green-600' : 'text-red-600')
                            }`}>
                              {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}%
                            </span>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* New Customer Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">New Customers per Month</h3>
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            {yearlyData.map(yd => (
              <button
                key={yd.year}
                onClick={() => setNewCustYear(yd.year)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  newCustYear === yd.year ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {yd.year}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={
            (yearlyData.find(y => y.year === newCustYear)?.monthly ?? [])
              .map((m, i) => ({ month: m.month, newCustomers: i > 0 || m.customers > 0 ? (i === 0 ? m.customers - (yearlyData.find(y => y.year === newCustYear - 1)?.monthly[11]?.customers ?? 0) : m.customers - (yearlyData.find(y => y.year === newCustYear)?.monthly[i - 1]?.customers ?? 0)) : 0 }))
              .map(m => ({ ...m, newCustomers: Math.max(m.newCustomers, 0) }))
              .filter(m => m.newCustomers > 0)
          }>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="newCustomers" fill={yearlyData.find(y => y.year === newCustYear)?.color ?? '#2563eb'} radius={[4, 4, 0, 0]} name="New Customers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}