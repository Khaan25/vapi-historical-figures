import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AIQuiz } from '@/features/quiz/components/ai-quiz'
import { ManualQuiz } from '@/features/quiz/components/manual-quiz'
import { createClient } from '@/utils/supabase/server'

import { defaultMetadata } from '@/config/metadata'
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

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Quiz',
  description: 'Quiz',
}

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
  const { id } = await params
  const { type } = await searchParams

  const supabase = await createClient()

  const { data: figure, error } = await supabase.from('historicalFigures').select('*').eq('id', id).single()

  if (error || !figure) {
    console.error('Error fetching historical figure:', error)
    return notFound()
  }

  return (
    <Screen>
      <ScreenHeader title={`Quiz: ${figure.name}`} description={type === 'ai' ? `AI-generated quiz about ${figure.name}` : `Add questions to test knowledge about ${figure.name}`} />

      {type === 'ai' ? <AIQuiz figure={figure} /> : <ManualQuiz figure={figure} />}
    </Screen>
  )
}
