import { getFeedbackAnalytics } from '@/features/analytics/queries'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const SectionCards = async () => {
  const { data: analytics, error } = await getFeedbackAnalytics()

  if (error) {
    console.error('Error fetching analytics:', error)
    return <div>Error loading analytics</div>
  }

  if (!analytics) {
    return <div>No analytics data available</div>
  }
  
  console.log('analytics :', analytics);

  const cards = [
    {
      title: 'Total Score',
      value: analytics.totalScore.value.toString(),
      trend: analytics.totalScore.trend,
      footer: {
        message: analytics.totalScore.trend.direction === 'up' ? 'Above average performance' : 'Below average performance',
        description: 'Based on all interviews',
      },
    },
    {
      title: 'Category Scores',
      value: analytics.categoryScores.value.toString(),
      trend: analytics.categoryScores.trend,
      footer: {
        message: analytics.categoryScores.trend.direction === 'up' ? 'Strong across all categories' : 'Room for improvement',
        description: 'Knowledge, Communication, Problem Solving',
      },
    },
    {
      title: 'Strengths Count',
      value: analytics.strengthsCount.value.toString(),
      trend: analytics.strengthsCount.trend,
      footer: {
        message: analytics.strengthsCount.trend.direction === 'up' ? 'Growing skill repertoire' : 'Consistent strengths',
        description: 'Key competencies identified',
      },
    },
    {
      title: 'Areas to Improve',
      value: analytics.areasToImprove.value.toString(),
      trend: analytics.areasToImprove.trend,
      footer: {
        message: analytics.areasToImprove.trend.direction === 'down' ? 'Fewer improvement areas' : 'More areas identified',
        description: 'Continuous learning progress',
      },
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{card.value}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.trend.direction === 'up' ? <TrendingUp /> : <TrendingDown />}
                {card.trend.value}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footer.message} {card.trend.direction === 'up' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground">{card.footer.description}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
