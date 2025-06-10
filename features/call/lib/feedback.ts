import { FeedbackFormValues } from '@/schema'
import { createClient } from '@/utils/supabase/client'

export type FeedbackCategoryScore = {
  name: string
  score: number
  comment: string
}

export const saveFeedback = async (feedback: FeedbackFormValues, userId: string, quizId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('feedbacks')
    .insert({
      userId,
      quizId,
      totalScore: feedback.totalScore,
      categoryScores: JSON.stringify(feedback.categoryScores),
      strengths: JSON.stringify(feedback.strengths),
      areasForImprovement: JSON.stringify(feedback.areasForImprovement),
      finalAssessment: feedback.finalAssessment,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
