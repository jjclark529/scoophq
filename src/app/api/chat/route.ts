import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const { message, model = 'gpt-4o', context } = await request.json()

    // TODO: Initialize with user's API key from database
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `You are Captain Scoop 🍦, an AI marketing strategist for PoopScoop HQ. 
You help service business owners optimize their Google Ads, Meta Ads, and overall marketing strategy.
You have access to their campaign data, CRM data from HubSpot, call/text data from Quo, and client data from Sweep&Go.
Be actionable, specific, and data-driven in your recommendations.
Use emojis occasionally to keep things engaging but stay professional.
When suggesting actions, be specific about what to do and why.
${context ? `Current context: ${context}` : ''}`

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
    })

    return NextResponse.json({
      response: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}