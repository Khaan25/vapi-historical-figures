import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { SidebarTrigger } from '../ui/sidebar'

type ScreenHeaderProps = ComponentProps<'div'> & {
  title: string
  description: string
}

export const ScreenHeader = ({ title, description, className, ...props }: ScreenHeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <SidebarTrigger />

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
