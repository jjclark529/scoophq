'use client'

import { useState, useRef, useCallback } from 'react'
import { FileText, Send, Download, Calculator, Plus, Trash2, DollarSign, Settings, Upload, X, Edit3, Table, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────
type PriceTier = 'basic' | 'premium'

type PricingEntry = {
  yardSize: string
  dogs: string
  frequency: string
  price: number
}

type PricingTable = {
  basic: PricingEntry[]
  premium: PricingEntry[]
}

type QuoteItem = {
  service: string
  basePrice: number
  adjustedPrice: number
  quantity: number
}

type Quote = {
  id: string
  customerName: string
  phone: string
  email: string
  items: QuoteItem[]
  yardSize: string
  dogCount: string
  discount: number
  notes: string
  status: 'draft' | 'sent' | 'accepted' | 'declined'
  createdAt: string
}

// ─── Default pricing data (matches typical Excel layout) ─────────
const defaultYardSizes = ['1–1,000 sqft', '1,001–2,000 sqft', '2,001–3,000 sqft', '3,001–4,000 sqft', '4,001–5,000 sqft', '5,001–6,000 sqft', '6,001–7,000 sqft', '7,001–8,000 sqft', '8,001–9,000 sqft', '9,001–10,000 sqft', '10,001+ sqft']
const defaultDogCounts = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const defaultFrequencies = ['Weekly', 'Bi-Weekly', 'Twice a Week', 'Once a Month', 'One-Time']

// Helper: generate prices for dogs 4-10 by scaling base (4-dog) prices +8% per extra dog
function scaleDogPrices(base4: Record<string, number>): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {}
  for (let d = 4; d <= 10; d++) {
    const multiplier = 1 + (d - 4) * 0.08
    const row: Record<string, number> = {}
    for (const [freq, price] of Object.entries(base4)) {
      row[freq] = Math.round(price * multiplier)
    }
    result[String(d)] = row
  }
  return result
}

