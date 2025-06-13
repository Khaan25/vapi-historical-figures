import { Metadata } from 'next'

import { siteConfig } from './site'

export const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const defaultMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.png'],
  },
  creator: 'Zia Ur Rehman Khan',
  keywords: ['Time Whisper', 'Historical Figures', 'AI', 'Voice Interactions'],
  authors: [{ name: 'Zia Ur Rehman', url: 'https://v2-zzia.vercel.app/' }],
  applicationName: siteConfig.name,
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(defaultUrl),
  alternates: {
    canonical: defaultUrl,
  },
}
