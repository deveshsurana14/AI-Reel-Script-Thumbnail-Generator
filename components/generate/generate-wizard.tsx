'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GeneratedScriptView } from './generated-script-view'
import { TrendingSuggestions } from './trending-suggestions'
import { toast } from '@/hooks/use-toast'
import {
  Loader2, Sparkles, Zap, Film, Hash, ImageIcon, TrendingUp,
  ChevronRight, Globe, Palette, Target, Clock, Lightbulb
} from 'lucide-react'
import type { GenerateScriptInput, GeneratedScript, Platform, ContentStyle } from '@/types'

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
]

const CONTENT_STYLES: { value: ContentStyle; label: string; desc: string }[] = [
  { value: 'educational', label: 'Educational', desc: 'Teach & inform' },
  { value: 'entertaining', label: 'Entertaining', desc: 'Fun & engaging' },
  { value: 'motivational', label: 'Motivational', desc: 'Inspire & uplift' },
  { value: 'storytelling', label: 'Storytelling', desc: 'Narrative-driven' },
  { value: 'tutorial', label: 'Tutorial', desc: 'Step-by-step guide' },
  { value: 'trending', label: 'Trending', desc: 'Viral formats' },
  { value: 'controversial', label: 'Controversial', desc: 'Hot takes' },
]

const NICHES = ['Technology', 'Fitness', 'Finance', 'Food', 'Travel', 'Fashion', 'Beauty', 'Business', 'Mental Health', 'Gaming', 'Music', 'Art', 'Relationships', 'Science', 'Sports', 'Entertainment', 'Education', 'DIY', 'Parenting', 'Pets']

type Step = 'input' | 'generating' | 'result'

interface GenerationProgress {
  step: string
  progress: number
}

const GENERATION_STEPS: GenerationProgress[] = [
  { step: 'Analyzing topic and niche...', progress: 10 },
  { step: 'Crafting viral hook...', progress: 25 },
  { step: 'Generating video title...', progress: 35 },
  { step: 'Writing full script...', progress: 55 },
  { step: 'Creating scene breakdown...', progress: 70 },
  { step: 'Generating hashtags & captions...', progress: 82 },
  { step: 'Calculating viral score...', progress: 90 },
  { step: 'Creating thumbnail prompt...', progress: 95 },
  { step: 'Finalizing content...', progress: 100 },
]

