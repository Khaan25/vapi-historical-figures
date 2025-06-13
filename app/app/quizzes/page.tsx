import { Metadata } from 'next'
import Link from 'next/link'
import { QuizList } from '@/features/quiz/components/quiz-list'
import { getQuizzes } from '@/features/quiz/queries'

import { defaultMetadata } from '@/config/metadata'
import { buttonVariants } from '@/components/ui/button'
import { Screen } from '@/components/common/screen'
import { ScreenHeader } from '@/components/common/screen-header'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Quizzes',
  description: 'Quizzes',
}

export default async function QuizPage() {
  const { data: quizzes, error } = await getQuizzes()

  if (error) {
    console.error('Error fetching historical figures:', error)
    return <div>Error loading historical figures</div>
  }

  return (
    <Screen>
      <ScreenHeader title="Historical Figures Quiz" description="Choose a historical figure to start your conversation">
        <Link href="/app/quizzes/create" className={buttonVariants()}>
          Create Quiz
        </Link>
      </ScreenHeader>

      <QuizList quizzes={quizzes} />
    </Screen>
  )
}
