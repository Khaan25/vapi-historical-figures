'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HistoricalFigure } from '@/types'
import { Star } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'

interface HistoricalFigureCardProps {
  figure: HistoricalFigure
  viewMode: 'grid' | 'list'
}

export function HistoricalFigureCard({ figure, viewMode }: HistoricalFigureCardProps) {
  // const initials = figure.name
  //   .split(' ')
  //   .map((n) => n[0])
  //   .join('')

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden bg-white border-0 shadow-sm">
        <CardContent className="flex items-center p-4">
          <div className={`w-12 h-12 ${figure.accent} rounded-full flex items-center justify-center mr-4`}>
            <Image src={figure.image} alt={figure.name} width={48} height={48} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 truncate">{figure.name}</h3>
              <Badge variant="secondary" className="ml-2">
                {figure.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 truncate">{figure.title}</p>
          </div>
          <Link href={`/call/${figure.id}`} className="ml-4">
            <Button variant="default" size="sm">
              Chat
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-white border-0 shadow-sm">
      <CardContent className="p-0">
        <div className={`h-32 ${figure.accent} flex items-center justify-center relative`}>
          <Image src={figure.image} alt={figure.name} width={128} height={128} />
          <Badge variant="secondary" className="absolute top-2 right-2">
            {figure.category}
          </Badge>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{figure.name}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{figure.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">{figure.title}</p>
          <Link href={`/call/${figure.id}`}>
            <Button className="w-full" size="sm">
              Start Chat
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
