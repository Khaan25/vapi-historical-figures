'use client'

import Link from 'next/link'
import { HistoricalFigure, ViewMode } from '@/types'

import { Button } from '@/components/ui/button'

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

  return (
    <HistoricalCardView
      figure={{
        badge: figure.category,
        imageUrl: figure.imageUrl,
        name: figure.name,
        description: figure.description,
      }}
    >
      <Link href={`/app/call/${figure.id}`} className="block">
        <Button className="w-full backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors" size="lg">
          Start Call
        </Button>
      </Link>
    </HistoricalCardView>
  )
}
