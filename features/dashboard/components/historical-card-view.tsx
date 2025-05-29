import Image from 'next/image'
import Link from 'next/link'
import { HistoricalFigure } from '@/types'

import { ProgressiveBlur } from '@/components/ui/progressive-blur'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'

type HistoricalCardViewProps = {
  figure: HistoricalFigure
}

export const HistoricalCardView = ({ figure }: HistoricalCardViewProps) => {
  return (
    <Card className="group relative isolate h-[400px] overflow-hidden border-0 py-0 shadow-lg">
      <ProgressiveBlur className="pointer-events-none z-10 absolute bottom-0 left-0 h-[75%] w-full" blurIntensity={0.5} />

      <Badge variant="secondary" className="absolute top-2 right-2 z-20 bg-white/10 hover:bg-white/20 text-white capitalize backdrop-blur-sm">
        {figure.category}
      </Badge>

      <div className="absolute inset-0">
        <Image src={figure.imageUrl} alt={figure.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
      </div>

      <CardContent className="relative h-full z-20 p-6 flex flex-col justify-between">
        <div className="space-y-4 mt-auto">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">{figure.name}</h3>
            <p className="text-sm text-gray-200">{figure.description}</p>
          </div>

          <Link href={`/app/call/${figure.id}`} className="block">
            <Button className="w-full backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors" size="lg">
              Start Chat
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
