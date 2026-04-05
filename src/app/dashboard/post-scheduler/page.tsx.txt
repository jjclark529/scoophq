'use client'

import { useState } from 'react'
import { Plus, Calendar as CalIcon, Clock, Edit, Trash2 } from 'lucide-react'

const scheduledPosts = [
  { platform: 'Facebook', date: 'Mar 28, 2026', time: '10:00 AM', content: '🐕 Spring is here and so are we! Book your first yard cleanup FREE with any weekly plan. Link in bio!', status: 'scheduled' },
  { platform: 'Instagram', date: 'Mar 29, 2026', time: '2:00 PM', content: 'Before & After: Check out this transformation! 📸 #TucsonDogOwners #CleanYard #ScoopDoggyLogs', status: 'scheduled' },
  { platform: 'Facebook', date: 'Mar 31, 2026', time: '9:00 AM', content: 'Happy Monday! Start the week with a clean yard. Schedule your cleanup today — we have same-week availability! 🏡', status: 'draft' },
  { platform: 'Instagram', date: 'Apr 1, 2026', time: '11:00 AM', content: '5-star review spotlight ⭐⭐⭐⭐⭐ "Best investment for our household!" — Lisa K. Thank you for trusting us!', status: 'scheduled' },
]

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentMonth = Array.from({ length: 31 }, (_, i) => i + 1)

export default function PostSchedulerPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Post Scheduler</h1>
          <p className="text-gray-500">Plan and schedule social media content</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('list')} className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>List</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-2 text-sm ${view === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Calendar</button>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-3">
          {scheduledPosts.map((post, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
              <div className="flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  post.platform === 'Facebook' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>{post.platform}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{post.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><CalIcon size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.time}</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    post.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>{post.status}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-center mb-4">
            <h2 className="font-semibold text-lg">March 2026</h2>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
            ))}
            {/* Offset for March 2026 starting on Sunday */}
            {currentMonth.map((day) => (
              <div key={day} className={`border border-gray-100 rounded-lg p-2 min-h-[80px] text-sm hover:bg-blue-50 cursor-pointer ${
                [28, 29, 31].includes(day) ? 'bg-blue-50 border-blue-200' : ''
              }`}>
                <span className="text-gray-600">{day}</span>
                {day === 28 && <div className="mt-1 text-xs bg-blue-100 text-blue-700 rounded px-1 truncate">FB: Spring promo</div>}
                {day === 29 && <div className="mt-1 text-xs bg-pink-100 text-pink-700 rounded px-1 truncate">IG: Before/After</div>}
                {day === 31 && <div className="mt-1 text-xs bg-gray-100 text-gray-600 rounded px-1 truncate">FB: Monday post</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}