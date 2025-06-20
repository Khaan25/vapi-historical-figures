import { Metadata } from 'next'
import { QuizCharactersList } from '@/features/quiz/components/quiz-characters-list'
import { createClient } from '@/utils/supabase/server'

import { defaultMetadata } from '@/config/metadata'
import { Screen } from '@/components/common/screen'
import { ScreenHeader } from '@/components/common/screen-header'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Create Quiz',
  description: 'Create a quiz',
}

export default async function QuizPage() {
  const supabase = await createClient()

  const { data: figures, error } = await supabase.from('historicalFigures').select('*').order('name', { ascending: true })

  if (error) {
    console.error('Error fetching historical figures:', error)
    return <div>Error loading historical figures</div>
  }

  return (
    <Screen>
      <ScreenHeader title="Create Quiz" description="Choose a historical figure to create a quiz" />
      <QuizCharactersList figures={figures} />
    </Screen>
  )
}
