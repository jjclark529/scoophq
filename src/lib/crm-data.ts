export type LeadStage = 'New Lead' | 'Quote Sent' | 'Follow Up' | 'Scheduled' | 'Customer' | 'Lost Lead'
export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue' | 'draft'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'
export type JobStatus = 'scheduled' | 'in-progress' | 'completed' | 'skipped'
export type Frequency = 'weekly' | 'bi-weekly' | 'monthly' | 'one-time'

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  zone: 'Regular' | 'Premium'
  dogCount: number
  frequency: Frequency
  status: 'active' | 'paused' | 'lead'
  monthlyValue: number
  nextService: string
  source: string
  notes?: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  source: string
  date: string
  value: number
  stage: LeadStage
  address: string
  zone: string
  notes: string
}

export interface Invoice {
  id: string
  customerId: string
  customerName: string
  amount: number
  status: InvoiceStatus
  dueDate: string
  issuedDate: string
  billingType: 'prepaid' | 'postpaid'
  lineItems: { description: string; quantity: number; rate: number }[]
}

export interface Subscription {
  id: string
  customerId: string
  customerName: string
  status: SubscriptionStatus
  frequency: Frequency
  billingType: 'prepaid' | 'postpaid'
  amount: number
  nextInvoice: string
  cardOnFile: string
}

export interface FieldTech {
  id: string
  name: string
  phone: string
  email: string
  defaultZone: string
  workingHours: string
  performanceTarget: number
}

export interface Job {
  id: string
  routeId: string
  customerId: string
  customerName: string
  address: string
  techId: string
  techName: string
  scheduledAt: string
  status: JobStatus
  frequency: Frequency
  zone: string
  etaMinutes: number
}

export interface Route {
  id: string
  name: string
  day: string
  techId: string
  techName: string
  zone: string
  estimatedHours: number
  stops: number
  driveMiles: number
  jobs: Job[]
}

export interface ServicePause {
  id: string
  customerId: string
  customerName: string
  startDate: string
  endDate: string
  reason: string
  status: 'scheduled' | 'active' | 'ending-soon'
}

