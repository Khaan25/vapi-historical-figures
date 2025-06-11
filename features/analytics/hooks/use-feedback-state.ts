'use client'

import { useState } from 'react'

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

export type FeedbackWithFigure = {
  feedbackId: string
  quizId: string
  totalScore: number
  categoryScores: CategoryScore[]
  strengths: string[]
  areasForImprovement: string[]
  finalAssessment: string
  createdAt: string
  figure: {
    id: string
    name: string
    imageUrl: string
  }
}

export function useFeedbackState(feedbacks: FeedbackWithFigure[]) {
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(feedbacks.length > 0 ? feedbacks[0].feedbackId : null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  const selectedFeedback = feedbacks.find((f) => f.feedbackId === selectedFeedbackId)

  return {
    selectedFeedbackId,
    setSelectedFeedbackId,
    selectedFeedback,
    isSheetOpen,
    setIsSheetOpen,
    isMobile,
  }
}
