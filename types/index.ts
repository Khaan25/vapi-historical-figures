export interface HistoricalFigure {
  id: string
  name: string
  title: string
  description: string
  image: string
  rating: number
  conversations: string
  category: string
  era: string
  accent: string
}

export type ViewMode = 'grid' | 'list'
