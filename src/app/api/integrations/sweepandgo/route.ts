import { NextResponse } from 'next/server'

// Sweep&Go API proxy
const SWEEPANDGO_BASE = 'https://openapi.sweepandgo.com/api'

async function sweepFetch(endpoint: string, apiKey: string) {
  const res = await fetch(`${SWEEPANDGO_BASE}${endpoint}`, {
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
      return NextResponse.json({ error: 'Sweep&Go API key required' }, { status: 401 })
    }

    switch (action) {
      case 'health':
        const health = await sweepFetch('/health', apiKey)
        return NextResponse.json(health)

      case 'active-clients':
        const page = params?.page || 1
        const clients = await sweepFetch(`/v1/clients/active?page=${page}`, apiKey)
        return NextResponse.json(clients)

      case 'search-clients':
        const search = await sweepFetch(`/v1/clients/search?q=${encodeURIComponent(params?.query || '')}`, apiKey)
        return NextResponse.json(search)

      case 'client-detail':
        const client = await sweepFetch(`/v1/clients/${params?.clientId}`, apiKey)
        return NextResponse.json(client)

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Sweep&Go API error:', error)
    return NextResponse.json({ error: 'Sweep&Go API request failed' }, { status: 500 })
  }
}