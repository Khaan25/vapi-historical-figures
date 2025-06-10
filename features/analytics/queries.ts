import { createClient } from '@/utils/supabase/server'

export const getFeedbackAnalytics = async () => {
  const supabase = await createClient()

  const { data: feedbacks, error } = await supabase.from('feedbacks').select('totalScore, categoryScores, strengths, areasForImprovement').order('createdAt', { ascending: false })
  console.log('feedbacks :', feedbacks)

  if (error) {
    return {
      data: null,
      error: error.message,
    }
  }

  // Calculate analytics
  const analytics = {
    totalScore: {
      value: 0,
      trend: { value: '0%', direction: 'up' as 'up' | 'down' },
    },
    categoryScores: {
      value: 0,
      trend: { value: '0%', direction: 'up' as 'up' | 'down' },
    },
    strengthsCount: {
      value: 0,
      trend: { value: '0', direction: 'up' as 'up' | 'down' },
    },
    areasToImprove: {
      value: 0,
      trend: { value: '0', direction: 'down' as 'up' | 'down' },
    },
  }

  if (feedbacks.length > 0) {
    // Calculate total score average
    const totalScoreAvg = feedbacks.reduce((acc, curr) => acc + curr.totalScore, 0) / feedbacks.length
    analytics.totalScore.value = Math.round(totalScoreAvg)

    // Calculate category scores average
    const categoryScoresAvg =
      feedbacks.reduce((acc, curr) => {
        const scores = Object.values(curr.categoryScores as Record<string, number>)
        return acc + scores.reduce((sum, score) => sum + score, 0) / scores.length
      }, 0) / feedbacks.length
    analytics.categoryScores.value = Number(categoryScoresAvg.toFixed(1))

    // Calculate unique strengths count
    const uniqueStrengths = new Set(feedbacks.flatMap((f) => f.strengths as string[]))
    analytics.strengthsCount.value = uniqueStrengths.size

    // Calculate unique areas to improve count
    const uniqueAreas = new Set(feedbacks.flatMap((f) => f.areasForImprovement as string[]))
    analytics.areasToImprove.value = uniqueAreas.size

    // Calculate trends if we have more than one feedback
    if (feedbacks.length > 1) {
      const oldFeedbacks = feedbacks.slice(Math.floor(feedbacks.length / 2))
      const recentFeedbacks = feedbacks.slice(0, Math.floor(feedbacks.length / 2))

      // Total score trend
      const oldTotalAvg = oldFeedbacks.reduce((acc, curr) => acc + curr.totalScore, 0) / oldFeedbacks.length
      const recentTotalAvg = recentFeedbacks.reduce((acc, curr) => acc + curr.totalScore, 0) / recentFeedbacks.length
      const totalScoreTrend = ((recentTotalAvg - oldTotalAvg) / oldTotalAvg) * 100
      analytics.totalScore.trend = {
        value: `${Math.abs(totalScoreTrend).toFixed(1)}%`,
        direction: totalScoreTrend >= 0 ? 'up' : 'down',
      }

      // Category scores trend
      const oldCategoryAvg =
        oldFeedbacks.reduce((acc, curr) => {
          const scores = Object.values(curr.categoryScores as Record<string, number>)
          return acc + scores.reduce((sum, score) => sum + score, 0) / scores.length
        }, 0) / oldFeedbacks.length
      const recentCategoryAvg =
        recentFeedbacks.reduce((acc, curr) => {
          const scores = Object.values(curr.categoryScores as Record<string, number>)
          return acc + scores.reduce((sum, score) => sum + score, 0) / scores.length
        }, 0) / recentFeedbacks.length
      const categoryScoreTrend = ((recentCategoryAvg - oldCategoryAvg) / oldCategoryAvg) * 100
      analytics.categoryScores.trend = {
        value: `${Math.abs(categoryScoreTrend).toFixed(1)}%`,
        direction: categoryScoreTrend >= 0 ? 'up' : 'down',
      }

      // Strengths trend
      const oldStrengths = new Set(oldFeedbacks.flatMap((f) => f.strengths as string[])).size
      const recentStrengths = new Set(recentFeedbacks.flatMap((f) => f.strengths as string[])).size
      analytics.strengthsCount.trend = {
        value: `${Math.abs(recentStrengths - oldStrengths)}`,
        direction: recentStrengths >= oldStrengths ? 'up' : 'down',
      }

      // Areas to improve trend
      const oldAreas = new Set(oldFeedbacks.flatMap((f) => f.areasForImprovement as string[])).size
      const recentAreas = new Set(recentFeedbacks.flatMap((f) => f.areasForImprovement as string[])).size
      analytics.areasToImprove.trend = {
        value: `${Math.abs(recentAreas - oldAreas)}`,
        direction: recentAreas >= oldAreas ? 'up' : 'down',
      }
    }
  }

  return { data: analytics, error: null }
}

export const getHistoricalFiguresWithFeedback = async () => {
  const supabase = await createClient()

  // First get all historical figures
  const { data: figures, error: figuresError } = await supabase.from('historicalFigures').select('id, name, imageUrl').order('name')

  if (figuresError) {
    return {
      data: null,
      error: figuresError.message,
    }
  }

  // Then get all feedbacks
  const { data: feedbacks, error: feedbacksError } = await supabase
    .from('feedbacks')
    .select(
      `
      id,
      quizId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt,
      quizzes (
        historicalFigureId
      )
    `
    )
    .order('createdAt', { ascending: false })

  if (feedbacksError) {
    return {
      data: null,
      error: feedbacksError.message,
    }
  }

  // Map feedbacks to their historical figures
  const figuresWithFeedback = figures.map((figure) => ({
    ...figure,
    feedbacks: feedbacks
      .filter((f) => f.quizzes?.historicalFigureId === figure.id)
      .map((f) => ({
        feedbackId: f.id,
        quizId: f.quizId,
        totalScore: f.totalScore,
        categoryScores: JSON.parse(f.categoryScores as string) as Record<string, number>,
        strengths: JSON.parse(f.strengths as string) as string[],
        areasForImprovement: JSON.parse(f.areasForImprovement as string) as string[],
        finalAssessment: f.finalAssessment,
        createdAt: f.createdAt,
      })),
  }))

  console.log('figuresWithFeedback :', figuresWithFeedback)

  return {
    data: figuresWithFeedback.filter((f) => f.feedbacks.length > 0), // Only return figures that have feedback
    error: null,
  }
}
