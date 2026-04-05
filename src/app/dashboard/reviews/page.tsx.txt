'use client'

import { useState } from 'react'
import { Star, Send, Clock, CheckCircle, XCircle, Settings, MessageSquare, BarChart3, Zap, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

const reviewStats = {
  totalSent: 87,
  responseRate: 42,
  averageRating: 4.9,
  totalReviews: 101,
  thisMonth: { sent: 12, responded: 6, fiveStar: 5 },
}

const recentRequests = [
  { name: 'Lisa Park', phone: '(520) 555-0573', sentDate: 'Mar 27, 2026', status: 'pending', platform: 'Google', linkClicked: false, followupsSent: 0 },
  { name: 'Mike Torres', phone: '(520) 555-0287', sentDate: 'Mar 26, 2026', status: 'reviewed', rating: 5, platform: 'Google', linkClicked: true, followupsSent: 0 },
  { name: 'Amy Nguyen', phone: '(520) 555-0644', sentDate: 'Mar 25, 2026', status: 'reviewed', rating: 5, platform: 'Google', linkClicked: true, followupsSent: 0 },
  { name: 'Robert James', phone: '(520) 555-0712', sentDate: 'Mar 24, 2026', status: 'clicked', platform: 'Google', linkClicked: true, followupsSent: 0 },
  { name: 'Sandra Hill', phone: '(520) 555-0835', sentDate: 'Mar 23, 2026', status: 'pending', platform: 'Google', linkClicked: false, followupsSent: 1 },
  { name: 'Tom Garcia', phone: '(520) 555-0491', sentDate: 'Mar 22, 2026', status: 'reviewed', rating: 4, platform: 'Google', linkClicked: true, followupsSent: 1 },
  { name: 'Karen White', phone: '(520) 555-0368', sentDate: 'Mar 20, 2026', status: 'declined', platform: 'Google', linkClicked: false, followupsSent: 2 },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Sent — Waiting', color: 'bg-blue-100 text-blue-700', icon: Clock },
  clicked: { label: 'Link Clicked', color: 'bg-amber-100 text-amber-700', icon: Zap },
  reviewed: { label: 'Review Posted!', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  declined: { label: 'No Response', color: 'bg-gray-100 text-gray-500', icon: XCircle },
}

const templates = [
  {
    name: 'Standard (After Job)',
    trigger: 'After completed job (Sweep&Go webhook)',
    delay: '2 hours after completion',
    message: 'Hi {name}! 🐕 Thanks for choosing Scoop Doggy Logs. We hope your yard looks great! Would you mind leaving us a quick Google review? It really helps small businesses like ours.\n\n⭐ {review_link}\n\nThank you so much! — The Scoop Team',
    active: true,
  },
  {
    name: 'Follow-up #1',
    trigger: 'After first request with no review & no link click',
    delay: 'Configurable days after initial text',
    message: 'Hey {name}! Just a friendly reminder — if you have a moment, we\'d love a quick Google review. It only takes 30 seconds and helps us serve more pet owners in Tucson! 🙏\n\n⭐ {review_link}',
    active: true,
  },
  {
    name: 'Follow-up #2',
    trigger: 'After follow-up #1 with no review & no link click',
    delay: 'Configurable days after follow-up #1',
    message: 'Hi {name}, last nudge from us! 😊 If you\'ve enjoyed our service, a Google review would mean the world to our small team. No worries if not — thanks for being a customer!\n\n⭐ {review_link}',
    active: true,
  },
  {
    name: 'Milestone (10th Cleanup)',
    trigger: 'After 10th completed job',
    delay: 'Immediate',
    message: 'Hey {name}! 🎉 You just hit 10 cleanups with us — you\'re officially a Scoop VIP! If you love our service, we\'d be so grateful for a Google review.\n\n⭐ {review_link}\n\nAs a thank you, your next cleanup is 50% off! 🍦',
    active: false,
  },
]

export default function ReviewsPage() {
  const [showSettings, setShowSettings] = useState(false)
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null)
  const [googlePlaceUrl, setGooglePlaceUrl] = useState('https://g.page/r/scoopHQ/review')
  const [autoSendEnabled, setAutoSendEnabled] = useState(true)
  const [delayHours, setDelayHours] = useState(2)

  // Followup scheduling settings
  const [followup1Days, setFollowup1Days] = useState(5)
  const [followup2Days, setFollowup2Days] = useState(10)
  const [stopOnClick, setStopOnClick] = useState(true)

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="text-amber-400" /> Review Requests
          </h1>
          <p className="text-gray-500">Automatically request Google reviews after completed jobs</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <Settings size={16} /> Settings
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500 flex items-center justify-center gap-1">
            {reviewStats.averageRating} <Star size={20} className="fill-amber-400 text-amber-400" />
          </p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{reviewStats.totalReviews}</p>
          <p className="text-xs text-gray-500">Total Reviews</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{reviewStats.totalSent}</p>
          <p className="text-xs text-gray-500">Requests Sent</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{reviewStats.responseRate}%</p>
          <p className="text-xs text-gray-500">Response Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{reviewStats.thisMonth.fiveStar}</p>
          <p className="text-xs text-gray-500">5-Star This Month</p>
        </div>
      </div>

      {/* Automation Status */}
      <div className={`rounded-xl p-4 mb-6 flex items-center justify-between ${autoSendEnabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <Zap size={20} className={autoSendEnabled ? 'text-green-600' : 'text-gray-400'} />
          <div>
            <p className="font-semibold text-sm">{autoSendEnabled ? '✅ Auto-Send Active' : '⏸️ Auto-Send Paused'}</p>
            <p className="text-xs text-gray-500">
              {autoSendEnabled
                ? `Review requests are sent automatically ${delayHours} hours after each completed job via Sweep&Go. Follow-ups at ${followup1Days} and ${followup1Days + followup2Days} days${stopOnClick ? ' (stop if link clicked)' : ''}.`
                : 'Review requests must be sent manually.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setAutoSendEnabled(!autoSendEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSendEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSendEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold mb-4">Review Request Settings</h2>
          <div className="space-y-5">
            {/* Google Review Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Review Link</label>
              <input type="text" value={googlePlaceUrl} onChange={(e) => setGooglePlaceUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              <p className="text-xs text-gray-400 mt-1">Get this from Google Business Profile → Share → Review link</p>
            </div>

            {/* Initial Delay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delay After Job Completion</label>
              <select value={delayHours} onChange={(e) => setDelayHours(Number(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={24}>Next day</option>
              </select>
            </div>

            {/* Followup Scheduling */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Follow-Up Scheduling
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up #1 — Days After Initial Send</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={followup1Days}
                      onChange={(e) => setFollowup1Days(Math.max(1, Math.min(30, Number(e.target.value))))}
                      className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-sm text-gray-500">days after initial request</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">First reminder sent {followup1Days} day{followup1Days !== 1 ? 's' : ''} after the original review request</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up #2 — Days After Follow-Up #1</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={followup2Days}
                      onChange={(e) => setFollowup2Days(Math.max(1, Math.min(30, Number(e.target.value))))}
                      className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-sm text-gray-500">days after follow-up #1</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Second reminder sent {followup2Days} day{followup2Days !== 1 ? 's' : ''} after follow-up #1 (day {followup1Days + followup2Days} total)</p>
                </div>
              </div>

              {/* Timeline Preview */}
              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-700 mb-2">📅 Follow-Up Timeline Preview</p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <span className="bg-white border border-blue-200 rounded px-2 py-1">Day 0: Initial Request</span>
                  <span className="text-blue-300">→</span>
                  <span className="bg-white border border-blue-200 rounded px-2 py-1">Day {followup1Days}: Follow-Up #1</span>
                  <span className="text-blue-300">→</span>
                  <span className="bg-white border border-blue-200 rounded px-2 py-1">Day {followup1Days + followup2Days}: Follow-Up #2</span>
                </div>
              </div>
            </div>

            {/* Stop on Link Click */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stop Follow-Ups When Review Link Is Clicked</label>
                  <p className="text-xs text-gray-400 mt-0.5">If a customer clicks the Google review link, all remaining follow-up messages will be cancelled automatically.</p>
                </div>
                <button
                  onClick={() => setStopOnClick(!stopOnClick)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${stopOnClick ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stopOnClick ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {stopOnClick && (
                <div className="mt-2 flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <AlertCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-green-700">Active — Follow-ups will automatically stop for any customer who clicks the review link. This prevents over-messaging customers who have already engaged.</p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="border-t border-gray-100 pt-4 flex justify-end">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Templates */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MessageSquare size={18} /> Message Templates
        </h2>
        <div className="space-y-3">
          {templates.map((template, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedTemplate(expandedTemplate === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${template.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-500">
                      {template.trigger} • {
                        i === 1 ? `${followup1Days} days after initial` :
                        i === 2 ? `${followup2Days} days after follow-up #1 (day ${followup1Days + followup2Days})` :
                        template.delay
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(i === 1 || i === 2) && stopOnClick && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                      Stops if clicked
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${template.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {template.active ? 'Active' : 'Inactive'}
                  </span>
                  {expandedTemplate === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              {expandedTemplate === i && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Message Preview:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{template.message}</p>
                  </div>
                  {(i === 1 || i === 2) && (
                    <div className="bg-blue-50 rounded-lg p-2.5 mb-3 flex items-start gap-2">
                      <Clock size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700">
                        {i === 1
                          ? `This follow-up sends ${followup1Days} day${followup1Days !== 1 ? 's' : ''} after the initial review request.`
                          : `This follow-up sends ${followup2Days} day${followup2Days !== 1 ? 's' : ''} after follow-up #1 (${followup1Days + followup2Days} days total from initial request).`}
                        {stopOnClick ? ' Will NOT send if the customer has already clicked the review link.' : ''}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Edit Template</button>
                    <button className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                      {template.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Send Test</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Requests</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Sent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Follow-Ups</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Rating</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req, i) => {
                const status = statusConfig[req.status]
                const StatusIcon = status.icon
                const followupsStopped = stopOnClick && req.linkClicked && req.status !== 'reviewed'
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium">{req.name}</p>
                      <p className="text-xs text-gray-400">{req.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{req.sentDate}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.color}`}>
                        <StatusIcon size={12} /> {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-600">{req.followupsSent}/2 sent</span>
                        {followupsStopped && (
                          <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded">
                            Stopped
                          </span>
                        )}
                        {req.status === 'reviewed' && (
                          <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded">
                            Complete
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {req.rating ? (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: req.rating }).map((_, s) => (
                            <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {req.status === 'pending' || req.status === 'declined' ? (
                        <button className="text-xs text-blue-600 hover:underline">Resend</button>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}