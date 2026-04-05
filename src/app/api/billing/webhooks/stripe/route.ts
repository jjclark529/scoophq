import { NextRequest, NextResponse } from 'next/server'

// Stripe Webhook Handler
// Endpoint: /api/billing/webhooks/stripe
// Configure in Stripe Dashboard → Webhooks → Add endpoint
// Events to listen for:
//   - checkout.session.completed
//   - customer.subscription.created
//   - customer.subscription.updated
//   - customer.subscription.deleted
//   - invoice.payment_succeeded
//   - invoice.payment_failed

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    // In production:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)

    // Mock: parse as JSON
    const event = JSON.parse(body)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('[Stripe Webhook] Checkout completed:', session.id)
        // TODO: Activate subscription in database
        // await prisma.subscription.update({ where: { stripeSessionId: session.id }, data: { status: 'active' } })
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('[Stripe Webhook] Subscription updated:', subscription.id, '→', subscription.status)
        // TODO: Update subscription status in database
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('[Stripe Webhook] Subscription cancelled:', subscription.id)
        // TODO: Mark subscription as cancelled, handle access revocation
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        console.log('[Stripe Webhook] Payment succeeded:', invoice.id, '$' + (invoice.amount_paid / 100))
        // TODO: Record payment, send receipt, update billing history
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        console.log('[Stripe Webhook] Payment failed:', invoice.id)
        // TODO: Mark subscription as past_due, send dunning email
        break
      }

      default:
        console.log('[Stripe Webhook] Unhandled event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[Stripe Webhook] Error:', error.message)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}