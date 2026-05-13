'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScriptCard } from '@/components/scripts/script-card'
import { FileText, FolderOpen, TrendingUp, Zap, PlusCircle, ArrowRight, Sparkles } from 'lucide-react'
import type { Script, DashboardStats } from '@/types'
import { PLATFORM_LABELS, viralScoreColor, viralScoreLabel } from '@/lib/utils'

interface DashboardClientProps {
  stats: DashboardStats
  recentScripts: Script[]
  userName: string
}

export function DashboardClient({ stats, recentScripts, userName }: DashboardClientProps) {
  const statCards = [
    { label: 'Total Scripts', value: stats.total_scripts, icon: FileText, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Projects', value: stats.total_projects, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'This Week', value: stats.scripts_this_week, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg Viral Score', value: stats.avg_viral_score > 0 ? `${stats.avg_viral_score}` : '—', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, <span className="gradient-text">{userName}</span>
          </h1>
          <p className="text-white/40">Here&apos;s your content overview</p>
        </div>
        <Link href="/generate">
          <Button variant="gradient" size="lg" className="gap-2">
            <PlusCircle className="w-5 h-5" />
            New Script
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="hover:border-white/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-white/40">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/generate" className="group">
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-6 hover:border-violet-500/40 transition-all duration-300 cursor-pointer h-full">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Generate Script</h3>
            <p className="text-sm text-white/40">Create a new AI-powered viral script</p>
          </div>
        </Link>

        <Link href="/projects" className="group">
          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-6 hover:border-blue-500/40 transition-all duration-300 cursor-pointer h-full">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
              <FolderOpen className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Manage Projects</h3>
            <p className="text-sm text-white/40">Organize your scripts into folders</p>
          </div>
        </Link>

        <Link href="/scripts" className="group">
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-500/5 p-6 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer h-full">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">All Scripts</h3>
            <p className="text-sm text-white/40">Browse and manage your script library</p>
          </div>
        </Link>
      </div>

      {/* Recent Scripts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Scripts</h2>
          <Link href="/scripts">
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {recentScripts.length === 0 ? (
          <div className="rounded-2xl border border-white/5 border-dashed p-12 text-center">
            <Sparkles className="w-10 h-10 text-violet-400/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/50 mb-2">No scripts yet</h3>
            <p className="text-sm text-white/30 mb-6">Generate your first AI-powered script to get started</p>
            <Link href="/generate">
              <Button variant="gradient" size="sm">Generate First Script</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentScripts.map(script => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
