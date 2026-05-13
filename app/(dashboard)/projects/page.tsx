import { createClient } from '@/lib/supabase/server'
import { ProjectsClient } from '@/components/dashboard/projects-client'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, scripts(count)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return <ProjectsClient initialProjects={projects || []} />
}
