'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BarChart3, Target, FileText, MapPin, Star, MessageSquare, Megaphone,
  Rocket, TrendingUp, Users, DollarSign, Zap, ChevronDown, ChevronUp,
  LogIn, UserPlus, ArrowRight
} from 'lucide-react'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'faq', label: 'FAQs' },
]

const features = [
  {
    icon: BarChart3,
    title: 'Marketing Dashboard & KPIs',
    description: 'See all your marketing metrics in one place — leads, ad spend, CPL, conversion rates, and ROI. No more jumping between Google Ads, Meta, and spreadsheets.',
  },
  {
    icon: Megaphone,
    title: 'Campaign Management',
    description: 'View and manage all your Google and Meta ad campaigns from a single dashboard. Get AI-powered health verdicts and optimization recommendations.',
  },
  {
    icon: Rocket,
    title: 'Ad Quick Launch',
    description: 'Launch a new ad campaign in under 5 minutes. Choose your platform, set your budget, define your audience, and go live — no marketing degree required.',
  },
  {
    icon: FileText,
    title: 'Quote Builder',
    description: 'Create professional quotes instantly based on yard size, number of dogs, and service frequency. Supports per-visit and monthly pricing with automatic calculations, initial cleanup fees, and pro-rated first months.',
  },
  {
    icon: DollarSign,
    title: 'Revenue & ROI Tracking',
    description: 'Track your revenue across all CRM integrations (Sweep&Go, Jobber, HubSpot, and more). See profit margins, customer LTV, payback periods, and true return on ad spend.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Goals',
    description: 'Set client and revenue targets with a goal date. Get AI-powered projections showing when you\'ll hit your goals at current growth rates, plus actionable strategies to get there faster.',
  },
  {
    icon: Target,
    title: 'Missions & Coaching',
    description: 'Gamified marketing tasks that earn you PooPower (PP) points, plus AI coaching tips with specific insights, actions, and estimated impact for your business.',
  },
  {
    icon: MapPin,
    title: 'Service Area Intelligence',
    description: 'Visualize your customer density by zone, identify high-potential neighborhoods, and get expansion recommendations based on where your current clients are concentrated.',
  },
  {
    icon: Users,
    title: 'Lead Generation',
    description: 'Find dog-owning households near your existing clients. Expand your reach block-by-block with targeted prospecting based on proximity to your current service routes.',
  },
  {
    icon: Star,
    title: 'Review Management',
    description: 'Automate review requests to customers after service. Track your Google rating, manage follow-up sequences, and grow your online reputation on autopilot.',
  },
  {
    icon: MessageSquare,
    title: 'SMS Templates',
    description: 'Pre-built text message templates for every situation — new leads, appointment reminders, follow-ups, seasonal promos, and review requests. Personalize with merge fields.',
  },
  {
    icon: Zap,
    title: 'Captain Scoop AI Assistant',
    description: 'Your AI marketing sidekick. Captain Scoop analyzes your data, spots opportunities, recommends budget moves, and helps you make smarter decisions — all in plain English.',
  },
]

const faqs = [
  {
    q: 'What is PoopScoop HQ?',
    a: 'PoopScoop HQ is an all-in-one marketing and operations platform built specifically for pet waste removal businesses. It combines ad management, CRM integrations, quoting, review management, lead generation, and AI-powered coaching into a single dashboard.',
  },
  {
    q: 'Who is this for?',
    a: 'Any pooper scooper business — whether you\'re a solo operator or managing a team. If you run ads, send quotes, track customers, or want to grow your business, PoopScoop HQ is built for you.',
  },
  {
    q: 'Do I need marketing experience?',
    a: 'Not at all. Captain Scoop (our AI assistant) guides you through everything. The Ad Quick Launch lets you create campaigns in under 5 minutes, and the Coaching section gives you specific, actionable advice based on your actual performance data.',
  },
  {
    q: 'What integrations do you support?',
    a: 'We integrate with Google Ads, Meta (Facebook/Instagram) Ads, Google Analytics, Google Search Console, Sweep&Go, Jobber, HubSpot (via Make), Pipeline CRM, GoHighLevel, Quo (phone/SMS), and Google Business Profile.',
  },
  {
    q: 'How does the Quote Builder work?',
    a: 'Upload your pricing spreadsheet or enter prices manually by yard size, number of dogs, and frequency. Then generate quotes instantly — per visit or per month. You can include initial cleanup fees, set start dates, and the system automatically handles pro-rated first months.',
  },
  {
    q: 'What are PooPower (PP) points?',
    a: 'PooPower is our gamification system. You earn PP by completing marketing missions — like optimizing your campaigns, auditing your ads, or hitting performance targets. It makes improving your marketing fun and trackable.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All API keys and credentials are stored securely. We use OAuth for platform connections where available, and your data is never shared with other accounts.',
  },
  {
    q: 'How much does it cost?',
    a: 'We offer multiple subscription tiers to fit businesses of all sizes. You can see pricing details on our registration page. All plans include a full-featured dashboard, AI coaching, and core integrations.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your account profile.',
  },
  {
    q: 'How do I get started?',
    a: 'Click "Sign Up" to create your account, choose a plan, and you\'ll be in your dashboard in under 2 minutes. From there, connect your ad accounts and CRM, and Captain Scoop will guide you through the rest.',
  },
]

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="PoopScoop HQ" width={200} height={200} priority className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold mb-3">What&apos;s PoopScoop HQ?</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            The AI-powered marketing and operations platform built exclusively for pet waste removal businesses.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === s.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full justify-center"
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full justify-center"
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Overview Section */}
          <section id="overview" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>PoopScoop HQ</strong> is the first marketing and business operations platform designed specifically for the pet waste removal industry. Whether you&apos;re a one-person operation or managing a growing team, PoopScoop HQ gives you the tools to market smarter, close more customers, and grow your business — all from one dashboard.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Most pooper scooper businesses juggle a mess of tools — Google Ads in one tab, a CRM in another, quotes in a spreadsheet, and review requests via text. PoopScoop HQ brings it all together and adds an AI assistant (Captain Scoop) that actually understands your business and tells you exactly what to do next.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">10+</p>
                  <p className="text-sm text-gray-600 mt-1">Platform Integrations</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">&lt; 5 min</p>
                  <p className="text-sm text-gray-600 mt-1">Launch an Ad Campaign</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">24/7</p>
                  <p className="text-sm text-gray-600 mt-1">AI Marketing Coach</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    {expandedFaq === i ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to out-scoop the competition?</h2>
            <p className="text-blue-100 mb-6">Join PoopScoop HQ and start growing your business today.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile auth buttons */}
          <div className="lg:hidden flex gap-3 mt-8">
            <Link href="/login" className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">Sign In</Link>
            <Link href="/register" className="flex-1 text-center border border-gray-200 py-3 rounded-lg font-medium hover:bg-gray-50">Sign Up</Link>
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        © 2026 PoopScoop HQ | info@poopscoophq.com | 877.357.7474
      </div>
    </div>
  )
}