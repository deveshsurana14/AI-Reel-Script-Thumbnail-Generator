import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const { data: original, error: fetchError } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError) return NextResponse.json({ error: 'Script not found' }, { status: 404 })

    const { id: _id, created_at, updated_at, ...rest } = original
    const { data, error } = await supabase
      .from('scripts')
      .insert({ ...rest, title: `${original.title} (Copy)`, status: 'draft' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to duplicate script' }, { status: 500 })
  }
}
