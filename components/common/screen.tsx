import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

type PageHeaderProps = ComponentProps<'div'>

export const Screen = ({ children, className, ...props }: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-1 flex-col gap-4 p-4', className)} {...props}>
      {children}
    </div>
  )
}
