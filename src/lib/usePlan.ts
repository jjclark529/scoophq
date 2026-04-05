'use client'

import { useState, useEffect } from 'react'
import { PlanId, hasAccess, getLimit, FeatureKey } from './planFeatures'

const PLAN_KEY = 'scoophq_user_plan'
const USAGE_KEY = 'scoophq_feature_usage'

export function usePlan() {
  const [plan, setPlan] = useState<PlanId>('pro')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PLAN_KEY)
      if (stored && ['starter', 'pro', 'enterprise'].includes(stored)) {
        setPlan(stored as PlanId)
      }
    }
  }, [])

  const changePlan = (newPlan: PlanId) => {
    setPlan(newPlan)
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLAN_KEY, newPlan)
    }
  }

  const canAccess = (key: FeatureKey) => hasAccess(plan, key)
  const featureLimit = (key: FeatureKey) => getLimit(plan, key)

  // Usage tracking for metered features
  const getUsage = (key: FeatureKey): number => {
    if (typeof window === 'undefined') return 0
    const usage = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}')
    return usage[key] || 0
  }

  const incrementUsage = (key: FeatureKey) => {
    if (typeof window === 'undefined') return
    const usage = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}')
    usage[key] = (usage[key] || 0) + 1
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
  }

  const hasQuota = (key: FeatureKey): boolean => {
    const limit = featureLimit(key)
    if (limit === null) return true // unlimited
    if (limit === 0) return false // no access
    return getUsage(key) < limit
  }

  return { plan, changePlan, canAccess, featureLimit, getUsage, incrementUsage, hasQuota }
}