export interface Communication {
  id: string
  customerId: string
  customerName: string
  channel: 'sms' | 'email'
  direction: 'inbound' | 'outbound'
  body: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

export interface ReferralRecord {
  id: string
  referrerId: string
  referrerName: string
  referredName: string
  referredEmail: string
  rewardCredit: number
  status: 'invited' | 'converted' | 'rewarded'
  source: 'email' | 'sms'
  createdAt: string
}

export const fieldTechs: FieldTech[] = [
  { id: 'tech-1', name: 'Maya Brooks', phone: '(951) 555-0101', email: 'maya@poopscoophq.com', defaultZone: 'North Hills', workingHours: '7:00 AM - 3:30 PM', performanceTarget: 28 },
  { id: 'tech-2', name: 'Carlos Vega', phone: '(951) 555-0102', email: 'carlos@poopscoophq.com', defaultZone: 'Lakeview', workingHours: '8:00 AM - 4:30 PM', performanceTarget: 24 },
  { id: 'tech-3', name: 'Jordan Kim', phone: '(951) 555-0103', email: 'jordan@poopscoophq.com', defaultZone: 'South Ridge', workingHours: '7:30 AM - 4:00 PM', performanceTarget: 26 },
]

export const customers: Customer[] = [
  { id: 'cust-1', name: 'Sarah Mitchell', phone: '(951) 555-0142', email: 'sarah@email.com', address: '1148 Oak Trail Dr, Riverside, CA', zone: 'Premium', dogCount: 2, frequency: 'weekly', status: 'active', monthlyValue: 168, nextService: '2026-04-22T09:00:00', source: 'Google Ads' },
  { id: 'cust-2', name: 'James Rodriguez', phone: '(951) 555-0198', email: 'james@email.com', address: '882 Summit View Ln, Riverside, CA', zone: 'Regular', dogCount: 1, frequency: 'bi-weekly', status: 'active', monthlyValue: 92, nextService: '2026-04-22T11:30:00', source: 'Referral' },
  { id: 'cust-3', name: 'Lisa Chen', phone: '(951) 555-0167', email: 'lisa@email.com', address: '410 Canyon Crest Dr, Riverside, CA', zone: 'Premium', dogCount: 3, frequency: 'weekly', status: 'active', monthlyValue: 224, nextService: '2026-04-23T13:00:00', source: 'Facebook' },
  { id: 'cust-4', name: 'Mike Thompson', phone: '(951) 555-0133', email: 'mike@email.com', address: '2214 Grove Park Ave, Riverside, CA', zone: 'Regular', dogCount: 2, frequency: 'monthly', status: 'paused', monthlyValue: 64, nextService: '2026-04-29T10:00:00', source: 'Door Hanger' },
  { id: 'cust-5', name: 'Amy Johnson', phone: '(951) 555-0155', email: 'amy@email.com', address: '73 Meadow Glen Way, Riverside, CA', zone: 'Premium', dogCount: 4, frequency: 'weekly', status: 'active', monthlyValue: 276, nextService: '2026-04-22T14:15:00', source: 'Referral' },
  { id: 'cust-6', name: 'David Park', phone: '(951) 555-0110', email: 'david@email.com', address: '905 Citrus Ridge Rd, Riverside, CA', zone: 'Regular', dogCount: 1, frequency: 'one-time', status: 'lead', monthlyValue: 79, nextService: '2026-04-25T15:00:00', source: 'Website Chat' },
]

export const leads: Lead[] = [
  { id: 'lead-1', name: 'Tina Alvarez', phone: '(951) 555-0201', email: 'tina@email.com', source: 'Google Local Services', date: 'Apr 21', value: 148, stage: 'New Lead', address: '417 Palm Crest Ave', zone: 'North Hills', notes: 'Needs weekly service for 2 dogs.' },
  { id: 'lead-2', name: 'Oliver Grant', phone: '(951) 555-0202', email: 'oliver@email.com', source: 'Referral', date: 'Apr 20', value: 92, stage: 'Quote Sent', address: '18 Willow Path', zone: 'Lakeview', notes: 'Requested bi-weekly starter package.' },
  { id: 'lead-3', name: 'Natalie Price', phone: '(951) 555-0203', email: 'natalie@email.com', source: 'Facebook Lead Form', date: 'Apr 19', value: 212, stage: 'Follow Up', address: '550 Ridge Top Ct', zone: 'South Ridge', notes: 'Interested in premium plan and deodorizer add-on.' },
  { id: 'lead-4', name: 'Trevor Scott', phone: '(951) 555-0204', email: 'trevor@email.com', source: 'Website', date: 'Apr 18', value: 168, stage: 'Scheduled', address: '74 Orchard Run', zone: 'North Hills', notes: 'First cleanup booked for Thursday.' },
  { id: 'lead-5', name: 'Brooke Ellis', phone: '(951) 555-0205', email: 'brooke@email.com', source: 'Referral', date: 'Apr 17', value: 224, stage: 'Customer', address: '308 Golden Field Dr', zone: 'Premium East', notes: 'Converted after same-day quote.' },
  { id: 'lead-6', name: 'Kevin Moss', phone: '(951) 555-0206', email: 'kevin@email.com', source: 'Yard Sign', date: 'Apr 16', value: 84, stage: 'Lost Lead', address: '99 Brookstone Way', zone: 'Lakeview', notes: 'Price objection, revisit in summer.' },
]

export const invoices: Invoice[] = [
  { id: 'INV-1001', customerId: 'cust-1', customerName: 'Sarah Mitchell', amount: 168, status: 'paid', dueDate: '2026-04-20', issuedDate: '2026-04-15', billingType: 'prepaid', lineItems: [{ description: 'Weekly Scoop Service', quantity: 4, rate: 42 }] },
  { id: 'INV-1002', customerId: 'cust-2', customerName: 'James Rodriguez', amount: 92, status: 'unpaid', dueDate: '2026-04-24', issuedDate: '2026-04-18', billingType: 'postpaid', lineItems: [{ description: 'Bi-weekly Scoop Service', quantity: 2, rate: 46 }] },
  { id: 'INV-1003', customerId: 'cust-3', customerName: 'Lisa Chen', amount: 224, status: 'overdue', dueDate: '2026-04-14', issuedDate: '2026-04-01', billingType: 'prepaid', lineItems: [{ description: 'Weekly Premium Service', quantity: 4, rate: 56 }] },
  { id: 'INV-1004', customerId: 'cust-5', customerName: 'Amy Johnson', amount: 276, status: 'draft', dueDate: '2026-04-30', issuedDate: '2026-04-21', billingType: 'prepaid', lineItems: [{ description: 'Weekly Multi-Dog Service', quantity: 4, rate: 69 }] },
]

export const subscriptions: Subscription[] = [
  { id: 'sub-1', customerId: 'cust-1', customerName: 'Sarah Mitchell', status: 'active', frequency: 'weekly', billingType: 'prepaid', amount: 168, nextInvoice: '2026-05-01', cardOnFile: 'Visa •••• 4242' },
  { id: 'sub-2', customerId: 'cust-2', customerName: 'James Rodriguez', status: 'active', frequency: 'bi-weekly', billingType: 'postpaid', amount: 92, nextInvoice: '2026-04-24', cardOnFile: 'Mastercard •••• 8811' },
  { id: 'sub-3', customerId: 'cust-4', customerName: 'Mike Thompson', status: 'paused', frequency: 'monthly', billingType: 'prepaid', amount: 64, nextInvoice: '2026-05-15', cardOnFile: 'Visa •••• 1004' },
  { id: 'sub-4', customerId: 'cust-5', customerName: 'Amy Johnson', status: 'active', frequency: 'weekly', billingType: 'prepaid', amount: 276, nextInvoice: '2026-05-01', cardOnFile: 'Amex •••• 3001' },
]

export const jobs: Job[] = [
  { id: 'job-1', routeId: 'route-1', customerId: 'cust-1', customerName: 'Sarah Mitchell', address: '1148 Oak Trail Dr', techId: 'tech-1', techName: 'Maya Brooks', scheduledAt: '2026-04-22T09:00:00', status: 'scheduled', frequency: 'weekly', zone: 'North Hills', etaMinutes: 15 },
  { id: 'job-2', routeId: 'route-1', customerId: 'cust-2', customerName: 'James Rodriguez', address: '882 Summit View Ln', techId: 'tech-1', techName: 'Maya Brooks', scheduledAt: '2026-04-22T11:30:00', status: 'in-progress', frequency: 'bi-weekly', zone: 'North Hills', etaMinutes: 30 },
  { id: 'job-3', routeId: 'route-2', customerId: 'cust-3', customerName: 'Lisa Chen', address: '410 Canyon Crest Dr', techId: 'tech-2', techName: 'Carlos Vega', scheduledAt: '2026-04-23T13:00:00', status: 'completed', frequency: 'weekly', zone: 'Lakeview', etaMinutes: 20 },
  { id: 'job-4', routeId: 'route-3', customerId: 'cust-4', customerName: 'Mike Thompson', address: '2214 Grove Park Ave', techId: 'tech-3', techName: 'Jordan Kim', scheduledAt: '2026-04-24T10:00:00', status: 'skipped', frequency: 'monthly', zone: 'South Ridge', etaMinutes: 45 },
  { id: 'job-5', routeId: 'route-2', customerId: 'cust-5', customerName: 'Amy Johnson', address: '73 Meadow Glen Way', techId: 'tech-2', techName: 'Carlos Vega', scheduledAt: '2026-04-22T14:15:00', status: 'scheduled', frequency: 'weekly', zone: 'Lakeview', etaMinutes: 15 },
]

export const routes: Route[] = [
  { id: 'route-1', name: 'North Hills AM', day: 'Tuesday', techId: 'tech-1', techName: 'Maya Brooks', zone: 'North Hills', estimatedHours: 5.5, stops: 12, driveMiles: 28, jobs: jobs.filter((job) => job.routeId === 'route-1') },
  { id: 'route-2', name: 'Lakeview Loop', day: 'Wednesday', techId: 'tech-2', techName: 'Carlos Vega', zone: 'Lakeview', estimatedHours: 6.25, stops: 14, driveMiles: 34, jobs: jobs.filter((job) => job.routeId === 'route-2') },
  { id: 'route-3', name: 'South Ridge Sweep', day: 'Thursday', techId: 'tech-3', techName: 'Jordan Kim', zone: 'South Ridge', estimatedHours: 4.75, stops: 9, driveMiles: 19, jobs: jobs.filter((job) => job.routeId === 'route-3') },
]

export const servicePauses: ServicePause[] = [
  { id: 'pause-1', customerId: 'cust-4', customerName: 'Mike Thompson', startDate: '2026-04-20', endDate: '2026-05-04', reason: 'Vacation hold', status: 'active' },
  { id: 'pause-2', customerId: 'cust-2', customerName: 'James Rodriguez', startDate: '2026-05-10', endDate: '2026-05-17', reason: 'Backyard renovation', status: 'scheduled' },
  { id: 'pause-3', customerId: 'cust-5', customerName: 'Amy Johnson', startDate: '2026-04-28', endDate: '2026-05-02', reason: 'Travel notice', status: 'ending-soon' },
]

export const communications: Communication[] = [
  { id: 'comm-1', customerId: 'cust-1', customerName: 'Sarah Mitchell', channel: 'sms', direction: 'outbound', body: 'On the way — Maya will arrive in about 15 minutes.', timestamp: '10:12 AM', status: 'read' },
  { id: 'comm-2', customerId: 'cust-1', customerName: 'Sarah Mitchell', channel: 'sms', direction: 'inbound', body: 'Perfect, gate is unlocked. Thank you!', timestamp: '10:14 AM', status: 'read' },
  { id: 'comm-3', customerId: 'cust-3', customerName: 'Lisa Chen', channel: 'email', direction: 'outbound', body: 'Your weekly scoop receipt and service summary are ready.', timestamp: 'Yesterday', status: 'delivered' },
  { id: 'comm-4', customerId: 'cust-2', customerName: 'James Rodriguez', channel: 'sms', direction: 'outbound', body: 'Service reminder: your next scoop is scheduled for tomorrow afternoon.', timestamp: 'Yesterday', status: 'delivered' },
]

export const referralRecords: ReferralRecord[] = [
  { id: 'ref-1', referrerId: 'cust-1', referrerName: 'Sarah Mitchell', referredName: 'Brooke Ellis', referredEmail: 'brooke@email.com', rewardCredit: 25, status: 'rewarded', source: 'email', createdAt: '2026-04-12' },
  { id: 'ref-2', referrerId: 'cust-3', referrerName: 'Lisa Chen', referredName: 'Noah Perry', referredEmail: 'noah@email.com', rewardCredit: 25, status: 'converted', source: 'sms', createdAt: '2026-04-18' },
  { id: 'ref-3', referrerId: 'cust-5', referrerName: 'Amy Johnson', referredName: 'Jenna Cole', referredEmail: 'jenna@email.com', rewardCredit: 0, status: 'invited', source: 'email', createdAt: '2026-04-20' },
]

export const crmActivity = [
  { id: 'act-1', title: 'Amy Johnson moved to completed on Lakeview Loop', time: '12 min ago', type: 'job' },
  { id: 'act-2', title: 'New lead Tina Alvarez entered Launch Pad from LSA', time: '27 min ago', type: 'lead' },
  { id: 'act-3', title: 'Invoice INV-1003 for Lisa Chen is overdue', time: '1 hr ago', type: 'billing' },
  { id: 'act-4', title: 'Referral reward issued to Sarah Mitchell', time: '3 hrs ago', type: 'referral' },
]

export const crmTemplates = [
  { id: 'tpl-1', name: 'On The Way', channel: 'sms', content: 'Hi {customer_name}, your scoop tech is on the way and should arrive in about {eta} minutes.' },
  { id: 'tpl-2', name: 'Job Completed', channel: 'sms', content: 'All set, {customer_name}! Your yard service for {service_date} is complete. Photo attached.' },
  { id: 'tpl-3', name: 'Welcome Sequence', channel: 'email', content: 'Welcome to PoopScoop HQ, {customer_name}! Your first service is scheduled for {service_date}.' },
]
