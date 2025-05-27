'use client'

import { ViewMode } from '@/types'
import { Grid, List } from 'lucide-react'

import { Button } from './button'

interface ViewToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button variant={value === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => onChange('grid')}>
        <Grid className="w-4 h-4" />
      </Button>
      <Button variant={value === 'list' ? 'default' : 'outline'} size="sm" onClick={() => onChange('list')}>
        <List className="w-4 h-4" />
      </Button>
    </div>
  )
}
