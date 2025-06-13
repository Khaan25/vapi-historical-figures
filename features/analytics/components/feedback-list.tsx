'use client'

import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

import { FeedbackWithFigure } from '../hooks/use-feedback-state'

function getBadgeForScore(score: number) {
  if (score >= 95) return { label: 'Platinum', className: 'bg-purple-500 hover:bg-purple-600' }
  if (score >= 90) return { label: 'Gold', className: 'bg-yellow-500 hover:bg-yellow-600' }
  if (score >= 80) return { label: 'Silver', className: 'bg-gray-400 hover:bg-gray-500' }
  return { label: 'Bronze', className: 'bg-orange-500 hover:bg-orange-600' }
}

type FeedbackListProps = {
  feedbacks: FeedbackWithFigure[]
  selectedFeedbackId: string | null
  setSelectedFeedbackId: (feedbackId: string) => void
  isMobile: boolean
  setIsSheetOpen: (open: boolean) => void
}

export const FeedbackList = ({ feedbacks, selectedFeedbackId, setSelectedFeedbackId, isMobile, setIsSheetOpen }: FeedbackListProps) => {
  return (
    <ScrollArea className="h-[500px]">
      <div className="p-4 space-y-4">
        {feedbacks.map((feedback) => {
          const badge = getBadgeForScore(feedback.totalScore)

          return (
            <div
              key={feedback.feedbackId}
              className={cn(
                'group flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-150',
                selectedFeedbackId === feedback.feedbackId ? 'bg-primary/10 hover:bg-primary/15 shadow-md ring-1 ring-primary/20' : 'hover:bg-accent hover:ring-1 hover:ring-primary/20'
              )}
              onClick={() => {
                setSelectedFeedbackId(feedback.feedbackId)

                if (isMobile) {
                  setIsSheetOpen(true)
                }
              }}
            >
              <div className="relative">
                <Avatar
                  className={cn(
                    'size-12 ring-2 ring-offset-2 ring-offset-background transition-all duration-150',
                    selectedFeedbackId === feedback.feedbackId ? 'ring-primary' : 'ring-border group-hover:ring-primary'
                  )}
                >
                  <AvatarImage src={feedback.figure.imageUrl} alt={feedback.figure.name} />
                  <AvatarFallback>{feedback.figure.name[0]}</AvatarFallback>
                </Avatar>
                <Badge className={`${badge.className} absolute -bottom-2 -right-2 size-6 rounded-full flex items-center justify-center p-0 text-xs font-bold shadow-lg`}>{feedback.totalScore}</Badge>
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn('font-medium truncate', selectedFeedbackId === feedback.feedbackId && 'text-primary')}>{feedback.figure.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">{format(new Date(feedback.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
