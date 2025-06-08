import React from 'react'
import { AppSidebar } from '@/features/sidebar/components/app-sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
