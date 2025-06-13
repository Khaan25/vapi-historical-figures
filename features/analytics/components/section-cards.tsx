import { getFeedbackAnalytics } from '@/features/analytics/queries'
import { Brain, Star, Target, Trophy } from 'lucide-react'

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

  console.log('analytics :', analytics)

  const cards = [
    {
      title: 'Total Score',
      value: analytics.totalScore.value.toString(),
      trend: analytics.totalScore.trend,
      icon: Trophy,
      footer: {
        message: analytics.totalScore.trend.direction === 'up' ? 'Performance improving' : 'Room for improvement',
        description: 'Overall interview performance',
      },
      gradient: 'from-purple-500/20 to-purple-500/5',
    },
    {
      title: 'Category Score',
      value: analytics.categoryScores.value.toString(),
      trend: analytics.categoryScores.trend,
      icon: Brain,
      footer: {
        message: analytics.categoryScores.trend.direction === 'up' ? 'Categories improving' : 'Areas to focus on',
        description: 'Average across all categories',
      },
      gradient: 'from-amber-500/20 to-amber-500/5',
    },
    {
      title: 'Strengths',
      value: analytics.strengthsCount.value.toString(),
      trend: analytics.strengthsCount.trend,
      icon: Star,
      footer: {
        message: analytics.strengthsCount.trend.direction === 'up' ? 'New strengths identified' : 'Consistent strengths',
        description: 'Key strong points',
      },
      gradient: 'from-blue-500/20 to-blue-500/5',
    },
    {
      title: 'Areas to Improve',
      value: analytics.areasToImprove.value.toString(),
      trend: analytics.areasToImprove.trend,
      icon: Target,
      footer: {
        message: analytics.areasToImprove.trend.direction === 'down' ? 'Fewer areas to improve' : 'Areas identified',
        description: 'Points to work on',
      },
      gradient: 'from-green-500/20 to-green-500/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className={`@container/card relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${card.gradient} bg-gradient-to-br`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription className="text-base font-medium">{card.title}</CardDescription>
                <Icon className="size-6 text-muted-foreground/50" />
              </div>
              <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl">{card.value}</CardTitle>
              <CardAction>
                <Badge variant={card.trend.direction === 'up' ? 'default' : 'secondary'} className="animate-pulse">
                  {card.trend.direction === 'up' ? '↑' : '↓'} {card.trend.value}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">{card.footer.message}</div>
              <div className="text-muted-foreground">{card.footer.description}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
