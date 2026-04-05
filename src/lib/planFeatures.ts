export type FeatureKey =
  | 'dashboard'
  | 'kpis'
  | 'revenue'
  | 'quotes'
  | 'reviews'
  | 'google_profile'
  | 'service_area'
  | 'growth_goals'
  | 'sms_templates'
  | 'creative'
  | 'post_scheduler'
  | 'campaigns'
  | 'lead_generation'
  | 'lead_response'
  | 'quick_launch'
  | 'missions'
  | 'competitors'
  | 'captain_scoop'

export type PlanId = 'starter' | 'pro' | 'enterprise'

export type FeatureConfig = {
  key: FeatureKey
  label: string
  description: string
  metered?: boolean
  // limits per plan (null = unlimited, 0 = not available)
  limits: Record<PlanId, number | null>
}

export const features: FeatureConfig[] = [
  { key: 'dashboard', label: 'Dashboard & Overview', description: 'Main marketing overview', limits: { starter: null, pro: null, enterprise: null } },
  { key: 'kpis', label: 'KPIs & Metrics', description: 'Basic performance metrics', limits: { starter: null, pro: null, enterprise: null } },
  { key: 'revenue', label: 'Revenue & ROI', description: 'Revenue tracking, YoY comparison', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'quotes', label: 'Quote Builder', description: 'Create and send quotes', limits: { starter: 10, pro: null, enterprise: null } },
  { key: 'reviews', label: 'Review Requests', description: 'Automated review management', limits: { starter: 20, pro: null, enterprise: null } },
  { key: 'google_profile', label: 'Google Business Profile', description: 'Profile completeness & reviews', limits: { starter: null, pro: null, enterprise: null } },
  { key: 'service_area', label: 'Service Area Intelligence', description: 'Zone analysis & expansion', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'growth_goals', label: 'Growth Goals', description: 'Goal setting & projections', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'sms_templates', label: 'SMS Templates', description: 'Pre-built text templates', limits: { starter: 5, pro: null, enterprise: null } },
  { key: 'creative', label: 'Creative Assets', description: 'Asset management', limits: { starter: null, pro: null, enterprise: null } },
  { key: 'post_scheduler', label: 'Post Scheduler', description: 'Social media scheduling', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'campaigns', label: 'Campaign Management', description: 'View and manage ad campaigns', limits: { starter: null, pro: null, enterprise: null } },
  { key: 'lead_generation', label: 'Lead Generation', description: 'Find leads near clients', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'lead_response', label: 'Lead Response Tracking', description: 'Response time analytics', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'quick_launch', label: 'Ad Quick Launch', description: 'Launch campaigns fast', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'missions', label: 'Missions & Coaching', description: 'Gamified tasks & AI coaching', limits: { starter: null, pro: null, enterprise: null } },
  { key: 'competitors', label: 'Rival Radar', description: 'Competitor tracking & SWOT', limits: { starter: 0, pro: null, enterprise: null } },
  { key: 'captain_scoop', label: 'Captain Scoop AI', description: 'AI assistant queries', metered: true, limits: { starter: 50, pro: null, enterprise: null } },
]

export function getFeature(key: FeatureKey): FeatureConfig | undefined {
  return features.find(f => f.key === key)
}

export function hasAccess(planId: PlanId, key: FeatureKey): boolean {
  const feature = getFeature(key)
  if (!feature) return false
  const limit = feature.limits[planId]
  return limit === null || limit > 0
}

export function getLimit(planId: PlanId, key: FeatureKey): number | null {
  const feature = getFeature(key)
  if (!feature) return 0
  return feature.limits[planId]
}

// Map dashboard routes to feature keys
export const routeFeatureMap: Record<string, FeatureKey> = {
  '/dashboard': 'dashboard',
  '/dashboard/kpis': 'kpis',
  '/dashboard/revenue': 'revenue',
  '/dashboard/quotes': 'quotes',
  '/dashboard/reviews': 'reviews',
  '/dashboard/google-profile': 'google_profile',
  '/dashboard/service-area': 'service_area',
  '/dashboard/growth-goals': 'growth_goals',
  '/dashboard/sms-templates': 'sms_templates',
  '/dashboard/creative': 'creative',
  '/dashboard/post-scheduler': 'post_scheduler',
  '/dashboard/campaigns': 'campaigns',
  '/dashboard/turf-tracker': 'lead_generation',
  '/dashboard/lead-response': 'lead_response',
  '/dashboard/quick-launch': 'quick_launch',
  '/dashboard/missions': 'missions',
  '/dashboard/competitors': 'competitors',
}