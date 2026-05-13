'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { FolderOpen, Plus, FileText, Trash2, Edit2, Loader2, ArrowRight } from 'lucide-react'
import type { Project } from '@/types'

const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'
]

interface ProjectsClientProps {
  initialProjects: (Project & { scripts: { count: number }[] })[]
}

function ProjectForm({ onSuccess, existing }: { onSuccess: (project: Project) => void; existing?: Project }) {
  const [name, setName] = useState(existing?.name || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [color, setColor] = useState(existing?.color || PROJECT_COLORS[0])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const url = existing ? `/api/projects/${existing.id}` : '/api/projects'
      const method = existing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, color }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      onSuccess(data)
      toast({ title: existing ? 'Project updated' : 'Project created', variant: 'success' })
    } catch {
      toast({ title: 'Failed to save project', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Project Name</Label>
        <Input placeholder="e.g., Q1 Campaign" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Input placeholder="Brief description..." value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2 flex-wrap">
          {PROJECT_COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <Button type="submit" variant="gradient" className="w-full" disabled={loading || !name.trim()}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : existing ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  )
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  function handleCreated(project: Project) {
    setProjects(prev => [{ ...project, scripts: [{ count: 0 }] } as any, ...prev])
    setCreateOpen(false)
  }

  function handleUpdated(project: Project) {
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, ...project } as any : p))
    setEditingProject(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project? Scripts will not be deleted.')) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setProjects(prev => prev.filter(p => p.id !== id))
      toast({ title: 'Project deleted', variant: 'success' })
    } catch {
      toast({ title: 'Failed to delete project', variant: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Projects</h1>
          <p className="text-white/40">Organize your scripts into folders</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSuccess={handleCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/5 border-dashed p-16 text-center">
          <FolderOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/50 mb-2">No projects yet</h3>
          <p className="text-sm text-white/30 mb-6">Create a project to organize your scripts</p>
          <Button variant="gradient" size="sm" onClick={() => setCreateOpen(true)}>Create Project</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const scriptCount = project.scripts?.[0]?.count || 0
            return (
              <Card key={project.id} className="group hover:border-white/20 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}>
                      <FolderOpen className="w-6 h-6" style={{ color: project.color }} />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog open={editingProject?.id === project.id} onOpenChange={open => !open && setEditingProject(null)}>
                        <DialogTrigger asChild>
                          <button onClick={() => setEditingProject(project)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
                          <ProjectForm onSuccess={handleUpdated} existing={project} />
                        </DialogContent>
                      </Dialog>
                      <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                  {project.description && <p className="text-sm text-white/40 mb-3 line-clamp-2">{project.description}</p>}

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1 text-sm text-white/30">
                      <FileText className="w-3.5 h-3.5" />
                      {scriptCount} script{scriptCount !== 1 ? 's' : ''}
                    </div>
                    <Link
                      href={`/scripts?project_id=${project.id}`}
                      className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit dialog rendered outside to avoid nesting issues */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={open => !open && setEditingProject(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
            <ProjectForm onSuccess={handleUpdated} existing={editingProject} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
