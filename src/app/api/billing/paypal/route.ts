import { NextRequest, NextResponse } from 'next/server'

// PayPal API integration for PoopScoop HQ subscriptions
// In production, use PayPal REST SDK or direct API calls
// const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
//   ? 'https://api-m.paypal.com'
//   : 'https://api-m.sandbox.paypal.com'

// async function getPayPalToken() {
//   const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
//   const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
//     method: 'POST',
//     headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: 'grant_type=client_credentials',
//   })
//   const data = await res.json()
//   return data.access_token
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, planId, subscriptionId, email } = body

    switch (action) {
      case 'create-subscription': {
        // const token = await getPayPalToken()
        // const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
        //   method: 'POST',
        //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     plan_id: planId,
        //     subscriber: { email_address: email },
        //     application_context: {
        //       brand_name: 'PoopScoop HQ',
        //       return_url: `${process.env.NEXTAUTH_URL}/dashboard?paypal_sub=success`,
        //       cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
        //     },
        //   }),
        // })
        // const data = await res.json()
        return NextResponse.json({
          success: true,
          subscriptionId: `I-MOCK${Date.now()}`,
          approvalUrl: '/dashboard?mock_paypal=approve',
          message: 'PayPal subscription created — redirect to approval',
        })
      }

      case 'cancel-subscription': {
        // const token = await getPayPalToken()
        // await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        //   method: 'POST',
        //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ reason: 'Customer requested cancellation' }),
        // })
        return NextResponse.json({
          success: true,
          message: 'PayPal subscription cancelled',
        })
      }

      case 'get-subscription': {
        // const token = await getPayPalToken()
        // const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // })
        // const data = await res.json()
        return NextResponse.json({
          success: true,
          subscription: {
            id: subscriptionId || 'I-MOCK123',
            status: 'ACTIVE',
            plan_id: 'P-PRO-MONTHLY',
            subscriber: { email_address: email || 'user@example.com' },
          },
        })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'PayPal API error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    plans: [
      { id: 'P-STARTER-MONTHLY', name: 'Starter', amount: '99.00', interval: 'MONTH' },
      { id: 'P-PRO-MONTHLY', name: 'Pro', amount: '199.00', interval: 'MONTH' },
      { id: 'P-ENTERPRISE-MONTHLY', name: 'Enterprise', amount: '299.00', interval: 'MONTH' },
    ],
  })
}