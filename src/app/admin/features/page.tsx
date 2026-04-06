'use client'

import { useState } from 'react'
import { Shield, Save, RotateCcw, Check, Info } from 'lucide-react'
import { features as defaultFeatures, FeatureConfig, PlanId } from '@/lib/planFeatures'

const plans: { id: PlanId; label: string; color: string }[] = [
  { id: 'starter', label: 'Starter', color: 'bg-gray-100 text-gray-700' },
  { id: 'pro', label: 'Pro', color: 'bg-blue-100 text-blue-700' },
  { id: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-700' },
]

export default function AdminFeaturesPage() {
  const [featureList, setFeatureList] = useState<FeatureConfig[]>(
    () => JSON.parse(JSON.stringify(defaultFeatures))
  )
  const [saved, setSaved] = useState(false)

  const handleToggle = (featureIdx: number, planId: PlanId) => {
    setFeatureList(prev => {
      const updated = [...prev]
      const feature = { ...updated[featureIdx] }
      const limits = { ...feature.limits }
      if (limits[planId] === 0) {
        // Enable: set to null (unlimited) for non-metered, or a default limit for metered
        limits[planId] = feature.metered ? 50 : null
      } else {
        // Disable
        limits[planId] = 0
      }
      feature.limits = limits
      updated[featureIdx] = feature
      return updated
    })
    setSaved(false)
  }

  const handleLimitChange = (featureIdx: number, planId: PlanId, value: string) => {
    setFeatureList(prev => {
      const updated = [...prev]
      const feature = { ...updated[featureIdx] }
      const limits = { ...feature.limits }
      if (value === '' || value === '∞') {
        limits[planId] = null
      } else {
        const num = parseInt(value, 10)
        limits[planId] = isNaN(num) ? 0 : num
      }
      feature.limits = limits
      updated[featureIdx] = feature
      return updated
    })
    setSaved(false)
  }

  const handleSave = () => {
    // In a real app, this would persist to a database
    // For now, save to localStorage so the rest of the app can read overrides
    if (typeof window !== 'undefined') {
      localStorage.setItem('scoophq_feature_config', JSON.stringify(featureList))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setFeatureList(JSON.parse(JSON.stringify(defaultFeatures)))
    if (typeof window !== 'undefined') {
      localStorage.removeItem('scoophq_feature_config')
    }
    setSaved(false)
  }

  const getLimitDisplay = (limit: number | null): string => {
    if (limit === null) return '∞'
    return limit.toString()
  }

  const isEnabled = (limit: number | null): boolean => {
    return limit === null || limit > 0
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Shield size={28} className="text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Feature Gates</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Control which features are available on each plan tier. Changes are saved to local config.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} /> Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${
              saved ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <strong>How it works:</strong> Toggle the checkbox to enable/disable a feature for a plan.
          For metered features (marked with ⚡), you can set a numeric limit.
          <strong> ∞</strong> means unlimited access, <strong>0</strong> means blocked.
        </div>
      </div>

      {/* Feature Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-80">Feature</th>
                {plans.map(p => (
                  <th key={p.id} className="text-center px-6 py-4 text-sm font-semibold text-gray-700 w-44">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${p.color}`}>
                      {p.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureList.map((feature, idx) => (
                <tr key={feature.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {feature.label}
                          {feature.metered && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                              ⚡ Metered
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                      </div>
                    </div>
                  </td>
                  {plans.map(p => {
                    const limit = feature.limits[p.id]
                    const enabled = isEnabled(limit)
                    return (
                      <td key={p.id} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {/* Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleToggle(idx, p.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" />
                          </label>
                          {/* Limit input (only when enabled and has a numeric limit or is metered) */}
                          {enabled && (
                            <input
                              type="text"
                              value={getLimitDisplay(limit)}
                              onChange={(e) => handleLimitChange(idx, p.id, e.target.value)}
                              className="w-16 text-center text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                              placeholder="∞"
                            />
                          )}
                          {!enabled && (
                            <span className="text-xs text-gray-400">Blocked</span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {plans.map(p => {
          const enabledCount = featureList.filter(f => isEnabled(f.limits[p.id])).length
          const meteredCount = featureList.filter(f => f.metered && isEnabled(f.limits[p.id]) && f.limits[p.id] !== null).length
          return (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.color}`}>{p.label}</span>
                <span className="text-lg font-bold text-gray-900">{enabledCount}/{featureList.length}</span>
              </div>
              <p className="text-xs text-gray-500">
                {enabledCount} features enabled{meteredCount > 0 ? `, ${meteredCount} metered` : ''}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}