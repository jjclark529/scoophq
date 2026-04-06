'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, Building2, Check, Star, Zap, Crown, CreditCard, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { ScoopLogo } from '@/components/ui/ScoopLogo'

type Step = 'account' | 'plan' | 'payment'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    icon: Zap,
    color: 'blue',
    features: [
      'Up to 50 active clients',
      'Quote Builder',
      'Review Requests (auto-send)',
      'Basic KPIs & reporting',
      'SMS Templates (5 custom)',
      'Captain Scoop AI (50 queries/mo)',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    icon: Star,
    color: 'purple',
    popular: true,
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
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    icon: Crown,
    color: 'amber',
    features: [
      'Unlimited active clients',
      'Everything in Pro, plus:',
      'Multi-location support',
      'White-label reports',
      'Custom integrations & API access',
      'Dedicated account manager',
      'Phone support',
      'Custom onboarding',
    ],
  },
]

const planStyles: Record<string, { bg: string; border: string; text: string; btn: string; ring: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700', ring: 'ring-blue-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700', ring: 'ring-purple-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700', ring: 'ring-amber-500' },
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('account')
  const [showPassword, setShowPassword] = useState(false)

  // Account fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [accountError, setAccountError] = useState<string | null>(null)

  // Plan
  const [selectedPlan, setSelectedPlan] = useState('pro')

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const selectedPlanData = plans.find(p => p.id === selectedPlan)!

  const handleAccountNext = () => {
    setAccountError(null)
    if (!fullName.trim()) { setAccountError('Full name is required'); return }
    if (!email.trim() || !email.includes('@')) { setAccountError('Valid email is required'); return }
    if (password.length < 8) { setAccountError('Password must be at least 8 characters'); return }
    if (!businessName.trim()) { setAccountError('Business name is required'); return }
    setStep('plan')
  }

  const handlePlanNext = () => {
    setStep('payment')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError(null)
    setProcessing(true)

    if (paymentMethod === 'stripe') {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        setPaymentError('Please fill in all card details')
        setProcessing(false)
        return
      }
    }

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000))

    // In production: call /api/billing/stripe or /api/billing/paypal
    // then redirect to /dashboard on success
    window.location.href = '/dashboard'
  }

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-xl w-full ${step === 'plan' ? 'max-w-4xl' : 'max-w-lg'} p-8 transition-all`}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ScoopLogo size={120} />
            
          </div>
          <p className="text-gray-500">
            {step === 'account' ? 'Create your account' : step === 'plan' ? 'Choose your plan' : 'Complete your subscription'}
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {(['account', 'plan', 'payment'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s ? 'bg-blue-600 text-white' :
                  (['account', 'plan', 'payment'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {(['account', 'plan', 'payment'].indexOf(step) > i) ? <Check size={14} /> : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 ${(['account', 'plan', 'payment'].indexOf(step) > i) ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-1">
            <span className="text-xs text-gray-400">Account</span>
            <span className="text-xs text-gray-400">Plan</span>
            <span className="text-xs text-gray-400">Payment</span>
          </div>
        </div>

        {/* Step 1: Account Details */}
        {step === 'account' && (
          <>
            <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {accountError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{accountError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className="w-full border border-gray-200 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your company name" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <button onClick={handleAccountNext} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                Continue to Plan Selection <ChevronRight size={18} />
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account? <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
            </p>
          </>
        )}

        {/* Step 2: Plan Selection */}
        {step === 'plan' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {plans.map((plan) => {
                const Icon = plan.icon
                const styles = planStyles[plan.color]
                const isSelected = selectedPlan === plan.id
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative text-left border-2 rounded-xl p-5 transition-all ${
                      isSelected ? `${styles.border} ring-2 ${styles.ring}` : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">Most Popular</div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${styles.bg} flex items-center justify-center`}>
                        <Icon size={18} className={styles.text} />
                      </div>
                      <h3 className="font-bold">{plan.name}</h3>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 text-sm">/mo</span>
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <Check size={12} className={`${styles.text} mt-0.5 flex-shrink-0`} />
                          <span>{f}</span>
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-xs text-gray-400">+{plan.features.length - 5} more features</li>
                      )}
                    </ul>
                    {isSelected && (
                      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${styles.btn.split(' ')[0]} text-white`}>
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('account')} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                <ChevronLeft size={18} /> Back
              </button>
              <button onClick={handlePlanNext} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                Continue to Payment <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <>
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Selected plan</p>
                <p className="font-bold text-lg">{selectedPlanData.name} — ${selectedPlanData.price}/mo</p>
              </div>
              <button onClick={() => setStep('plan')} className="text-sm text-blue-600 hover:underline">Change</button>
            </div>

            {/* Payment Method Toggle */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`flex-1 border-2 rounded-xl p-4 flex items-center gap-3 transition-colors ${
                  paymentMethod === 'stripe' ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">💳</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, Amex via Stripe</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`flex-1 border-2 rounded-xl p-4 flex items-center gap-3 transition-colors ${
                  paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">🅿️</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">PayPal</p>
                  <p className="text-xs text-gray-500">PayPal balance, bank, or card</p>
                </div>
              </button>
            </div>

            {paymentError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{paymentError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {paymentMethod === 'stripe' ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                    <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                      <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-center">
                  <p className="text-2xl mb-2">🅿️</p>
                  <p className="font-semibold text-gray-900 mb-1">Pay with PayPal</p>
                  <p className="text-sm text-gray-600">You'll be redirected to PayPal to complete your ${selectedPlanData.price}/mo subscription.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('plan')} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`flex-1 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                    paymentMethod === 'stripe' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'stripe' ? <CreditCard size={18} /> : <span>🅿️</span>}
                      {paymentMethod === 'stripe' ? `Pay $${selectedPlanData.price}/mo` : 'Continue to PayPal'}
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              🔒 Payments are processed securely via {paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}. Cancel anytime.
              <br />By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className="text-center text-xs text-gray-400 mt-6">
              © 2026 PoopScoop HQ | info@poopscoophq.com | 877.357.7474
            </p>
          </>
        )}
      </div>
    </div>
  )
}