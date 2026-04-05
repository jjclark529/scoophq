import { NextRequest, NextResponse } from 'next/server'

// PayPal Webhook Handler
// Endpoint: /api/billing/webhooks/paypal
// Configure in PayPal Developer Dashboard → Webhooks
// Events to listen for:
//   - BILLING.SUBSCRIPTION.CREATED
//   - BILLING.SUBSCRIPTION.ACTIVATED
//   - BILLING.SUBSCRIPTION.UPDATED
//   - BILLING.SUBSCRIPTION.CANCELLED
//   - BILLING.SUBSCRIPTION.SUSPENDED
//   - PAYMENT.SALE.COMPLETED
//   - PAYMENT.SALE.DENIED

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // In production, verify webhook signature:
    // const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
    // const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, { ... })

    const eventType = body.event_type
    const resource = body.resource

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        console.log('[PayPal Webhook] Subscription activated:', resource.id)
        // TODO: Activate subscription in database
        break
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        console.log('[PayPal Webhook] Subscription ended:', resource.id, eventType)
        // TODO: Mark subscription as cancelled/suspended
        break
      }

      case 'PAYMENT.SALE.COMPLETED': {
        console.log('[PayPal Webhook] Payment received:', resource.id, '$' + resource.amount?.total)
        // TODO: Record payment in database
        break
      }

      case 'PAYMENT.SALE.DENIED': {
        console.log('[PayPal Webhook] Payment denied:', resource.id)
        // TODO: Mark subscription as past_due
        break
      }

      default:
        console.log('[PayPal Webhook] Unhandled event:', eventType)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[PayPal Webhook] Error:', error.message)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}