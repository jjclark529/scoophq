'use client'

import { useState } from 'react'
import { UserCircle, Lock, Mail, Building2, Phone, Eye, EyeOff, Save, Check, AlertCircle, CreditCard, Star, Zap, Crown, ArrowRight, ChevronRight, Shield, Edit3, MapPin } from 'lucide-react'

const currentUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '(520) 555-0100',
  company: 'My Pooper Scooper Co',
  address: '123 Main St, Tucson, AZ 85701',
  plan: 'pro' as const,
  paymentMethod: 'stripe' as const,
  cardLast4: '4242',
  cardBrand: 'Visa',
  cardExpiry: '12/27',
  billingEmail: 'john@example.com',
  nextBillingDate: 'Apr 27, 2026',
  memberSince: 'Jan 15, 2025',
}

const plans = [
  { id: 'starter', name: 'Starter', price: 99, icon: Zap, color: 'blue', features: ['Up to 50 clients', 'Quote Builder', 'Review Requests', 'Basic KPIs', '5 SMS Templates', 'Captain Scoop (50/mo)'] },
  { id: 'pro', name: 'Pro', price: 199, icon: Star, color: 'purple', popular: true, features: ['Up to 250 clients', 'Lead Generation + Map', 'Ad Builder & Creative', 'Competitor Intel', 'Unlimited SMS & AI', 'Priority Support'] },
  { id: 'enterprise', name: 'Enterprise', price: 299, icon: Crown, color: 'amber', features: ['Unlimited clients', 'Multi-location', 'White-label reports', 'API access', 'Dedicated manager', 'Phone support'] },
]

const planStyles: Record<string, { bg: string; border: string; text: string; btn: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
}

