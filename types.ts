import { Enums } from './database.types'

export type Message = { success: string } | { error: string; error_description: string } | { message: string }
export type MessageParams = Message & { callbackUrl?: string }

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

export type Category = Enums<'categories'>
export const CATEGORIES = {
  SCIENTISTS: 'scientists',
  ARTISTS: 'artists',
  PHILOSOPHERS: 'philosophers',
  LEADERS: 'leaders',
  OTHERS: 'others',
} as const satisfies Record<string, Category>
export const categories = Object.values(CATEGORIES)
