import { NextResponse } from 'next/server'

// GoHighLevel API proxy
const GHL_BASE = 'https://rest.gohighlevel.com/v1'

async function ghlFetch(endpoint: string, apiKey: string) {
  const res = await fetch(`${GHL_BASE}${endpoint}`, {
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
      return NextResponse.json({ error: 'GoHighLevel API key required' }, { status: 401 })
    }

    switch (action) {
      case 'contacts':
        const contacts = await ghlFetch('/contacts/', apiKey)
        return NextResponse.json(contacts)
      case 'opportunities':
        const opps = await ghlFetch('/pipelines/opportunities/', apiKey)
        return NextResponse.json(opps)
      case 'conversations':
        const convos = await ghlFetch('/conversations/', apiKey)
        return NextResponse.json(convos)
      case 'campaigns':
        const campaigns = await ghlFetch('/campaigns/', apiKey)
        return NextResponse.json(campaigns)
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('GoHighLevel API error:', error)
    return NextResponse.json({ error: 'GoHighLevel API request failed' }, { status: 500 })
  }
}