'use client'

import { useState } from 'react'
import { Clock, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Zap, Bell, PhoneIncoming, MessageSquare } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const avgResponseByDay = [
  { day: 'Mon', minutes: 8 },
  { day: 'Tue', minutes: 4 },
  { day: 'Wed', minutes: 12 },
  { day: 'Thu', minutes: 6 },
  { day: 'Fri', minutes: 3 },
  { day: 'Sat', minutes: 18 },
  { day: 'Sun', minutes: 45 },
]

const weeklyTrend = [
  { week: 'W1 Mar', avg: 14 },
  { week: 'W2 Mar', avg: 11 },
  { week: 'W3 Mar', avg: 9 },
  { week: 'W4 Mar', avg: 7 },
]

const recentLeads = [
  { name: 'Jennifer Lawson', source: 'Google Ads', channel: 'text', receivedAt: 'Mar 27, 10:15 AM', respondedAt: 'Mar 27, 10:18 AM', responseTime: 3, status: 'fast' },
  { name: 'Lisa Park', source: 'Sweep&Go', channel: 'text', receivedAt: 'Mar 27, 8:30 AM', respondedAt: 'Mar 27, 8:35 AM', responseTime: 5, status: 'fast' },
  { name: 'David Chen', source: 'Meta Ads', channel: 'call', receivedAt: 'Mar 26, 3:45 PM', respondedAt: null, responseTime: null, status: 'no-response' },
  { name: 'Sarah Mitchell', source: 'Google Ads', channel: 'text', receivedAt: 'Mar 26, 2:00 PM', respondedAt: 'Mar 26, 2:12 PM', responseTime: 12, status: 'ok' },
  { name: 'Mike Torres', source: 'Referral', channel: 'call', receivedAt: 'Mar 26, 11:00 AM', respondedAt: 'Mar 26, 11:03 AM', responseTime: 3, status: 'fast' },
  { name: 'Amy Nguyen', source: 'Meta Ads', channel: 'text', receivedAt: 'Mar 25, 4:30 PM', respondedAt: 'Mar 25, 5:15 PM', responseTime: 45, status: 'slow' },
  { name: 'Robert James', source: 'Google Ads', channel: 'text', receivedAt: 'Mar 25, 1:00 PM', respondedAt: 'Mar 25, 1:08 PM', responseTime: 8, status: 'ok' },
  { name: 'Karen White', source: 'Organic', channel: 'call', receivedAt: 'Mar 24, 9:00 AM', respondedAt: null, responseTime: null, status: 'no-response' },
]

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'fast': { label: '⚡ Under 5 min', color: 'text-green-700', bg: 'bg-green-100' },
  'ok': { label: '✅ Under 15 min', color: 'text-blue-700', bg: 'bg-blue-100' },
  'slow': { label: '⚠️ Over 15 min', color: 'text-amber-700', bg: 'bg-amber-100' },
  'no-response': { label: '🔴 No Response', color: 'text-red-700', bg: 'bg-red-100' },
}

export default function LeadResponsePage() {
  const avgResponse = 7.2
  const target = 5
  const fastRate = Math.round((recentLeads.filter(l => l.status === 'fast').length / recentLeads.length) * 100)
  const noResponseCount = recentLeads.filter(l => l.status === 'no-response').length

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="text-blue-500" /> Lead Response Time
          </h1>
          <p className="text-gray-500">Responding within 5 minutes makes you 21x more likely to convert a lead</p>
        </div>
      </div>

      {/* Alert */}
      {noResponseCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-800">⚠️ {noResponseCount} lead{noResponseCount > 1 ? 's' : ''} with no response!</p>
            <p className="text-sm text-red-600">These leads haven&apos;t been contacted yet. Every minute counts — reach out now.</p>
          </div>
          <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex-shrink-0">
            View Leads
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Avg Response Time</span>
            <Clock size={16} className={avgResponse <= target ? 'text-green-500' : 'text-amber-500'} />
          </div>
          <p className="text-3xl font-bold">{avgResponse} <span className="text-sm text-gray-400 font-normal">min</span></p>
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-xs ${avgResponse <= target ? 'text-green-600' : 'text-amber-600'}`}>
              Target: {target} min
            </span>
            {avgResponse <= target ? (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">✅ On Target</span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">⚠️ Above Target</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">&lt;5 Min Rate</span>
            <Zap size={16} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{fastRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{recentLeads.filter(l => l.status === 'fast').length} of {recentLeads.length} leads</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">No Response</span>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{noResponseCount}</p>
          <p className="text-xs text-gray-400 mt-1">Leads need attention</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Trend</span>
            <TrendingDown size={16} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">-50%</p>
          <p className="text-xs text-green-600 mt-1">Response time improving! 🎉</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-4">Avg Response Time by Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avgResponseByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis label={{ value: 'minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => [`${value} min`, 'Avg Response']} />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]} fill="#2563eb">
                {avgResponseByDay.map((entry, i) => (
                  <rect key={i} fill={entry.minutes <= 5 ? '#16a34a' : entry.minutes <= 15 ? '#2563eb' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">🔴 Weekends are your slowest — consider auto-reply for after-hours leads</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis label={{ value: 'minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => [`${value} min`, 'Avg Response']} />
              <Line type="monotone" dataKey="avg" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-green-600 mt-2">📈 Great improvement! You&apos;ve cut response time in half this month.</p>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">Recent Lead Responses</h2>
          <div className="flex gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">⚡ {recentLeads.filter(l => l.status === 'fast').length}</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">⚠️ {recentLeads.filter(l => l.status === 'slow').length}</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">🔴 {noResponseCount}</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Lead</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Source</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Channel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Received</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Response Time</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead, i) => {
              const status = statusConfig[lead.status]
              return (
                <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${lead.status === 'no-response' ? 'bg-red-50/50' : ''}`}>
                  <td className="py-3 px-4 font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-gray-500">{lead.source}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-gray-500">
                      {lead.channel === 'call' ? <PhoneIncoming size={14} /> : <MessageSquare size={14} />}
                      {lead.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{lead.receivedAt}</td>
                  <td className="py-3 px-4">
                    {lead.responseTime !== null ? (
                      <span className="font-bold">{lead.responseTime} min</span>
                    ) : (
                      <span className="text-red-600 font-bold">No response</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}