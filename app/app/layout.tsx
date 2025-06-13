import React from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/features/sidebar/components/app-sidebar'
import { createClient } from '@/utils/supabase/client'

import { defaultMetadata } from '@/config/metadata'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const metadata: Metadata = {
  ...defaultMetadata,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
