import { NextResponse } from 'next/server'

// Webhook receiver for Sweep&Go events
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const eventType = payload.event || payload.type || 'unknown'

    console.log(`[Sweep&Go Webhook] Received event: ${eventType}`)

    // TODO: Store in database and trigger UI updates
    // Event types from Sweep&Go:
    // - free:quote
    // - lead:in_service_area, lead:out_of_service_area, lead:delete
    // - client:changed_status, client:changed_info, client:changed_address
    // - client:client_onboarding_recurring, client:client_onboarding_onetime
    // - client:subscription_created/canceled/paused/unpaused
    // - client:invoice_finalized
    // - client:client_payment_declined/accepted
    // - notification:on_the_way/completed_job/skipped_job
    // - staff:staff_clock_in/forgot_to_clock_out
    // - payroll:shift_info, payroll:job_complete

    return NextResponse.json({ received: true, eventType })
  } catch (error) {
    console.error('Sweep&Go webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}