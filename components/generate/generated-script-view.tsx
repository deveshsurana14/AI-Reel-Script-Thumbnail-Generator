'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThumbnailGenerator } from './thumbnail-generator'
import { toast } from '@/hooks/use-toast'
import { viralScoreColor, viralScoreLabel, PLATFORM_LABELS } from '@/lib/utils'
import {
  Copy, Check, RefreshCw, Eye, Zap, Film, Hash, ImageIcon,
  TrendingUp, Clapperboard, MessageSquare, CheckCircle2, ExternalLink
} from 'lucide-react'
import type { GeneratedScript, GenerateScriptInput } from '@/types'

interface GeneratedScriptViewProps {
  script: GeneratedScript
  scriptId: string | null
  input: GenerateScriptInput
  onRegenerate: () => void
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

export function GeneratedScriptView({ script, scriptId, input, onRegenerate }: GeneratedScriptViewProps) {
  const router = useRouter()
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  const scoreColor = viralScoreColor(script.viral_score)
  const scoreLabel = viralScoreLabel(script.viral_score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Generated</Badge>
            <Badge variant="secondary">{PLATFORM_LABELS[input.platform]}</Badge>
            <Badge variant="secondary">{input.niche}</Badge>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight">{script.title}</h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={onRegenerate} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </Button>
          {scriptId && (
            <Button onClick={() => router.push(`/scripts/${scriptId}`)} variant="gradient" size="sm" className="gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              View & Edit
            </Button>
          )}
        </div>
      </div>

      {/* Viral Score */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-center gap-6">
        <div className="text-center">
          <div className={`text-4xl font-bold ${scoreColor}`}>{script.viral_score}</div>
          <div className="text-xs text-white/40 mt-1">Viral Score</div>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 ${scoreColor}`} />
            <span className={`font-semibold ${scoreColor}`}>{scoreLabel}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${script.viral_score >= 80 ? 'bg-emerald-500' : script.viral_score >= 60 ? 'bg-yellow-500' : script.viral_score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
              style={{ width: `${script.viral_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="script">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="script" className="gap-1.5 text-xs"><Film className="w-3.5 h-3.5" />Script</TabsTrigger>
          <TabsTrigger value="scenes" className="gap-1.5 text-xs"><Clapperboard className="w-3.5 h-3.5" />Scenes</TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5 text-xs"><Hash className="w-3.5 h-3.5" />Social</TabsTrigger>
          <TabsTrigger value="thumbnail" className="gap-1.5 text-xs"><ImageIcon className="w-3.5 h-3.5" />Thumbnail</TabsTrigger>
        </TabsList>

        {/* Script Tab */}
        <TabsContent value="script" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Viral Hook
                </CardTitle>
                <CopyButton text={script.hook} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4">
                <p className="text-white leading-relaxed font-medium">"{script.hook}"</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Film className="w-4 h-4 text-violet-400" />
                  Full Script
                </CardTitle>
                <CopyButton text={script.script} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-white/3 border border-white/8 p-4 max-h-96 overflow-y-auto">
                <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">{script.script}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  Call to Action
                </CardTitle>
                <CopyButton text={script.cta} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
                <p className="text-white/80">{script.cta}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenes Tab */}
        <TabsContent value="scenes" className="space-y-3">
          {script.scene_structure?.map((scene) => (
            <Card key={scene.scene}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">
                    {scene.scene}
                  </div>
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

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Caption</CardTitle>
                <CopyButton text={script.captions} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-white/3 border border-white/8 p-4">
                <p className="text-white/80 text-sm leading-relaxed">{script.captions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Hashtags ({script.hashtags?.length})</CardTitle>
                <CopyButton text={script.hashtags?.map(h => `#${h}`).join(' ') || ''} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {script.hashtags?.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-sm border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thumbnail Tab */}
        <TabsContent value="thumbnail">
          <ThumbnailGenerator
            prompt={script.thumbnail_prompt}
            scriptId={scriptId}
            onGenerated={setThumbnail}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
