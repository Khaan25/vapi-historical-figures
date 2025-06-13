import React from 'react'
import { Metadata } from 'next'
import { AppSidebar } from '@/features/sidebar/components/app-sidebar'

import { defaultMetadata } from '@/config/metadata'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const metadata: Metadata = {
  ...defaultMetadata,
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
