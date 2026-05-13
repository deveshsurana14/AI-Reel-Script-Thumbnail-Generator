import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [scriptsResult, projectsResult, recentResult] = await Promise.all([
    supabase.from('scripts').select('id', { count: 'exact' }).eq('user_id', user!.id),
    supabase.from('projects').select('id', { count: 'exact' }).eq('user_id', user!.id),
    supabase.from('scripts').select('*, project:projects(name, color)').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(6),
  ])

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const weeklyResult = await supabase.from('scripts').select('id', { count: 'exact' }).eq('user_id', user!.id).gte('created_at', oneWeekAgo.toISOString())

  const scoresResult = await supabase.from('scripts').select('viral_score').eq('user_id', user!.id).not('viral_score', 'is', null)
  const scores = scoresResult.data?.map(s => s.viral_score).filter(Boolean) || []
  const avgViralScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0

  const stats = {
    total_scripts: scriptsResult.count || 0,
    total_projects: projectsResult.count || 0,
    scripts_this_week: weeklyResult.count || 0,
    avg_viral_score: avgViralScore,
  }

  return (
    <DashboardClient
      stats={stats}
      recentScripts={recentResult.data || []}
      userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Creator'}
    />
  )
}
