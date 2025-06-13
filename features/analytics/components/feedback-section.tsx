'use client'

import { format } from 'date-fns'
import { Scroll } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { useFeedbackState, type FeedbackWithFigure } from '../hooks/use-feedback-state'
import { FeedbackCard } from './feedback-card'

function getBadgeForScore(score: number) {
  if (score >= 95) return { label: 'Platinum', className: 'bg-purple-500 hover:bg-purple-600' }
  if (score >= 90) return { label: 'Gold', className: 'bg-yellow-500 hover:bg-yellow-600' }
  if (score >= 80) return { label: 'Silver', className: 'bg-gray-400 hover:bg-gray-500' }
  return { label: 'Bronze', className: 'bg-orange-500 hover:bg-orange-600' }
}

interface FeedbackSectionProps {
  feedbacks: FeedbackWithFigure[]
}

export function FeedbackSection({ feedbacks }: FeedbackSectionProps) {
  const { setSelectedFeedbackId, selectedFeedback, isSheetOpen, setIsSheetOpen, isMobile } = useFeedbackState(feedbacks)

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-amber-500/10 to-amber-500/5">
        <div className="flex flex-col items-center gap-4">
          <Scroll className="size-12 text-muted-foreground/50" />
          <div>
            <p className="text-lg font-semibold mb-2">No Feedback Available</p>
            <p className="text-muted-foreground">Complete some interviews to see your feedback here.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Feedback List */}
      <Card className="lg:col-span-1 gap-0 py-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Scroll className="size-5" />
            Recent Interviews
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{feedbacks.length} total</p>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {feedbacks.map((feedback) => {
              const badge = getBadgeForScore(feedback.totalScore)
              return (
                <div
                  key={feedback.feedbackId}
                  className={cn(
                    'group flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-300',
                    selectedFeedback?.feedbackId === feedback.feedbackId ? 'bg-primary/10 hover:bg-primary/15 shadow-md ring-1 ring-primary/20' : 'hover:bg-accent hover:shadow-md'
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
                        'size-12 ring-2 ring-offset-2 ring-offset-background transition-all duration-300',
                        selectedFeedback?.feedbackId === feedback.feedbackId ? 'ring-primary' : 'ring-border group-hover:ring-primary'
                      )}
                    >
                      <AvatarImage src={feedback.figure.imageUrl} alt={feedback.figure.name} />
                      <AvatarFallback>{feedback.figure.name[0]}</AvatarFallback>
                    </Avatar>
                    <Badge className={`${badge.className} absolute -bottom-2 -right-2 size-6 rounded-full flex items-center justify-center p-0 text-xs font-bold shadow-lg`}>
                      {feedback.totalScore}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-medium truncate', selectedFeedback?.feedbackId === feedback.feedbackId && 'text-primary')}>{feedback.figure.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">{format(new Date(feedback.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Feedback Details - Desktop */}
      {!isMobile && (
        <Card className="lg:col-span-3 gap-0 py-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Scroll className="size-5" />
              Interview Feedback
            </h3>
          </div>
          <ScrollArea className="h-[485px]">
            <div className="p-6">
              {selectedFeedback ? (
                <FeedbackCard feedback={selectedFeedback} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Scroll className="size-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-semibold mb-2">Select an Interview</p>
                  <p className="text-muted-foreground">Choose an interview from the list to view feedback</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Feedback Details - Mobile Sheet */}
      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] overflow-auto pb-10">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Scroll className="size-5" />
                Interview Feedback
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 mt-4">
              {selectedFeedback ? (
                <FeedbackCard feedback={selectedFeedback} asSheet />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Scroll className="size-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-semibold mb-2">Select an Interview</p>
                  <p className="text-muted-foreground">Choose an interview from the list to view feedback</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
