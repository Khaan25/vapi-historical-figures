import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

type LogoProps = ComponentProps<'div'>

export default function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn('text-2xl font-bold', className)} {...props}>
      TimeWhisper
    </div>
  )
}
