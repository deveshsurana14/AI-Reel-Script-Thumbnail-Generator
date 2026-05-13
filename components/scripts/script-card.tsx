'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Copy, Trash2, Edit, TrendingUp, Hash, ImageIcon } from 'lucide-react'
import { timeAgo, PLATFORM_LABELS, viralScoreColor } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import type { Script } from '@/types'

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  youtube: '▶️',
  tiktok: '🎵',
  linkedin: '💼',
  twitter: '🐦',
  facebook: '👥',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'secondary',
  published: 'success',
  archived: 'outline',
}

interface ScriptCardProps {
  script: Script
  onDelete?: (id: string) => void
}

export function ScriptCard({ script, onDelete }: ScriptCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  async function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDuplicating(true)
    try {
      const res = await fetch(`/api/scripts/${script.id}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error()
      toast({ title: 'Script duplicated', variant: 'success' })
      router.refresh()
    } catch {
      toast({ title: 'Failed to duplicate script', variant: 'error' })
    } finally {
      setDuplicating(false)
      setShowMenu(false)
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this script?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/scripts/${script.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Script deleted', variant: 'success' })
      onDelete?.(script.id)
      router.refresh()
    } catch {
      toast({ title: 'Failed to delete script', variant: 'error' })
    } finally {
      setDeleting(false)
      setShowMenu(false)
    }
  }

  return (
    <Link href={`/scripts/${script.id}`}>
      <Card className="group hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 cursor-pointer relative">
        {script.thumbnail_url && (
          <div className="relative w-full h-32 overflow-hidden rounded-t-2xl">
            <img src={script.thumbnail_url} alt={script.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <CardContent className="p-5">
          {/* Platform & Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{PLATFORM_ICONS[script.platform] || '📱'}</span>
              <span className="text-xs text-white/40">{PLATFORM_LABELS[script.platform]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={STATUS_COLORS[script.status] as any} className="text-[10px]">
                {script.status}
              </Badge>
              <div className="relative">
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 z-50 w-40 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl py-1">
                    <button
                      onClick={handleDuplicate}
                      disabled={duplicating}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {duplicating ? 'Duplicating...' : 'Duplicate'}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-white mb-1 line-clamp-2 leading-tight">{script.title}</h3>
          <p className="text-xs text-white/30 mb-3">{script.niche} · {timeAgo(script.created_at)}</p>

          {/* Hook preview */}
          {script.hook && (
            <p className="text-xs text-white/40 line-clamp-2 mb-3 italic">"{script.hook}"</p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 text-xs text-white/30">
            {script.viral_score && (
              <span className={`flex items-center gap-1 font-medium ${viralScoreColor(script.viral_score)}`}>
                <TrendingUp className="w-3 h-3" />
                {script.viral_score}
              </span>
            )}
            {script.hashtags && script.hashtags.length > 0 && (
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {script.hashtags.length}
              </span>
            )}
            {script.thumbnail_url && (
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Thumbnail
              </span>
            )}
            {script.project && (
              <span className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: script.project.color }} />
                {script.project.name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
