'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MessageSquare } from 'lucide-react'

import { Message } from '@/types/conversation.type'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { generateFeedbackAction } from '../actions'
import { CALL_STATUS } from '../types'

interface FeedbackButtonProps {
  userId: string | null
  messages: Message[] | null
  characterId: string
  userIdLoading: boolean
  userIdError: Error | null
  callStatus: CALL_STATUS
}

export const FeedbackButton = ({ userId, messages, characterId, userIdLoading, userIdError, callStatus }: FeedbackButtonProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateFeedback = async () => {
    if (!userId || !messages || userIdLoading || Boolean(userIdError) || callStatus === CALL_STATUS.LOADING) return

    try {
      setIsLoading(true)
      await generateFeedbackAction(messages, characterId)
      router.push(`/app/analytics`)
    } catch (error) {
      console.error('Error generating feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className={cn('rounded-full size-12 bg-secondary text-secondary-foreground', isLoading && 'opacity-50 cursor-not-allowed')}
      onClick={handleGenerateFeedback}
      aria-label="Get Feedback"
      disabled={!messages || messages.length === 0 || userIdLoading || Boolean(userIdError) || callStatus === CALL_STATUS.LOADING || isLoading}
    >
      {isLoading ? <Loader2 className="size-5 animate-spin" /> : <MessageSquare className="size-5" />}
    </Button>
  )
}
