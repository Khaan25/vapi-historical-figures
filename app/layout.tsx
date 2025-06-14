import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'

import { Analytics } from '@vercel/analytics/next'

import { Toaster } from '@/components/ui/sonner'
import { ReactQueryProvider } from '@/components/react-query-provider'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TimeWhisper',
  description: 'TimeWhisper is a platform for creating and sharing time-travel stories.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, 'font-[family-name:var(--font-geist-sans)] antialiased')}>
        <ReactQueryProvider>
          {children}
          <Toaster richColors theme="system" />
          <Analytics />
        </ReactQueryProvider>

        {process.env.NODE_ENV === 'production' && <Script defer src="https://cloud.umami.is/script.js" data-website-id="e2be9698-2b5e-432b-b846-a02a0a9b7733" />}
      </body>
    </html>
  )
}
