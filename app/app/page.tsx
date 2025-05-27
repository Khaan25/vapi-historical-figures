'use client'

import { useState } from 'react'
import { HistoricalFigure, ViewMode } from '@/types'

import { HistoricalFigureCard } from '@/components/ui/historical-figure-card'
import { SearchBar } from '@/components/ui/search-bar'
import { ViewToggle } from '@/components/ui/view-toggle'

const historicalFigures: HistoricalFigure[] = [
  {
    id: 'isaac-newton',
    name: 'Isaac Newton',
    title: 'Physicist & Mathematician',
    description: 'Revolutionary scientist who formulated the laws of motion and universal gravitation.',
    image: 'https://cdn.midjourney.com/cc26090d-771b-48e4-a154-b8678e6c883c/0_0.png',
    rating: 4.9,
    conversations: '2.5k+',
    category: 'Science',
    era: '17th Century',
    accent: 'bg-blue-600',
  },
  // ... other figures (keeping just one for brevity)
]

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredFigures = historicalFigures.filter(
    (figure) =>
      figure.name.toLowerCase().includes(searchTerm.toLowerCase()) || figure.category.toLowerCase().includes(searchTerm.toLowerCase()) || figure.era.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historical Figures</h1>
        <p className="text-gray-600">Choose a historical figure to start your conversation</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name, category, or era..." />
        </div>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filteredFigures.map((figure) => (
          <HistoricalFigureCard key={figure.id} figure={figure} viewMode={viewMode} />
        ))}
      </div>

      {filteredFigures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No historical figures found matching your search.</p>
        </div>
      )}
    </div>
  )
}
