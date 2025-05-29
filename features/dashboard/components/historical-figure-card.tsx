'use client'

import { HistoricalFigure, ViewMode } from '@/types'

import { HistoricalCardListView } from './historical-card-list-view'
import { HistoricalCardView } from './historical-card-view'

interface HistoricalFigureCardProps {
  figure: HistoricalFigure
  viewMode: ViewMode
}

export function HistoricalFigureCard({ figure, viewMode }: HistoricalFigureCardProps) {
  if (viewMode === 'list') {
    return <HistoricalCardListView figure={figure} />
  }

  return <HistoricalCardView figure={figure} />
}
