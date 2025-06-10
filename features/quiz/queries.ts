import { createClient } from '@/utils/supabase/server'

export const getQuizzes = async () => {
  const supabase = await createClient()

  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select(
      `
    *,
    historicalFigure:historicalFigureId (
      id,
      name,
      description,
      imageUrl,
      category
    )
  `
    )
    .order('created_at', { ascending: true })

  if (error) {
    return {
      data: null,
      error: error.message,
    }
  }

  return { data: quizzes, error: null }
}
