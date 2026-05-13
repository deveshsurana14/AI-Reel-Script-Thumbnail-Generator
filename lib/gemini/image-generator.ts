import { GoogleGenerativeAI } from '@google/generative-ai'

export async function generateThumbnailImage(prompt: string): Promise<string | null> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' } as any)

    const enhancedPrompt = `Create a high-quality, eye-catching social media thumbnail/poster. ${prompt}
    Style: Professional, vibrant colors, high contrast, visually stunning.
    Format: 16:9 aspect ratio, suitable for YouTube thumbnail or Instagram post.`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as any,
    })

    const response = result.response
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if ((part as any).inlineData) {
          const imageData = (part as any).inlineData
          return `data:${imageData.mimeType};base64,${imageData.data}`
        }
      }
    }

    return null
  } catch (error) {
    console.error('Image generation error:', error)
    return null
  }
}

export async function generateThumbnailWithImagen(prompt: string): Promise<string | null> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'imagen-4.0-generate-001' } as any)

    const enhancedPrompt = `Social media thumbnail: ${prompt}. High quality, vibrant, professional, eye-catching design.`

    const result = await (model as any).generateImages({
      prompt: enhancedPrompt,
      numberOfImages: 1,
      aspectRatio: '16:9',
    })

    if (result.images && result.images[0]) {
      const image = result.images[0]
      return `data:image/png;base64,${image.imageBytes}`
    }

    return null
  } catch (error) {
    console.error('Imagen generation error:', error)
    return null
  }
}