export default function UserProfilePage() {
  // Profile
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [phone, setPhone] = useState(currentUser.phone)
  const [company, setCompany] = useState(currentUser.company)
  const [address, setAddress] = useState(currentUser.address)
  const [profileSaved, setProfileSaved] = useState(false)

  // Password
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  // Plan
  const [selectedPlan, setSelectedPlan] = useState(currentUser.plan)
  const [showPlanChange, setShowPlanChange] = useState(false)
  const [planChangeSuccess, setPlanChangeSuccess] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)

  // Billing
  const [showUpdateCard, setShowUpdateCard] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>(currentUser.paymentMethod)
  const [billingSaved, setBillingSaved] = useState(false)

  const handleSaveProfile = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(false)
    if (!currentPw) { setPwError('Current password is required'); return }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters'); return }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
    setPwSuccess(true)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setTimeout(() => setPwSuccess(false), 3000)
  }

  const handleChangePlan = () => {
    setPlanChangeSuccess(true)
    setShowPlanChange(false)
    setTimeout(() => setPlanChangeSuccess(false), 4000)
  }

  const handleCancelSubscription = () => {
    setShowCancelModal(false)
    setCancelSuccess(true)
    setTimeout(() => setCancelSuccess(false), 5000)
  }

  const handleUpdateBilling = (e: React.FormEvent) => {
    e.preventDefault()
    setBillingSaved(true)
    setShowUpdateCard(false)
    setCardNumber(''); setCardExpiry(''); setCardCvc(''); setCardName('')
    setTimeout(() => setBillingSaved(false), 3000)
  }

  const formatCardNum = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d }

  const currentPlanData = plans.find(p => p.id === currentUser.plan)!

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><UserCircle className="text-blue-500" /> My Account</h1>
        <p className="text-gray-500">Manage your profile, subscription, billing, and password</p>
      </div>

      {/* ─── Profile Details ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Edit3 size={18} className="text-gray-500" /> Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Save size={16} /> Save Changes</button>
          {profileSaved && <span className="text-sm text-green-600 flex items-center gap-1"><Check size={14} /> Saved!</span>}
        </div>
        <p className="text-xs text-gray-400 mt-3">Member since {currentUser.memberSince}</p>
      </div>

      {/* ─── Subscription Plan ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><Star size={18} className="text-purple-500" /> Subscription Plan</h2>
          <button onClick={() => setShowPlanChange(!showPlanChange)} className="text-sm text-blue-600 hover:underline">
            {showPlanChange ? 'Cancel' : 'Change Plan'}
          </button>
        </div>

        {planChangeSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Check size={14} className="text-green-500" />
            <p className="text-sm text-green-700">Plan changed to <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong>! Changes take effect at your next billing cycle.</p>
          </div>
        )}

        {cancelSuccess && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-500" />
            <p className="text-sm text-amber-700">Your subscription has been cancelled. You will continue to have access until <strong>{currentUser.nextBillingDate}</strong>. Your plan will not be renewed after that date.</p>
          </div>
        )}

        {/* Current Plan Summary */}
        {!showPlanChange && (
          <div>
            <div className={`rounded-xl p-4 flex items-center justify-between ${planStyles[currentPlanData.color || 'purple'].bg} border ${planStyles[currentPlanData.color || 'purple'].border}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center`}>
                  <currentPlanData.icon size={20} className={planStyles[currentPlanData.color || 'purple'].text} />
                </div>
                <div>
                  <p className="font-bold text-lg">{currentPlanData.name} Plan</p>
                  <p className="text-sm text-gray-600">${currentPlanData.price}/month • Next billing: {currentUser.nextBillingDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${currentPlanData.price}</p>
                <p className="text-xs text-gray-500">/month</p>
              </div>
            </div>
            <button onClick={() => setShowCancelModal(true)} className="text-sm text-red-500 hover:text-red-700 hover:underline mt-3 ml-1">
              Cancel Subscription
            </button>
          </div>
        )}

        {/* Plan Selection */}
        {showPlanChange && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {plans.map((plan) => {
                const Icon = plan.icon
                const styles = planStyles[plan.color]
                const isCurrent = plan.id === currentUser.plan
                const isSelected = plan.id === selectedPlan
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`relative text-left border-2 rounded-xl p-4 transition-all ${
                      isSelected ? `${styles.border} ring-2 ring-offset-1` : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={isSelected ? { ['--tw-ring-color' as any]: plan.color === 'blue' ? '#3b82f6' : plan.color === 'purple' ? '#a855f7' : '#f59e0b' } : {}}
                  >
                    {plan.popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">Popular</div>}
                    {isCurrent && <div className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Current</div>}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${styles.bg} flex items-center justify-center`}><Icon size={16} className={styles.text} /></div>
                      <h3 className="font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-xl font-bold mb-2">${plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                    <ul className="space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600"><Check size={10} className={`${styles.text} mt-0.5 flex-shrink-0`} />{f}</li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleChangePlan}
                disabled={selectedPlan === currentUser.plan}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowRight size={16} /> {selectedPlan === currentUser.plan ? 'Current Plan' : `Switch to ${plans.find(p => p.id === selectedPlan)?.name}`}
              </button>
              {selectedPlan !== currentUser.plan && (
                <p className="text-xs text-gray-500">Changes take effect at your next billing cycle.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Billing & Payment ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><CreditCard size={18} className="text-green-500" /> Billing & Payment</h2>
          <button onClick={() => setShowUpdateCard(!showUpdateCard)} className="text-sm text-blue-600 hover:underline">
            {showUpdateCard ? 'Cancel' : 'Update Payment Method'}
          </button>
        </div>

        {billingSaved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Check size={14} className="text-green-500" />
            <p className="text-sm text-green-700">Payment method updated successfully!</p>
          </div>
        )}

        {/* Current Payment Info */}
        {!showUpdateCard && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  {currentUser.paymentMethod === 'stripe' ? <span className="text-lg">💳</span> : <span className="text-lg">🅿️</span>}
                </div>
                <div>
                  <p className="font-medium text-sm">{currentUser.cardBrand} ending in {currentUser.cardLast4}</p>
                  <p className="text-xs text-gray-500">Expires {currentUser.cardExpiry} • via {currentUser.paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Next billing date</span>
              <span className="font-medium">{currentUser.nextBillingDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Billing email</span>
              <span className="font-medium">{currentUser.billingEmail}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium">${currentPlanData.price}/month</span>
            </div>
          </div>
        )}

        {/* Update Payment Form */}
        {showUpdateCard && (
          <div>
            {/* Method Toggle */}
            <div className="flex gap-3 mb-4">
              <button onClick={() => setPaymentMethod('stripe')} className={`flex-1 border-2 rounded-xl p-3 flex items-center gap-2 transition-colors ${paymentMethod === 'stripe' ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}`}>
                <span className="text-lg">💳</span>
                <div className="text-left"><p className="text-sm font-medium">Credit / Debit Card</p><p className="text-xs text-gray-500">Stripe</p></div>
              </button>
              <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 border-2 rounded-xl p-3 flex items-center gap-2 transition-colors ${paymentMethod === 'paypal' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                <span className="text-lg">🅿️</span>
                <div className="text-left"><p className="text-sm font-medium">PayPal</p><p className="text-xs text-gray-500">PayPal account</p></div>
              </button>
            </div>

            {paymentMethod === 'stripe' ? (
              <form onSubmit={handleUpdateBilling} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name on Card</label>
                  <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNum(e.target.value))} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Expiry</label>
                    <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(formatExp(e.target.value))} placeholder="MM/YY" maxLength={5} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CVC</label>
                    <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 font-mono" />
                  </div>
                </div>
                <button type="submit" className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"><CreditCard size={16} /> Update Card</button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-600 mb-3">Click below to link or update your PayPal account.</p>
                <button onClick={() => { setBillingSaved(true); setShowUpdateCard(false); setTimeout(() => setBillingSaved(false), 3000) }} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 inline-flex items-center gap-2">
                  🅿️ Connect PayPal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Change Password ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Lock size={18} className="text-gray-500" /> Change Password</h2>

        {pwError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500" /><p className="text-sm text-red-700">{pwError}</p>
          </div>
        )}
        {pwSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Check size={14} className="text-green-500" /><p className="text-sm text-green-700">Password changed successfully!</p>
          </div>
        )}

        <form onSubmit={handleChangePw} className="space-y-4">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showCurrentPw ? 'text' : 'password'} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Enter current password" required className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" required minLength={8} className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" required className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          <button type="submit" className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"><Lock size={16} /> Update Password</button>
        </form>
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">
        © 2026 PoopScoop HQ | info@poopscoophq.com | 877.357.7474
      </p>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Cancel Subscription?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to cancel your <strong>{currentPlanData.name}</strong> plan?
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
              <p className="text-sm text-amber-800">
                You will continue to have full access until <strong>{currentUser.nextBillingDate}</strong>. After that date, your subscription will not be renewed and you will lose access to {currentPlanData.name} features.
              </p>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep My Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}