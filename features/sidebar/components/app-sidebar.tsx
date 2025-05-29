import * as React from 'react'
import { NavMenu } from '@/features/sidebar/components/nav-menu'
import { NavUser } from '@/features/sidebar/components/nav-user'
import { createClient } from '@/utils/supabase/server'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail } from '@/components/ui/sidebar'

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">EP</div>
          <span className="font-semibold leading-none">Echoes of the Past</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMenu />

        {/* <ChatCharactersList /> */}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user?.user_metadata.full_name || '',
              email: user?.email || '',
              avatar: user?.user_metadata.avatar_url || '',
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail name="main" />
    </Sidebar>
  )
}
