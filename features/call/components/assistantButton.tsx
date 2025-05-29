import { CALL_STATUS, useVapi } from '@/features/call/hooks/useVapi'
import { Loader2, Phone, PhoneOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const AssistantButton = ({ toggleCall, callStatus }: Partial<ReturnType<typeof useVapi>>) => {
  return (
    <Button
      variant="destructive"
      onClick={toggleCall}
      className={cn(
        'rounded-full size-12',
        callStatus === CALL_STATUS.ACTIVE && 'bg-red-500 hover:bg-red-700',
        callStatus === CALL_STATUS.LOADING && 'bg-orange-500 hover:bg-orange-700',
        callStatus === CALL_STATUS.INACTIVE && 'bg-green-500 hover:bg-green-700'
      )}
      aria-label={callStatus === CALL_STATUS.ACTIVE ? 'End call' : 'Start call'}
    >
      {callStatus === CALL_STATUS.ACTIVE && <PhoneOff />}
      {callStatus === CALL_STATUS.LOADING && <Loader2 className="animate-spin" />}
      {callStatus === CALL_STATUS.INACTIVE && <Phone />}
    </Button>
  )
}
