import { NextResponse } from 'next/server'

// Google OAuth callback handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    // Redirect to Google OAuth
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_ADS_CLIENT_ID || '')
    googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/integrations/google`)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', [
      'https://www.googleapis.com/auth/adwords',
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/webmasters.readonly',
    ].join(' '))
    googleAuthUrl.searchParams.set('access_type', 'offline')

    return NextResponse.redirect(googleAuthUrl.toString())
  }

  // TODO: Exchange code for tokens and store in database
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/settings/connections?connected=google`)
}

export async function POST(request: Request) {
  // TODO: Fetch Google Ads / Analytics data
  const { action } = await request.json()

  switch (action) {
    case 'campaigns':
      return NextResponse.json({ campaigns: [] })
    case 'analytics':
      return NextResponse.json({ data: [] })
    case 'search-console':
      return NextResponse.json({ data: [] })
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}