'use client'

import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { type Feedback, type HistoricalFigureWithFeedback } from '../hooks/use-feedback-state'

function getBadgeForScore(score: number) {
  if (score >= 95) return { label: 'Platinum', className: 'bg-purple-500 hover:bg-purple-600' }
  if (score >= 90) return { label: 'Gold', className: 'bg-yellow-500 hover:bg-yellow-600' }
  if (score >= 80) return { label: 'Silver', className: 'bg-gray-400 hover:bg-gray-500' }
  return { label: 'Bronze', className: 'bg-orange-500 hover:bg-orange-600' }
}

interface FeedbackCardProps {
  figure: HistoricalFigureWithFeedback
  feedback: Feedback
  asSheet?: boolean
}

export function FeedbackCard({ figure, feedback, asSheet }: FeedbackCardProps) {
  const badge = getBadgeForScore(feedback.totalScore)
  const categoryScores = feedback.categoryScores as Record<string, number>
  const strengths = feedback.strengths as string[]
  const areasForImprovement = feedback.areasForImprovement as string[]

  return (
    <div className={cn('w-full', !asSheet && 'mb-6')}>
      <div className="flex items-center space-x-4 mb-4">
        <Avatar>
          <AvatarImage src={figure.imageUrl} alt={figure.name} />
          <AvatarFallback>{figure.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">{figure.name}</h4>
          <div className="flex space-x-2">
            <Badge className={badge.className}>{badge.label}</Badge>
            <p className="text-sm text-muted-foreground">{format(new Date(feedback.createdAt), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h5 className="font-medium mb-2">Category Scores</h5>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryScores).map(([category, score]) => (
              <Card key={category} className="p-4">
                <p className="text-sm text-muted-foreground capitalize">{category}</p>
                <p className="text-xl font-bold">{score}%</p>
              </Card>
            ))}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="strengths">
            <AccordionTrigger>Strengths</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                {strengths.map((strength, index) => (
                  <li key={index} className="text-sm">
                    {strength}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="improvements">
            <AccordionTrigger>Areas for Improvement</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                {areasForImprovement.map((area, index) => (
                  <li key={index} className="text-sm">
                    {area}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="assessment">
            <AccordionTrigger>Final Assessment</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">{feedback.finalAssessment}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
