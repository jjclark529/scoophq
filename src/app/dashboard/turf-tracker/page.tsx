'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Crosshair, MapPin, Users, Home, ChevronDown, Lightbulb, TrendingUp, Target, Minus, Plus, Download, Filter } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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

// ─── Types ──────────────────────────────────────────────────────
type InterestLevel = 'unknown' | 'interested' | 'not-interested'

interface Household {
  id: string
  address: string
  lat: number
  lng: number
  distance: number
}

interface HouseholdStatus {
  knocked: boolean
  flyerLeft: boolean
  dogVerified: boolean
  interest: InterestLevel
  converted: boolean
}

// ─── Mock Data: Current Clients with addresses ──────────────────
const clients = [
  { id: 'c1', name: 'Sarah Mitchell', address: '4521 N Campbell Ave, Tucson, AZ', lat: 32.2651, lng: -110.9387, dogs: 2, plan: 'Weekly', since: 'Jan 2025' },
  { id: 'c2', name: 'David Chen', address: '7890 E Tanque Verde Rd, Tucson, AZ', lat: 32.2510, lng: -110.8430, dogs: 4, plan: 'Weekly', since: 'Mar 2025' },
  { id: 'c3', name: 'Jennifer Lawson', address: '1234 W Ina Rd, Tucson, AZ', lat: 32.3322, lng: -111.0102, dogs: 3, plan: 'Bi-Weekly', since: 'Jun 2025' },
  { id: 'c4', name: 'Mike Torres', address: '5678 N Oracle Rd, Tucson, AZ', lat: 32.2890, lng: -110.9705, dogs: 1, plan: 'Weekly', since: 'Sep 2025' },
  { id: 'c5', name: 'Lisa Park', address: '9012 E Broadway Blvd, Tucson, AZ', lat: 32.2218, lng: -110.8890, dogs: 2, plan: 'Twice Weekly', since: 'Nov 2025' },
  { id: 'c6', name: 'Tom Garcia', address: '3456 S Kolb Rd, Tucson, AZ', lat: 32.1950, lng: -110.8410, dogs: 1, plan: 'Weekly', since: 'Dec 2025' },
  { id: 'c7', name: 'Amy Nguyen', address: '2345 N Alvernon Way, Tucson, AZ', lat: 32.2432, lng: -110.9190, dogs: 2, plan: 'Bi-Weekly', since: 'Feb 2026' },
  { id: 'c8', name: 'Robert James', address: '6789 E Speedway Blvd, Tucson, AZ', lat: 32.2363, lng: -110.8650, dogs: 3, plan: 'Weekly', since: 'Jan 2026' },
]

// ~80m per block in Tucson-style grid
const METERS_PER_BLOCK = 80

// ─── Generate nearby households based on selected client & radius ────
function generateNearbyHouseholds(client: typeof clients[0], blockRadius: number): Household[] {
  const tucsonStreets = [
    'E Elm St', 'N Stone Ave', 'W Congress St', 'E Speedway Blvd', 'N Campbell Ave',
    'E Grant Rd', 'S Park Ave', 'W Miracle Mile', 'N Oracle Rd', 'E Pima St',
    'W Anklam Rd', 'N Flowing Wells Rd', 'E 22nd St', 'S 6th Ave', 'W Ajo Way',
    'N 1st Ave', 'E Mabel St', 'S 4th Ave', 'W St Marys Rd', 'N Euclid Ave',
    'E Lee St', 'S Tucson Blvd', 'W Silverlake Rd', 'N Country Club Rd', 'E Adams St',
    'S Craycroft Rd', 'W Ruthrauff Rd', 'N Swan Rd', 'E Fort Lowell Rd', 'S Wilmot Rd',
  ]

  const seed = client.id.charCodeAt(1)
  const maxDist = blockRadius * METERS_PER_BLOCK
  const spreadFactor = blockRadius / 10
  const totalHouseholds = Math.round(5 * blockRadius)
  const households: Household[] = []

  for (let i = 0; i < totalHouseholds; i++) {
    const latOffset = (((seed * 13 + i * 7) % 200) - 100) / 10000 * spreadFactor
    const lngOffset = (((seed * 17 + i * 11) % 200) - 100) / 10000 * spreadFactor
    const houseNum = 100 + ((seed * 3 + i * 41) % 9900)
    const streetIdx = (seed + i * 3) % tucsonStreets.length
    const distance = Math.round(Math.sqrt(latOffset * latOffset + lngOffset * lngOffset) * 111000)

    if (distance > maxDist) continue

    households.push({
      id: `hh-${client.id}-${i}`,
      address: `${houseNum} ${tucsonStreets[streetIdx]}, Tucson, AZ`,
      lat: client.lat + latOffset,
      lng: client.lng + lngOffset,
      distance: Math.max(20, Math.min(distance, maxDist)),
    })
  }

  return households.sort((a, b) => a.distance - b.distance)
}

