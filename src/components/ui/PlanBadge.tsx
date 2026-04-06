'use client'

import { usePlan } from '@/lib/usePlan'
import { FeatureKey, getFeature } from '@/lib/planFeatures'

export default function PlanBadge({ feature }: { feature: FeatureKey }) {
  const { featureLimit, getUsage } = usePlan()
  const config = getFeature(feature)
  if (!config) return null

  const limit = featureLimit(feature)
  if (limit === null) return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Unlimited</span>
  if (limit === 0) return <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">🔒 Upgrade</span>

  if (config.metered) {
    const used = getUsage(feature)
    return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{used}/{limit}</span>
  }

  return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Limit: {limit}</span>
}