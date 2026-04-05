import { NextResponse } from 'next/server'

// Webhook receiver for Quo (OpenPhone) events
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const eventType = payload.type || 'unknown'

    console.log(`[Quo Webhook] Received event: ${eventType}`)

    // TODO: Store in database and trigger UI updates
    // Event types from Quo:
    // - call.completed — New call completed
    // - call.recording.completed — Recording available
    // - message.received — Incoming text message
    // - message.delivered — Outgoing text delivered
    // - call.summary.completed — AI call summary ready
    // - call.transcription.completed — Transcription ready

    return NextResponse.json({ received: true, eventType })
  } catch (error) {
    console.error('Quo webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}