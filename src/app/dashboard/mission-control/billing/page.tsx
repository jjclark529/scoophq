'use client'

import { useMemo, useState } from 'react'
import { CreditCard, DollarSign, FilePlus2, Receipt, Settings, Wallet } from 'lucide-react'
import { customers, invoices as initialInvoices, subscriptions } from '@/lib/crm-data'

export default function BillingCenterPage() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [statusFilter, setStatusFilter] = useState('all')
  const [form, setForm] = useState({ customerId: customers[0].id, description: 'Weekly scoop service', quantity: 4, rate: 42, tax: 8.75 })

  const filteredInvoices = useMemo(() => invoices.filter((invoice) => statusFilter === 'all' || invoice.status === statusFilter), [invoices, statusFilter])

  const createInvoice = () => {
    const customer = customers.find((item) => item.id === form.customerId)
    if (!customer) return
    const subtotal = form.quantity * form.rate
    const total = subtotal + subtotal * (form.tax / 100)
    setInvoices((prev) => [{ id: `INV-${Date.now()}`, customerId: customer.id, customerName: customer.name, amount: Number(total.toFixed(2)), status: 'draft', dueDate: '2026-05-01', issuedDate: '2026-04-21', billingType: 'prepaid', lineItems: [{ description: form.description, quantity: form.quantity, rate: form.rate }] }, ...prev])
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold mb-3"><DollarSign size={14} /> Billing Center</div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices, subscriptions, and payments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage billing workflows, card-on-file details, and payment settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5"><Receipt className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Invoices this month</p><p className="text-2xl font-bold text-gray-900 mt-1">{invoices.length}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5"><Wallet className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Collected revenue</p><p className="text-2xl font-bold text-gray-900 mt-1">${invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0)}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5"><CreditCard className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Cards on file</p><p className="text-2xl font-bold text-gray-900 mt-1">{subscriptions.length}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5"><Settings className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Billing model</p><p className="text-2xl font-bold text-gray-900 mt-1">Hybrid</p></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Invoice list</h2>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="all">All</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option><option value="overdue">Overdue</option><option value="draft">Draft</option></select>
            </div>
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{invoice.id} • {invoice.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">Issued {invoice.issuedDate} • Due {invoice.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${invoice.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : invoice.status === 'overdue' ? 'bg-red-100 text-red-700' : invoice.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>{invoice.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription management</h2>
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{subscription.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{subscription.frequency} • {subscription.billingType} • {subscription.cardOnFile}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${subscription.status === 'active' ? 'bg-emerald-100 text-emerald-700' : subscription.status === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{subscription.status}</span>
                      <p className="text-sm font-semibold text-gray-900 mt-2">${subscription.amount}/cycle</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><FilePlus2 size={18} className="text-emerald-600" /> Create invoice</h2>
            <div className="mt-4 space-y-4">
              <select value={form.customerId} onChange={(e) => setForm((prev) => ({ ...prev, customerId: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white">{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select>
              <input value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Line item" />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" value={form.quantity} onChange={(e) => setForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Qty" />
                <input type="number" value={form.rate} onChange={(e) => setForm((prev) => ({ ...prev, rate: Number(e.target.value) }))} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Rate" />
                <input type="number" value={form.tax} onChange={(e) => setForm((prev) => ({ ...prev, tax: Number(e.target.value) }))} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Tax %" />
              </div>
              <button onClick={createInvoice} className="w-full rounded-xl bg-emerald-600 text-white py-3 text-sm font-semibold hover:bg-emerald-700">Create draft invoice</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Billing options</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4"><span>Prepaid billing</span><span className="text-emerald-700 font-semibold">Enabled</span></div>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4"><span>Postpaid billing</span><span className="text-emerald-700 font-semibold">Enabled</span></div>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4"><span>Skip reason billing</span><span className="font-semibold">Charge weather skips: Off</span></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Stripe / gateway config</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="rounded-xl border border-gray-200 p-4">Primary processor: Stripe • Auto-pay on file</div>
              <div className="rounded-xl border border-gray-200 p-4">Payment retries: 3 attempts over 7 days</div>
              <div className="rounded-xl border border-gray-200 p-4">Failed payment SMS reminder: Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
