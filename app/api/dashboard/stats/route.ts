import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const [scriptsResult, projectsResult, weeklyResult, avgScoreResult] = await Promise.all([
      supabase.from('scripts').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('projects').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('scripts').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', oneWeekAgo.toISOString()),
      supabase.from('scripts').select('viral_score').eq('user_id', user.id).not('viral_score', 'is', null),
    ])

    const scores = avgScoreResult.data?.map(s => s.viral_score).filter(Boolean) || []
    const avgViralScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

    return NextResponse.json({
      data: {
        total_scripts: scriptsResult.count || 0,
        total_projects: projectsResult.count || 0,
        scripts_this_week: weeklyResult.count || 0,
        avg_viral_score: avgViralScore,
      }
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
