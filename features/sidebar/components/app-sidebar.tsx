import * as React from 'react'
import { NavMenu } from '@/features/sidebar/components/nav-menu'
import { NavUser } from '@/features/sidebar/components/nav-user'
import { createClient } from '@/utils/supabase/server'

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <Sidebar collapsible="icon" {...props}>
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
