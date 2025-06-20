import { Metadata } from 'next'

import { defaultMetadata } from '@/config/metadata'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Coming Soon',
  description: 'Coming Soon',
}

const features = [
  'Adjustable speaking style (casual to formal)',
  'Tone customization (serious to conversational)',
  'Automate the process of adding historical figures from Wikipedia',
  'Pro account can create custom characters + more talking time',
]

export default function ComingSoonPage() {
  return (
    <div className="@container/main container mx-auto p-6 space-y-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Coming Soon: Voice Customization</h1>
        <p className="text-lg text-muted-foreground mb-6">We&apos;re working on an exciting new feature that will let you customize voices for each historical figure.</p>
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Planned Features:</h2>
          <ul className="text-left space-y-3">
            {features.map((feature) => (
              <li className="flex items-center gap-2" key={feature}>
                <span className="text-primary">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
