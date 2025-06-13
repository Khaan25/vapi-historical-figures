'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HistoricalFigure } from '@/types'
import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useUserId } from '@/hooks/use-user-id'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'

import { useVapi } from '../hooks/useVapi'
import { CALL_STATUS, VapiCallProps } from '../types'
import { AssistantButton } from './assistantButton'
import { CallHelperText } from './call-helper-text'
import { FeedbackButton } from './feedback-button'
import Siri from './siri'

type CallInterfaceProps = VapiCallProps & {
  character: HistoricalFigure
  backHref: string
  children?: React.ReactNode
  isQuiz?: boolean
}

export const CallInterface = ({ character, systemPrompt, firstMessage, backHref, children, isQuiz }: CallInterfaceProps) => {
  const [callDuration, setCallDuration] = useState(0)
  const { toggleCall, callStatus, audioLevel, messages, askQuestion } = useVapi({ character, systemPrompt, firstMessage })
  const { userId, isLoading: userIdLoading, error: userIdError } = useUserId()

  // Handle helper text option clicks
  const handleOptionClick = (option: string) => {
    switch (option) {
      case 'Ask a question':
        askQuestion("If you've a question? feel free to ask")
        break
      case 'Request Explanation':
        askQuestion("I'd be happy to explain anything about me or my work. What would you like me to clarify?")
        break
      case 'Topic Discussion':
        if (character.notableWork) {
          const notableEvents = character.notableWork.split(',').slice(0, 2)
          if (notableEvents[0] && notableEvents[1]) {
            const message = `I see you're interested in a discussion! Here are two notable events from my life:\n\n1. ${notableEvents[0]}\n2. ${notableEvents[1]}\n\nWould you like to discuss one of these topics, or do you have something else in mind?`
            askQuestion(message)
          } else {
            askQuestion("I see you're interested in a discussion! What topic would you like to explore together?")
          }
        } else {
          askQuestion("I see you're interested in a discussion! What topic would you like to explore together?")
        }
        break
    }
  }

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
      <Link href={backHref} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'rounded-full absolute top-4 left-4')}>
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

        <Siri theme="ios9" audioLevel={audioLevel} callStatus={callStatus} />

        <CallHelperText title="Try to:" options={['Ask a question', 'Request Explanation', 'Topic Discussion']} onOptionClick={handleOptionClick} />

        {children}
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

          {isQuiz && <FeedbackButton userId={userId} messages={messages} characterId={character.id} userIdLoading={userIdLoading} userIdError={userIdError} callStatus={callStatus} />}
          <AssistantButton onClick={toggleCall} callStatus={callStatus} />
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
