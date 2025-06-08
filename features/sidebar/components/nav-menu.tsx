'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, Compass, UserPlus } from 'lucide-react'

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

const menuList = [
  {
    name: 'Explore',
    url: '/app',
    icon: Compass,
  },
  {
    name: 'New Character',
    url: '/app/new',
    icon: UserPlus,
  },
  {
    name: 'Features Coming Soon',
    url: '/app/coming-soon',
    icon: Clock,
  },
]

export function NavMenu() {
  const pathname = usePathname()

  // Check if the current pathname is the same as the url
  const isActive = (url: string) => {
    return pathname === url
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {menuList.map((menu) => (
          <SidebarMenuItem key={menu.name}>
            <SidebarMenuButton asChild tooltip={menu.name} isActive={isActive(menu.url)}>
              <Link href={menu.url}>
                <menu.icon />
                <span>{menu.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
