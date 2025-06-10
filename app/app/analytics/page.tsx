import { Suspense } from 'react'
import { FeedbackSection } from '@/features/analytics/components/feedback-section'
import { SectionCards } from '@/features/analytics/components/section-cards'
import { getHistoricalFiguresWithFeedback } from '@/features/analytics/queries'

export default async function AnalyticsPage() {
  const { data: historicalFigures, error } = await getHistoricalFiguresWithFeedback()
  console.log('historicalFigures :', historicalFigures)

  if (error) {
    console.error('Error fetching historical figures:', error)
    return <div>Error loading feedback data</div>
  }

  if (!historicalFigures || historicalFigures.length === 0) {
    return <div>No feedback data available</div>
  }

  // Validate the data structure
  const isValidData = historicalFigures.every((figure) =>
    figure.feedbacks?.every((feedback) => typeof feedback.totalScore === 'number' && feedback.categoryScores && Array.isArray(feedback.strengths) && Array.isArray(feedback.areasForImprovement))
  )

  if (!isValidData) {
    console.error('Invalid data structure:', historicalFigures)
    return <div>Error: Invalid feedback data structure</div>
  }

  return (
    <div className="@container/main container mx-auto p-6 space-y-6">
      <Suspense fallback={<div>Loading analytics...</div>}>
        <SectionCards />
      </Suspense>

      {/* Main Content */}
      <FeedbackSection historicalFigures={historicalFigures} />
    </div>
  )
}
