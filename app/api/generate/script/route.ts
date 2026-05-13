import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateFullScript } from '@/lib/gemini/script-generator'
import type { GenerateScriptInput } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: GenerateScriptInput = await request.json()

    if (!body.topic || !body.niche || !body.platform || !body.content_style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const generated = await generateFullScript(body)

    return NextResponse.json({ data: generated })
  } catch (error) {
    console.error('Script generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate script. Please try again.' },
      { status: 500 }
    )
  }
}
