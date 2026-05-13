import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateTrendingTopics } from '@/lib/gemini/script-generator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { niche, platform } = await request.json()

    if (!niche || !platform) {
      return NextResponse.json({ error: 'niche and platform are required' }, { status: 400 })
    }

    const topics = await generateTrendingTopics(niche, platform)
    return NextResponse.json({ data: topics })
  } catch (error) {
    console.error('Trending topics error:', error)
    return NextResponse.json({ error: 'Failed to fetch trending topics' }, { status: 500 })
  }
}
