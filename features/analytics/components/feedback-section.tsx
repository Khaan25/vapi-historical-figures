'use client'

import { format } from 'date-fns'

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
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No feedback data available. Complete some interviews to see feedback here.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Feedback List */}
      <Card className="lg:col-span-1 gap-0 py-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Interviews</h3>
          <p className="text-sm text-muted-foreground mt-1">{feedbacks.length} total</p>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-4">
            {feedbacks.map((feedback) => {
              const badge = getBadgeForScore(feedback.totalScore)
              return (
                <div
                  key={feedback.feedbackId}
                  className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => {
                    console.log('Selecting feedback:', feedback.feedbackId)
                    setSelectedFeedbackId(feedback.feedbackId)
                    if (isMobile) {
                      setIsSheetOpen(true)
                    }
                  }}
                >
                  <Avatar>
                    <AvatarImage src={feedback.figure.imageUrl} alt={feedback.figure.name} />
                    <AvatarFallback>{feedback.figure.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{feedback.figure.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={badge.className}>{badge.label}</Badge>
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
        <Card className="lg:col-span-3 gap-0 py-0">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Interview Feedback</h3>
          </div>
          <ScrollArea className="h-[585px]">
            <div className="p-4">
              {selectedFeedback ? <FeedbackCard feedback={selectedFeedback} /> : <div className="text-center p-6 text-muted-foreground">Select a feedback entry to view details</div>}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Feedback Details - Mobile Sheet */}
      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] overflow-auto pb-10">
            <SheetHeader>
              <SheetTitle>Interview Feedback</SheetTitle>
            </SheetHeader>
            <div className="px-4">
              {selectedFeedback ? <FeedbackCard feedback={selectedFeedback} asSheet /> : <div className="text-center p-6 text-muted-foreground">Select a feedback entry to view details</div>}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
