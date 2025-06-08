'use client'

import { useMemo, useState } from 'react'
import { HistoricalCardView } from '@/features/dashboard/components/historical-card-view'
import { HistoricalFigure } from '@/types'
import { Grid2X2Icon, ListIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { QuizTypeModal } from './quiz-type-modal'

interface QuizCharactersListProps {
  figures: HistoricalFigure[]
}

export function QuizCharactersList({ figures }: QuizCharactersListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredFigures = useMemo(() => {
    if (!searchTerm) return figures

    const searchLower = searchTerm.toLowerCase()
    return figures.filter(
      (figure) => figure.name.toLowerCase().includes(searchLower) || figure.category?.toLowerCase().includes(searchLower) || figure.description?.toLowerCase().includes(searchLower)
    )
  }, [figures, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Search by name or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full" />
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
            <Grid2X2Icon className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredFigures.length === 0 && (
        <div className="text-center border-dashed border-2 rounded-md border-border py-12">
          <p className="text-gray-500">No historical figures found matching your search.</p>
        </div>
      )}

      <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4')}>
        {filteredFigures.map((figure) => (
          <HistoricalCardView key={figure.id} figure={figure}>
            <QuizTypeModal figure={figure} />
          </HistoricalCardView>
        ))}
      </div>
    </div>
  )
}
