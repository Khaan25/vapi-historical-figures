import { ComponentProps } from 'react'
import { useVapi } from '@/features/call/hooks/useVapi'
import { Loader2, Phone, PhoneOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { CALL_STATUS } from '../types'

type AssistantButtonProps = ComponentProps<'button'> & {
  callStatus: ReturnType<typeof useVapi>['callStatus']
}

export const AssistantButton = ({ callStatus, className, ...props }: AssistantButtonProps) => {
  return (
    <Button
      variant="destructive"
      className={cn(
        'rounded-full size-12',
        callStatus === CALL_STATUS.ACTIVE && 'bg-red-500 hover:bg-red-700',
        callStatus === CALL_STATUS.LOADING && 'bg-orange-500 hover:bg-orange-700',
        callStatus === CALL_STATUS.INACTIVE && 'bg-green-500 hover:bg-green-700',
        className
      )}
      aria-label={callStatus === CALL_STATUS.ACTIVE ? 'End call' : 'Start call'}
      {...props}
    >
      {callStatus === CALL_STATUS.ACTIVE && <PhoneOff />}
      {callStatus === CALL_STATUS.LOADING && <Loader2 className="animate-spin" />}
      {callStatus === CALL_STATUS.INACTIVE && <Phone />}
    </Button>
  )
}
