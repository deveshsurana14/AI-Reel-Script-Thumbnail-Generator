import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(dateString)
}

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'from-pink-500 to-purple-600',
  youtube: 'from-red-500 to-red-700',
  tiktok: 'from-gray-900 to-gray-700',
  linkedin: 'from-blue-600 to-blue-800',
  twitter: 'from-sky-400 to-sky-600',
  facebook: 'from-blue-500 to-blue-700',
}

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  facebook: 'Facebook',
}

export const CONTENT_STYLE_LABELS: Record<string, string> = {
  educational: 'Educational',
  entertaining: 'Entertaining',
  motivational: 'Motivational',
  storytelling: 'Storytelling',
  tutorial: 'Tutorial',
  trending: 'Trending',
  controversial: 'Controversial',
}

export function viralScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

export function viralScoreLabel(score: number): string {
  if (score >= 80) return 'Viral Potential'
  if (score >= 60) return 'High Reach'
  if (score >= 40) return 'Moderate'
  return 'Low Reach'
}
