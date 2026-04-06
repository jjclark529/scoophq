'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const monthlyData = [
  { month: 'Oct', leads: 8, spend: 1200, cpl: 150 },
  { month: 'Nov', leads: 11, spend: 1400, cpl: 127 },
  { month: 'Dec', leads: 9, spend: 1300, cpl: 144 },
  { month: 'Jan', leads: 13, spend: 1800, cpl: 138 },
  { month: 'Feb', leads: 14, spend: 1950, cpl: 139 },
  { month: 'Mar', leads: 16, spend: 2103, cpl: 131 },
]

const channelData = [
  { name: 'Google Search', value: 42, color: '#4285F4' },
  { name: 'Meta Feed', value: 28, color: '#1877F2' },
  { name: 'Google Display', value: 15, color: '#34A853' },
  { name: 'Meta Stories', value: 10, color: '#E1306C' },
  { name: 'Organic', value: 5, color: '#6B7280' },
]

const kpiCards = [
  { label: 'Total Impressions', value: '142,847', change: '+18%', positive: true },
  { label: 'Total Clicks', value: '3,421', change: '+12%', positive: true },
  { label: 'Click-Through Rate', value: '2.40%', change: '+0.3%', positive: true },
  { label: 'Conversion Rate', value: '2.02%', change: '-0.5%', positive: false },
  { label: 'Cost Per Click', value: '$7.48', change: '+$1.20', positive: false },
  { label: 'Cost Per Lead', value: '$47.15', change: '-$3.85', positive: true },
  { label: 'Total Leads', value: '16', change: '+2', positive: true },
  { label: 'Total Spend', value: '$2,103', change: '+$153', positive: false },
]

export default function KPIsPage() {
  const [timeRange, setTimeRange] = useState('month')

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">KPIs & Metrics</h1>
          <p className="text-gray-500">Detailed performance analytics across all channels</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium capitalize ${
                timeRange === range ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            <p className={`text-sm mt-1 ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-4">Leads Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-4">Monthly Ad Spend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="spend" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {channelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CPL Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-4">Cost Per Lead Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpl" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}