const generateDefaultPricing = (): PricingTable => {
  const base4Prices: Record<string, Record<string, number>> = {
    '1–1,000 sqft': { 'Weekly': 55, 'Bi-Weekly': 44, 'Twice a Week': 88, 'Once a Month': 65, 'One-Time': 100 },
    '1,001–2,000 sqft': { 'Weekly': 62, 'Bi-Weekly': 50, 'Twice a Week': 100, 'Once a Month': 75, 'One-Time': 112 },
    '2,001–3,000 sqft': { 'Weekly': 70, 'Bi-Weekly': 56, 'Twice a Week': 112, 'Once a Month': 85, 'One-Time': 125 },
    '3,001–4,000 sqft': { 'Weekly': 80, 'Bi-Weekly': 64, 'Twice a Week': 128, 'Once a Month': 95, 'One-Time': 140 },
    '4,001–5,000 sqft': { 'Weekly': 88, 'Bi-Weekly': 70, 'Twice a Week': 140, 'Once a Month': 105, 'One-Time': 155 },
    '5,001–6,000 sqft': { 'Weekly': 98, 'Bi-Weekly': 78, 'Twice a Week': 155, 'Once a Month': 115, 'One-Time': 170 },
    '6,001–7,000 sqft': { 'Weekly': 108, 'Bi-Weekly': 86, 'Twice a Week': 172, 'Once a Month': 128, 'One-Time': 188 },
    '7,001–8,000 sqft': { 'Weekly': 118, 'Bi-Weekly': 94, 'Twice a Week': 188, 'Once a Month': 140, 'One-Time': 205 },
    '8,001–9,000 sqft': { 'Weekly': 128, 'Bi-Weekly': 102, 'Twice a Week': 205, 'Once a Month': 152, 'One-Time': 222 },
    '9,001–10,000 sqft': { 'Weekly': 134, 'Bi-Weekly': 107, 'Twice a Week': 215, 'Once a Month': 160, 'One-Time': 232 },
    '10,001+ sqft': { 'Weekly': 140, 'Bi-Weekly': 112, 'Twice a Week': 225, 'Once a Month': 168, 'One-Time': 245 },
  }

  const basicPrices: Record<string, Record<string, Record<string, number>>> = {
    '1–1,000 sqft': { '1': { 'Weekly': 35, 'Bi-Weekly': 28, 'Twice a Week': 60, 'Once a Month': 45, 'One-Time': 70 },
                           '2': { 'Weekly': 40, 'Bi-Weekly': 32, 'Twice a Week': 65, 'Once a Month': 50, 'One-Time': 75 },
                           '3': { 'Weekly': 45, 'Bi-Weekly': 36, 'Twice a Week': 72, 'Once a Month': 55, 'One-Time': 85 },
                           ...scaleDogPrices(base4Prices['1–1,000 sqft']) },
    '1,001–2,000 sqft': { '1': { 'Weekly': 40, 'Bi-Weekly': 32, 'Twice a Week': 68, 'Once a Month': 50, 'One-Time': 78 },
                           '2': { 'Weekly': 45, 'Bi-Weekly': 36, 'Twice a Week': 74, 'Once a Month': 55, 'One-Time': 85 },
                           '3': { 'Weekly': 50, 'Bi-Weekly': 40, 'Twice a Week': 82, 'Once a Month': 62, 'One-Time': 95 },
                           ...scaleDogPrices(base4Prices['1,001–2,000 sqft']) },
    '2,001–3,000 sqft': { '1': { 'Weekly': 45, 'Bi-Weekly': 36, 'Twice a Week': 75, 'Once a Month': 55, 'One-Time': 85 },
                           '2': { 'Weekly': 50, 'Bi-Weekly': 40, 'Twice a Week': 82, 'Once a Month': 62, 'One-Time': 95 },
                           '3': { 'Weekly': 58, 'Bi-Weekly': 46, 'Twice a Week': 92, 'Once a Month': 70, 'One-Time': 108 },
                           ...scaleDogPrices(base4Prices['2,001–3,000 sqft']) },
    '3,001–4,000 sqft': { '1': { 'Weekly': 50, 'Bi-Weekly': 40, 'Twice a Week': 85, 'Once a Month': 62, 'One-Time': 95 },
                           '2': { 'Weekly': 58, 'Bi-Weekly': 46, 'Twice a Week': 95, 'Once a Month': 70, 'One-Time': 108 },
                           '3': { 'Weekly': 65, 'Bi-Weekly': 52, 'Twice a Week': 105, 'Once a Month': 78, 'One-Time': 120 },
                           ...scaleDogPrices(base4Prices['3,001–4,000 sqft']) },
    '4,001–5,000 sqft': { '1': { 'Weekly': 55, 'Bi-Weekly': 44, 'Twice a Week': 92, 'Once a Month': 68, 'One-Time': 105 },
                           '2': { 'Weekly': 65, 'Bi-Weekly': 52, 'Twice a Week': 105, 'Once a Month': 78, 'One-Time': 118 },
                           '3': { 'Weekly': 72, 'Bi-Weekly': 58, 'Twice a Week': 115, 'Once a Month': 85, 'One-Time': 130 },
                           ...scaleDogPrices(base4Prices['4,001–5,000 sqft']) },
    '5,001–6,000 sqft': { '1': { 'Weekly': 62, 'Bi-Weekly': 50, 'Twice a Week': 100, 'Once a Month': 75, 'One-Time': 115 },
                           '2': { 'Weekly': 72, 'Bi-Weekly': 58, 'Twice a Week': 115, 'Once a Month': 85, 'One-Time': 128 },
                           '3': { 'Weekly': 80, 'Bi-Weekly': 64, 'Twice a Week': 128, 'Once a Month': 95, 'One-Time': 142 },
                           ...scaleDogPrices(base4Prices['5,001–6,000 sqft']) },
    '6,001–7,000 sqft': { '1': { 'Weekly': 68, 'Bi-Weekly': 55, 'Twice a Week': 110, 'Once a Month': 82, 'One-Time': 125 },
                           '2': { 'Weekly': 78, 'Bi-Weekly': 62, 'Twice a Week': 125, 'Once a Month': 92, 'One-Time': 138 },
                           '3': { 'Weekly': 88, 'Bi-Weekly': 70, 'Twice a Week': 140, 'Once a Month': 105, 'One-Time': 155 },
                           ...scaleDogPrices(base4Prices['6,001–7,000 sqft']) },
    '7,001–8,000 sqft': { '1': { 'Weekly': 75, 'Bi-Weekly': 60, 'Twice a Week': 120, 'Once a Month': 90, 'One-Time': 135 },
                           '2': { 'Weekly': 85, 'Bi-Weekly': 68, 'Twice a Week': 135, 'Once a Month': 100, 'One-Time': 150 },
                           '3': { 'Weekly': 95, 'Bi-Weekly': 76, 'Twice a Week': 152, 'Once a Month': 112, 'One-Time': 168 },
                           ...scaleDogPrices(base4Prices['7,001–8,000 sqft']) },
    '8,001–9,000 sqft': { '1': { 'Weekly': 82, 'Bi-Weekly': 65, 'Twice a Week': 130, 'Once a Month': 98, 'One-Time': 145 },
                           '2': { 'Weekly': 92, 'Bi-Weekly': 74, 'Twice a Week': 148, 'Once a Month': 110, 'One-Time': 162 },
                           '3': { 'Weekly': 105, 'Bi-Weekly': 84, 'Twice a Week': 168, 'Once a Month': 125, 'One-Time': 182 },
                           ...scaleDogPrices(base4Prices['8,001–9,000 sqft']) },
    '9,001–10,000 sqft': { '1': { 'Weekly': 86, 'Bi-Weekly': 69, 'Twice a Week': 138, 'Once a Month': 103, 'One-Time': 152 },
                            '2': { 'Weekly': 97, 'Bi-Weekly': 78, 'Twice a Week': 155, 'Once a Month': 115, 'One-Time': 170 },
                            '3': { 'Weekly': 110, 'Bi-Weekly': 88, 'Twice a Week': 175, 'Once a Month': 130, 'One-Time': 190 },
                            ...scaleDogPrices(base4Prices['9,001–10,000 sqft']) },
    '10,001+ sqft':     { '1': { 'Weekly': 90, 'Bi-Weekly': 72, 'Twice a Week': 145, 'Once a Month': 108, 'One-Time': 160 },
                           '2': { 'Weekly': 102, 'Bi-Weekly': 82, 'Twice a Week': 162, 'Once a Month': 120, 'One-Time': 178 },
                           '3': { 'Weekly': 115, 'Bi-Weekly': 92, 'Twice a Week': 182, 'Once a Month': 135, 'One-Time': 198 },
                           ...scaleDogPrices(base4Prices['10,001+ sqft']) },
  }

  const basic: PricingEntry[] = []
  const premium: PricingEntry[] = []

  for (const ys of defaultYardSizes) {
    for (const dc of defaultDogCounts) {
      for (const freq of defaultFrequencies) {
        const bp = basicPrices[ys]?.[dc]?.[freq] ?? 50
        basic.push({ yardSize: ys, dogs: dc, frequency: freq, price: bp })
        premium.push({ yardSize: ys, dogs: dc, frequency: freq, price: Math.round(bp * 1.35) })
      }
    }
  }
  return { basic, premium }
}

