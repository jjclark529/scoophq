'use client'

import { useMemo, useState } from 'react'
import { CalendarClock, CloudRain, PauseCircle, PlayCircle, Repeat, Shuffle } from 'lucide-react'
import { fieldTechs, jobs as initialJobs, routes, servicePauses } from '@/lib/crm-data'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function ScoopSchedulerPage() {
  const [jobs, setJobs] = useState(initialJobs)
  const [frequencyFilter, setFrequencyFilter] = useState('all')
  const [techFilter, setTechFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('all')

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    return (frequencyFilter === 'all' || job.frequency === frequencyFilter) && (techFilter === 'all' || job.techId === techFilter) && (zoneFilter === 'all' || job.zone === zoneFilter)
  }), [jobs, frequencyFilter, techFilter, zoneFilter])

  const reassignJob = (jobId: string, techId: string) => {
    const tech = fieldTechs.find((item) => item.id === techId)
    if (!tech) return
    setJobs((prev) => prev.map((job) => job.id === jobId ? { ...job, techId: tech.id, techName: tech.name } : job))
  }

  const bulkSkipWeather = () => {
    setJobs((prev) => prev.map((job) => job.scheduledAt.startsWith('2026-04-22') ? { ...job, status: 'skipped' } : job))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold mb-3">
            <CalendarClock size={14} /> Scoop Scheduler
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly scheduling board</h1>
          <p className="text-sm text-gray-500 mt-1">Manage recurring service, pauses, weather skips, and tech assignments.</p>
        </div>
        <button onClick={bulkSkipWeather} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 flex items-center gap-2"><CloudRain size={16} /> Bulk skip for weather</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select value={frequencyFilter} onChange={(e) => setFrequencyFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"><option value="all">All frequencies</option><option value="weekly">Weekly</option><option value="bi-weekly">Bi-weekly</option><option value="monthly">Monthly</option><option value="one-time">One-time</option></select>
        <select value={techFilter} onChange={(e) => setTechFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"><option value="all">All techs</option>{fieldTechs.map((tech) => <option key={tech.id} value={tech.id}>{tech.name}</option>)}</select>
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"><option value="all">All zones</option>{Array.from(new Set(jobs.map((job) => job.zone))).map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly calendar view</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => (
            <div key={day} className="rounded-xl border border-gray-200 bg-gray-50 p-4 min-h-[220px]">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-gray-900">{day}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">{routes.filter((route) => route.day === day).length} routes</span>
              </div>
              <div className="space-y-3">
                {filteredJobs.filter((job) => new Date(job.scheduledAt).toLocaleDateString('en-US', { weekday: 'long' }) === day).map((job) => (
                  <div key={job.id} className="rounded-lg bg-white border border-gray-200 p-3">
                    <p className="font-medium text-sm text-gray-900">{job.customerName}</p>
                    <p className="text-xs text-gray-500 mt-1">{job.techName} • {job.frequency}</p>
                    <p className="text-[11px] text-gray-400 mt-2">{new Date(job.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming jobs</h2>
            <div className="text-xs text-gray-500">Filtered: {filteredJobs.length} jobs</div>
          </div>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{job.customerName}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : job.status === 'skipped' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{job.zone}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{job.address}</p>
                    <p className="text-xs text-gray-400 mt-2">{job.techName} • {job.frequency} • ETA {job.etaMinutes} min</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select value={job.techId} onChange={(e) => reassignJob(job.id, e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs bg-white">
                      {fieldTechs.map((tech) => <option key={tech.id} value={tech.id}>{tech.name}</option>)}
                    </select>
                    <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"><Shuffle size={12} /> Reassign</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Repeat size={18} className="text-emerald-600" /> Service pause management</h2>
            <div className="mt-4 space-y-3">
              {servicePauses.map((pause) => (
                <div key={pause.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{pause.customerName}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{pause.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{pause.startDate} → {pause.endDate}</p>
                  <p className="text-sm text-gray-600 mt-2">{pause.reason}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"><PauseCircle size={12} /> Pause</button>
                    <button className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center gap-1"><PlayCircle size={12} /> Resume</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
