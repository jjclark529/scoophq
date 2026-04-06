'use client'

import { useState } from 'react'
import { DollarSign, Download, Filter, Search, ArrowUpRight, ArrowDownRight, CreditCard, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

type Transaction = {
  id: string
  customer: string
  company: string
  amount: number
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  method: 'stripe' | 'paypal'
  plan: string
  date: string
  invoiceId: string
}

const transactions: Transaction[] = [
  { id: 'txn_001', customer: 'Jackie Martinez', company: 'Scoop Doggy Logs', amount: 199, status: 'succeeded', method: 'stripe', plan: 'Pro', date: 'Mar 25, 2026', invoiceId: 'INV-2026-0341' },
  { id: 'txn_002', customer: 'Mike Chen', company: 'Paws & Claws Cleanup', amount: 99, status: 'succeeded', method: 'stripe', plan: 'Starter', date: 'Mar 22, 2026', invoiceId: 'INV-2026-0340' },
  { id: 'txn_003', customer: 'Sarah Wilson', company: 'Desert Dogs AZ', amount: 199, status: 'succeeded', method: 'paypal', plan: 'Pro', date: 'Mar 10, 2026', invoiceId: 'INV-2026-0335' },
  { id: 'txn_004', customer: 'Tom Davis', company: 'Clean Yards Co', amount: 299, status: 'succeeded', method: 'stripe', plan: 'Enterprise', date: 'Mar 5, 2026', invoiceId: 'INV-2026-0330' },
  { id: 'txn_005', customer: 'Lisa Rodriguez', company: 'Happy Tails Service', amount: 199, status: 'failed', method: 'stripe', plan: 'Pro', date: 'Mar 20, 2026', invoiceId: 'INV-2026-0338' },
  { id: 'txn_006', customer: 'Robert Kim', company: 'AZ Pet Waste Pro', amount: 199, status: 'succeeded', method: 'stripe', plan: 'Pro', date: 'Mar 12, 2026', invoiceId: 'INV-2026-0336' },
  { id: 'txn_007', customer: 'Amanda Brooks', company: 'Scoop Town LLC', amount: 299, status: 'succeeded', method: 'stripe', plan: 'Enterprise', date: 'Mar 8, 2026', invoiceId: 'INV-2026-0332' },
  { id: 'txn_008', customer: 'Nancy Taylor', company: 'Tucson Poop Patrol', amount: 99, status: 'refunded', method: 'paypal', plan: 'Starter', date: 'Mar 1, 2026', invoiceId: 'INV-2026-0325' },
  { id: 'txn_009', customer: 'Jackie Martinez', company: 'Scoop Doggy Logs', amount: 199, status: 'succeeded', method: 'stripe', plan: 'Pro', date: 'Feb 25, 2026', invoiceId: 'INV-2026-0310' },
  { id: 'txn_010', customer: 'Tom Davis', company: 'Clean Yards Co', amount: 299, status: 'succeeded', method: 'stripe', plan: 'Enterprise', date: 'Feb 5, 2026', invoiceId: 'INV-2026-0290' },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  succeeded: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-600', icon: RefreshCw },
}

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  const filtered = transactions.filter(t => {
    const matchesSearch = !searchQuery || t.customer.toLowerCase().includes(searchQuery.toLowerCase()) || t.company.toLowerCase().includes(searchQuery.toLowerCase()) || t.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    const matchesMethod = methodFilter === 'all' || t.method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalRevenue = transactions.filter(t => t.status === 'succeeded').reduce((s, t) => s + t.amount, 0)
  const failedAmount = transactions.filter(t => t.status === 'failed').reduce((s, t) => s + t.amount, 0)
  const refundedAmount = transactions.filter(t => t.status === 'refunded').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><DollarSign className="text-green-500" /> Billing & Transactions</h1>
          <p className="text-gray-500">View all payment transactions, invoices, and revenue</p>
        </div>
        <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"><Download size={16} /> Export CSV</button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Collected</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
          <p className="text-xs text-gray-500">Total Transactions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-500">${failedAmount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Failed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-500">${refundedAmount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Refunded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search transactions..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Statuses</option>
          <option value="succeeded">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Methods</option>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Invoice</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Plan</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Method</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn) => {
              const sc = statusConfig[txn.status]
              const StatusIcon = sc.icon
              return (
                <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{txn.invoiceId}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{txn.customer}</p>
                    <p className="text-xs text-gray-400">{txn.company}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{txn.plan}</td>
                  <td className="py-3 px-4 font-bold">${txn.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded ${txn.method === 'stripe' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      {txn.method === 'stripe' ? '💳 Stripe' : '🅿️ PayPal'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${sc.color}`}>
                      <StatusIcon size={12} /> {sc.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{txn.date}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {txn.status === 'failed' && <button className="text-xs text-blue-600 hover:underline">Retry</button>}
                      {txn.status === 'succeeded' && <button className="text-xs text-gray-500 hover:underline">Refund</button>}
                      <button className="text-xs text-gray-500 hover:underline">View</button>
                    </div>
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