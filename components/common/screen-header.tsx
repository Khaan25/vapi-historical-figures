import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { SidebarTrigger } from '../ui/sidebar'

type ScreenHeaderProps = ComponentProps<'div'> & {
  title: string
  description: string
  children?: React.ReactNode
}

export const ScreenHeader = ({ title, description, className, children, ...props }: ScreenHeaderProps) => {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)} {...props}>
      <div className="flex flex-col gap-1">
        <SidebarTrigger />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {children}
    </div>
  )
}
