import { NextResponse } from 'next/server'

// Meta (Facebook/Instagram) OAuth callback handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    const metaAuthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
    metaAuthUrl.searchParams.set('client_id', process.env.META_APP_ID || '')
    metaAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/integrations/meta`)
    metaAuthUrl.searchParams.set('scope', 'ads_read,ads_management,pages_read_engagement,instagram_basic')

    return NextResponse.redirect(metaAuthUrl.toString())
  }

  // TODO: Exchange code for tokens and store in database
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings/connections?connected=meta`)
}

export async function POST(request: Request) {
  const { action } = await request.json()

  switch (action) {
    case 'campaigns':
      return NextResponse.json({ campaigns: [] })
    case 'insights':
      return NextResponse.json({ data: [] })
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}