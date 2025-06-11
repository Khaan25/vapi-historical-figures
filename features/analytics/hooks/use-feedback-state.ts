'use client'

import { useEffect, useState } from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'

export type CategoryScore = {
  name: string
  score: number
  comment: string
}

export type HistoricalFigureWithFeedback = {
  id: string
  name: string
  imageUrl: string
  feedbacks: Array<{
    feedbackId: string
    quizId: string
    totalScore: number
    categoryScores: CategoryScore[]
    strengths: string[]
    areasForImprovement: string[]
    finalAssessment: string
    createdAt: string
  }>
}

export type Feedback = HistoricalFigureWithFeedback['feedbacks'][number]

export function useFeedbackState(historicalFigures: HistoricalFigureWithFeedback[]) {
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(historicalFigures.length > 0 ? historicalFigures[0].id : null)
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    if (selectedFigureId) {
      const figure = historicalFigures.find((f) => f.id === selectedFigureId)
      if (figure && figure.feedbacks.length > 0 && !selectedFeedbackId) {
        setSelectedFeedbackId(figure.feedbacks[0].feedbackId)
      }
    }
  }, [selectedFigureId, historicalFigures, selectedFeedbackId])

  const selectedFigure = historicalFigures.find((f) => f.id === selectedFigureId)
  const selectedFeedback = selectedFigure?.feedbacks.find((f) => f.feedbackId === selectedFeedbackId)

  return {
    selectedFigureId,
    setSelectedFigureId,
    selectedFeedbackId,
    setSelectedFeedbackId,
    selectedFigure,
    selectedFeedback,
    isSheetOpen,
    setIsSheetOpen,
    isMobile,
  }
}
