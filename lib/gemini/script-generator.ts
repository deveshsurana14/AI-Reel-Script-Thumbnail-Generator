import { getTextModel } from './client'
import type { GenerateScriptInput, GeneratedScript, SceneStructure, TrendingTopic } from '@/types'

async function generateJSON<T>(prompt: string): Promise<T> {
  const model = getTextModel()
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/)
  const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
  return JSON.parse(jsonStr.trim())
}

export async function generateHook(input: GenerateScriptInput): Promise<string> {
  const model = getTextModel()
  const prompt = `You are an expert viral content creator. Generate ONE powerful, attention-grabbing hook for a ${input.platform} ${input.content_style} video about "${input.topic}" in the ${input.niche} niche.

The hook must:
- Be under 15 seconds when spoken
- Create immediate curiosity or emotional response
- Be specific to ${input.platform} audience
- Sound natural when spoken out loud

Return ONLY the hook text, nothing else.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateScript(input: GenerateScriptInput, hook: string): Promise<string> {
  const model = getTextModel()
  const duration = input.duration || '60'
  const prompt = `You are an expert ${input.platform} content creator. Write a compelling ${duration}-second ${input.content_style} script for a video about "${input.topic}" in the ${input.niche} niche.

Hook (already written): "${hook}"

Requirements:
- Continue naturally from the hook
- Optimize for ${input.platform} algorithm and audience retention
- Include natural pauses marked with [PAUSE]
- Include emphasis on key words marked with [EMPHASIS: word]
- Be conversational and authentic
- Target audience: ${input.target_audience || 'general audience'}
- Content style: ${input.content_style}
- Total duration: approximately ${duration} seconds

Write ONLY the script content (not the hook), no labels or explanations.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateSceneStructure(
  input: GenerateScriptInput,
  hook: string,
  script: string
): Promise<SceneStructure[]> {
  const prompt = `Break down this ${input.platform} video script into scenes with visual and audio directions.

Topic: ${input.topic}
Hook: ${hook}
Script: ${script}

Return a JSON array of scenes. Each scene must have:
{
  "scene": number,
  "duration": "Xs" (e.g., "5s", "10s"),
  "description": "What happens in this scene",
  "visuals": "Camera angle, setting, props, text overlays",
  "audio": "Music mood, sound effects, voiceover notes"
}

Return ONLY valid JSON array, no other text.`

  return generateJSON<SceneStructure[]>(prompt)
}

export async function generateCTA(input: GenerateScriptInput): Promise<string> {
  const model = getTextModel()
  const prompt = `Write a compelling call-to-action for a ${input.platform} video about "${input.topic}" in the ${input.niche} niche.

The CTA must:
- Be natural and not salesy
- Be specific to ${input.platform} (e.g., "follow for more", "save this", "subscribe")
- Be 1-2 sentences maximum
- Drive meaningful engagement

Return ONLY the CTA text.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateHashtagsAndCaptions(input: GenerateScriptInput, title: string): Promise<{ hashtags: string[], captions: string }> {
  const prompt = `Generate optimized hashtags and caption for a ${input.platform} video.

Title: ${title}
Topic: ${input.topic}
Niche: ${input.niche}
Platform: ${input.platform}

Return JSON:
{
  "hashtags": ["hashtag1", "hashtag2", ...] (15-20 hashtags without # symbol, mix of popular and niche),
  "captions": "Engaging caption for the post (2-3 sentences with emojis)"
}

Return ONLY valid JSON, no other text.`

  return generateJSON<{ hashtags: string[], captions: string }>(prompt)
}

export async function generateTitle(input: GenerateScriptInput, hook: string): Promise<string> {
  const model = getTextModel()
  const prompt = `Generate a compelling, SEO-optimized video title for ${input.platform}.

Topic: ${input.topic}
Niche: ${input.niche}
Style: ${input.content_style}
Hook: ${hook}

Requirements:
- Optimized for ${input.platform} search
- Creates curiosity or promises value
- Under 60 characters
- No clickbait, but compelling

Return ONLY the title text.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateViralScore(input: GenerateScriptInput, hook: string, script: string): Promise<{ score: number, reasoning: string }> {
  const prompt = `Analyze this content and predict its viral potential on ${input.platform}.

Topic: ${input.topic}
Niche: ${input.niche}
Style: ${input.content_style}
Hook: ${hook}
Script preview: ${script.substring(0, 200)}...

Score the viral potential from 0-100 based on:
- Hook strength (0-25 points)
- Topic relevance & trend alignment (0-25 points)
- Platform optimization (0-25 points)
- Audience engagement potential (0-25 points)

Return JSON:
{
  "score": number,
  "reasoning": "Brief 1-2 sentence explanation"
}

Return ONLY valid JSON.`

  return generateJSON<{ score: number, reasoning: string }>(prompt)
}

export async function generateThumbnailPrompt(input: GenerateScriptInput, title: string, hook: string): Promise<string> {
  const model = getTextModel()
  const prompt = `Create a detailed image generation prompt for a ${input.platform} thumbnail/poster.

Video Title: ${title}
Topic: ${input.topic}
Niche: ${input.niche}
Hook: ${hook}

The thumbnail prompt should describe:
- Main subject/person (if applicable)
- Background and setting
- Color scheme (vivid, eye-catching)
- Text overlay suggestions
- Lighting and mood
- Style (photorealistic, illustrated, etc.)

Optimize for ${input.platform} thumbnail best practices (high contrast, clear focal point, emotional appeal).

Return ONLY the image generation prompt (2-3 sentences), no explanations.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateTrendingTopics(niche: string, platform: string): Promise<TrendingTopic[]> {
  const prompt = `You are a social media trend analyst. Generate 6 trending topic ideas for ${platform} in the ${niche} niche that have high viral potential right now.

Return JSON array:
[
  {
    "topic": "Specific topic title",
    "niche": "${niche}",
    "estimated_views": "100K-500K",
    "why_trending": "Brief reason why this is trending"
  }
]

Return ONLY valid JSON array.`

  return generateJSON<TrendingTopic[]>(prompt)
}

export async function generateFullScript(input: GenerateScriptInput): Promise<GeneratedScript> {
  // Step 1: Generate hook
  const hook = await generateHook(input)

  // Step 2: Generate title
  const title = await generateTitle(input, hook)

  // Step 3: Generate full script (parallel with scene structure possible after)
  const script = await generateScript(input, hook)

  // Step 4: Generate scene structure
  const scene_structure = await generateSceneStructure(input, hook, script)

  // Step 5: Generate CTA + hashtags + captions + viral score + thumbnail prompt in parallel
  const [cta, hashtagsData, viralData, thumbnail_prompt] = await Promise.all([
    generateCTA(input),
    generateHashtagsAndCaptions(input, title),
    generateViralScore(input, hook, script),
    generateThumbnailPrompt(input, title, hook),
  ])

  return {
    title,
    hook,
    script,
    scene_structure,
    cta,
    hashtags: hashtagsData.hashtags,
    captions: hashtagsData.captions,
    viral_score: viralData.score,
    thumbnail_prompt,
  }
}
