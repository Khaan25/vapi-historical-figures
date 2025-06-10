'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { useFeedbackState, type HistoricalFigureWithFeedback } from '../hooks/use-feedback-state'
import { FeedbackCard } from './feedback-card'

interface FeedbackSectionProps {
  historicalFigures: HistoricalFigureWithFeedback[]
}

export function FeedbackSection({ historicalFigures }: FeedbackSectionProps) {
  const { setSelectedFigureId, setSelectedFeedbackId, selectedFigure, selectedFeedback, isSheetOpen, setIsSheetOpen, isMobile } = useFeedbackState(historicalFigures)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Historical Figures List */}
      <Card className="lg:col-span-1">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Historical Figures</h3>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-4">
            {historicalFigures.map((figure) => (
              <div
                key={figure.id}
                className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => {
                  setSelectedFigureId(figure.id)
                  if (figure.feedbacks.length > 0) {
                    setSelectedFeedbackId(figure.feedbacks[0].feedbackId)
                  }
                  if (isMobile) {
                    setIsSheetOpen(true)
                  }
                }}
              >
                <Avatar>
                  <AvatarImage src={figure.imageUrl} alt={figure.name} />
                  <AvatarFallback>{figure.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{figure.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {figure.feedbacks.length} {figure.feedbacks.length === 1 ? 'interview' : 'interviews'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Feedback Details - Desktop */}
      {!isMobile && (
        <Card className="lg:col-span-3">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Interview Feedback</h3>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="p-4">{selectedFigure && selectedFeedback && <FeedbackCard figure={selectedFigure} feedback={selectedFeedback} />}</div>
          </ScrollArea>
        </Card>
      )}

      {/* Feedback Details - Mobile Sheet */}
      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] pt-10">
            <SheetHeader>
              <SheetTitle>Interview Feedback</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full pr-6">{selectedFigure && selectedFeedback && <FeedbackCard figure={selectedFigure} feedback={selectedFeedback} asSheet />}</ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
