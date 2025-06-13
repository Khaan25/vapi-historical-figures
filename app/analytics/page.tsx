import { Suspense } from 'react'
import { Metadata } from 'next'
import { AnalyticsCards } from '@/features/analytics/components/analytics-cards'
import { FeedbackSection } from '@/features/analytics/components/feedback-section'
import { getHistoricalFiguresWithFeedback } from '@/features/analytics/queries'

import { defaultMetadata } from '@/config/metadata'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Analytics',
  description: 'You can checkout your latest quizzes result, areas to improve, strengths.',
}

export default async function AnalyticsPage() {
  const { data: feedbacks, error } = await getHistoricalFiguresWithFeedback()

  if (error) {
    console.error('Error fetching feedbacks:', error)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="font-semibold mb-2">Error Loading Feedback Data</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
          <h2 className="font-semibold mb-2">No Feedback Data Available</h2>
          <p className="text-muted-foreground">Complete some interviews to see feedback here.</p>
        </div>
      </div>
    )
  }

  // Validate the data structure
  const isValidData = feedbacks.every(
    (feedback) =>
      feedback &&
      typeof feedback.totalScore === 'number' &&
      Array.isArray(feedback.categoryScores) &&
      Array.isArray(feedback.strengths) &&
      Array.isArray(feedback.areasForImprovement) &&
      feedback.figure &&
      typeof feedback.figure.name === 'string' &&
      typeof feedback.figure.imageUrl === 'string'
  )

  if (!isValidData) {
    console.error('Invalid feedback data structure:', feedbacks)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="font-semibold mb-2">Data Structure Error</h2>
          <p>The feedback data is not in the expected format. Please contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="@container/main container mx-auto p-6 space-y-6">
      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsCards />
      </Suspense>

      <Suspense fallback={<div>Loading feedback data...</div>}>
        <FeedbackSection feedbacks={feedbacks} />
      </Suspense>
    </div>
  )
}
