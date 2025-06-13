'use client'

import { format } from 'date-fns'
import { Brain, Crown, MessageCircle, Star, Target } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { type FeedbackWithFigure } from '../hooks/use-feedback-state'

function getBadgeForScore(score: number) {
  if (score >= 95) return { label: 'Excellent', className: 'bg-purple-500 hover:bg-purple-600 text-white' }
  if (score >= 90) return { label: 'Great', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' }
  if (score >= 80) return { label: 'Good', className: 'bg-blue-500 hover:bg-blue-600 text-white' }
  return { label: 'Fair', className: 'bg-orange-500 hover:bg-orange-600 text-white' }
}

interface FeedbackCardProps {
  feedback: FeedbackWithFigure
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const badge = getBadgeForScore(feedback.totalScore)

  return (
    <div className={cn('w-full space-y-6')}>
      <div className="flex items-center space-x-4 bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg">
        <Avatar className="size-16 ring-2 ring-offset-2 ring-offset-background ring-primary">
          <AvatarImage src={feedback.figure.imageUrl} alt={feedback.figure.name} />
          <AvatarFallback>{feedback.figure.name[0]}</AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <div className="space-y-1">
            <h4 className="text-xl font-semibold">{feedback.figure.name}</h4>
            <div className="flex items-center space-x-2">
              <Badge className={cn(badge.className, 'flex items-center gap-1')}>
                <Crown className="size-3" />
                {badge.label}
              </Badge>
              <p className="text-sm text-muted-foreground">{format(new Date(feedback.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-4 gap-0 bg-gradient-to-br from-sky-500/5 to-sky-500/2 border-sky-500">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="size-5 text-sky-500" />
            <h5 className="font-semibold">Overall Assessment</h5>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{feedback.finalAssessment}</p>
        </Card>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="size-5 text-purple-500" />
            <h5 className="font-semibold">Category Scores</h5>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {feedback.categoryScores.map((category, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0 mb-2">
                <Card className="bg-gradient-to-br to-purple-500/10 py-1 shadow-none from-purple-500/5 gap-2 border-purple-200">
                  <AccordionTrigger className="px-4 py-1.5 hover:no-underline [&[data-state=open]>div]:text-primary">
                    <div className="flex items-center justify-between w-full transition-colors">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="default" className={cn("ml-auto text-black",
                        category.score >= 90 ? "text-white bg-green-500 hover:bg-green-600" :
                        category.score >= 80 ? "text-white bg-yellow-500 hover:bg-yellow-600" :
                        category.score >= 50 ? "text-white bg-orange-500 hover:bg-orange-600" :
                        "bg-red-500 hover:bg-red-600 text-white"
                      )}>
                        {category.score}%
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">{category.comment}</p>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-gradient-to-br gap-2 from-green-500/5 to-green-500/2 border-green-300">
            <div className="flex items-center gap-2 mb-3">
              <Star className="size-5 text-green-500" />
              <h5 className="font-semibold">Strengths</h5>
            </div>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-muted-foreground flex gap-2 items-center">
                  <span className="text-green-500">•</span>
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 bg-gradient-to-br gap-2 from-orange-500/5 to-orange-500/2 border-orange-300">
            <div className="flex items-center gap-2 mb-3">
              <Target className="size-5 text-orange-500" />
              <h5 className="font-semibold">Areas to Improve</h5>
            </div>
            <ul className="space-y-2">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="text-sm text-muted-foreground flex gap-2 items-center">
                  <span className="text-orange-500">•</span>
                  <span className="leading-relaxed">{area}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
