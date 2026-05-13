'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, Loader2, X, ArrowRight } from 'lucide-react'
import type { TrendingTopic, Platform } from '@/types'
import { PLATFORM_LABELS } from '@/lib/utils'

const NICHES = ['Technology', 'Fitness', 'Finance', 'Food', 'Travel', 'Fashion', 'Beauty', 'Business', 'Mental Health', 'Gaming']

interface TrendingSuggestionsProps {
  platform: Platform
  onSelect: (topic: string, niche: string) => void
  onClose: () => void
}

export function TrendingSuggestions({ platform, onSelect, onClose }: TrendingSuggestionsProps) {
  const [niche, setNiche] = useState('Technology')
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchTrending() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platform }),
      })
      const { data } = await res.json()
      setTopics(data || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-violet-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            Trending Ideas
          </CardTitle>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={fetchTrending} disabled={loading} size="sm" variant="outline" className="shrink-0">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Fetch'}
          </Button>
        </div>

        {topics.length === 0 && !loading && (
          <p className="text-xs text-white/30 text-center py-4">Click &quot;Fetch&quot; to get trending ideas for {PLATFORM_LABELS[platform]}</p>
        )}

        <div className="space-y-2">
          {topics.map((topic, i) => (
            <button
              key={i}
              onClick={() => onSelect(topic.topic, topic.niche)}
              className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/3 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors leading-tight">{topic.topic}</p>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 shrink-0 mt-0.5 transition-colors" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-emerald-400">{topic.estimated_views} est. views</span>
              </div>
              <p className="text-xs text-white/30 mt-1">{topic.why_trending}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
