'use client'

import { useState } from 'react'
import { CreditCard, Check, Star, Zap, Crown, Edit3, Plus, DollarSign, Users, ArrowRight, X, Trash2 } from 'lucide-react'

type Plan = {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  paypalPlanId: string
  active: boolean
  subscribers: number
}

const initialPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    interval: 'month',
    features: [
      'Up to 50 active clients',
      'Quote Builder',
      'Review Requests (auto-send)',
      'Basic KPIs & reporting',
      'SMS Templates (5 custom)',
      'Captain Scoop AI (50 queries/mo)',
      'Email support',
    ],
    stripePriceId: 'price_starter_monthly',
    paypalPlanId: 'P-STARTER-MONTHLY',
    active: true,
    subscribers: 18,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    interval: 'month',
    features: [
      'Up to 250 active clients',
      'Everything in Starter, plus:',
      'Lead Generation with map',
      'Ad Builder & Creative tools',
      'Competitor Intelligence',
      'Advanced KPIs & Revenue tracking',
      'Unlimited SMS Templates',
      'Captain Scoop AI (unlimited)',
      'Post Scheduler',
      'Priority support',
    ],
    stripePriceId: 'price_pro_monthly',
    paypalPlanId: 'P-PRO-MONTHLY',
    active: true,
    subscribers: 19,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'Unlimited active clients',
      'Everything in Pro, plus:',
      'Multi-location support',
      'White-label reports',
      'Custom integrations',
      'API access',
      'Dedicated account manager',
      'Phone support',
      'Custom onboarding',
    ],
    stripePriceId: 'price_enterprise_monthly',
    paypalPlanId: 'P-ENTERPRISE-MONTHLY',
    active: true,
    subscribers: 5,
  },
]

const planIcons: Record<string, any> = {
  starter: Zap,
  pro: Star,
  enterprise: Crown,
}

const planColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  starter: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-600' },
  pro: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-600' },
  enterprise: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-600' },
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [showStripeSetup, setShowStripeSetup] = useState(false)
  const [showPaypalSetup, setShowPaypalSetup] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [newFeature, setNewFeature] = useState('')

  const totalMRR = plans.reduce((sum, p) => sum + (p.active ? p.price * p.subscribers : 0), 0)

  const togglePlanActive = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  const savePlan = () => {
    if (!editingPlan) return
    setPlans(prev => prev.map(p => p.id === editingPlan.id ? editingPlan : p))
    setEditingPlan(null)
  }

  const addFeature = () => {
    if (!editingPlan || !newFeature.trim()) return
    setEditingPlan({ ...editingPlan, features: [...editingPlan.features, newFeature.trim()] })
    setNewFeature('')
  }

  const removeFeature = (index: number) => {
    if (!editingPlan) return
    setEditingPlan({ ...editingPlan, features: editingPlan.features.filter((_, i) => i !== index) })
  }

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="text-blue-500" /> Subscription Plans</h1>
          <p className="text-gray-500">Manage plans, pricing, and payment gateway configuration</p>
        </div>
      </div>

      {/* MRR Summary */}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2"><Edit3 size={20} className="text-blue-500" /> Edit Plan: {editingPlan.name}</h2>
                <p className="text-sm text-gray-500">Update plan details, pricing, and features</p>
              </div>
              <button onClick={() => setEditingPlan(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan ID</label>
                  <input
                    type="text"
                    value={editingPlan.id}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                      min={0}
                      className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Interval</label>
                  <select
                    value={editingPlan.interval}
                    onChange={(e) => setEditingPlan({ ...editingPlan, interval: e.target.value as 'month' | 'year' })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingPlan.active ? 'active' : 'disabled'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, active: e.target.value === 'active' })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Payment IDs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Price ID</label>
                  <input
                    type="text"
                    value={editingPlan.stripePriceId}
                    onChange={(e) => setEditingPlan({ ...editingPlan, stripePriceId: e.target.value })}
                    placeholder="price_..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Plan ID</label>
                  <input
                    type="text"
                    value={editingPlan.paypalPlanId}
                    onChange={(e) => setEditingPlan({ ...editingPlan, paypalPlanId: e.target.value })}
                    placeholder="P-..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="space-y-2 mb-3">
                  {editingPlan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Check size={14} className="text-green-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const updated = [...editingPlan.features]
                          updated[i] = e.target.value
                          setEditingPlan({ ...editingPlan, features: updated })
                        }}
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                      />
                      <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="Add a feature..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={addFeature} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Subscriber Info (read-only) */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Current Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{editingPlan.subscribers}</p>
                <p className="text-xs text-gray-400 mt-1">MRR from this plan: ${(editingPlan.price * editingPlan.subscribers).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setEditingPlan(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100">Cancel</button>
              <button onClick={savePlan} className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* MRR Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">${totalMRR.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total MRR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{plans.reduce((s, p) => s + p.subscribers, 0)}</p>
          <p className="text-xs text-gray-500">Total Subscribers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">${(totalMRR / Math.max(plans.reduce((s, p) => s + p.subscribers, 0), 1)).toFixed(0)}</p>
          <p className="text-xs text-gray-500">Avg Revenue / User</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{plans.filter(p => p.active).length}</p>
          <p className="text-xs text-gray-500">Active Plans</p>
        </div>
      </div>

      {/* Plans */}
      <h2 className="text-lg font-semibold mb-3">Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const Icon = planIcons[plan.id]
          const colors = planColors[plan.id]
          return (
            <div key={plan.id} className={`bg-white rounded-xl border-2 ${colors.border} p-6 relative`}>
              {plan.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon size={20} className={colors.text} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-xs text-gray-400">{plan.subscribers} subscribers</p>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/{plan.interval}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={() => setEditingPlan({ ...plan })} className={`flex-1 ${colors.badge} text-white py-2 rounded-lg text-sm font-medium hover:opacity-90`}>Edit Plan</button>
                <button onClick={() => togglePlanActive(plan.id)} className="border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">{plan.active ? 'Disable' : 'Enable'}</button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                <p>Stripe: {plan.stripePriceId}</p>
                <p>PayPal: {plan.paypalPlanId}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Payment Gateway Configuration */}
      <h2 className="text-lg font-semibold mb-3">Payment Gateway Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stripe */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><span className="text-lg">💳</span></div>
              <div>
                <h3 className="font-semibold">Stripe</h3>
                <p className="text-xs text-gray-500">Credit/debit cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Connected</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Publishable Key</label>
              <input type="text" value="pk_live_51••••••••••••" readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Secret Key</label>
              <input type="password" value="sk_live_••••••••••••••" readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Webhook Secret</label>
              <input type="password" value="whsec_••••••••••••••" readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <a href="https://dashboard.stripe.com" target="_blank" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Open Stripe Dashboard <ArrowRight size={12} /></a>
              <button className="text-sm bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700">Update Keys</button>
            </div>
          </div>
        </div>

        {/* PayPal */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-lg">🅿️</span></div>
              <div>
                <h3 className="font-semibold">PayPal</h3>
                <p className="text-xs text-gray-500">PayPal balance, bank accounts, cards</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Connected</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Client ID</label>
              <input type="text" value="AV8e••••••••••••••" readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Client Secret</label>
              <input type="password" value="EK7p••••••••••••••" readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Webhook ID</label>
              <input type="text" value="WH-••••••••••••••" readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <a href="https://developer.paypal.com/dashboard" target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Open PayPal Dashboard <ArrowRight size={12} /></a>
              <button className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">Update Keys</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}