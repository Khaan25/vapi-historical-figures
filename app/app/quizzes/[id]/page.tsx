import { notFound } from 'next/navigation'
import { AIQuiz } from '@/features/quiz/components/ai-quiz'
import { ManualQuiz } from '@/features/quiz/components/manual-quiz'
import { createClient } from '@/utils/supabase/server'

import { Screen } from '@/components/common/screen'
import { ScreenHeader } from '@/components/common/screen-header'

interface QuizPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    type: 'ai' | 'manual'
    difficulty?: 'easy' | 'medium' | 'hard'
  }>
}

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
  const { id } = await params
  const { type, difficulty } = await searchParams

  const supabase = await createClient()

  const { data: figure, error } = await supabase.from('historicalFigures').select('*').eq('id', id).single()

  if (error || !figure) {
    console.error('Error fetching historical figure:', error)
    return notFound()
  }

  return (
    <Screen>
      <ScreenHeader
        title={`Quiz: ${figure.name}`}
        description={type === 'ai' ? `AI-generated ${difficulty} quiz about ${figure.name}` : `Add questions to test knowledge about ${figure.name}`}
      />

      {type === 'ai' ? <AIQuiz figure={figure} difficulty={difficulty || 'medium'} /> : <ManualQuiz figure={figure} />}
    </Screen>
  )
}
