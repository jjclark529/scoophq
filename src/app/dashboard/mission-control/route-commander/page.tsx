'use client'

import { useState } from 'react'
import { Bell, CheckCircle2, Navigation, Route as RouteIcon, Shuffle, UserRound } from 'lucide-react'
import { fieldTechs, jobs as initialJobs, routes as initialRoutes } from '@/lib/crm-data'

export default function RouteCommanderPage() {
  const [routes, setRoutes] = useState(initialRoutes)
  const [jobs, setJobs] = useState(initialJobs)
  const [selectedRouteId, setSelectedRouteId] = useState(initialRoutes[0].id)
  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || routes[0]
  const routeJobs = jobs.filter((job) => job.routeId === selectedRoute.id)

  const assignTech = (techId: string) => {
    const tech = fieldTechs.find((item) => item.id === techId)
    if (!tech) return
    setRoutes((prev) => prev.map((route) => route.id === selectedRoute.id ? { ...route, techId: tech.id, techName: tech.name } : route))
    setJobs((prev) => prev.map((job) => job.routeId === selectedRoute.id ? { ...job, techId: tech.id, techName: tech.name } : job))
  }

  const updateJobStatus = (jobId: string) => {
    setJobs((prev) => prev.map((job) => job.id === jobId ? { ...job, status: job.status === 'completed' ? 'scheduled' : 'completed' } : job))
  }

  const reorderStops = () => {
    setJobs((prev) => [...prev].sort((a, b) => a.etaMinutes - b.etaMinutes))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold mb-3">
            <Navigation size={14} /> Route Commander
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Route optimization + dispatch</h1>
          <p className="text-sm text-gray-500 mt-1">Assign field techs, notify customers, track completion, and optimize drive time.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={reorderStops} className="rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Shuffle size={16} /> Optimize order</button>
          <button className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Publish route</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {routes.map((route) => (
          <button key={route.id} onClick={() => setSelectedRouteId(route.id)} className={`text-left rounded-xl border p-5 bg-white transition-colors ${selectedRouteId === route.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-200 hover:border-emerald-300'}`}>
            <div className="flex items-center gap-2 text-emerald-700 mb-3"><RouteIcon size={18} /><span className="text-sm font-semibold">{route.day}</span></div>
            <h2 className="font-bold text-gray-900">{route.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{route.techName} • {route.zone}</p>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-sm font-bold">{route.stops}</p><p className="text-[10px] text-gray-500">Stops</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-sm font-bold">{route.driveMiles}</p><p className="text-[10px] text-gray-500">Miles</p></div>
              <div className="rounded-lg bg-gray-50 p-2"><p className="text-sm font-bold">{route.estimatedHours}h</p><p className="text-[10px] text-gray-500">ETA</p></div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><UserRound size={18} className="text-emerald-600" /> Field tech assignment</h2>
            <p className="text-sm text-gray-500 mt-1">Assign a technician for {selectedRoute.name}.</p>
            <select value={selectedRoute.techId} onChange={(e) => assignTech(e.target.value)} className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {fieldTechs.map((tech) => <option key={tech.id} value={tech.id}>{tech.name} — {tech.defaultZone}</option>)}
            </select>
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-sm font-semibold text-emerald-800">Current tech: {selectedRoute.techName}</p>
              <p className="text-xs text-emerald-700 mt-1">Drive plan includes estimated drive times between every stop.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Optimization summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Total stops</span><span className="font-semibold">{routeJobs.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Drive miles</span><span className="font-semibold">{selectedRoute.driveMiles} mi</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Drive time</span><span className="font-semibold">2h 14m</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Service time</span><span className="font-semibold">3h 45m</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Projected finish</span><span className="font-semibold text-emerald-700">2:48 PM</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Stops for {selectedRoute.name}</h2>
              <p className="text-sm text-gray-500">Includes status tracking, on-the-way notifications, and drive estimates.</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {routeJobs.map((job, index) => (
              <div key={job.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{job.customerName}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : job.status === 'skipped' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{job.address} • {job.frequency} • {job.zone}</p>
                  <p className="text-xs text-gray-400 mt-2">Estimated drive from previous stop: {index === 0 ? 'Depot start' : `${8 + index * 4} min`} • Service window {new Date(job.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"><Bell size={14} /> On the way ({job.etaMinutes}m)</button>
                  <button onClick={() => updateJobStatus(job.id)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center gap-1"><CheckCircle2 size={14} /> {job.status === 'completed' ? 'Reopen' : 'Complete'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
