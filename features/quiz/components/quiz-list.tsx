import Link from 'next/link'
import { Tables } from '@/database.types'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CardContent, CardHeader } from '@/components/ui/card'

type QuizWithFigure = Tables<'quizzes'> & {
  historicalFigure: {
    id: string
    name: string
    description: string | null
    imageUrl: string | null
  }
}

type QuizListProps = {
  quizzes: QuizWithFigure[]
}

export const QuizList = ({ quizzes }: QuizListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <Link key={quiz.id} href={`/app/quizzes/${quiz.historicalFigureId}/start`} className="overflow-hidden">
          <CardHeader className="relative">
            {quiz.historicalFigure.imageUrl && (
              <div className="absolute inset-0">
                <img src={quiz.historicalFigure.imageUrl} alt={quiz.historicalFigure.name} className="object-cover w-full h-full opacity-20" />
              </div>
            )}
            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{quiz.historicalFigure.name}</h3>
                <Badge variant="outline" className={cn(quiz.userId ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500')}>
                  {quiz.userId ? 'manual' : 'ai'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{quiz.historicalFigure.description}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{quiz.type}</p>
          </CardContent>
        </Link>
      ))}
    </div>
  )
}
