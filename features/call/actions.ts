'use server'

import { createClient } from '@/utils/supabase/server'

import { Message } from '@/types/conversation.type'

import { saveFeedback } from './lib/feedback'
import { generateFeedback } from './lib/generate-feedback'

export const generateFeedbackAction = async (messages: Message[], historicalFigureId: string) => {
  const feedback = await generateFeedback(messages)
  console.log('feedback :', feedback)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const { data: quiz } = await supabase.from('quizzes').select('id').eq('historicalFigureId', historicalFigureId).single()

  if (!quiz) {
    throw new Error('Quiz not found')
  }

  const savedFeedback = await saveFeedback(feedback, user.id, quiz.id)

  return savedFeedback
}
