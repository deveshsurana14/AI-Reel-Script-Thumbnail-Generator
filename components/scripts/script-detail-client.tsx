'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThumbnailGenerator } from '@/components/generate/thumbnail-generator'
import { toast } from '@/hooks/use-toast'
import { timeAgo, PLATFORM_LABELS, CONTENT_STYLE_LABELS, viralScoreColor } from '@/lib/utils'
import {
  ArrowLeft, Save, Copy, Trash2, Check, Loader2, Edit2, Film,
  Hash, ImageIcon, TrendingUp, Clapperboard, Zap, MessageSquare, FolderOpen
} from 'lucide-react'
import type { Script, Project } from '@/types'

interface ScriptDetailClientProps {
  script: Script
  projects: Pick<Project, 'id' | 'name' | 'color'>[]
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export function ScriptDetailClient({ script: initialScript, projects }: ScriptDetailClientProps) {
  const router = useRouter()
  const [script, setScript] = useState(initialScript)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editedFields, setEditedFields] = useState({
    title: initialScript.title,
    hook: initialScript.hook || '',
    script: initialScript.script || '',
    cta: initialScript.cta || '',
    captions: initialScript.captions || '',
    status: initialScript.status,
    project_id: initialScript.project_id || '',
  })

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/scripts/${script.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedFields,
          project_id: editedFields.project_id || null,
        }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setScript(data)
      setEditing(false)
      toast({ title: 'Script saved', variant: 'success' })
    } catch {
      toast({ title: 'Failed to save', variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this script? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/scripts/${script.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Script deleted', variant: 'success' })
      router.push('/scripts')
    } catch {
      toast({ title: 'Failed to delete', variant: 'error' })
      setDeleting(false)
    }
  }

  async function handleDuplicate() {
    try {
      const res = await fetch(`/api/scripts/${script.id}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      toast({ title: 'Script duplicated', variant: 'success' })
      router.push(`/scripts/${data.id}`)
    } catch {
      toast({ title: 'Failed to duplicate', variant: 'error' })
    }
  }

  async function updateStatus(status: string) {
    try {
      const res = await fetch(`/api/scripts/${script.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setScript(prev => ({ ...prev, status: status as any }))
      setEditedFields(prev => ({ ...prev, status: status as any }))
      toast({ title: `Status updated to ${status}`, variant: 'success' })
    } catch {
      toast({ title: 'Failed to update status', variant: 'error' })
    }
  }

  const scoreColor = viralScoreColor(script.viral_score || 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/scripts">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Scripts
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {editing ? (
            <Input
              value={editedFields.title}
              onChange={e => setEditedFields(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-bold h-auto py-2 text-white bg-transparent border-white/20"
            />
          ) : (
            <h1 className="text-2xl font-bold text-white leading-tight">{script.title}</h1>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap text-sm text-white/40">
            <span>{PLATFORM_LABELS[script.platform]}</span>
            <span>·</span>
            <span>{script.niche}</span>
            <span>·</span>
            <span>{CONTENT_STYLE_LABELS[script.content_style]}</span>
            <span>·</span>
            <span>{timeAgo(script.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {editing ? (
            <>
              <Button onClick={() => { setEditing(false); setEditedFields({ title: script.title, hook: script.hook || '', script: script.script || '', cta: script.cta || '', captions: script.captions || '', status: script.status, project_id: script.project_id || '' }) }} variant="ghost" size="sm">Cancel</Button>
              <Button onClick={handleSave} variant="gradient" size="sm" disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </Button>
            </>
          ) : (
            <>
              <Select value={script.status} onValueChange={updateStatus}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleDuplicate} variant="outline" size="sm" className="gap-1.5">
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </Button>
              <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="gap-1.5">
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Button>
              <Button onClick={handleDelete} variant="destructive" size="sm" disabled={deleting} className="gap-1.5">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Viral Score + Project */}
      <div className="grid grid-cols-2 gap-4">
        {script.viral_score && (
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`text-3xl font-bold ${scoreColor}`}>{script.viral_score}</div>
              <div>
                <div className="text-sm font-medium text-white">Viral Score</div>
                <div className="h-1.5 w-24 rounded-full bg-white/5 mt-1 overflow-hidden">
                  <div className={`h-full rounded-full ${script.viral_score >= 80 ? 'bg-emerald-500' : script.viral_score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`} style={{ width: `${script.viral_score}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen className="w-4 h-4 text-white/30" />
              <span className="text-sm text-white/50">Project</span>
            </div>
            {editing ? (
              <Select value={editedFields.project_id || 'none'} onValueChange={v => setEditedFields(prev => ({ ...prev, project_id: v === 'none' ? '' : v }))}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <span className="font-medium text-white text-sm">
                {script.project ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: script.project.color }} />
                    {script.project.name}
                  </span>
                ) : 'No project'}
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="script">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="script" className="gap-1.5 text-xs"><Film className="w-3.5 h-3.5" />Script</TabsTrigger>
          <TabsTrigger value="scenes" className="gap-1.5 text-xs"><Clapperboard className="w-3.5 h-3.5" />Scenes</TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5 text-xs"><Hash className="w-3.5 h-3.5" />Social</TabsTrigger>
          <TabsTrigger value="thumbnail" className="gap-1.5 text-xs"><ImageIcon className="w-3.5 h-3.5" />Thumbnail</TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-4">
          {/* Hook */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Viral Hook</CardTitle>
                <CopyButton text={script.hook || ''} />
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea value={editedFields.hook} onChange={e => setEditedFields(p => ({ ...p, hook: e.target.value }))} className="min-h-[80px]" />
              ) : (
                <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4">
                  <p className="text-white leading-relaxed">"{script.hook}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Script */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Film className="w-4 h-4 text-violet-400" />Full Script</CardTitle>
                <CopyButton text={script.script || ''} />
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea value={editedFields.script} onChange={e => setEditedFields(p => ({ ...p, script: e.target.value }))} className="min-h-[250px]" />
              ) : (
                <div className="rounded-xl bg-white/3 border border-white/8 p-4 max-h-96 overflow-y-auto">
                  <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{script.script}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-400" />Call to Action</CardTitle>
                <CopyButton text={script.cta || ''} />
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea value={editedFields.cta} onChange={e => setEditedFields(p => ({ ...p, cta: e.target.value }))} className="min-h-[60px]" />
              ) : (
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
                  <p className="text-white/80">{script.cta}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenes" className="space-y-3">
          {script.scene_structure?.map((scene) => (
            <Card key={scene.scene}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">{scene.scene}</div>
                  <div>
                    <p className="font-medium text-white text-sm">{scene.description}</p>
                    <p className="text-xs text-white/30">{scene.duration}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/3 border border-white/5 p-3">
                    <p className="text-xs font-medium text-violet-400 mb-1">Visuals</p>
                    <p className="text-xs text-white/60">{scene.visuals}</p>
                  </div>
                  <div className="rounded-lg bg-white/3 border border-white/5 p-3">
                    <p className="text-xs font-medium text-blue-400 mb-1">Audio</p>
                    <p className="text-xs text-white/60">{scene.audio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Caption</CardTitle>
                <CopyButton text={script.captions || ''} />
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea value={editedFields.captions} onChange={e => setEditedFields(p => ({ ...p, captions: e.target.value }))} className="min-h-[100px]" />
              ) : (
                <div className="rounded-xl bg-white/3 border border-white/8 p-4">
                  <p className="text-white/80 text-sm leading-relaxed">{script.captions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {script.hashtags && script.hashtags.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Hashtags ({script.hashtags.length})</CardTitle>
                  <CopyButton text={script.hashtags.map(h => `#${h}`).join(' ')} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {script.hashtags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-sm border border-violet-500/30 bg-violet-500/10 text-violet-300">#{tag}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="thumbnail">
          {script.thumbnail_url ? (
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src={script.thumbnail_url} alt="Thumbnail" className="w-full object-cover" />
                </div>
                <ThumbnailGenerator prompt={script.thumbnail_prompt || ''} scriptId={script.id} />
              </CardContent>
            </Card>
          ) : (
            <ThumbnailGenerator prompt={script.thumbnail_prompt || ''} scriptId={script.id} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
