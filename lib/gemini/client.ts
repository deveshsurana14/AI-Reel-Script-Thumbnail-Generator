import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

export function getGeminiClient() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }
  return genAI
}

export function getTextModel() {
  return getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-flash' })
}

export function getProModel() {
  return getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-pro' })
}
