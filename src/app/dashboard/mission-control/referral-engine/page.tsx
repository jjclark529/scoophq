'use client'

import { useMemo, useState } from 'react'
import { Gift, Mail, MessageSquare, Share2, TrendingUp, Trophy } from 'lucide-react'
import { referralRecords, customers } from '@/lib/crm-data'

export default function ReferralEnginePage() {
  const [channel, setChannel] = useState<'email' | 'sms'>('email')
  const [reward, setReward] = useState(25)
  const [template, setTemplate] = useState('Give a friend $25 off their first month and earn a $25 credit when they convert.')

  const analytics = useMemo(() => ({
    topReferrer: referralRecords.reduce((best, current) => {
      const currentCount = referralRecords.filter((record) => record.referrerId === current.referrerId).length
      const bestCount = referralRecords.filter((record) => record.referrerId === best.referrerId).length
      return currentCount > bestCount ? current : best
    }, referralRecords[0]),
    conversionRate: Math.round((referralRecords.filter((record) => record.status !== 'invited').length / referralRecords.length) * 100),
  }), [])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold mb-3"><Share2 size={14} /> Referral Engine</div>
        <h1 className="text-3xl font-bold text-gray-900">Referral growth machine</h1>
        <p className="text-sm text-gray-500 mt-1">Track who referred whom, automate rewards, and tune conversion performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5"><Trophy className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Top referrer</p><p className="text-xl font-bold text-gray-900 mt-1">{analytics.topReferrer.referrerName}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5"><TrendingUp className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Conversion rate</p><p className="text-xl font-bold text-gray-900 mt-1">{analytics.conversionRate}%</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5"><Gift className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Rewards issued</p><p className="text-xl font-bold text-gray-900 mt-1">${referralRecords.filter((record) => record.status === 'rewarded').reduce((sum, record) => sum + record.rewardCredit, 0)}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5"><Share2 className="text-emerald-600 mb-3" size={20} /><p className="text-sm text-gray-500">Active referrals</p><p className="text-xl font-bold text-gray-900 mt-1">{referralRecords.length}</p></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.9fr] gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral tracking</h2>
          <div className="space-y-4">
            {referralRecords.map((record) => (
              <div key={record.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{record.referrerName} referred {record.referredName}</p>
                    <p className="text-sm text-gray-500 mt-1">{record.referredEmail} • via {record.source.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${record.status === 'rewarded' ? 'bg-emerald-100 text-emerald-700' : record.status === 'converted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{record.status}</span>
                    <p className="text-sm font-semibold text-gray-900 mt-2">${record.rewardCredit} credit</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Rewards & credits</h2>
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Reward per conversion</label>
            <input type="number" value={reward} onChange={(e) => setReward(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800">Auto-apply ${reward} account credit after successful first payment.</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Automated templates</h2>
            <div className="flex gap-2 mt-4 mb-4">
              <button onClick={() => setChannel('email')} className={`rounded-lg px-3 py-2 text-sm font-medium ${channel === 'email' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}><Mail size={14} className="inline mr-1" /> Email</button>
              <button onClick={() => setChannel('sms')} className={`rounded-lg px-3 py-2 text-sm font-medium ${channel === 'sms' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}><MessageSquare size={14} className="inline mr-1" /> SMS</button>
            </div>
            <textarea value={template} onChange={(e) => setTemplate(e.target.value)} rows={6} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <button className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-3 text-sm font-semibold hover:bg-emerald-700">Save template</button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Customers ready to invite</h2>
            <div className="mt-4 space-y-3">
              {customers.filter((customer) => customer.status === 'active').slice(0, 4).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                  <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Send invite</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
