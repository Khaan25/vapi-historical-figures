import Image from 'next/image'
import Link from 'next/link'
import { HistoricalFigure } from '@/types'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'

type HistoricalCardListViewProps = {
  figure: HistoricalFigure
}

export const HistoricalCardListView = ({ figure }: HistoricalCardListViewProps) => {
  return (
    <Card className="overflow-hidden py-0 bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex items-center p-6 gap-4">
        <Image src={figure.imageUrl} alt={figure.name} width={64} height={64} className="size-16 object-cover flex-shrink rounded-full border-2 border-gray-100" />

        <div className="flex-1 min-w-0">
          <h3 className="text-lg flex items-center gap-2 font-semibold text-gray-900 truncate">
            {figure.name}

            <Badge variant="secondary" className="px-1 py-0.5 text-[10px] font-medium capitalize">
              {figure.category}
            </Badge>
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{figure.description}</p>

          <div className="flex items-center justify-between gap-4"></div>
        </div>
        <Link href={`/app/call/${figure.id}`} className="ml-6 flex-shrink-0">
          <Button variant="default" size="lg" className="w-full">
            Chat
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
