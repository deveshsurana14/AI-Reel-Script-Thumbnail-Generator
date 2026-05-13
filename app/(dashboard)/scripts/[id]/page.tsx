import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ScriptDetailClient } from '@/components/scripts/script-detail-client'

export default async function ScriptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [scriptResult, projectsResult] = await Promise.all([
    supabase.from('scripts').select('*, project:projects(id, name, color)').eq('id', id).eq('user_id', user!.id).single(),
    supabase.from('projects').select('id, name, color').eq('user_id', user!.id).order('name'),
  ])

  if (scriptResult.error || !scriptResult.data) notFound()

  return (
    <ScriptDetailClient
      script={scriptResult.data}
      projects={projectsResult.data || []}
    />
  )
}
