import { NextRequest, NextResponse } from 'next/server'

// Stripe API integration for PoopScoop HQ subscriptions
// In production, use: import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, customerId, priceId, email, name } = body

    switch (action) {
      case 'create-customer': {
        // const customer = await stripe.customers.create({ email, name, metadata: { source: 'poopscoophq' } })
        return NextResponse.json({
          success: true,
          customerId: `cus_mock_${Date.now()}`,
          message: 'Stripe customer created',
        })
      }

      case 'create-subscription': {
        // const subscription = await stripe.subscriptions.create({
        //   customer: customerId,
        //   items: [{ price: priceId }],
        //   payment_behavior: 'default_incomplete',
        //   expand: ['latest_invoice.payment_intent'],
        // })
        return NextResponse.json({
          success: true,
          subscriptionId: `sub_mock_${Date.now()}`,
          clientSecret: `pi_mock_secret_${Date.now()}`,
          message: 'Subscription created — awaiting payment confirmation',
        })
      }

      case 'create-checkout-session': {
        // const session = await stripe.checkout.sessions.create({
        //   customer: customerId,
        //   line_items: [{ price: priceId, quantity: 1 }],
        //   mode: 'subscription',
        //   success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        //   cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
        // })
        return NextResponse.json({
          success: true,
          sessionId: `cs_mock_${Date.now()}`,
          url: '/dashboard?mock_checkout=success',
          message: 'Checkout session created',
        })
      }

      case 'cancel-subscription': {
        // await stripe.subscriptions.cancel(body.subscriptionId)
        return NextResponse.json({
          success: true,
          message: 'Subscription cancelled',
        })
      }

      case 'create-portal-session': {
        // const portalSession = await stripe.billingPortal.sessions.create({
        //   customer: customerId,
        //   return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        // })
        return NextResponse.json({
          success: true,
          url: '/dashboard?mock_portal=open',
          message: 'Customer portal session created',
        })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Stripe API error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  switch (action) {
    case 'plans': {
      return NextResponse.json({
        plans: [
          { id: 'starter', name: 'Starter', priceId: 'price_starter_monthly', amount: 9900, interval: 'month' },
          { id: 'pro', name: 'Pro', priceId: 'price_pro_monthly', amount: 19900, interval: 'month' },
          { id: 'enterprise', name: 'Enterprise', priceId: 'price_enterprise_monthly', amount: 29900, interval: 'month' },
        ],
      })
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}