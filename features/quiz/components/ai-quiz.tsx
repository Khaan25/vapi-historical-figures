'use client'

import { useEffect, useState } from 'react'
import { HistoricalFigure } from '@/types'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

interface AIQuizProps {
  figure: HistoricalFigure
  difficulty: 'easy' | 'medium' | 'hard'
}

export function AIQuiz({ figure, difficulty }: AIQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    async function generateQuestions() {
      try {
        const response = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            figure,
            difficulty,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate questions')
        }

        const data = await response.json()
        setQuestions(data.questions)
        setIsLoading(false)
      } catch (error) {
        console.error('Error generating questions:', error)
        setIsLoading(false)
      }
    }

    generateQuestions()
  }, [figure, difficulty])

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = parseInt(answer)
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-lg mb-4">
          You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className="text-lg">{question.question}</p>
        </div>

        <RadioGroup value={selectedAnswers[currentQuestion]?.toString()} onValueChange={handleAnswerSelect} className="space-y-3">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        <Button className="w-full" onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}>
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Show Results'}
        </Button>
      </div>
    </Card>
  )
}
