'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, ChevronDown, Minimize2, Maximize2 } from 'lucide-react'
import Image from 'next/image'

// Captain Scoop icon — uses uploaded image
function CaptainScoopIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/captain-scoop.png"
      alt="Captain Scoop"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  )
}
import { useChatStore } from '@/store/chatStore'

const models = ['gpt-4o', 'gpt-4o-mini', 'o4-mini', 'claude-sonnet']

export default function CaptainScoopChat() {
  const { messages, isOpen, isLoading, model, addMessage, setLoading, toggleChat, setModel } = useChatStore()
  const [input, setInput] = useState('')
  const [showModelSelect, setShowModelSelect] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    addMessage('user', msg)
    setLoading(true)
    
    // Simulate AI response (will be replaced with real API call)
    setTimeout(() => {
      addMessage('assistant', generateMockResponse(msg))
      setLoading(false)
    }, 1500)
  }

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <CaptainScoopIcon size={28} />
      </button>
    )
  }

  return (
    <div className={`w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 ${minimized ? 'h-14' : 'h-full'}`}>
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-2 flex-shrink-0">
        <CaptainScoopIcon size={24} />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Captain Scoop</h3>
          <p className="text-xs text-slate-400">Business Development Assistant</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(!minimized)} className="p-1 hover:bg-slate-700 rounded">
            {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={toggleChat} className="p-1 hover:bg-slate-700 rounded">
            <X size={14} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Model Selector */}
          <div className="px-3 py-2 border-b border-gray-200 flex items-center gap-2 bg-gray-50 flex-shrink-0">
            <span className="text-xs text-gray-500">Model:</span>
            <div className="relative">
              <button
                onClick={() => setShowModelSelect(!showModelSelect)}
                className="text-xs bg-white border border-gray-300 rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-50"
              >
                {model} <ChevronDown size={12} />
              </button>
              {showModelSelect && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {models.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setModel(m); setShowModelSelect(false) }}
                      className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 ${m === model ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 ml-auto">Mar 2026</span>
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 border-b border-gray-100 flex flex-wrap gap-1.5 bg-white flex-shrink-0">
            {[
              { label: '📊 Research', prompt: 'Help me research my local market and competition' },
              { label: '🎯 Strategy', prompt: 'Give me marketing strategy recommendations' },
              { label: '💡 Lead Ideas', prompt: 'Suggest lead generation ideas for my area' },
              { label: '📈 Growth', prompt: 'Analyze my business growth opportunities' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => {
                  setInput(chip.prompt)
                }}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 mb-1">
                      <CaptainScoopIcon size={16} />
                      <span className="text-xs font-semibold text-blue-600">Captain Scoop</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask Captain Scoop anything..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase()

  // Market Research
  if (lower.includes('research') || lower.includes('market') || lower.includes('data')) {
    return "🔍 Here's what I found for your market:\n\n📊 Market Data — Tucson, AZ:\n• ~180,000 households with dogs (42% of homes)\n• 23 active pet waste removal companies\n• Average service price: $55–$75/mo for weekly\n• Peak demand: Oct–Apr (snowbird season)\n\n🏘️ Underserved Neighborhoods:\n• Oro Valley North — only 1 competitor, high home values\n• Rita Ranch — growing fast, 3,200 new homes since 2024\n• Marana — low competition, lots of new construction\n\n📈 Industry Trends:\n• Pet ownership up 8% since 2023\n• Subscription-based services growing 15% YoY\n• Customers prefer text/online booking (73%)\n\nWant me to dive deeper into any of these areas?"
  }

  // Strategy
  if (lower.includes('strategy') || lower.includes('plan') || lower.includes('grow')) {
    return "🎯 Business Development Strategy for Scoop Doggy Logs:\n\n1️⃣ Neighborhood Saturation (High Impact)\n• Target 10-block radius around each current client\n• Door hangers + targeted Meta ads by zip code\n• Referral incentive: $10 credit per new signup\n\n2️⃣ Partnership Development\n• Local vets & pet stores for referral agreements\n• HOA contracts for community-wide service\n• Dog walker & pet sitter cross-promotions\n\n3️⃣ Seasonal Campaigns\n• Spring cleanup push (Mar–Apr)\n• Snowbird welcome packages (Oct)\n• Holiday gift card promotions (Nov–Dec)\n\n4️⃣ Retention & Upsells\n• Premium tier with deodorizing included\n• Bi-annual deep clean add-ons\n• Loyalty rewards after 6 months\n\nShould I build out a detailed action plan for any of these?"
  }

  // Lead Generation
  if (lower.includes('lead') || lower.includes('prospect') || lower.includes('generation')) {
    return "💡 Lead Generation Ideas for Your Area:\n\n🏠 Neighborhood Targeting:\n• Use the Lead Generation page to find dog-owning households near your current clients\n• Each client creates a \"warm zone\" — neighbors see your truck weekly\n\n📱 Digital Tactics:\n• Geo-fenced Meta ads within 2 miles of service routes\n• Google Local Services Ads (pay-per-lead)\n• Nextdoor business page + neighborhood sponsorships\n\n🤝 Grassroots:\n• Leave door hangers on service days (neighbors notice)\n• Partner with local dog parks — sponsor waste stations\n• Attend pet adoption events with branded booth\n\n📧 Re-engagement:\n• Text past quotes that didn't convert (avg 15% win-back)\n• Seasonal \"we miss you\" campaign for churned clients\n\n🎯 Your hottest leads right now: 47 households with dogs within 10 blocks of your Oro Valley clients. Check the Lead Generation page!\n\nWant me to draft any outreach messages?"
  }

  // Budget & Spending
  if (lower.includes('budget') || lower.includes('spend') || lower.includes('cost')) {
    return "📊 Budget & ROI Analysis:\n\n💰 Current Monthly Spend:\n• Google Ads: $1,247/mo — CPL: $47.15\n• Meta Ads: $856/mo — CPL: $38.20\n• Door Hangers: ~$200/mo — CPL: ~$25 (est.)\n• Nextdoor: Free — 3 leads/mo avg\n\n📈 ROI by Channel:\n• Meta: 4.2x ROI (best performer)\n• Google Search: 3.1x ROI\n• Google Display: 1.4x ROI (consider reducing)\n• Referrals: 8.7x ROI (invest more here)\n\n💡 Recommendation:\n• Shift $200 from Google Display → Meta Lead Gen\n• Launch referral program ($10/referral = ~$15 CPL)\n• Test Nextdoor promoted posts ($50/mo)\n\nEstimated impact: +6 leads/mo, -12% avg CPL\n\nWant me to model different budget scenarios?"
  }

  // Campaigns & Ads
  if (lower.includes('campaign') || lower.includes('ads') || lower.includes('advertising')) {
    return "🎯 Campaign Performance — March 2026:\n\n✅ Top Performers:\n• 'Meta Lead Gen Spring' — $32.10 CPL, 12 leads\n• 'Google Search Brand' — $28.50 CPL, 8 leads\n\n⚠️ Needs Optimization:\n• 'Meta Retargeting' — CTR dropped 15%, refresh creative\n• 'Google Display Awareness' — $89 CPL, consider pausing\n\n📝 Creative Suggestions:\n• Before/after yard photos perform 3x better\n• Video testimonials get 2.5x engagement\n• \"First cleanup free\" offers convert 40% higher\n\nWant me to generate ad copy or creative ideas?"
  }

  // Competitor Analysis
  if (lower.includes('competitor') || lower.includes('competition')) {
    return "🔎 Competitor Intelligence Report:\n\n📊 Top 5 Competitors in Tucson:\n1. Pet Butler — 4.6★ (89 reviews), $60-90/mo\n2. DoodyCalls — 4.3★ (45 reviews), $55-85/mo\n3. Poop Patrol AZ — 4.8★ (34 reviews), $50-75/mo\n4. Scoop Masters — 4.1★ (22 reviews), $45-70/mo\n5. Desert Dog Waste — 4.5★ (18 reviews), $50-80/mo\n\n💪 Your Advantages:\n• You: 4.9★ with 101 reviews (highest rated!)\n• More competitive pricing on premium tier\n• Faster response time (avg 12 min vs industry 4 hr)\n\n🎯 Opportunities:\n• Pet Butler doesn't serve Marana — you could own that area\n• None offer subscription pricing with loyalty rewards\n• Only 2 have active social media presence\n\nWant me to do a deeper dive on any competitor?"
  }

  // Customer / Client info
  if (lower.includes('customer') || lower.includes('client') || lower.includes('retention')) {
    return "👥 Customer & Business Overview:\n\n📊 Active Clients: 234\n• Weekly: 156 (67%)\n• Bi-weekly: 52 (22%)\n• Monthly/Other: 26 (11%)\n\n💰 Revenue Metrics:\n• MRR: $14,820\n• Avg revenue per client: $63.33/mo\n• Churn rate: 4.2% (industry avg: 6.8%) ✅\n• LTV: $1,508 per client\n\n📈 Growth:\n• +18 new clients this month (target: 15) ✅\n• Net growth: +12 (6 churned)\n• Quo calls received: 47\n\n🔄 Retention Opportunities:\n• 14 clients approaching 6-month mark → loyalty offer\n• 8 bi-weekly clients may upgrade to weekly\n• 3 clients haven't been serviced in 3 weeks → check in\n\nWant me to draft outreach messages for any of these groups?"
  }

  // Default — broad capabilities
  return "🍦 I'm Captain Scoop — your complete business development assistant!\n\nI can help with:\n\n📊 Research & Data\n• Market analysis & demographics\n• Customer data & trends\n• Industry benchmarks\n\n🎯 Marketing Strategy\n• Campaign optimization\n• Ad copy & creative ideas\n• Lead generation tactics\n\n🔍 Business Intelligence\n• Competitor analysis\n• Revenue & ROI insights\n• Growth opportunity identification\n\n👥 Customer Development\n• Retention strategies\n• Upsell recommendations\n• Outreach message drafting\n\n🗺️ Local Intelligence\n• Neighborhood targeting\n• Service area optimization\n• Dog-owner household research\n\nWhat would you like to work on?"
}