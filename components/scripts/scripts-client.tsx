'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScriptCard } from './script-card'
import { PlusCircle, Search, SlidersHorizontal, FileText } from 'lucide-react'
import type { Script, Project } from '@/types'
import { PLATFORM_LABELS } from '@/lib/utils'

interface ScriptsClientProps {
  initialScripts: Script[]
  projects: Pick<Project, 'id' | 'name' | 'color'>[]
}

export function ScriptsClient({ initialScripts, projects }: ScriptsClientProps) {
  const [scripts, setScripts] = useState<Script[]>(initialScripts)
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = useMemo(() => {
    let result = scripts

    if (search) result = result.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.topic.toLowerCase().includes(search.toLowerCase()))
    if (platformFilter !== 'all') result = result.filter(s => s.platform === platformFilter)
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter)
    if (projectFilter === 'none') result = result.filter(s => !s.project_id)
    else if (projectFilter !== 'all') result = result.filter(s => s.project_id === projectFilter)

    return result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'viral') return (b.viral_score || 0) - (a.viral_score || 0)
      return a.title.localeCompare(b.title)
    })
  }, [scripts, search, platformFilter, statusFilter, projectFilter, sortBy])

  function handleDelete(id: string) {
    setScripts(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Scripts</h1>
          <p className="text-white/40">{scripts.length} script{scripts.length !== 1 ? 's' : ''} in your library</p>
        </div>
        <Link href="/generate">
          <Button variant="gradient" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            New Script
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input placeholder="Search scripts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {Object.entries(PLATFORM_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {projects.length > 0 && (
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="none">No Project</SelectItem>
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="viral">Viral Score</SelectItem>
            <SelectItem value="title">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scripts Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 border-dashed p-16 text-center">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          {scripts.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-white/50 mb-2">No scripts yet</h3>
              <p className="text-sm text-white/30 mb-6">Generate your first AI script to get started</p>
              <Link href="/generate">
                <Button variant="gradient" size="sm">Generate Script</Button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-white/50 mb-2">No results</h3>
              <p className="text-sm text-white/30">Try adjusting your filters</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(script => (
            <ScriptCard key={script.id} script={script} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
