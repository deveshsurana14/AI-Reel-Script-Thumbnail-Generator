import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReelForge AI — Script & Thumbnail Generator',
  description: 'AI-powered platform to generate viral reel scripts, hooks, and thumbnails for content creators',
  keywords: ['AI content creator', 'reel script generator', 'viral hooks', 'thumbnail generator', 'Gemini AI'],
  openGraph: {
    title: 'ReelForge AI',
    description: 'Generate viral scripts and thumbnails with AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0f] text-white">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
