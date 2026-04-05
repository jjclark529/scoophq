'use client'

import Link from 'next/link'
import { Lock, ArrowRight, Zap } from 'lucide-react'
import { usePlan } from '@/lib/usePlan'
import { FeatureKey, getFeature } from '@/lib/planFeatures'

type PlanGateProps = {
  feature: FeatureKey
  children: React.ReactNode
}

export default function PlanGate({ feature, children }: PlanGateProps) {
  const { plan, canAccess, featureLimit, getUsage, hasQuota } = usePlan()
  const featureConfig = getFeature(feature)

  if (!featureConfig) return <>{children}</>

  // No access at all
  if (!canAccess(feature)) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{featureConfig.label}</h2>
          <p className="text-gray-500 mb-2">{featureConfig.description}</p>
          <p className="text-sm text-amber-600 font-medium mb-6">
            This feature is not available on your current <span className="capitalize font-bold">{plan}</span> plan.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Upgrade to unlock:</p>
            <p className="text-sm text-gray-600">{featureConfig.label} is available on the <strong>Pro</strong> and <strong>Enterprise</strong> plans.</p>
          </div>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Zap size={18} /> Upgrade Plan <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  // Metered feature — check quota
  if (featureConfig.metered && !hasQuota(feature)) {
    const limit = featureLimit(feature)
    const used = getUsage(feature)
    return (
      <div className="p-6 max-w-2xl mx-auto mt-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quota Reached</h2>
          <p className="text-gray-500 mb-2">{featureConfig.label}</p>
          <p className="text-sm text-red-600 font-medium mb-6">
            You&apos;ve used {used} of {limit} {featureConfig.label.toLowerCase()} this month.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Zap size={18} /> Upgrade for Unlimited <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  // Has access — show a usage indicator for metered features
  if (featureConfig.metered) {
    const limit = featureLimit(feature)
    const used = getUsage(feature)
    if (limit !== null) {
      return (
        <>
          <div className="mx-6 mt-2 mb-0">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-blue-700">
                <strong>{featureConfig.label}:</strong> {used}/{limit} used this month
              </span>
              <div className="w-24 bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min((used / limit) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
          {children}
        </>
      )
    }
  }

  return <>{children}</>
}