'use client'

import { useState } from 'react'
import { BarChart3, Users, CreditCard, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, AlertCircle } from 'lucide-react'

const stats = {
  totalCustomers: 47,
  activeSubscriptions: 42,
  mrr: 6580,
  arr: 78960,
  churnRate: 3.2,
  newThisMonth: 5,
  cancelledThisMonth: 2,
  trialUsers: 3,
  revenue30d: 7240,
  revenue90d: 20450,
  avgRevenuePerUser: 156.67,
  paymentSuccessRate: 97.8,
}

const recentEvents = [
  { type: 'payment', message: 'Payment received from Scoop Doggy Logs', amount: '$199/mo', time: '2 hours ago', status: 'success' },
  { type: 'signup', message: 'New subscriber: Paws & Claws Cleanup', amount: '$99/mo', time: '5 hours ago', status: 'success' },
  { type: 'upgrade', message: 'Plan upgrade: Desert Dogs AZ (Starter → Pro)', amount: '$99 → $199', time: '1 day ago', status: 'success' },
  { type: 'cancel', message: 'Cancellation: Tucson Poop Patrol', amount: '$99/mo', time: '2 days ago', status: 'warning' },
  { type: 'payment', message: 'Payment received from Clean Yards Co', amount: '$299/mo', time: '2 days ago', status: 'success' },
  { type: 'failed', message: 'Payment failed: Happy Tails Service', amount: '$199/mo', time: '3 days ago', status: 'error' },
  { type: 'signup', message: 'New trial started: Southwest Scoopers', amount: 'Trial', time: '3 days ago', status: 'info' },
  { type: 'payment', message: 'Payment received from AZ Pet Waste Pro', amount: '$199/mo', time: '4 days ago', status: 'success' },
]

const statusColors: Record<string, string> = {
  success: 'text-green-600 bg-green-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',
  info: 'text-blue-600 bg-blue-50',
}

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">PoopScoop HQ subscription management & revenue overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <Users size={20} className="text-blue-500" />
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5"><ArrowUpRight size={10} /> +{stats.newThisMonth}</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalCustomers}</p>
          <p className="text-xs text-gray-500">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <CreditCard size={20} className="text-green-500" />
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stats.activeSubscriptions} active</span>
          </div>
          <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
          <p className="text-xs text-gray-500">Active Subscriptions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={20} className="text-green-600" />
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5"><TrendingUp size={10} /> +12%</span>
          </div>
          <p className="text-3xl font-bold">${stats.mrr.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Monthly Recurring Revenue</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 size={20} className="text-purple-500" />
            <span className={`text-xs px-2 py-0.5 rounded-full ${stats.churnRate < 5 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{stats.churnRate}%</span>
          </div>
          <p className="text-3xl font-bold">${stats.arr.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Annual Run Rate</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-gray-900">${stats.avgRevenuePerUser.toFixed(0)}</p>
          <p className="text-xs text-gray-500">Avg Revenue/User</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-gray-900">{stats.trialUsers}</p>
          <p className="text-xs text-gray-500">Active Trials</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-green-600">{stats.paymentSuccessRate}%</p>
          <p className="text-xs text-gray-500">Payment Success Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-lg font-bold text-red-500">{stats.cancelledThisMonth}</p>
          <p className="text-xs text-gray-500">Cancelled This Month</p>
        </div>
      </div>

      {/* Revenue Chart Placeholder + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-green-600" /> Revenue Overview</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-700">${stats.revenue30d.toLocaleString()}</p>
              <p className="text-xs text-green-600">Last 30 Days</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-700">${stats.revenue90d.toLocaleString()}</p>
              <p className="text-xs text-blue-600">Last 90 Days</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-purple-700">${stats.arr.toLocaleString()}</p>
              <p className="text-xs text-purple-600">Projected Annual</p>
            </div>
          </div>
          <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-sm text-gray-400">📊 Revenue chart — connect Stripe for live data</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-500" /> Recent Activity</h2>
          <div className="space-y-3">
            {recentEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${statusColors[event.status]}`}>
                  {event.type === 'payment' && <DollarSign size={14} />}
                  {event.type === 'signup' && <Users size={14} />}
                  {event.type === 'upgrade' && <ArrowUpRight size={14} />}
                  {event.type === 'cancel' && <ArrowDownRight size={14} />}
                  {event.type === 'failed' && <AlertCircle size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{event.message}</p>
                  <p className="text-xs text-gray-400">{event.time}</p>
                </div>
                <span className="text-sm font-medium text-gray-700 flex-shrink-0">{event.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}