import { NextResponse } from 'next/server'

// Webhook receiver for Make (Integromat) / HubSpot data
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const eventType = payload.event_type || payload.eventType || 'unknown'

    console.log(`[Make Webhook] Received event: ${eventType}`)

    // TODO: Store in database
    // - Contact updates from HubSpot
    // - Deal/pipeline changes
    // - Workflow triggers

    switch (eventType) {
      case 'contact.created':
      case 'contact.updated':
        // Handle contact sync from HubSpot
        break
      case 'deal.created':
      case 'deal.updated':
      case 'deal.stage_changed':
        // Handle pipeline updates
        break
      default:
        console.log(`[Make Webhook] Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true, eventType })
  } catch (error) {
    console.error('Make webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}