// ─── Legacy fallback options (used when pricing table not loaded) ─
type AddonService = {
  name: string
  basePrice: number
  description: string
}

const defaultAddons: AddonService[] = [
  { name: 'Deodorizing Treatment', basePrice: 40, description: 'Enzyme-based yard deodorizer' },
  { name: 'Brown Spot Treatment', basePrice: 30, description: 'Lawn repair for pet damage' },
]

const savedQuotes: Quote[] = [
  {
    id: 'Q-001', customerName: 'Sarah Mitchell', phone: '(520) 555-0142', email: 'sarah.m@gmail.com',
    items: [{ service: 'Weekly Cleanup', basePrice: 45, adjustedPrice: 56.25, quantity: 1 }],
    yardSize: '6,001–7,000 sqft', dogCount: '2', discount: 0, notes: 'Large backyard, 2 golden retrievers', status: 'sent', createdAt: 'Mar 25, 2026',
  },
  {
    id: 'Q-002', customerName: 'David Chen', phone: '(520) 555-0458', email: 'dchen88@gmail.com',
    items: [
      { service: 'Weekly Cleanup', basePrice: 45, adjustedPrice: 90, quantity: 1 },
      { service: 'Initial Deep Clean', basePrice: 125, adjustedPrice: 250, quantity: 1 },
    ],
    yardSize: '10,001+ sqft', dogCount: '4', discount: 10, notes: "Large estate property, 4 dogs, hasn't been cleaned in months", status: 'draft', createdAt: 'Mar 26, 2026',
  },
  {
    id: 'Q-003', customerName: 'Jennifer Lawson', phone: '(520) 555-0391', email: 'jlawson@outlook.com',
    items: [{ service: 'Biweekly Cleanup', basePrice: 35, adjustedPrice: 43.75, quantity: 1 }],
    yardSize: '2,001–3,000 sqft', dogCount: '3', discount: 0, notes: '3 medium dogs, fenced yard, Oro Valley', status: 'accepted', createdAt: 'Mar 22, 2026',
  },
]

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
}

