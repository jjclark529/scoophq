'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, ExternalLink, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react'

type Guide = {
  title: string
  icon: string
  description: string
  time: string
  steps: { title: string; detail: string }[]
}

const setupGuides: Guide[] = [
  {
    title: 'Google Ads Setup',
    icon: '🔍',
    description: 'Connect your Google Ads account and start tracking campaign performance.',
    time: '10 min',
    steps: [
      { title: 'Go to your Google Ads account', detail: 'Log in at ads.google.com. You\'ll need your Customer ID (found in the top right corner, format: XXX-XXX-XXXX).' },
      { title: 'Find your Customer ID', detail: 'Click on your account icon in the top right. Your Customer ID is displayed under your email. Copy this number.' },
      { title: 'Open PoopScoop HQ Connections', detail: 'Navigate to Settings → Connections in PoopScoop HQ. Find the Google card.' },
      { title: 'Enter your Google Ads Customer ID', detail: 'Paste your Customer ID into the "Google Ads Customer ID" field and click Save.' },
      { title: 'Authorize access', detail: 'Click "Connect" and follow the Google OAuth prompt to grant PoopScoop HQ read access to your campaign data.' },
    ],
  },
  {
    title: 'Facebook Ads Setup',
    icon: '📘',
    description: 'Link your Meta Business account to pull Facebook and Instagram ad data.',
    time: '8 min',
    steps: [
      { title: 'Open Meta Business Settings', detail: 'Go to business.facebook.com/settings. You\'ll need Admin access to your Business Manager.' },
      { title: 'Find your Ad Account ID', detail: 'Navigate to Accounts → Ad Accounts. Your Ad Account ID starts with "act_" followed by numbers.' },
      { title: 'Open PoopScoop HQ Connections', detail: 'Navigate to Settings → Connections. Find the Meta (Facebook / Instagram) card.' },
      { title: 'Enter your Ad Account ID', detail: 'Paste your Ad Account ID and Page ID into the respective fields.' },
    ],
  },
  {
    title: 'Google Analytics (GA4)',
    icon: '📊',
    description: 'Connect GA4 to track website traffic, conversions, and user behavior.',
    time: '12 min',
    steps: [
      { title: 'Log into Google Analytics', detail: 'Go to analytics.google.com and select your GA4 property.' },
      { title: 'Find your Property ID', detail: 'Click Admin (gear icon) → Property Settings. Your Property ID is a 9-digit number at the top.' },
      { title: 'Enable the Analytics API', detail: 'Go to console.cloud.google.com → APIs & Services → Enable "Google Analytics Data API".' },
      { title: 'Create a service account (optional)', detail: 'For automated access, create a service account and add it as a Viewer on your GA4 property.' },
      { title: 'Enter Property ID in PoopScoop HQ', detail: 'Go to Settings → Connections → Google card. Paste your GA4 Property ID and save.' },
      { title: 'Verify the connection', detail: 'After saving, Captain Scoop should be able to pull your analytics data. Ask it "Show me my website traffic this month" to test.' },
    ],
  },
  {
    title: 'Search Console',
    icon: '🌐',
    description: 'Link Search Console for organic search rankings and click data.',
    time: '5 min',
    steps: [
      { title: 'Open Google Search Console', detail: 'Go to search.google.com/search-console and select your property.' },
      { title: 'Copy your site URL', detail: 'Your property URL is shown at the top (e.g., https://yoursite.com). Copy this.' },
      { title: 'Enter in PoopScoop HQ', detail: 'Go to Settings → Connections → Google card. Paste the URL into "Search Console URL" and save.' },
    ],
  },
  {
    title: 'Conversion Tracking',
    icon: '🎯',
    description: 'Set up proper conversion tracking across Google and Meta platforms.',
    time: '20 min',
    steps: [
      { title: 'Install Google Tag Manager', detail: 'Go to tagmanager.google.com and create a container for your website. Add the GTM snippet to your site\'s <head> tag.' },
      { title: 'Set up Google Ads conversion', detail: 'In Google Ads, go to Tools → Conversions → New conversion action. Choose "Website" and configure your conversion (e.g., form submission, phone call).' },
      { title: 'Add conversion tag to GTM', detail: 'In GTM, create a new tag → Google Ads Conversion Tracking. Enter your Conversion ID and Label from Google Ads.' },
      { title: 'Set up Meta Pixel', detail: 'In Meta Events Manager, go to Data Sources → Add → Facebook Pixel. Copy the pixel code.' },
      { title: 'Add Meta Pixel to GTM', detail: 'In GTM, create a Custom HTML tag and paste the Meta Pixel code. Set trigger to "All Pages".' },
      { title: 'Configure conversion events', detail: 'In Meta Events Manager, set up Standard Events (e.g., Lead, Contact, SubmitApplication) for your key actions.' },
      { title: 'Test conversions', detail: 'Use Google Tag Assistant and Meta Pixel Helper browser extensions to verify tracking is firing correctly.' },
      { title: 'Link to PoopScoop HQ', detail: 'Once tracking is live, PoopScoop HQ will automatically pull conversion data from your connected Google and Meta accounts.' },
    ],
  },
  {
    title: 'Call Tracking',
    icon: '📞',
    description: 'Configure call tracking to attribute phone leads to your ad campaigns.',
    time: '10 min',
    steps: [
      { title: 'Get a tracking number', detail: 'Use Quo (or a service like CallRail) to get a dedicated tracking phone number for your ads.' },
      { title: 'Set up call forwarding', detail: 'Configure the tracking number to forward to your main business line.' },
      { title: 'Add to your ads', detail: 'Use the tracking number in your Google Ads call extensions and on your landing pages.' },
      { title: 'Enter in PoopScoop HQ', detail: 'Go to My Business → Performance Targets and enter your call tracking number. This helps Captain Scoop attribute calls to campaigns.' },
    ],
  },
  {
    title: 'Quo Setup',
    icon: '💬',
    description: 'Connect Quo for calls, texts, voicemails, transcriptions, and in-app SMS.',
    time: '5 min',
    steps: [
      { title: 'Log into Quo', detail: 'Go to quo.com and sign into your account. You\'ll need Admin access.' },
      { title: 'Generate an API key', detail: 'Navigate to Settings → API → Create new API key. Give it a descriptive name like "PoopScoop HQ Integration". Set permissions to include Calls, Messages, and Contacts.' },
      { title: 'Enter API key in PoopScoop HQ', detail: 'Go to Settings → Connections → Quo card. Paste your API key and click Connect.' },
      { title: 'Enable for SMS messaging (optional)', detail: 'To send SMS from PoopScoop HQ through Quo, click "Use for In-App SMS" on the Quo connection card. Only one SMS provider can be active at a time.' },
      { title: 'Verify the connection', detail: 'Go to SMS Templates and try sending a test message. Calls and voicemails should also start appearing in your Contact Followup data.' },
    ],
  },
  {
    title: 'Dialpad Setup',
    icon: '☎️',
    description: 'Connect Dialpad for business phone, SMS messaging, and call analytics.',
    time: '8 min',
    steps: [
      { title: 'Log into Dialpad', detail: 'Go to dialpad.com and sign into your admin account.' },
      { title: 'Create an API key', detail: 'Navigate to Admin Settings → Integrations → API Keys → Create new key. Name it "PoopScoop HQ" and enable SMS and Call permissions.' },
      { title: 'Find your Office ID', detail: 'In Admin Settings → Offices, click on your office. The Office ID is in the URL or the details panel.' },
      { title: 'Enter credentials in PoopScoop HQ', detail: 'Go to Settings → Connections → Dialpad card. Enter your API Key and Office ID, then click Connect.' },
      { title: 'Enable for SMS messaging (optional)', detail: 'Click "Use for In-App SMS" on the Dialpad card. This lets you send SMS directly from PoopScoop HQ templates and followups via your Dialpad number.' },
      { title: 'Verify', detail: 'Send a test SMS from the SMS Templates page. Check that your Dialpad call history also syncs.' },
    ],
  },
  {
    title: 'RingCentral Setup',
    icon: '📱',
    description: 'Connect RingCentral for cloud phone, SMS messaging, and team communications.',
    time: '10 min',
    steps: [
      { title: 'Log into RingCentral Developer Portal', detail: 'Go to developers.ringcentral.com and sign in with your RingCentral admin credentials.' },
      { title: 'Create a new app', detail: 'Click "Create App" → Choose "REST API App" → Set auth type to "JWT". Name it "PoopScoop HQ Integration".' },
      { title: 'Set permissions', detail: 'Under App Permissions, enable: ReadMessages, SendMessages, ReadCallLog, ReadContacts. Save the app.' },
      { title: 'Get your credentials', detail: 'From the app\'s Credentials page, copy the Client ID and Client Secret. Then go to your RingCentral admin account → Settings → Create a JWT Token.' },
      { title: 'Enter credentials in PoopScoop HQ', detail: 'Go to Settings → Connections → RingCentral card. Enter your Client ID, Client Secret, and JWT Token. Click Connect.' },
      { title: 'Enable for SMS messaging (optional)', detail: 'Click "Use for In-App SMS" on the RingCentral card. Messages will send from your RingCentral business number.' },
      { title: 'Verify', detail: 'Send a test SMS from SMS Templates. Confirm your RingCentral number appears as the sender.' },
    ],
  },
  {
    title: 'Sweep&Go Setup',
    icon: '🧹',
    description: 'Connect Sweep&Go for client data, subscriptions, and job tracking.',
    time: '5 min',
    steps: [
      { title: 'Log into Sweep&Go', detail: 'Go to your Sweep&Go dashboard.' },
      { title: 'Generate API token', detail: 'Click "Generate API token" in your dashboard settings. This creates a Bearer token for API access.' },
      { title: 'Enter credentials in PoopScoop HQ', detail: 'Go to Settings → Connections → Sweep&Go card. Paste your API Token and Organization ID, then click Connect.' },
    ],
  },
  {
    title: 'HubSpot + Make Setup',
    icon: '🔗',
    description: 'Set up Make scenarios to bridge HubSpot data into PoopScoop HQ.',
    time: '15 min',
    steps: [
      { title: 'Create a Make.com account', detail: 'Go to make.com and sign up for a free account if you don\'t have one.' },
      { title: 'Create a new scenario', detail: 'Click "Create a new scenario". Add HubSpot as the trigger module.' },
      { title: 'Connect your HubSpot account', detail: 'In the HubSpot module, click "Add" and authorize Make to access your HubSpot account via OAuth.' },
      { title: 'Set up trigger events', detail: 'Choose trigger events like "New Contact", "Deal Stage Changed", "New Deal Created".' },
      { title: 'Add PoopScoop HQ webhook', detail: 'Add an HTTP module → Make a Request. Set the URL to your PoopScoop HQ webhook endpoint (shown on the Connections page).' },
      { title: 'Test and activate', detail: 'Run the scenario once to test, then turn it on. Data will now flow from HubSpot → Make → PoopScoop HQ automatically.' },
    ],
  },
  {
    title: 'Jobber Setup',
    icon: '🔧',
    description: 'Connect Jobber to pull jobs, invoices, clients, and quotes.',
    time: '8 min',
    steps: [
      { title: 'Log into Jobber', detail: 'Go to getjobber.com and sign into your account.' },
      { title: 'Access API settings', detail: 'Navigate to Settings → Integrations → API. Jobber uses a GraphQL API.' },
      { title: 'Create an API application', detail: 'Go to developer.getjobber.com and register a new application. You\'ll receive a Client ID and Client Secret.' },
      { title: 'Generate API key', detail: 'Follow the OAuth flow to generate an access token for your Jobber account.' },
      { title: 'Enter credentials in PoopScoop HQ', detail: 'Go to Settings → Connections → Jobber card. Paste your API Key and Client ID, then click Connect.' },
    ],
  },
  {
    title: 'Pipeline CRM Setup',
    icon: '📊',
    description: 'Connect Pipeline CRM for deals, contacts, and pipeline tracking.',
    time: '5 min',
    steps: [
      { title: 'Log into Pipeline CRM', detail: 'Go to pipelinecrm.com and sign into your account.' },
      { title: 'Find your API key', detail: 'Navigate to Account Settings → API. Your API key is displayed on this page. Copy it.' },
      { title: 'Get your App Key', detail: 'If required, register an application to get an App Key for additional access.' },
      { title: 'Enter credentials in PoopScoop HQ', detail: 'Go to Settings → Connections → Pipeline CRM card. Paste your API Key and App Key, then click Connect.' },
    ],
  },
  {
    title: 'GoHighLevel Setup',
    icon: '🚀',
    description: 'Connect GoHighLevel for contacts, opportunities, and campaigns.',
    time: '8 min',
    steps: [
      { title: 'Log into GoHighLevel', detail: 'Go to app.gohighlevel.com and sign into your account.' },
      { title: 'Navigate to API settings', detail: 'Go to Settings → Business Info → API. Or use the Developer Marketplace at marketplace.gohighlevel.com.' },
      { title: 'Generate an API key', detail: 'Click "Generate API Key". Give it a name like "PoopScoop HQ Integration". Copy the generated key.' },
      { title: 'Find your Location ID', detail: 'Your Location ID is in the URL when you\'re logged in (the string after /location/). Copy this.' },
      { title: 'Enter credentials in PoopScoop HQ', detail: 'Go to Settings → Connections → GoHighLevel card. Paste your API Key and Location ID, then click Connect.' },
    ],
  },
  {
    title: 'OpenAI API Key',
    icon: '🤖',
    description: 'Configure your AI key to power Captain Scoop and smart features.',
    time: '3 min',
    steps: [
      { title: 'Go to OpenAI', detail: 'Visit platform.openai.com and sign in (or create an account).' },
      { title: 'Generate an API key', detail: 'Navigate to API Keys → Create new secret key. Copy it immediately (you won\'t be able to see it again).' },
      { title: 'Enter in PoopScoop HQ', detail: 'Go to Settings → Connections → AI Configuration section. Paste your API key and click Save. Captain Scoop is now powered up! 🍦' },
    ],
  },
]

