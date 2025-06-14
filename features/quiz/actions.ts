'use server'

import { TablesInsert } from '@/database.types'
import { QuizFormValues } from '@/schema'
import { HistoricalFigure } from '@/types'
import { createClient } from '@/utils/supabase/server'

import { openai } from '@/lib/ai'

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

export async function addAIQuizzes(data: QuizFormValues, figureId: string) {
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
      type: 'ai',
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

export const getQuizQuestions = async (id: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase.from('quizQuestions').select('*').eq('historicalFigureId', id)

  if (error) {
    return {
      data: null,
      error: error.message,
    }
  }

  const formattedQuestions = data.map((question) => question.question)

  return {
    data: formattedQuestions,
    error: null,
  }
}

export const generateQuizQuestions = async (figure: HistoricalFigure, difficulty: string) => {
  const prompt = `Generate 5 questions about ${figure.name} (${figure.category}) at a ${difficulty} difficulty level.
Use the following information about the historical figure:
- Bio: ${figure.bio}
- Notable Work: ${figure.notableWork}
- Description: ${figure.description}
- Time Period: ${figure.dateOfBirth} - ${figure.dateOfDeath}

For each question:
1. Make it ${difficulty} difficulty
2. Ensure questions are factual and based on the provided information
3. Return only the question text, no answers or options

Format the response as a JSON object with a "questions" array containing the question strings, like this:
{
  "questions": [
    "Question 1 text here",
    "Question 2 text here",
    "Question 3 text here",
    "Question 4 text here",
    "Question 5 text here"
  ]
}`

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a knowledgeable history teacher creating quiz questions. Return a JSON object with a questions array containing only the question strings.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4-turbo-preview',
    response_format: { type: 'json_object' },
  })

  const response = completion.choices[0].message.content

  if (!response) {
    return {
      data: null,
      error: 'Error generating quiz questions',
    }
  }

  try {
    const parsedResponse = JSON.parse(response)
    const questions = parsedResponse.questions

    if (!Array.isArray(questions)) {
      return {
        data: null,
        error: 'Invalid response format from AI',
      }
    }

    return {
      data: questions,
      error: null,
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    return {
      data: null,
      error: 'Failed to parse AI response',
    }
  }
}
