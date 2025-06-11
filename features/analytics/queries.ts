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
        try {
          const categoryScores = typeof curr.categoryScores === 'string' ? JSON.parse(curr.categoryScores) : curr.categoryScores

          // Handle array of score objects
          if (Array.isArray(categoryScores)) {
            const scores = categoryScores.map((item) => item.score)
            if (scores.length === 0) return acc
            return acc + scores.reduce((sum, score) => sum + score, 0) / scores.length
          }
          return acc
        } catch (e) {
          console.error('Error parsing categoryScores:', e)
          return acc
        }
      }, 0) / (feedbacks.length || 1)
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
          try {
            const categoryScores = typeof curr.categoryScores === 'string' ? JSON.parse(curr.categoryScores) : curr.categoryScores

            // Handle array of score objects
            if (Array.isArray(categoryScores)) {
              const scores = categoryScores.map((item) => item.score)
              if (scores.length === 0) return acc
              return acc + scores.reduce((sum, score) => sum + score, 0) / scores.length
            }
            return acc
          } catch (e) {
            console.error('Error parsing categoryScores in old feedbacks:', e)
            return acc
          }
        }, 0) / (oldFeedbacks.length || 1)
      const recentCategoryAvg =
        recentFeedbacks.reduce((acc, curr) => {
          try {
            const categoryScores = typeof curr.categoryScores === 'string' ? JSON.parse(curr.categoryScores) : curr.categoryScores

            // Handle array of score objects
            if (Array.isArray(categoryScores)) {
              const scores = categoryScores.map((item) => item.score)
              if (scores.length === 0) return acc
              return acc + scores.reduce((sum, score) => sum + score, 0) / scores.length
            }
            return acc
          } catch (e) {
            console.error('Error parsing categoryScores in recent feedbacks:', e)
            return acc
          }
        }, 0) / (recentFeedbacks.length || 1)
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

  try {
    // First get all historical figures
    const { data: figures, error: figuresError } = await supabase.from('historicalFigures').select('id, name, imageUrl').order('name')

    if (figuresError) {
      console.error('Error fetching figures:', figuresError)
      return {
        data: null,
        error: figuresError.message,
      }
    }

    if (!figures || figures.length === 0) {
      console.log('No historical figures found')
      return {
        data: [],
        error: null,
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
      console.error('Error fetching feedbacks:', feedbacksError)
      return {
        data: null,
        error: feedbacksError.message,
      }
    }

    if (!feedbacks || feedbacks.length === 0) {
      console.log('No feedbacks found')
      return {
        data: [],
        error: null,
      }
    }

    console.log('Raw feedbacks:', feedbacks)

    // Map feedbacks to include their historical figure data
    const feedbacksWithFigures = feedbacks
      .map((feedback) => {
        const figure = figures.find((f) => f.id === feedback.quizzes?.historicalFigureId)
        if (!figure) {
          console.log('No figure found for feedback:', feedback)
          return null
        }

        try {
          // Ensure all JSON fields are properly parsed
          let categoryScores
          let strengths
          let areasForImprovement

          try {
            categoryScores = JSON.parse(feedback.categoryScores as string)
            if (!Array.isArray(categoryScores)) {
              throw new Error('categoryScores is not an array')
            }
          } catch (e) {
            console.error('Error parsing categoryScores:', e)
            categoryScores = []
          }

          try {
            strengths = JSON.parse(feedback.strengths as string)
            if (!Array.isArray(strengths)) {
              throw new Error('strengths is not an array')
            }
          } catch (e) {
            console.error('Error parsing strengths:', e)
            strengths = []
          }

          try {
            areasForImprovement = JSON.parse(feedback.areasForImprovement as string)
            if (!Array.isArray(areasForImprovement)) {
              throw new Error('areasForImprovement is not an array')
            }
          } catch (e) {
            console.error('Error parsing areasForImprovement:', e)
            areasForImprovement = []
          }

          const parsedFeedback = {
            feedbackId: feedback.id,
            quizId: feedback.quizId,
            totalScore: feedback.totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment: feedback.finalAssessment || '',
            createdAt: feedback.createdAt,
            figure: {
              id: figure.id,
              name: figure.name,
              imageUrl: figure.imageUrl,
            },
          }

          // Validate the structure
          if (
            typeof parsedFeedback.totalScore !== 'number' ||
            !Array.isArray(parsedFeedback.categoryScores) ||
            !Array.isArray(parsedFeedback.strengths) ||
            !Array.isArray(parsedFeedback.areasForImprovement)
          ) {
            console.error('Invalid feedback structure:', parsedFeedback)
            return null
          }

          return parsedFeedback
        } catch (error) {
          console.error('Error parsing feedback data:', error, feedback)
          return null
        }
      })
      .filter((f): f is NonNullable<typeof f> => f !== null)

    console.log('Processed feedbacks:', feedbacksWithFigures)

    return {
      data: feedbacksWithFigures,
      error: null,
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      data: null,
      error: 'An unexpected error occurred while fetching feedback data',
    }
  }
}
