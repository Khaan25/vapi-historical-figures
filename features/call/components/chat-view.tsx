'use client'

import { useVapi } from '../hooks/useVapi'
import { TranscriptView } from './TranscriptView'
import { HistoricalFigure } from '@/types'

type ChatViewProps = {
  character: HistoricalFigure
  userImage: string
}

function ChatView({ character, userImage }: ChatViewProps) {
  const { messages, activeTranscript } = useVapi({ character })

  return (
    <div className="flex flex-col min-h-screen size-full">
      <TranscriptView messages={messages} activeTranscript={activeTranscript} character={character} userImage={userImage} />
    </div>
  )
}

export { ChatView as Display }
