import { NextResponse } from 'next/server'

// Quo (formerly OpenPhone) API proxy
const QUO_BASE = 'https://api.openphone.com/v1'

async function quoFetch(endpoint: string, apiKey: string) {
  const res = await fetch(`${QUO_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

export async function POST(request: Request) {
  try {
    const { action, apiKey, params } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: 'Quo API key required' }, { status: 401 })
    }

    switch (action) {
      case 'calls':
        // List calls
        const calls = await quoFetch(`/calls?phoneNumberId=${params?.phoneNumberId || ''}`, apiKey)
        return NextResponse.json(calls)

      case 'call-detail':
        // Get call by ID
        const call = await quoFetch(`/calls/${params?.callId}`, apiKey)
        return NextResponse.json(call)

      case 'call-recording':
        const recording = await quoFetch(`/calls/${params?.callId}/recordings`, apiKey)
        return NextResponse.json(recording)

      case 'call-transcription':
        const transcript = await quoFetch(`/calls/${params?.callId}/transcription`, apiKey)
        return NextResponse.json(transcript)

      case 'call-voicemail':
        const voicemail = await quoFetch(`/calls/${params?.callId}/voicemail`, apiKey)
        return NextResponse.json(voicemail)

      case 'call-summary':
        const summary = await quoFetch(`/calls/${params?.callId}/summary`, apiKey)
        return NextResponse.json(summary)

      case 'messages':
        // List messages
        const messages = await quoFetch(`/messages?phoneNumberId=${params?.phoneNumberId || ''}`, apiKey)
        return NextResponse.json(messages)

      case 'send-message':
        // Send text message
        const sendRes = await fetch(`${QUO_BASE}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: params?.from,
            to: params?.to,
            content: params?.content,
          }),
        })
        return NextResponse.json(await sendRes.json())

      case 'contacts':
        const contacts = await quoFetch('/contacts', apiKey)
        return NextResponse.json(contacts)

      case 'conversations':
        const convos = await quoFetch('/conversations', apiKey)
        return NextResponse.json(convos)

      case 'phone-numbers':
        const numbers = await quoFetch('/phone-numbers', apiKey)
        return NextResponse.json(numbers)

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Quo API error:', error)
    return NextResponse.json({ error: 'Quo API request failed' }, { status: 500 })
  }
}