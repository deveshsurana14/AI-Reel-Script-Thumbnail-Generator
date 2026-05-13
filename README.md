# ReelForge AI — Reel Script & Thumbnail Generator

An AI-powered platform for content creators to generate viral reel scripts, hooks, scene breakdowns, hashtags, captions, and AI thumbnails using Google Gemini.

## Features

- **AI Script Generation** — Multi-step Gemini pipeline: hook → title → script → scenes → CTA → hashtags → viral score → thumbnail prompt
- **Viral Score Prediction** — AI predicts content reach potential (0-100)  
- **AI Thumbnail Generator** — Gemini image generation for eye-catching thumbnails
- **Trending Topics** — AI-suggested viral topic ideas per niche/platform
- **Script Management** — Save, edit, duplicate, organize into projects/folders
- **Multi-Platform** — Instagram, YouTube, TikTok, LinkedIn, Twitter/X, Facebook
- **Authentication** — Supabase Auth with Row Level Security

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes  
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **AI**: Google Gemini 1.5 Flash (text) + Gemini 2.0 Flash (images)
- **Deployment**: Vercel

## Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env.local` and add your keys:
- **Supabase**: [supabase.com](https://supabase.com) → Settings → API
- **Gemini**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 3. Database
Run `supabase/schema.sql` in your Supabase SQL Editor.

### 4. Run locally
```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## AI Pipeline Architecture

Script generation uses **8 separate AI steps** (not one huge prompt):

1. Generate viral hook
2. Generate video title  
3. Generate full script
4. Generate scene structure
5-8. CTA + hashtags + viral score + thumbnail prompt (parallel)

This multi-step approach produces significantly better quality output than a single mega-prompt.

## Project Structure

```
app/(auth)/          — Login & signup pages
app/(dashboard)/     — Dashboard, generate, scripts, projects
app/api/             — API routes for AI generation and CRUD
components/          — UI components, generate wizard, script views
lib/gemini/          — Multi-step AI generation pipeline
lib/supabase/        — Client/server/middleware helpers
supabase/schema.sql  — Database schema with RLS policies
```
