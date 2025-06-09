// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { getUserChats } from '@/features/chat/queries'
// import { useQuery } from '@tanstack/react-query'

// import { queryKeys } from '@/lib/query-keys'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

// type ChatListProps = {
//   userId: string
// }

// export default function ChatCharactersList({ userId }: ChatListProps) {
//   const pathname = usePathname()

//   const { data, isLoading, error } = useQuery({
//     queryKey: queryKeys.chats(userId),
//     queryFn: () => getUserChats(userId),
//     enabled: !!userId, // Only runs after role check succeeds
//   })

//   if (isLoading) {
//     return <div className="px-4 py-2 text-xs flex flex-col items-center gap-2 justify-center text-muted-foreground text-center">Loading...</div>
//   }

//   if (error) {
//     return <div className="px-4 py-2 text-xs flex flex-col items-center gap-2 justify-center text-muted-foreground text-center">Error loading chats.</div>
//   }

//   if (!data || !data.length) {
//     return null
//   }

//   // Check if the current pathname is the same as the url
//   const isActive = (url: string) => {
//     return pathname === url
//   }

//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Chats</SidebarGroupLabel>
//       <SidebarMenu>
//         <ScrollArea className="h-[calc(100vh-460px)]">
//           {data.map((menu) => (
//             <SidebarMenuItem key={menu.id}>
//               <SidebarMenuButton asChild tooltip={menu.character.name} isActive={isActive(`/chat/${menu.id}`)}>
//                 <Link href={`/chat/${menu.id}`}>
//                   <Image className="object-cover aspect-square rounded-md" src={menu.character.avatarPath || '/logo.png'} alt={menu.character.name} width={24} height={24} />
//                   <span className="truncate">{menu.character.name}</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </ScrollArea>
//       </SidebarMenu>
//     </SidebarGroup>
//   )
// }
