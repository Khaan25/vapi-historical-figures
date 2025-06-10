'use client'

import { useEffect, useState } from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'

import { getHistoricalFiguresWithFeedback } from '../queries'

type QueryResult = Awaited<ReturnType<typeof getHistoricalFiguresWithFeedback>>
export type HistoricalFigureWithFeedback = NonNullable<QueryResult['data']> extends (infer T)[] ? T : never
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
