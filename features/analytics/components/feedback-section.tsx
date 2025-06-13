'use client'

import { Scroll } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { useFeedbackState, type FeedbackWithFigure } from '../hooks/use-feedback-state'
import { FeedbackCard } from './feedback-card'
import { FeedbackList } from './feedback-list'

interface FeedbackSectionProps {
  feedbacks: FeedbackWithFigure[]
}

export function FeedbackSection({ feedbacks }: FeedbackSectionProps) {
  const { setSelectedFeedbackId, selectedFeedbackId, selectedFeedback, isSheetOpen, setIsSheetOpen, isMobile } = useFeedbackState(feedbacks)

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
      <div className="lg:col-span-1 border border-border rounded-md from-primary/5 to-card dark:bg-card grid grid-cols-1 gap-4 bg-gradient-to-t shadow-xs">
        <h3 className="font-semibold p-4 border-b">Recent Interviews ({feedbacks.length})</h3>

        <FeedbackList feedbacks={feedbacks} selectedFeedbackId={selectedFeedbackId} setSelectedFeedbackId={setSelectedFeedbackId} isMobile={isMobile} setIsSheetOpen={setIsSheetOpen} />
      </div>

      {/* Feedback Details - Desktop */}
      {!isMobile && (
        <div className="lg:col-span-3 border border-border rounded-md from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <h3 className="font-semibold p-4 border-b">Interview Feedback</h3>

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
        </div>
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
                <FeedbackCard feedback={selectedFeedback} />
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