const learningResources = [
  { title: 'Reading Your Reports', icon: '📈', description: 'Understanding your marketing metrics and what they mean.', time: '10 min read', content: 'Your PoopScoop HQ dashboard shows several key metrics:\n\n• **CPL (Cost Per Lead)** — How much you spend to get one lead. Lower is better. Industry average for service businesses is $30-50.\n\n• **CTR (Click-Through Rate)** — Percentage of people who click your ad after seeing it. Good CTR is 2-5% for search ads, 0.5-1.5% for display.\n\n• **ROAS (Return on Ad Spend)** — Revenue generated per dollar spent on ads. A 5x ROAS means $5 revenue for every $1 spent.\n\n• **Conversion Rate** — Percentage of visitors who become leads. Industry average is 2-5%.\n\n• **LTV (Lifetime Value)** — How much a customer is worth over their entire relationship with you.' },
  { title: 'Using Ad Builder', icon: '🎨', description: 'How to create ads using the built-in ad builder and AI assistance.', time: '8 min read', content: 'The Ad Builder lets you create campaigns for Google Ads and Meta (Facebook/Instagram):\n\n1. Choose your platform\n2. Set your budget and duration\n3. Define your target audience\n4. Write ad copy (or let Captain Scoop generate it)\n5. Review and launch\n\n**Pro tip:** Use the "Let AI build it" option to have Captain Scoop create an entire campaign based on your brand voice and target audience.' },
  { title: 'Budget Management', icon: '💰', description: 'Best practices for allocating and optimizing your ad budget.', time: '6 min read', content: 'Key budget principles:\n\n• **Start small, scale winners** — Begin with $10-25/day per campaign. Scale up campaigns with CPL below your target.\n\n• **70/20/10 rule** — Put 70% of budget in proven campaigns, 20% in testing new audiences, 10% in experimental creative.\n\n• **Kill losers fast** — If a campaign has spent 3x your target CPL with no conversions, pause it.\n\n• **Platform allocation** — Most service businesses see best results splitting 60% Google / 40% Meta.' },
  { title: 'Glossary', icon: '📖', description: 'Marketing terms and abbreviations explained simply.', time: 'Reference', content: '**CPA** — Cost Per Acquisition\n**CPL** — Cost Per Lead\n**CPC** — Cost Per Click\n**CTR** — Click-Through Rate\n**ROAS** — Return on Ad Spend\n**ROI** — Return on Investment\n**LTV** — Lifetime Value\n**MRR** — Monthly Recurring Revenue\n**CAC** — Customer Acquisition Cost\n**GA4** — Google Analytics 4\n**GTM** — Google Tag Manager\n**Impression** — One view of your ad\n**Conversion** — A desired action (form fill, call, etc.)\n**Retargeting** — Showing ads to people who already visited your site\n**Lookalike** — Meta audience similar to your existing customers' },
]

