'use client'

import { useState } from 'react'
import { HistoricalFigure, ViewMode } from '@/types'

import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/ui/search-bar'
import { ViewToggle } from '@/components/ui/view-toggle'
import { Screen } from '@/components/common/screen'
import { ScreenHeader } from '@/components/common/screen-header'

import { HistoricalFigureCard } from './historical-figure-card'

type HistoricalCharactersListProps = {
  figures: HistoricalFigure[]
}

export const HistoricalCharactersList = ({ figures }: HistoricalCharactersListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredFigures = figures.filter((figure) => figure.name.toLowerCase().includes(searchTerm.toLowerCase()) || figure.category.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Screen>
      <ScreenHeader title="Historical Figures" description="Choose a historical figure to start your conversation" />

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or category..." />
        </div>

        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {filteredFigures.length === 0 && (
        <div className="text-center border-dashed border-2 rounded-md border-border py-12">
          <p className="text-gray-500">No historical figures found matching your search.</p>
        </div>
      )}

      <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4')}>
        {filteredFigures.map((figure) => (
          <HistoricalFigureCard key={figure.id} figure={figure} viewMode={viewMode} />
        ))}
      </div>
    </Screen>
  )
}
