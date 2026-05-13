import { createClient } from '@/lib/supabase/server'
import { ScriptsClient } from '@/components/scripts/scripts-client'

export default async function ScriptsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [scriptsResult, projectsResult] = await Promise.all([
    supabase.from('scripts').select('*, project:projects(id, name, color)').eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('projects').select('id, name, color').eq('user_id', user!.id).order('name'),
  ])

  return (
    <ScriptsClient
      initialScripts={scriptsResult.data || []}
      projects={projectsResult.data || []}
    />
  )
}
