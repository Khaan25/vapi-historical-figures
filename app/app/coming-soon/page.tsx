import { Metadata } from 'next'

import { defaultMetadata } from '@/config/metadata'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Coming Soon',
  description: 'Coming Soon',
}

export default function ComingSoonPage() {
  return (
    <div className="@container/main container mx-auto p-6 space-y-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Coming Soon: Voice Customization</h1>
        <p className="text-lg text-muted-foreground mb-6">We&apos;re working on an exciting new feature that will let you customize voices for each historical figure.</p>
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Planned Features:</h2>
          <ul className="text-left space-y-3">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Unique voice selection for each historical figure</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Adjustable speaking styles (casual to formal)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Tone customization (serious to conversational)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Period-appropriate speech patterns</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Add an option to upload custom voices</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
