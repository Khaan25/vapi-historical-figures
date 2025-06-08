'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HistoricalFigure } from '@/types'
import { BrainCircuit, FileQuestion } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface QuizTypeModalProps {
  figure: HistoricalFigure
}

export function QuizTypeModal({ figure }: QuizTypeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const quizTypes = [
    {
      id: 'manual',
      title: 'Manual Quiz',
      description: `Pre-defined questions about ${figure.name}`,
      icon: FileQuestion,
      onClick: () => {
        router.push(`/app/quizzes/${figure.id}?type=manual`)
        setIsOpen(false)
      },
    },
    {
      id: 'ai',
      title: 'AI Quiz',
      description: `AI-generated questions about ${figure.name}`,
      icon: BrainCircuit,
      onClick: () => {
        router.push(`/app/quizzes/${figure.id}?type=ai`)
        setIsOpen(false)
      },
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors" size="lg">
          Start Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Quiz Type for {figure.name}</DialogTitle>
          <DialogDescription>Select how you would like to be quizzed about {figure.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4">
          {quizTypes.map(({ id, title, description, icon: Icon, onClick }) => (
            <Button key={id} variant="outline" className="h-auto cursor-pointer py-8 flex flex-col gap-4 hover:bg-accent hover:text-accent-foreground transition-all" onClick={onClick}>
              <Icon className="size-12" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-lg">{title}</span>
                <span className="text-sm text-muted-foreground text-balance text-center">{description}</span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