export function GenerateScriptWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('input')
  const [input, setInput] = useState<GenerateScriptInput>({
    topic: '',
    niche: '',
    platform: 'instagram',
    content_style: 'educational',
    target_audience: '',
    duration: '60',
  })
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null)
  const [savedScriptId, setSavedScriptId] = useState<string | null>(null)
  const [progressStep, setProgressStep] = useState(0)
  const [showTrending, setShowTrending] = useState(false)

  async function handleGenerate() {
    if (!input.topic.trim() || !input.niche) {
      toast({ title: 'Please fill in all required fields', variant: 'error' })
      return
    }

    setStep('generating')
    setProgressStep(0)

    const progressInterval = setInterval(() => {
      setProgressStep(prev => Math.min(prev + 1, GENERATION_STEPS.length - 1))
    }, 1800)

    try {
      const res = await fetch('/api/generate/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }

      const { data } = await res.json()
      setGeneratedScript(data)
      setProgressStep(GENERATION_STEPS.length - 1)

      // Auto-save to DB
      const saveRes = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          topic: input.topic,
          niche: input.niche,
          platform: input.platform,
          content_style: input.content_style,
          hook: data.hook,
          script: data.script,
          scene_structure: data.scene_structure,
          cta: data.cta,
          hashtags: data.hashtags,
          captions: data.captions,
          viral_score: data.viral_score,
          thumbnail_prompt: data.thumbnail_prompt,
          status: 'draft',
        }),
      })

      if (saveRes.ok) {
        const { data: saved } = await saveRes.json()
        setSavedScriptId(saved.id)
      }

      setTimeout(() => setStep('result'), 500)
    } catch (err: any) {
      clearInterval(progressInterval)
      toast({ title: err.message || 'Generation failed', variant: 'error' })
      setStep('input')
    }
  }

  function handleTopicSelect(topic: string, niche: string) {
    setInput(prev => ({ ...prev, topic, niche }))
    setShowTrending(false)
  }

  const currentProgress = GENERATION_STEPS[progressStep]

  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-violet-400" />
          </div>
        </div>

        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-xl font-semibold text-white">Generating Your Script</h2>
          <p className="text-violet-300 text-sm font-medium">{currentProgress?.step}</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs text-white/30 mb-2">
            <span>Progress</span>
            <span>{currentProgress?.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${currentProgress?.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm w-full">
          {[
            { icon: Zap, label: 'Viral Hook' },
            { icon: Film, label: 'Script' },
            { icon: TrendingUp, label: 'Viral Score' },
          ].map(({ icon: Icon, label }, i) => (
            <div key={label} className={`rounded-xl border p-3 text-center transition-all duration-500 ${progressStep > i * 2 ? 'border-violet-500/30 bg-violet-500/10' : 'border-white/5 bg-white/3'}`}>
              <Icon className={`w-4 h-4 mx-auto mb-1 ${progressStep > i * 2 ? 'text-violet-400' : 'text-white/20'}`} />
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (step === 'result' && generatedScript) {
    return (
      <GeneratedScriptView
        script={generatedScript}
        scriptId={savedScriptId}
        input={input}
        onRegenerate={() => { setStep('input'); setGeneratedScript(null) }}
      />
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" />
              Content Brief
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Topic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Topic *</Label>
                <button
                  onClick={() => setShowTrending(!showTrending)}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <Lightbulb className="w-3 h-3" />
                  Get trending ideas
                </button>
              </div>
              <Input
                placeholder="e.g., '5 morning habits that changed my life' or '3 money mistakes to avoid'"
                value={input.topic}
                onChange={e => setInput(prev => ({ ...prev, topic: e.target.value }))}
              />
            </div>

            {/* Niche */}
            <div className="space-y-2">
              <Label>Niche / Category *</Label>
              <Select value={input.niche} onValueChange={v => setInput(prev => ({ ...prev, niche: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your niche..." />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Platform</Label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setInput(prev => ({ ...prev, platform: value }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      input.platform === value
                        ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                        : 'border-white/10 bg-white/3 text-white/50 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span>{icon}</span>
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Style */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Palette className="w-3.5 h-3.5" /> Content Style</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_STYLES.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setInput(prev => ({ ...prev, content_style: value }))}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      input.content_style === value
                        ? 'border-violet-500/50 bg-violet-500/15'
                        : 'border-white/10 bg-white/3 hover:border-white/20'
                    }`}
                  >
                    <p className={`text-sm font-medium ${input.content_style === value ? 'text-violet-300' : 'text-white/70'}`}>{label}</p>
                    <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duration (seconds)</Label>
                <Select value={input.duration} onValueChange={v => setInput(prev => ({ ...prev, duration: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30s (Short)</SelectItem>
                    <SelectItem value="60">60s (Standard)</SelectItem>
                    <SelectItem value="90">90s (Medium)</SelectItem>
                    <SelectItem value="180">3 min (Long)</SelectItem>
                    <SelectItem value="600">10 min (Deep dive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input
                  placeholder="e.g., entrepreneurs 25-35"
                  value={input.target_audience}
                  onChange={e => setInput(prev => ({ ...prev, target_audience: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleGenerate}
          variant="gradient"
          size="xl"
          className="w-full gap-2"
          disabled={!input.topic.trim() || !input.niche}
        >
          <Sparkles className="w-5 h-5" />
          Generate Script with AI
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {showTrending && (
          <TrendingSuggestions
            platform={input.platform}
            onSelect={handleTopicSelect}
            onClose={() => setShowTrending(false)}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              What AI Will Generate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { icon: Zap, label: 'Viral Hook', desc: 'Attention-grabbing opener' },
              { icon: Film, label: 'Full Script', desc: 'Complete spoken content' },
              { icon: Target, label: 'Scene Breakdown', desc: 'Visual & audio directions' },
              { icon: Hash, label: 'Hashtags & Caption', desc: '15-20 optimized tags' },
              { icon: TrendingUp, label: 'Viral Score', desc: 'Predicted reach (0-100)' },
              { icon: ImageIcon, label: 'Thumbnail Prompt', desc: 'AI image generation ready' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-white/30">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-white/30 leading-relaxed">
              <span className="text-violet-400 font-medium">Pro tip:</span> Be specific with your topic. Instead of &quot;fitness tips&quot;, try &quot;3 beginner gym mistakes that prevent muscle growth&quot;. Specific topics generate more focused, viral content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
