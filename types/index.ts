export type Platform = 'instagram' | 'youtube' | 'tiktok' | 'linkedin' | 'twitter' | 'facebook'
export type ContentStyle = 'educational' | 'entertaining' | 'motivational' | 'storytelling' | 'tutorial' | 'trending' | 'controversial'
export type ScriptStatus = 'draft' | 'published' | 'archived'

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
  scripts?: Script[]
  _count?: { scripts: number }
}

export interface SceneStructure {
  scene: number
  duration: string
  description: string
  visuals: string
  audio: string
}

export interface Script {
  id: string
  user_id: string
  project_id: string | null
  title: string
  topic: string
  niche: string
  platform: Platform
  content_style: ContentStyle
  hook: string | null
  script: string | null
  scene_structure: SceneStructure[] | null
  cta: string | null
  hashtags: string[] | null
  captions: string | null
  viral_score: number | null
  thumbnail_url: string | null
  thumbnail_prompt: string | null
  status: ScriptStatus
  created_at: string
  updated_at: string
  project?: Project | null
}

export interface GenerateScriptInput {
  topic: string
  niche: string
  platform: Platform
  content_style: ContentStyle
  target_audience?: string
  duration?: string
}

export interface GeneratedScript {
  title: string
  hook: string
  script: string
  scene_structure: SceneStructure[]
  cta: string
  hashtags: string[]
  captions: string
  viral_score: number
  thumbnail_prompt: string
}

export interface TrendingTopic {
  topic: string
  niche: string
  estimated_views: string
  why_trending: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface DashboardStats {
  total_scripts: number
  total_projects: number
  avg_viral_score: number
  scripts_this_week: number
}
