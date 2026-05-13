import { GenerateScriptWizard } from '@/components/generate/generate-wizard'

export default function GeneratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Generate Script</h1>
        <p className="text-white/40">AI-powered multi-step script generation with viral hooks, scenes, and thumbnails</p>
      </div>
      <GenerateScriptWizard />
    </div>
  )
}
