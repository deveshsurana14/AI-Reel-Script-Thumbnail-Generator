'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageIcon, Loader2, Download, RefreshCw, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ThumbnailGeneratorProps {
  prompt: string
  scriptId: string | null
  onGenerated?: (url: string) => void
}

export function ThumbnailGenerator({ prompt: initialPrompt, scriptId, onGenerated }: ThumbnailGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt || '')
  const [imageData, setImageData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function generateThumbnail() {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/generate/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, scriptId }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }

      const { data } = await res.json()
      setImageData(data.imageData)
      onGenerated?.(data.imageData)
      toast({ title: 'Thumbnail generated!', variant: 'success' })
    } catch (err: any) {
      toast({ title: err.message || 'Failed to generate thumbnail', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  function downloadImage() {
    if (!imageData) return
    const a = document.createElement('a')
    a.href = imageData
    a.download = 'thumbnail.png'
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-violet-400" />
          AI Thumbnail Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/50">Image Prompt (auto-generated, customizable)</label>
          <Textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your thumbnail..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={generateThumbnail}
          variant="gradient"
          className="w-full gap-2"
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating thumbnail...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Thumbnail
            </>
          )}
        </Button>

        {loading && (
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-violet-300">Gemini is creating your thumbnail...</p>
            <p className="text-xs text-white/30 mt-1">This may take 10-30 seconds</p>
          </div>
        )}

        {imageData && !loading && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-white/10">
              <img src={imageData} alt="Generated thumbnail" className="w-full object-cover" />
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadImage} variant="outline" className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button onClick={generateThumbnail} variant="secondary" className="gap-2" disabled={loading}>
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {!imageData && !loading && (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
            <ImageIcon className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">Your AI-generated thumbnail will appear here</p>
            <p className="text-xs text-white/20 mt-1">Uses Google Gemini image generation</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
