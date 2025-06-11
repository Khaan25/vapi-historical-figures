'use client'

import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { type FeedbackWithFigure } from '../hooks/use-feedback-state'

function getBadgeForScore(score: number) {
  if (score >= 95) return { label: 'Platinum', className: 'bg-purple-500 hover:bg-purple-600' }
  if (score >= 90) return { label: 'Gold', className: 'bg-yellow-500 hover:bg-yellow-600' }
  if (score >= 80) return { label: 'Silver', className: 'bg-gray-400 hover:bg-gray-500' }
  return { label: 'Bronze', className: 'bg-orange-500 hover:bg-orange-600' }
}

interface FeedbackCardProps {
  feedback: FeedbackWithFigure
  asSheet?: boolean
}

export function FeedbackCard({ feedback, asSheet }: FeedbackCardProps) {
  const badge = getBadgeForScore(feedback.totalScore)

  return (
    <div className={cn('w-full', !asSheet && 'mb-6')}>
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage src={feedback.figure.imageUrl} alt={feedback.figure.name} />
          <AvatarFallback>{feedback.figure.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">{feedback.figure.name}</h4>
          <div className="flex space-x-2">
            <Badge className={badge.className}>{badge.label}</Badge>
            <p className="text-sm text-muted-foreground">{format(new Date(feedback.createdAt), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="font-semibold mb-2">Final Assessment</h5>
          <p className="text-sm text-muted-foreground">{feedback.finalAssessment}</p>
        </div>

        <div>
          <h5 className="font-semibold mb-2">Category Scores</h5>
          <Accordion type="single" collapsible className="w-full">
            {feedback.categoryScores.map((category, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>{category.name}</span>
                    <Badge variant={category.score >= 90 ? 'default' : 'secondary'}>{category.score}%</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground pt-2">{category.comment}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold mb-2">Strengths</h5>
            <ul className="list-disc list-inside space-y-1">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Areas for Improvement</h5>
            <ul className="list-disc list-inside space-y-1">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