// ═══════════════════════════════════════════════════════════════════
//  PRICING SETTINGS MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════
function PricingSettingsModal({
  isOpen,
  onClose,
  pricingTable,
  onSave,
  addonServices,
  onSaveAddons,
}: {
  isOpen: boolean
  onClose: () => void
  pricingTable: PricingTable
  onSave: (table: PricingTable) => void
  addonServices: AddonService[]
  onSaveAddons: (addons: AddonService[]) => void
}) {
  const [tab, setTab] = useState<'upload' | 'manual' | 'addons'>('upload')
  const [editTier, setEditTier] = useState<PriceTier>('basic')
  const [localPricing, setLocalPricing] = useState<PricingTable>(pricingTable)
  const [localAddons, setLocalAddons] = useState<AddonService[]>(addonServices)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [expandedYard, setExpandedYard] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.toLowerCase().split('.').pop()
    if (!['xlsx', 'xls', 'csv'].includes(ext || '')) {
      setUploadStatus('❌ Unsupported file type. Please upload .xlsx, .xls, or .csv')
      return
    }

    try {
      setUploadStatus('⏳ Parsing file...')
      const XLSX = await import('xlsx')
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const sheetNames = workbook.SheetNames

      const parseSheet = (sheetName: string): PricingEntry[] => {
        const sheet = workbook.Sheets[sheetName]
        if (!sheet) return []
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        const entries: PricingEntry[] = []

        for (const row of rows) {
          const keys = Object.keys(row)
          // Try to detect columns: look for yard size, dogs, frequency, price
          const yardCol = keys.find(k => /yard|size|property/i.test(k))
          const dogCol = keys.find(k => /dog|pet|count/i.test(k))
          const freqCol = keys.find(k => /freq|service|schedule|plan/i.test(k))
          const priceCol = keys.find(k => /price|cost|rate|amount|\$/i.test(k))

          if (yardCol && dogCol && freqCol && priceCol) {
            const price = parseFloat(String(row[priceCol]).replace(/[$,]/g, ''))
            if (!isNaN(price)) {
              entries.push({
                yardSize: String(row[yardCol]).trim(),
                dogs: String(row[dogCol]).trim(),
                frequency: String(row[freqCol]).trim(),
                price,
              })
            }
          }
        }
        return entries
      }

      // Try to find Basic/Premium sheets by name
      const basicSheet = sheetNames.find(n => /basic/i.test(n)) || sheetNames[0]
      const premiumSheet = sheetNames.find(n => /premium/i.test(n)) || sheetNames[1]

      const basicEntries = parseSheet(basicSheet)
      const premiumEntries = premiumSheet ? parseSheet(premiumSheet) : []

      if (basicEntries.length === 0 && premiumEntries.length === 0) {
        setUploadStatus('❌ Could not parse pricing data. Make sure your file has columns for Yard Size, Dogs, Frequency, and Price.')
        return
      }

      const newPricing: PricingTable = {
        basic: basicEntries.length > 0 ? basicEntries : localPricing.basic,
        premium: premiumEntries.length > 0 ? premiumEntries : localPricing.premium,
      }

      setLocalPricing(newPricing)
      setUploadStatus(`✅ Imported ${basicEntries.length} basic and ${premiumEntries.length} premium pricing entries from "${file.name}"`)
    } catch (err) {
      console.error(err)
      setUploadStatus('❌ Error reading file. Please check the format and try again.')
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const updatePrice = (tier: PriceTier, yardSize: string, dogs: string, frequency: string, newPrice: number) => {
    setLocalPricing(prev => ({
      ...prev,
      [tier]: prev[tier].map(entry =>
        entry.yardSize === yardSize && entry.dogs === dogs && entry.frequency === frequency
          ? { ...entry, price: newPrice }
          : entry
      ),
    }))
  }

  const yardSizes = Array.from(new Set(localPricing[editTier].map(e => e.yardSize)))
  const dogCounts = Array.from(new Set(localPricing[editTier].map(e => e.dogs)))
  const frequencies = Array.from(new Set(localPricing[editTier].map(e => e.frequency)))

  const getPrice = (ys: string, dc: string, freq: string): number => {
    return localPricing[editTier].find(e => e.yardSize === ys && e.dogs === dc && e.frequency === freq)?.price ?? 0
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2"><Settings size={20} className="text-blue-500" /> Pricing Settings</h2>
            <p className="text-sm text-gray-500">Upload a spreadsheet or manually edit pricing tiers</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 px-5">
          <button onClick={() => setTab('upload')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Upload size={14} className="inline mr-1.5" /> Upload File
          </button>
          <button onClick={() => setTab('manual')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'manual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Edit3 size={14} className="inline mr-1.5" /> Manual Input
          </button>
          <button onClick={() => setTab('addons')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'addons' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Plus size={14} className="inline mr-1.5" /> Add-On Services
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'upload' ? (
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">Upload Excel or CSV file</p>
                <p className="text-xs text-gray-400 mb-4">Supports .xlsx, .xls, and .csv formats</p>
                <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
                  <Upload size={16} /> Choose File
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadStatus && (
                <div className={`rounded-lg p-3 text-sm ${uploadStatus.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : uploadStatus.startsWith('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {uploadStatus}
                </div>
              )}

              {/* Expected Format */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Expected File Format</h3>
                <p className="text-xs text-gray-500 mb-3">Your file should have two tabs/sheets: <strong>Basic</strong> and <strong>Premium</strong>. Each should have columns:</p>
                <div className="overflow-x-auto">
                  <table className="text-xs border border-gray-200 rounded">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-3 py-1.5">Yard Size</th>
                        <th className="border border-gray-200 px-3 py-1.5">Dogs</th>
                        <th className="border border-gray-200 px-3 py-1.5">Frequency</th>
                        <th className="border border-gray-200 px-3 py-1.5">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-gray-200 px-3 py-1">1–1,000 sqft</td><td className="border border-gray-200 px-3 py-1">1</td><td className="border border-gray-200 px-3 py-1">Weekly</td><td className="border border-gray-200 px-3 py-1">$35</td></tr>
                      <tr><td className="border border-gray-200 px-3 py-1">1–1,000 sqft</td><td className="border border-gray-200 px-3 py-1">2</td><td className="border border-gray-200 px-3 py-1">Weekly</td><td className="border border-gray-200 px-3 py-1">$40</td></tr>
                      <tr><td className="border border-gray-200 px-3 py-1">1,001–2,000 sqft</td><td className="border border-gray-200 px-3 py-1">1</td><td className="border border-gray-200 px-3 py-1">Bi-Weekly</td><td className="border border-gray-200 px-3 py-1">$32</td></tr>
                      <tr><td className="border border-gray-200 px-3 py-1 text-gray-400" colSpan={4}>... etc</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">Yard Size options: 1–1,000 sqft through 10,001+ sqft • Dogs: 1–10 • Frequency: Weekly, Bi-Weekly, Twice a Week, Once a Month, One-Time</p>
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-700">💡 Pricing Note</p>
                  <p className="text-xs text-blue-600 mt-0.5"><strong>Weekly, Bi-Weekly, Twice a Week</strong> — enter the <strong>per-visit (weekly)</strong> price. Monthly cost is calculated automatically (price × dogs × 52 ÷ 12).</p>
                  <p className="text-xs text-blue-600 mt-0.5"><strong>Once a Month, One-Time</strong> — enter the <strong>per-visit / per-month</strong> price as-is. No conversion is applied.</p>
                </div>
              </div>
            </div>
          ) : tab === 'manual' ? (
            <div className="space-y-4">
              {/* Tier Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Editing:</span>
                <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                  <button onClick={() => setEditTier('basic')} className={`px-4 py-2 text-sm font-medium transition-colors ${editTier === 'basic' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                    Basic Pricing
                  </button>
                  <button onClick={() => setEditTier('premium')} className={`px-4 py-2 text-sm font-medium transition-colors ${editTier === 'premium' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                    Premium Pricing
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-700">💡 Pricing Note</p>
                <p className="text-xs text-blue-600 mt-0.5"><strong>Weekly, Bi-Weekly, Twice a Week</strong> — enter the <strong>per-visit (weekly)</strong> price. Monthly cost is calculated automatically (price × dogs × 52 ÷ 12).</p>
                <p className="text-xs text-blue-600 mt-0.5"><strong>Once a Month, One-Time</strong> — enter the <strong>per-visit / per-month</strong> price as-is. No conversion is applied.</p>
              </div>

              {/* Pricing Grid - Grouped by Yard Size */}
              <div className="space-y-3">
                {yardSizes.map(ys => (
                  <div key={ys} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedYard(expandedYard === ys ? null : ys)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-700">{ys}</span>
                      {expandedYard === ys ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedYard === ys && (
                      <div className="p-3 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-2 font-semibold text-gray-500 w-16">Dogs</th>
                              {frequencies.map(f => (
                                <th key={f} className="text-center py-2 px-2 font-semibold text-gray-500">{f}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dogCounts.map(dc => (
                              <tr key={dc} className="border-b border-gray-50">
                                <td className="py-2 px-2 font-medium text-gray-700">{dc} {dc === '1' ? 'dog' : 'dogs'}</td>
                                {frequencies.map(freq => (
                                  <td key={freq} className="py-1 px-1 text-center">
                                    <div className="relative">
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                      <input
                                        type="number"
                                        value={getPrice(ys, dc, freq)}
                                        onChange={(e) => updatePrice(editTier, ys, dc, freq, Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-center text-xs focus:outline-none focus:border-blue-500 pl-5"
                                        min={0}
                                      />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : tab === 'addons' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Manage the add-on services available when building quotes.</p>

              {localAddons.map((addon, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Service Name</label>
                      <input
                        type="text"
                        value={addon.name}
                        onChange={(e) => {
                          const updated = [...localAddons]
                          updated[i] = { ...updated[i], name: e.target.value }
                          setLocalAddons(updated)
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={addon.basePrice}
                          onChange={(e) => {
                            const updated = [...localAddons]
                            updated[i] = { ...updated[i], basePrice: Number(e.target.value) }
                            setLocalAddons(updated)
                          }}
                          min={0}
                          step={0.01}
                          className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        value={addon.description}
                        onChange={(e) => {
                          const updated = [...localAddons]
                          updated[i] = { ...updated[i], description: e.target.value }
                          setLocalAddons(updated)
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setLocalAddons(localAddons.filter((_, idx) => idx !== i))}
                    className="mt-6 text-red-400 hover:text-red-600 p-1"
                    title="Remove add-on"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setLocalAddons([...localAddons, { name: '', basePrice: 0, description: '' }])}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add New Service
              </button>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-400">
            {localPricing.basic.length} basic & {localPricing.premium.length} premium pricing entries • {localAddons.length} add-on services
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100">Cancel</button>
            <button
              onClick={() => { onSave(localPricing); onSaveAddons(localAddons); onClose() }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN QUOTES PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function QuotesPage() {
  const [view, setView] = useState<'list' | 'builder'>('list')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [yardSize, setYardSize] = useState('3,001–4,000 sqft')
  const [dogCount, setDogCount] = useState('1')
  const [frequency, setFrequency] = useState('Weekly')
  const [priceTier, setPriceTier] = useState<PriceTier>('basic')
  const [selectedServices, setSelectedServices] = useState<QuoteItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('')
  const [quoteMode, setQuoteMode] = useState<'visit' | 'month'>('visit')
  const [includeInitialClean, setIncludeInitialClean] = useState(false)
  const [initialCleanFee, setInitialCleanFee] = useState<number | null>(null)
  const [initialCleanDate, setInitialCleanDate] = useState('')
  const [recurringStartDate, setRecurringStartDate] = useState('')
  const [showPricingSettings, setShowPricingSettings] = useState(false)
  const [pricingTable, setPricingTable] = useState<PricingTable>(generateDefaultPricing)
  const [addonServices, setAddonServices] = useState<AddonService[]>(defaultAddons)

  // Look up price from the loaded pricing table
  const lookupPrice = useCallback((ys: string, dc: string, freq: string, tier: PriceTier): number | null => {
    const entry = pricingTable[tier].find(
      e => e.yardSize === ys && e.dogs === dc && e.frequency === freq
    )
    return entry?.price ?? null
  }, [pricingTable])

  const currentPrice = lookupPrice(yardSize, dogCount, frequency, priceTier)

  // Initial clean price: look up "One-Time" frequency for same yard/dogs/tier
  const initialCleanPrice = lookupPrice(yardSize, dogCount, 'One-Time', priceTier)

  // Calculate monthly price: per-visit price × number of dogs × 52 / 12
  const numDogs = parseInt(dogCount, 10) || 1
  const fullMonthlyPrice = currentPrice !== null
    ? (frequency === 'Once a Month' || frequency === 'One-Time')
      ? currentPrice
      : Math.round((currentPrice * numDogs * 52 / 12) * 100) / 100
    : null

  // Pro-rate logic: prorated first month = (visits remaining in recurring start month) × per-visit cost.
  // If the recurring start month is AFTER the initial-clean month, there's nothing to prorate and
  // no current-month charge — but the "Following Months" monthly fee should still be shown.
  const calculateProratedMonth = (): {
    prorated: number | null
    fullMonthly: number | null
    remainingWeeks: number
    totalWeeks: number
    isProrated: boolean
    recurringInFutureMonth: boolean
    visitsInFirstMonth: number
  } => {
    const base = { prorated: null, fullMonthly: fullMonthlyPrice, remainingWeeks: 0, totalWeeks: 0, isProrated: false, recurringInFutureMonth: false, visitsInFirstMonth: 0 }
    if (fullMonthlyPrice === null || currentPrice === null || !recurringStartDate || frequency === 'Once a Month' || frequency === 'One-Time') return base

    const startDate = new Date(recurringStartDate + 'T00:00:00')
    const year = startDate.getFullYear()
    const month = startDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const endOfMonth = new Date(year, month, daysInMonth)

    const stepDays = frequency === 'Bi-Weekly' ? 14 : 7
    const visitsPerWeek = frequency === 'Three Times a Week' ? 3 : frequency === 'Twice a Week' ? 2 : 1

    let serviceWeeksInMonth = 0
    for (let d = new Date(startDate); d <= endOfMonth; d.setDate(d.getDate() + stepDays)) {
      serviceWeeksInMonth++
    }
    const visitsInFirstMonth = serviceWeeksInMonth * visitsPerWeek

    let refYear = year
    let refMonth = month
    if (includeInitialClean && initialCleanDate) {
      const icd = new Date(initialCleanDate + 'T00:00:00')
      refYear = icd.getFullYear()
      refMonth = icd.getMonth()
    }

    const recurringMonthIndex = year * 12 + month
    const refMonthIndex = refYear * 12 + refMonth

    if (recurringMonthIndex > refMonthIndex) {
      return { prorated: null, fullMonthly: fullMonthlyPrice, remainingWeeks: 0, totalWeeks: 0, isProrated: false, recurringInFutureMonth: true, visitsInFirstMonth: 0 }
    }

    const fullServiceWeeksPerMonth = frequency === 'Bi-Weekly' ? 2 : 4

    if (serviceWeeksInMonth >= fullServiceWeeksPerMonth) {
      return { prorated: null, fullMonthly: fullMonthlyPrice, remainingWeeks: serviceWeeksInMonth, totalWeeks: fullServiceWeeksPerMonth, isProrated: false, recurringInFutureMonth: false, visitsInFirstMonth }
    }

    const prorated = Math.round(currentPrice * visitsInFirstMonth * 100) / 100
    return { prorated, fullMonthly: fullMonthlyPrice, remainingWeeks: serviceWeeksInMonth, totalWeeks: fullServiceWeeksPerMonth, isProrated: true, recurringInFutureMonth: false, visitsInFirstMonth }
  }

  const prorationInfo = quoteMode === 'month' ? calculateProratedMonth() : { prorated: null, fullMonthly: fullMonthlyPrice, remainingWeeks: 0, totalWeeks: 0, isProrated: false, recurringInFutureMonth: false, visitsInFirstMonth: 0 }

  const monthlyPrice = prorationInfo.recurringInFutureMonth ? 0 : (prorationInfo.isProrated ? prorationInfo.prorated : fullMonthlyPrice)
  const displayPrice = quoteMode === 'month' ? monthlyPrice : currentPrice
  const priceLabel = quoteMode === 'month' ? '/month' : '/visit'

  const addMainService = () => {
    if (displayPrice === null) return
    const modeLabel = quoteMode === 'month' ? 'Monthly' : frequency
    const serviceName = `${modeLabel} Cleanup (${priceTier})`
    const newServices: QuoteItem[] = []

    // Add initial clean if selected
    if (includeInitialClean && initialCleanFee !== null) {
      newServices.push({
        service: 'Initial Cleanup',
        basePrice: initialCleanFee,
        adjustedPrice: initialCleanFee,
        quantity: 1,
      })
    }

    // Add the recurring service (skip if recurring starts in a future month — nothing to charge now)
    if (!(quoteMode === 'month' && prorationInfo.recurringInFutureMonth)) {
      newServices.push({
        service: prorationInfo.isProrated ? `${serviceName} (pro-rated first month)` : serviceName,
        basePrice: displayPrice,
        adjustedPrice: displayPrice,
        quantity: 1,
      })
    }

    setSelectedServices([...selectedServices, ...newServices])
  }

  const addAddon = (addon: AddonService) => {
    setSelectedServices([...selectedServices, {
      service: addon.name,
      basePrice: addon.basePrice,
      adjustedPrice: addon.basePrice,
      quantity: 1,
    }])
  }

  const removeService = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index))
  }

  const subtotal = selectedServices.reduce((sum, s) => sum + (s.adjustedPrice * s.quantity), 0)
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount

  const yardSizes = Array.from(new Set(pricingTable[priceTier].map(e => e.yardSize)))
  const dogCounts = Array.from(new Set(pricingTable[priceTier].map(e => e.dogs)))
  const frequencies = Array.from(new Set(pricingTable[priceTier].map(e => e.frequency)))

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-blue-500" /> Quote Builder
          </h1>
          <p className="text-gray-500">Create, send, and track quotes for new and existing customers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPricingSettings(true)}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <Settings size={16} /> Pricing Settings
          </button>
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('list')} className={`px-4 py-2 text-sm font-medium ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Quotes</button>
            <button onClick={() => setView('builder')} className={`px-4 py-2 text-sm font-medium ${view === 'builder' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>New Quote</button>
          </div>
        </div>
      </div>

      {/* Pricing Settings Modal */}
      <PricingSettingsModal
        isOpen={showPricingSettings}
        onClose={() => setShowPricingSettings(false)}
        pricingTable={pricingTable}
        onSave={setPricingTable}
        addonServices={addonServices}
        onSaveAddons={setAddonServices}
      />

      {view === 'list' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{savedQuotes.length}</p>
              <p className="text-xs text-gray-500">Total Quotes</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{savedQuotes.filter(q => q.status === 'sent').length}</p>
              <p className="text-xs text-gray-500">Awaiting Response</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{savedQuotes.filter(q => q.status === 'accepted').length}</p>
              <p className="text-xs text-gray-500">Accepted</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round((savedQuotes.filter(q => q.status === 'accepted').length / Math.max(savedQuotes.filter(q => q.status !== 'draft').length, 1)) * 100)}%
              </p>
              <p className="text-xs text-gray-500">Close Rate</p>
            </div>
          </div>

          {/* Quote List */}
          <div className="space-y-3">
            {savedQuotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-gray-400 font-mono">{quote.id}</span>
                    <h3 className="font-semibold">{quote.customerName}</h3>
                    <p className="text-sm text-gray-500">{quote.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${quote.items.reduce((sum, i) => sum + i.adjustedPrice * i.quantity, 0).toFixed(2)}
                      <span className="text-xs text-gray-400 font-normal">/visit</span>
                    </p>
                    <p className="text-xs text-gray-500">{quote.items.map(i => i.service).join(', ')}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[quote.status]}`}>
                    {quote.status}
                  </span>
                  <p className="text-xs text-gray-400">{quote.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="(520) 555-0000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="john@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Service Selection — Driven by Pricing Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-green-600" /> Service & Pricing
              </h2>

              {/* Tier Toggle */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-700">Pricing Tier:</span>
                <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                  <button onClick={() => setPriceTier('basic')} className={`px-4 py-2 text-sm font-medium transition-colors ${priceTier === 'basic' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                    Basic
                  </button>
                  <button onClick={() => setPriceTier('premium')} className={`px-4 py-2 text-sm font-medium transition-colors ${priceTier === 'premium' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                    Premium
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yard Size</label>
                  <select value={yardSize} onChange={(e) => setYardSize(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    {yardSizes.map(ys => <option key={ys} value={ys}>{ys}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Dogs</label>
                  <select value={dogCount} onChange={(e) => setDogCount(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    {dogCounts.map(dc => <option key={dc} value={dc}>{dc} {dc === '1' ? 'dog' : 'dogs'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Live Price Preview */}
              <div className={`rounded-xl p-4 mb-4 flex items-center justify-between ${priceTier === 'premium' ? 'bg-purple-50 border border-purple-200' : 'bg-green-50 border border-green-200'}`}>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {frequency} • {yardSize} • {dogCount} {dogCount === '1' ? 'Dog' : 'Dogs'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{priceTier} Tier Pricing</p>
                </div>
                <div className="text-right">
                  {displayPrice !== null ? (
                    <p className={`text-2xl font-bold ${priceTier === 'premium' ? 'text-purple-600' : 'text-green-600'}`}>${displayPrice.toFixed(2)}<span className="text-sm text-gray-400 font-normal">{priceLabel}</span></p>
                  ) : (
                    <p className="text-sm text-red-500">No price set</p>
                  )}
                </div>
              </div>

              {/* Per Visit / Per Month Toggle */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-700">Quote as:</span>
                <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuoteMode('visit')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${quoteMode === 'visit' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    Per Visit
                  </button>
                  <button
                    onClick={() => setQuoteMode('month')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${quoteMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    Per Month
                  </button>
                </div>
                {quoteMode === 'month' && currentPrice !== null && (
                  <span className="text-xs text-gray-400">({dogCount} {dogCount === '1' ? 'dog' : 'dogs'} × ${currentPrice}/visit × 52 wks ÷ 12 mo)</span>
                )}
              </div>

              {/* Initial Clean Option */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInitialClean}
                    onChange={(e) => {
                      setIncludeInitialClean(e.target.checked)
                      if (e.target.checked && initialCleanFee === null && initialCleanPrice !== null) {
                        setInitialCleanFee(initialCleanPrice)
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">Include Initial Cleanup</span>
                    <p className="text-xs text-gray-400">One-time first visit cleanup before recurring service begins</p>
                  </div>
                </label>

                {includeInitialClean && (
                  <div className="mt-3 pl-7 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <DollarSign size={14} className="inline mr-1 text-gray-400" /> Initial Cleanup Fee
                      </label>
                      <div className="relative w-full max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={initialCleanFee ?? ''}
                          onChange={(e) => setInitialCleanFee(e.target.value === '' ? null : Number(e.target.value))}
                          min={0}
                          step={0.01}
                          className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder={initialCleanPrice !== null ? initialCleanPrice.toString() : '0'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <CalendarDays size={14} className="inline mr-1 text-gray-400" /> Initial Cleanup Date
                      </label>
                      <input
                        type="date"
                        value={initialCleanDate}
                        onChange={(e) => setInitialCleanDate(e.target.value)}
                        className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recurring Service Start Date */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarDays size={14} className="inline mr-1 text-gray-400" /> Recurring Service Start Date
                </label>
                <input
                  type="date"
                  value={recurringStartDate}
                  onChange={(e) => setRecurringStartDate(e.target.value)}
                  className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                {prorationInfo.isProrated && quoteMode === 'month' && prorationInfo.prorated !== null && fullMonthlyPrice !== null && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-700">
                      ⚡ Pro-rated first month: <span className="font-bold">${prorationInfo.prorated.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      {prorationInfo.visitsInFirstMonth} visit{prorationInfo.visitsInFirstMonth === 1 ? '' : 's'} this month × ${currentPrice?.toFixed(2)}/visit. Full monthly rate of ${fullMonthlyPrice.toFixed(2)} starts the following month.
                    </p>
                  </div>
                )}
                {prorationInfo.recurringInFutureMonth && quoteMode === 'month' && fullMonthlyPrice !== null && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-700">
                      ℹ️ Recurring service starts next month — nothing to prorate.
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      First monthly charge of ${fullMonthlyPrice.toFixed(2)} begins {new Date(recurringStartDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={addMainService}
                disabled={displayPrice === null}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={16} /> Add to Quote
              </button>

              {/* Add-on Services */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Add-On Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {addonServices.map((addon) => (
                    <button
                      key={addon.name}
                      onClick={() => addAddon(addon)}
                      className="text-left border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{addon.name}</span>
                        <span className="text-sm text-green-600 font-bold">${addon.basePrice}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{addon.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Services</h3>
                  <div className="space-y-2">
                    {selectedServices.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                        <span className="text-sm font-medium">{item.service}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-green-700">${item.adjustedPrice.toFixed(2)}</span>
                          <button onClick={() => removeService(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold mb-2">Notes</h2>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Special instructions, gate codes, dog info..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Quote Summary */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Calculator size={18} /> Quote Summary</h2>

              {selectedServices.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Add services to build your quote</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {selectedServices.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.service}</span>
                        <span className="font-medium">${item.adjustedPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Discount</span>
                      <div className="flex items-center gap-1">
                        <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} min={0} max={100} className="w-14 border border-gray-200 rounded px-2 py-0.5 text-sm text-right" />
                        <span className="text-gray-400">%</span>
                        {discountAmount > 0 && <span className="text-red-500 text-xs">-${discountAmount.toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mb-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg text-green-600">${total.toFixed(2)}<span className="text-sm text-gray-400 font-normal">{priceLabel}</span></span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {dogCount} {dogCount === '1' ? 'dog' : 'dogs'} • {frequency}
                    </p>
                    {initialCleanDate && includeInitialClean && (
                      <p className="text-xs text-gray-400 mt-0.5">Initial clean: {new Date(initialCleanDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    )}
                    {recurringStartDate && (
                      <p className="text-xs text-gray-400 mt-0.5">Recurring starts: {new Date(recurringStartDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    )}
                    {(prorationInfo.isProrated || prorationInfo.recurringInFutureMonth) && fullMonthlyPrice !== null && (
                      <p className="text-xs text-blue-600 font-medium mt-1.5">
                        Following months: ${fullMonthlyPrice.toFixed(2)}/month
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                      <Send size={16} /> Send via Text (Quo)
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Send size={16} /> Send via Email
                    </button>
                    <button className="w-full border border-gray-200 py-2.5 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Download size={16} /> Download PDF
                    </button>
                    <button className="w-full border border-gray-200 py-2.5 rounded-lg font-medium hover:bg-gray-50 text-sm">
                      Save as Draft
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}