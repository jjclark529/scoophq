# 🍦 ScoopHQ

AI-powered marketing dashboard for service businesses. Connect your Google Ads, Meta Ads, HubSpot, Quo, and Sweep&Go in one place with Captain Scoop — your AI marketing strategist.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 + Tailwind CSS
- **Database:** PostgreSQL (Prisma ORM)
- **Auth:** NextAuth.js (Email/Password + Google OAuth)
- **AI:** OpenAI API (Captain Scoop)
- **Charts:** Recharts
- **State:** Zustand
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. Clone and install:
```bash
cd app
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Fill in your environment variables in `.env.local`

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Features

### Dashboard
- **Overview** — Performance snapshot, AI call-outs, top action items
- **KPIs** — Detailed charts and metrics across all channels
- **Campaigns** — Campaign list with AI verdicts and health scores
- **Quick Launch** — 5-minute campaign creation wizard
- **Missions** — Gamified marketing tasks with XP and levels
- **Coaching** — AI-powered marketing recommendations

### Business Tools
- **My Business** — Brand profile, logos, colors, voice, targets
- **Google Profile** — Google Business Profile management and reviews
- **Post Scheduler** — Social media content planning
- **Competitor Intel** — AI-powered competitive analysis

### Integrations
- **Google** — Ads, Analytics (GA4), Search Console
- **Meta** — Facebook Ads, Instagram Ads
- **Quo** — Calls, texts, voicemails, transcriptions
- **Sweep&Go** — Client data, subscriptions, jobs
- **HubSpot** — Contacts, deals, pipeline (via Make)

### Captain Scoop 🍦
Persistent AI chat assistant that:
- Analyzes campaign performance
- Recommends budget optimizations
- Generates ad copy and creative ideas
- Pulls customer data from integrations
- Provides competitor counter-strategies

## Project Structure
```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth
│   │   ├── chat/               # Captain Scoop AI
│   │   ├── integrations/       # Google, Meta, Quo, Sweep&Go
│   │   └── webhooks/           # Make, Sweep&Go, Quo webhooks
│   ├── dashboard/              # Dashboard pages
│   │   ├── ad-builder/
│   │   ├── business/
│   │   ├── campaigns/
│   │   ├── coaching/
│   │   ├── competitors/
│   │   ├── creative/
│   │   ├── google-profile/
│   │   ├── kpis/
│   │   ├── missions/
│   │   ├── post-scheduler/
│   │   ├── quick-launch/
│   │   └── settings/
│   ├── login/
│   └── register/
├── components/
│   ├── chat/                   # Captain Scoop chat panel
│   └── layout/                 # Sidebar, layout components
├── lib/                        # Utilities, configs
└── store/                      # Zustand state stores
```

## Deployment

Recommended: [Vercel](https://vercel.com)

```bash
npm run build
```

## License

Private — All rights reserved.