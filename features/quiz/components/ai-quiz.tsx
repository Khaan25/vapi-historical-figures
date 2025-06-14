'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HistoricalFigure } from '@/types'
import { Brain, Lightbulb, Loader2, Pencil, Plus, Trash2, Trophy } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { addAIQuizzes, generateQuizQuestions } from '../actions'

interface Question {
  question: string
  id?: string
}

interface AIQuizProps {
  figure: HistoricalFigure
}

const DIFFICULTY_OPTIONS = [
  {
    value: 'easy',
    label: 'Easy',
    description: 'Basic questions about key facts',
    icon: Lightbulb,
    color: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Moderate complexity and detail',
    icon: Brain,
    color: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'Advanced knowledge required',
    icon: Trophy,
    color: 'bg-purple-100 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
] as const

export function AIQuiz({ figure }: AIQuizProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<{ index: number; value: string } | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [showDifficultySelect, setShowDifficultySelect] = useState(true)

  const generateQuestions = async (difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      setIsGenerating(true)
      const { data, error } = await generateQuizQuestions(figure, difficulty)

      if (error || !data) {
        toast.error(error || 'Failed to generate questions')
        return false
      }

      setQuestions(data.map((question) => ({ question })))
      setShowDifficultySelect(false)
      return true
    } catch (error) {
      console.error('Error generating questions:', error)
      toast.error('An unexpected error occurred')
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty)
  }

  const handleContinue = async () => {
    if (!selectedDifficulty) {
      toast.error('Please select a difficulty level')
      return
    }
    await generateQuestions(selectedDifficulty)
  }

  const handleChangeDifficulty = () => {
    setQuestions([])
    setSelectedDifficulty(null)
    setShowDifficultySelect(true)
  }

  const handleUpdateQuestion = (index: number) => {
    if (editingQuestion?.index === index) {
      const updatedQuestions = [...questions]
      updatedQuestions[index] = { ...updatedQuestions[index], question: editingQuestion.value }
      setQuestions(updatedQuestions)
      setEditingQuestion(null)
    } else {
      setEditingQuestion({ index, value: questions[index].question })
    }
  }

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return
    setQuestions([...questions, { question: newQuestion }])
    setNewQuestion('')
  }

  const handleSave = async () => {
    try {
      const { error } = await addAIQuizzes({ questions }, figure.id)

      if (error) {
        toast.error(error)
        return
      }

      toast.success('Questions saved successfully!')
      router.push(`/app/quizzes/${figure.id}/start`)
    } catch (error) {
      console.error('Error saving questions:', error)
      toast.error('Failed to save questions')
    }
  }

  if (showDifficultySelect) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Select Difficulty Level</h2>
        <p className="text-muted-foreground text-center">Choose the difficulty level for your quiz questions</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {DIFFICULTY_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.value}
                className={cn(
                  'relative p-6 cursor-pointer transition-all hover:scale-[1.02]',
                  option.color,
                  option.borderColor,
                  selectedDifficulty === option.value && 'ring-2 ring-primary',
                  isGenerating && 'opacity-50 pointer-events-none'
                )}
                onClick={() => !isGenerating && handleDifficultySelect(option.value)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold text-lg">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <Button className="w-full" size="lg" onClick={handleContinue} disabled={!selectedDifficulty || isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Questions...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-lg">Generating {selectedDifficulty} questions...</p>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generated Questions</h2>
          <Button variant="outline" size="sm" onClick={handleChangeDifficulty} disabled={isGenerating}>
            Change Difficulty
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              {editingQuestion?.index === index ? (
                <Input value={editingQuestion.value} onChange={(e) => setEditingQuestion({ index, value: e.target.value })} className="mb-2" />
              ) : (
                <p className="text-lg">{question.question}</p>
              )}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleUpdateQuestion(index)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  {editingQuestion?.index === index ? 'Save' : 'Edit'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(index)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input placeholder="Add a new question..." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
            <Button onClick={handleAddQuestion}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <Button className="w-full" onClick={handleSave} disabled={isGenerating}>
          Save & Continue
        </Button>
      </div>
    </Card>
  )
}