export default function HelpPage() {
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null)
  const [expandedResource, setExpandedResource] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})

  const toggleStep = (guideIdx: number, stepIdx: number) => {
    const key = `${guideIdx}-${stepIdx}`
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-500" /> Help Center
        </h1>
        <p className="text-gray-500">Setup guides, tutorials, and documentation</p>
      </div>

      {/* What's PoopScoop HQ */}
      <Link
        href="/about"
        className="block bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 mb-6 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">What&apos;s PoopScoop HQ?</h2>
            <p className="text-blue-100 text-sm mt-1">Learn about all features, integrations, and FAQs</p>
          </div>
          <ArrowRight size={20} className="text-white/70" />
        </div>
      </Link>

      {/* Quick Start */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">🚀 Quick Start</h2>
        <p className="text-sm text-blue-800">
          New to PoopScoop HQ? Start by connecting your Google Ads and Meta Ads accounts (guides below),
          then set up your business profile. Captain Scoop will guide you through the rest!
        </p>
      </div>

      {/* Setup Guides */}
      <h2 className="text-lg font-semibold mb-4">Setup Guides</h2>
      <div className="space-y-3 mb-8">
        {setupGuides.map((guide, gi) => {
          const isExpanded = expandedGuide === gi
          const completedCount = guide.steps.filter((_, si) => completedSteps[`${gi}-${si}`]).length
          const allDone = completedCount === guide.steps.length

          return (
            <div key={gi} className={`bg-white rounded-xl border ${allDone ? 'border-green-300' : 'border-gray-200'} overflow-hidden`}>
              <button
                onClick={() => setExpandedGuide(isExpanded ? null : gi)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{guide.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      {guide.title}
                      {allDone && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Complete</span>}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{guide.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{guide.steps.length} steps • {guide.time}</span>
                  {completedCount > 0 && !allDone && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{completedCount}/{guide.steps.length}</span>
                  )}
                  {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="space-y-3">
                    {guide.steps.map((step, si) => {
                      const stepKey = `${gi}-${si}`
                      const isDone = completedSteps[stepKey]
                      return (
                        <div key={si} className={`rounded-lg border p-3 ${isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleStep(gi, si)}
                              className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isDone ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-500'
                              }`}
                            >
                              {isDone && <Check size={14} />}
                            </button>
                            <div>
                              <p className={`text-sm font-medium ${isDone ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                                Step {si + 1}: {step.title}
                              </p>
                              <p className={`text-xs mt-1 ${isDone ? 'text-green-600' : 'text-gray-500'}`}>{step.detail}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{completedCount} of {guide.steps.length} steps completed</p>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${(completedCount / guide.steps.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Learning Resources */}
      <h2 className="text-lg font-semibold mb-4">Learning Resources</h2>
      <div className="space-y-3">
        {learningResources.map((resource, ri) => {
          const isExpanded = expandedResource === ri
          return (
            <div key={ri} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedResource(isExpanded ? null : ri)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{resource.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{resource.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{resource.time}</span>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="prose prose-sm max-w-none">
                    {resource.content.split('\n\n').map((paragraph, pi) => (
                      <p key={pi} className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">
        © 2026 PoopScoop HQ | info@poopscoophq.com | 877.357.7474
      </p>
    </div>
  )
}