// ─── Captain Scoop Tips ─────────────────────────────────────────
function getScoopTips(client: typeof clients[0], householdCount: number, blockRadius: number) {
  return [
    {
      icon: '🚪',
      title: 'Door Knock Strategy',
      tip: `You have ${householdCount} households within ${blockRadius} block${blockRadius !== 1 ? 's' : ''} of ${client.name}. Knock doors on the same day you service ${client.name} — residents see your truck and know you're legit. Bring door hangers for anyone who doesn't answer.`,
    },
    {
      icon: '📱',
      title: 'Geo-Targeted Digital Ads',
      tip: `Run a Meta ad with a ${blockRadius <= 3 ? '0.25' : blockRadius <= 6 ? '0.5' : '1'}-mile radius around ${client.address.split(',')[0]}. Use copy like "Your neighbor trusts us with their yard — ready to try us?" Include a first-cleanup discount to drive conversions.`,
    },
    {
      icon: '🤝',
      title: 'Referral Power Play',
      tip: `Ask ${client.name} if they know any neighbors with dogs. Offer them a $10 credit for each referral that signs up. Personal referrals in this area could convert at 30-40% vs. 3-5% for cold outreach.`,
    },
    {
      icon: '📬',
      title: 'Direct Mail Campaign',
      tip: `Send postcards to the ${householdCount} nearby households. Include a before/after photo, your 4.9★ rating, and a QR code linking to your quote builder. Time it for spring (peak signup season).`,
    },
    {
      icon: '🏘️',
      title: 'HOA Opportunity',
      tip: `Check if any nearby subdivisions have an HOA. Offering a community discount (10% off for 5+ signups) can land you 8-12 clients at once. HOA newsletters are free advertising.`,
    },
    {
      icon: '🐕',
      title: 'Dog Park & Vet Partnerships',
      tip: `The nearest dog park and vet clinic to this area are great places to leave business cards. Offer vet offices a referral commission — they talk to dog owners every day.`,
    },
  ]
}

// ─── Filter type ────────────────────────────────────────────────
type FilterType = 'all' | 'knocked' | 'not-knocked' | 'interested' | 'converted'

