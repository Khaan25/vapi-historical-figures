'use server'

import { TablesInsert } from '@/database.types'
import { QuizFormValues } from '@/schema'
import { createClient } from '@/utils/supabase/server'

/**
 *
 *
 * @export
 * @param {QuizFormValues} data
 * @param {string} figureId
 * @return {*}
 */
export async function addManualQuizzes(data: QuizFormValues, figureId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      data: null,
      error: 'User not found',
    }
  }

  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .insert({
      historicalFigureId: figureId,
      userId: user.id,
      type: 'manual',
    })
    .select()
    .single()

  if (quizError) {
    return {
      data: null,
      error: quizError.message,
    }
  }

  const insertData: TablesInsert<'quizQuestions'>[] = data.questions.map((question) => ({
    historicalFigureId: figureId,
    question: question.question,
    quizId: quiz.id,
  }))

  const { data: quizQuestions, error } = await supabase.from('quizQuestions').insert(insertData).select()

  if (error) {
    return {
      data: null,
      error: error.message,
    }
  }

  return {
    data: quizQuestions,
    error: null,
  }
}
