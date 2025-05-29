'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HistoricalFigure } from '@/types'
import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'

import { CALL_STATUS, useVapi } from '../hooks/useVapi'
import { AssistantButton } from './assistantButton'

type CallInterfaceProps = {
  character: HistoricalFigure
}

export const CallInterface = ({ character }: CallInterfaceProps) => {
  const [callDuration, setCallDuration] = useState(0)

  const { toggleCall, callStatus } = useVapi({ character })

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout

    // Start timer when call is active
    if (callStatus === CALL_STATUS.ACTIVE) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [callStatus])

  // Start the call
  useEffect(() => {
    toggleCall()
  }, [])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen relative bg-muted text-muted-foreground flex flex-col justify-between">
      <Link href="/app" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'rounded-full absolute top-4 left-4')}>
        <ArrowLeft className="size-4" />
      </Link>

      {/* Top section with user info */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16">
        <Avatar className="w-32 h-32 border-2 border-border mb-6">
          <AvatarImage className="object-cover" src={character.imageUrl} alt={character.name} />
          <AvatarFallback className="text-2xl bg-border">{character.name.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <h1 className="text-3xl font-bold mb-2 text-foreground">{character.name}</h1>

        {callStatus === CALL_STATUS.LOADING && <p className="text-muted-foreground">Connecting...</p>}

        {callStatus === CALL_STATUS.ACTIVE && (
          <>
            <p className="text-muted-foreground mb-2">Connected</p>
            <p className="text-muted-foreground">{formatTime(callDuration)}</p>
          </>
        )}

        {callStatus === CALL_STATUS.INACTIVE && <p className="text-muted-foreground">Call ended</p>}
      </div>

      {/* Bottom action Buttons */}
      <div className="pb-6">
        {/* Horizontal line */}
        <div className="h-px bg-border w-full mb-6"></div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-2 px-6">
          {/* Message button */}
          {/* <Button variant="outline" className="rounded-full size-12" aria-label="Message">
            <MessageSquare className="size-5" />
          </Button> */}

          {/* Mute button */}
          {/* <Button
            onClick={toggleMute}
            variant="outline"
            className={cn('rounded-full size-12', isMuted ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground')}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </Button> */}

          {/* End call Button */}
          <AssistantButton toggleCall={toggleCall} callStatus={callStatus} />
        </div>
      </div>

      {/* Call ended overlay */}
      {/* {callStatus === CALL_STATUS.INACTIVE && (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
          <div className="text-center">
            <PhoneOff className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">Call Ended</h2>
            {callDuration > 0 && <p className="text-muted-foreground">Duration: {formatTime(callDuration)}</p>}
          </div>
        </div>
      )} */}
    </div>
  )
}
