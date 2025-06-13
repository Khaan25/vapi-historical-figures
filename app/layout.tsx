import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { ReactQueryProvider } from '@/components/react-query-provider'

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
        </ReactQueryProvider>
      </body>
    </html>
  )
}
