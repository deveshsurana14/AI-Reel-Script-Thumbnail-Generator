import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateThumbnailImage, generateThumbnailWithImagen } from '@/lib/gemini/image-generator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, scriptId } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Try Gemini image generation first, fall back to Imagen
    let imageData = await generateThumbnailImage(prompt)
    if (!imageData) {
      imageData = await generateThumbnailWithImagen(prompt)
    }

    if (!imageData) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
    }

    // If script ID provided, update the script with the thumbnail URL
    if (scriptId && imageData) {
      await supabase
        .from('scripts')
        .update({ thumbnail_url: imageData })
        .eq('id', scriptId)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ data: { imageData } })
  } catch (error) {
    console.error('Thumbnail generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate thumbnail. Please try again.' },
      { status: 500 }
    )
  }
}