// ─── Turf Activity Mock Data ────────────────────────────────────
const turfMonthlyData: Record<number, { month: string; doorKnocks: number; dogsVerified: number; conversions: number }[]> = {
  2025: [
    { month: 'Jan', doorKnocks: 18, dogsVerified: 7, conversions: 2 },
    { month: 'Feb', doorKnocks: 22, dogsVerified: 9, conversions: 3 },
    { month: 'Mar', doorKnocks: 28, dogsVerified: 12, conversions: 3 },
    { month: 'Apr', doorKnocks: 35, dogsVerified: 15, conversions: 4 },
    { month: 'May', doorKnocks: 42, dogsVerified: 18, conversions: 5 },
    { month: 'Jun', doorKnocks: 45, dogsVerified: 20, conversions: 6 },
    { month: 'Jul', doorKnocks: 40, dogsVerified: 17, conversions: 5 },
    { month: 'Aug', doorKnocks: 38, dogsVerified: 16, conversions: 4 },
    { month: 'Sep', doorKnocks: 30, dogsVerified: 13, conversions: 3 },
    { month: 'Oct', doorKnocks: 25, dogsVerified: 10, conversions: 2 },
    { month: 'Nov', doorKnocks: 20, dogsVerified: 8, conversions: 2 },
    { month: 'Dec', doorKnocks: 15, dogsVerified: 5, conversions: 1 },
  ],
  2026: [
    { month: 'Jan', doorKnocks: 35, dogsVerified: 15, conversions: 4 },
    { month: 'Feb', doorKnocks: 42, dogsVerified: 18, conversions: 6 },
    { month: 'Mar', doorKnocks: 52, dogsVerified: 22, conversions: 8 },
    { month: 'Apr', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'May', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'Jun', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'Jul', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'Aug', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'Sep', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'Oct', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'Nov', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
    { month: 'Dec', doorKnocks: 0, dogsVerified: 0, conversions: 0 },
  ],
}

const turfYearlyTotals = Object.entries(turfMonthlyData).map(([year, months]) => ({
  year: year,
  doorKnocks: months.reduce((s, m) => s + m.doorKnocks, 0),
  dogsVerified: months.reduce((s, m) => s + m.dogsVerified, 0),
  conversions: months.reduce((s, m) => s + m.conversions, 0),
}))

const turfAllTimeTotals = {
  doorKnocks: turfYearlyTotals.reduce((s, y) => s + y.doorKnocks, 0),
  dogsVerified: turfYearlyTotals.reduce((s, y) => s + y.dogsVerified, 0),
  conversions: turfYearlyTotals.reduce((s, y) => s + y.conversions, 0),
}

const turfYoyColors: Record<number, string> = { 2025: '#94a3b8', 2026: '#16a34a' }

// ─── Map Component ──────────────────────────────────────────────
function TurfMap({ client, households, radiusMeters }: { client: typeof clients[0]; households: Household[]; radiusMeters: number }) {
  const [mapReady, setMapReady] = useState(false)
  const [LeafletComponents, setLeafletComponents] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      delete (L.default.Icon.Default.prototype as any)._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      setLeafletComponents({ L: L.default, ...RL })
      setMapReady(true)
    })
  }, [])

  if (!mapReady || !LeafletComponents) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup, Circle } = LeafletComponents
  const L = LeafletComponents.L

  const clientIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
  })

  const householdIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [20, 33], iconAnchor: [10, 33], popupAnchor: [1, -28], shadowSize: [33, 33],
  })

  const nearbyClients = clients.filter(c => {
    if (c.id === client.id) return false
    const dLat = c.lat - client.lat
    const dLng = c.lng - client.lng
    return Math.sqrt(dLat * dLat + dLng * dLng) * 111000 < radiusMeters * 1.5
  })

  const otherClientIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [20, 33], iconAnchor: [10, 33], popupAnchor: [1, -28], shadowSize: [33, 33],
  })

  const zoom = radiusMeters <= 200 ? 17 : radiusMeters <= 400 ? 16 : radiusMeters <= 600 ? 15 : 14

  return (
    <MapContainer key={`${client.id}-${radiusMeters}`} center={[client.lat, client.lng]} zoom={zoom} className="w-full h-full rounded-xl" style={{ minHeight: 400 }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={[client.lat, client.lng]} radius={radiusMeters} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 2, dashArray: '8 4' }} />
      <Marker position={[client.lat, client.lng]} icon={clientIcon}>
        <Popup><div className="text-xs"><p className="font-bold text-green-700">⭐ {client.name} (Your Client)</p><p>{client.address}</p><p>{client.dogs} dog{client.dogs > 1 ? 's' : ''} • {client.plan} • Since {client.since}</p></div></Popup>
      </Marker>
      {nearbyClients.map(nc => (
        <Marker key={nc.id} position={[nc.lat, nc.lng]} icon={otherClientIcon}>
          <Popup><div className="text-xs"><p className="font-bold text-amber-700">⭐ {nc.name} (Client)</p><p>{nc.address}</p><p>{nc.dogs} dog{nc.dogs > 1 ? 's' : ''} • {nc.plan}</p></div></Popup>
        </Marker>
      ))}
      {households.slice(0, 50).map(hh => (
        <Marker key={hh.id} position={[hh.lat, hh.lng]} icon={householdIcon}>
          <Popup><div className="text-xs"><p className="font-bold">{hh.address}</p><p>{hh.distance}m away</p></div></Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

// ─── Status Toggle Button ───────────────────────────────────────
function StatusToggle({ active, emoji, label, onClick }: { active: boolean; emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-7 h-7 flex items-center justify-center rounded-md text-sm transition-all ${
        active
          ? 'bg-blue-100 border border-blue-300 shadow-sm scale-105'
          : 'bg-gray-50 border border-gray-200 opacity-40 hover:opacity-70'
      }`}
    >
      {emoji}
    </button>
  )
}

// ─── Interest Toggle ────────────────────────────────────────────
function InterestToggle({ value, onChange }: { value: InterestLevel; onChange: (v: InterestLevel) => void }) {
  const cycle = () => {
    if (value === 'unknown') onChange('interested')
    else if (value === 'interested') onChange('not-interested')
    else onChange('unknown')
  }
  const emoji = value === 'interested' ? '👍' : value === 'not-interested' ? '👎' : '❓'
  const bg = value === 'interested' ? 'bg-green-100 border-green-300 opacity-100' : value === 'not-interested' ? 'bg-red-100 border-red-300 opacity-100' : 'bg-gray-50 border-gray-200 opacity-40 hover:opacity-70'

  return (
    <button
      onClick={cycle}
      title={value === 'interested' ? 'Interested' : value === 'not-interested' ? 'Not Interested' : 'Unknown Interest'}
      className={`w-7 h-7 flex items-center justify-center rounded-md text-sm transition-all border ${bg}`}
    >
      {emoji}
    </button>
  )
}


// ═══════════════════════════════════════════════════════════════════
export default function TurfTrackerPage() {
  const [selectedClientId, setSelectedClientId] = useState(clients[0].id)
  const [blockRadius, setBlockRadius] = useState(5)
  const [showTips, setShowTips] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [statusMap, setStatusMap] = useState<Record<string, HouseholdStatus>>({})
  const [turfView, setTurfView] = useState<'monthly' | 'yearly'>('monthly')
  const [turfYear, setTurfYear] = useState(2026)
  const [yoyYears, setYoyYears] = useState<number[]>([2025, 2026])

  const selectedClient = clients.find(c => c.id === selectedClientId)!
  const radiusMeters = blockRadius * METERS_PER_BLOCK
  const households = useMemo(() => generateNearbyHouseholds(selectedClient, blockRadius), [selectedClient, blockRadius])
  const tips = useMemo(() => getScoopTips(selectedClient, households.length, blockRadius), [selectedClient, households.length, blockRadius])

  // Get or initialize status for a household
  const getStatus = useCallback((id: string): HouseholdStatus => {
    return statusMap[id] || { knocked: false, flyerLeft: false, dogVerified: false, interest: 'unknown' as InterestLevel, converted: false }
  }, [statusMap])

  const updateStatus = useCallback((id: string, field: keyof HouseholdStatus, value: any) => {
    setStatusMap(prev => ({
      ...prev,
      [id]: { ...prev[id] || { knocked: false, flyerLeft: false, dogVerified: false, interest: 'unknown', converted: false }, [field]: value },
    }))
  }, [])

  // Stats
  const stats = useMemo(() => {
    const total = households.length
    let knocked = 0, dogVerified = 0, interested = 0, converted = 0
    households.forEach(hh => {
      const s = statusMap[hh.id]
      if (s?.knocked) knocked++
      if (s?.dogVerified) dogVerified++
      if (s?.interest === 'interested') interested++
      if (s?.converted) converted++
    })
    return { total, knocked, dogVerified, interested, converted }
  }, [households, statusMap])

  // Filtered households
  const filteredHouseholds = useMemo(() => {
    return households.filter(hh => {
      const s = getStatus(hh.id)
      switch (filter) {
        case 'knocked': return s.knocked
        case 'not-knocked': return !s.knocked
        case 'interested': return s.interest === 'interested'
        case 'converted': return s.converted
        default: return true
      }
    })
  }, [households, filter, getStatus])

  // Export CSV
  const exportCSV = useCallback(() => {
    const header = 'Address,Distance (m),Knocked,Flyer Left,Dog Verified,Interest,Converted'
    const rows = households.map(hh => {
      const s = getStatus(hh.id)
      return [
        `"${hh.address}"`,
        hh.distance,
        s.knocked ? 'Yes' : 'No',
        s.flyerLeft ? 'Yes' : 'No',
        s.dogVerified ? 'Yes' : 'No',
        s.interest === 'interested' ? 'Interested' : s.interest === 'not-interested' ? 'Not Interested' : 'Unknown',
        s.converted ? 'Yes' : 'No',
      ].join(',')
    })
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const date = new Date().toISOString().split('T')[0]
    const clientSlug = selectedClient.name.toLowerCase().replace(/\s+/g, '-')
    link.href = url
    link.download = `turf-tracker-${clientSlug}-${date}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [households, getStatus, selectedClient])

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'knocked', label: 'Knocked' },
    { key: 'not-knocked', label: 'Not Knocked' },
    { key: 'interested', label: 'Interested' },
    { key: 'converted', label: 'Converted' },
  ]

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Crosshair className="text-blue-500" /> Turf Tracker</h1>
          <p className="text-gray-500">Plan and track door-knock canvassing around your current clients</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Households</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.knocked}</p>
          <p className="text-xs text-gray-500">Doors Knocked</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{stats.dogVerified}</p>
          <p className="text-xs text-gray-500">Dogs Verified</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.converted}</p>
          <p className="text-xs text-gray-500">Converted</p>
        </div>
      </div>

      {/* Client Selector + Radius Control */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-green-600" />
            <label className="text-sm font-semibold text-gray-700">Client:</label>
          </div>
          <div className="relative flex-1 max-w-md">
            <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-10">
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.address} ({c.dogs} dog{c.dogs > 1 ? 's' : ''}, {c.plan})</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Block Radius Selector */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
            <Target size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Radius:</span>
            <button onClick={() => setBlockRadius(Math.max(1, blockRadius - 1))} className="w-7 h-7 flex items-center justify-center rounded bg-white border border-blue-200 hover:bg-blue-100 disabled:opacity-40" disabled={blockRadius <= 1}>
              <Minus size={14} className="text-blue-600" />
            </button>
            <div className="w-20 text-center">
              <span className="text-lg font-bold text-blue-700">{blockRadius}</span>
              <span className="text-xs text-blue-500 ml-1">block{blockRadius !== 1 ? 's' : ''}</span>
            </div>
            <button onClick={() => setBlockRadius(Math.min(10, blockRadius + 1))} className="w-7 h-7 flex items-center justify-center rounded bg-white border border-blue-200 hover:bg-blue-100 disabled:opacity-40" disabled={blockRadius >= 10}>
              <Plus size={14} className="text-blue-600" />
            </button>
            <span className="text-xs text-blue-400 ml-1">~{radiusMeters}m</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Client
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block ml-2" /> Nearby Clients
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block ml-2" /> Households
          </div>
        </div>

        {/* Radius Quick Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Quick:</span>
          {[1, 2, 3, 5, 7, 10].map(r => (
            <button key={r} onClick={() => setBlockRadius(r)} className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${blockRadius === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {r} block{r !== 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Map — Full Width */}
      <div className="mb-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: 500 }}>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
          <TurfMap client={selectedClient} households={households} radiusMeters={radiusMeters} />
        </div>
      </div>

      {/* Nearby Households — Full Width */}
      <div className="mb-6">
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col" style={{ maxHeight: 600 }}>
          {/* Panel header */}
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Users size={16} className="text-blue-500" /> Nearby Households ({filteredHouseholds.length})</h3>
              <span className="text-xs text-gray-400">{blockRadius}-block radius</span>
            </div>
            {/* Filter bar */}
            <div className="flex items-center gap-1 flex-wrap">
              {filterButtons.map(fb => (
                <button
                  key={fb.key}
                  onClick={() => setFilter(fb.key)}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
                    filter === fb.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {fb.label}
                </button>
              ))}
            </div>
          </div>
          {/* Household list */}
          <div className="flex-1 overflow-y-auto">
            {filteredHouseholds.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-center p-4">
                <div>
                  <Crosshair size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {filter === 'all' ? `No households found in ${blockRadius}-block radius` : `No ${filter} households`}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {filter === 'all' ? 'Try increasing the radius' : 'Try a different filter'}
                  </p>
                </div>
              </div>
            ) : filteredHouseholds.map((hh) => {
              const s = getStatus(hh.id)
              return (
                <div key={hh.id} className="px-4 py-2.5 border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Address + distance */}
                    <div className="min-w-0 w-72 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{hh.address}</p>
                      <p className="text-xs text-gray-400">{hh.distance}m away</p>
                    </div>
                    {/* Status toggles — inline on the same row */}
                    <div className="flex items-center gap-1.5">
                      <StatusToggle active={s.knocked} emoji="🚪" label="Knocked" onClick={() => updateStatus(hh.id, 'knocked', !s.knocked)} />
                      <StatusToggle active={s.flyerLeft} emoji="📄" label="Flyer Left" onClick={() => updateStatus(hh.id, 'flyerLeft', !s.flyerLeft)} />
                      <StatusToggle active={s.dogVerified} emoji="🐕" label="Dog Verified" onClick={() => updateStatus(hh.id, 'dogVerified', !s.dogVerified)} />
                      <InterestToggle value={s.interest} onChange={(v) => updateStatus(hh.id, 'interest', v)} />
                      <StatusToggle active={s.converted} emoji="✅" label="Converted" onClick={() => updateStatus(hh.id, 'converted', !s.converted)} />
                    </div>
                    {/* Active status labels */}
                    <div className="flex-1 flex items-center gap-2 overflow-hidden">
                      {s.knocked && <span className="text-xs text-blue-600 font-medium whitespace-nowrap">Knocked</span>}
                      {s.flyerLeft && <span className="text-xs text-orange-500 font-medium whitespace-nowrap">Flyer</span>}
                      {s.dogVerified && <span className="text-xs text-amber-600 font-medium whitespace-nowrap">🐕 Dog</span>}
                      {s.interest === 'interested' && <span className="text-xs text-green-600 font-medium whitespace-nowrap">Interested</span>}
                      {s.interest === 'not-interested' && <span className="text-xs text-red-400 font-medium whitespace-nowrap">Not Interested</span>}
                      {s.converted && <span className="text-xs text-purple-600 font-medium whitespace-nowrap">✅ Converted</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Turf Activity Charts */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart — Turf Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" /> Turf Activity
              </h3>
              <div className="flex items-center gap-2">
                {turfView === 'monthly' && (
                  <div className="flex bg-gray-100 rounded-lg overflow-hidden mr-2">
                    {[2025, 2026].map(y => (
                      <button
                        key={y}
                        onClick={() => setTurfYear(y)}
                        className={`px-3 py-1 text-xs font-medium transition-colors ${
                          turfYear === y ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                  {(['monthly', 'yearly'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setTurfView(v)}
                      className={`px-3 py-1 text-xs font-medium transition-colors capitalize ${
                        turfView === v ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={turfView === 'monthly' ? turfMonthlyData[turfYear].filter(m => m.doorKnocks > 0 || m.dogsVerified > 0 || m.conversions > 0) : turfYearlyTotals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={turfView === 'monthly' ? 'month' : 'year'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="doorKnocks" fill="#3b82f6" name="Door Knocks" radius={[2, 2, 0, 0]} />
                <Bar dataKey="dogsVerified" fill="#f59e0b" name="Dogs Verified" radius={[2, 2, 0, 0]} />
                <Bar dataKey="conversions" fill="#8b5cf6" name="Conversions" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart — Year-over-Year Comparison */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Year-over-Year Comparison</h3>
              <div className="flex items-center gap-2">
                {[2025, 2026].map(y => (
                  <button
                    key={y}
                    onClick={() => setYoyYears(prev => prev.includes(y) ? prev.filter(v => v !== y) : [...prev, y].sort())}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      yoyYears.includes(y)
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: yoyYears.includes(y) ? turfYoyColors[y] : '#d1d5db' }} />
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  .map((month, i) => {
                    const point: Record<string, any> = { month }
                    yoyYears.forEach(y => {
                      const m = turfMonthlyData[y]?.[i]
                      if (m && m.conversions > 0) {
                        point[`conversions_${y}`] = m.conversions
                      }
                    })
                    return point
                  })
                  .filter(p => Object.keys(p).length > 1)
              }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {yoyYears.map(y => (
                  <Line
                    key={y}
                    type="monotone"
                    dataKey={`conversions_${y}`}
                    stroke={turfYoyColors[y]}
                    strokeWidth={y === 2026 ? 3 : 2}
                    strokeDasharray={y === 2025 ? '6 3' : undefined}
                    dot={{ fill: turfYoyColors[y], r: 3 }}
                    name={`${y}`}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{turfAllTimeTotals.doorKnocks}</p>
            <p className="text-xs text-gray-500">Total Door Knocks</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{turfAllTimeTotals.dogsVerified}</p>
            <p className="text-xs text-gray-500">Total Dogs Verified</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{turfAllTimeTotals.conversions}</p>
            <p className="text-xs text-gray-500">Total Conversions</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{(turfAllTimeTotals.conversions / turfAllTimeTotals.doorKnocks * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Captain Scoop Tips */}
      <div className="mb-6">
        <button onClick={() => setShowTips(!showTips)} className="flex items-center gap-2 mb-3">
          <CaptainScoopIcon size={24} />
          <h2 className="text-lg font-semibold">Captain Scoop's Turf Tips</h2>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{tips.length} suggestions</span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showTips ? 'rotate-180' : ''}`} />
        </button>
        {showTips && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Target size={18} className="text-blue-600" /> Quick Actions for {selectedClient.name}'s Area</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <button onClick={exportCSV} className="bg-white rounded-lg border border-gray-200 p-3 text-left hover:border-blue-400 hover:shadow-sm transition-all">
            <p className="text-sm font-medium text-gray-900">📋 Export Turf Data</p>
            <p className="text-xs text-gray-500 mt-0.5">Download CSV of all {households.length} households</p>
          </button>
          <button className="bg-white rounded-lg border border-gray-200 p-3 text-left hover:border-blue-400 hover:shadow-sm transition-all">
            <p className="text-sm font-medium text-gray-900">📬 Door Hanger Route</p>
            <p className="text-xs text-gray-500 mt-0.5">Generate optimized walking route</p>
          </button>
          <button className="bg-white rounded-lg border border-gray-200 p-3 text-left hover:border-blue-400 hover:shadow-sm transition-all">
            <p className="text-sm font-medium text-gray-900">🎯 Meta Ad Audience</p>
            <p className="text-xs text-gray-500 mt-0.5">Create geo-targeted ad for this zone</p>
          </button>
          <button className="bg-white rounded-lg border border-gray-200 p-3 text-left hover:border-blue-400 hover:shadow-sm transition-all">
            <p className="text-sm font-medium text-gray-900">🐕 Log Dog Sightings</p>
            <p className="text-xs text-gray-500 mt-0.5">Bulk-mark dogs verified on your route</p>
          </button>
        </div>
      </div>
    </div>
  )
}