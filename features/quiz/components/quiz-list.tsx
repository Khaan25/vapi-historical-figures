import Link from 'next/link'
import { HistoricalCardView } from '@/features/dashboard/components/historical-card-view'

import { Button } from '@/components/ui/button'

import { getQuizzes } from '../queries'

type QuizListProps = {
  quizzes: NonNullable<Awaited<ReturnType<typeof getQuizzes>>>['data']
}

export const QuizList = ({ quizzes }: QuizListProps) => {
  if (!quizzes || quizzes.length === 0) {
    return <div>No quizzes found</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <HistoricalCardView
          key={quiz.id}
          figure={{
            badge: quiz.historicalFigure.category,
            imageUrl: quiz.historicalFigure.imageUrl ?? '',
            name: quiz.historicalFigure.name,
            description: quiz.historicalFigure.description ?? '',
          }}
        >
          <Link href={`/app/quizzes/${quiz.historicalFigureId}/start`} className="block">
            <Button className="w-full backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors" size="lg">
              Start Quiz
            </Button>
          </Link>
        </HistoricalCardView>
      ))}
    </div>
  )
}
