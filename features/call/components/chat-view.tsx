'use client'

import { HistoricalFigure } from '@/types'

import { useVapi } from '../hooks/useVapi'
import { VapiCallProps } from '../types'
import { TranscriptView } from './TranscriptView'

type ChatViewProps = VapiCallProps & {
  character: HistoricalFigure
  userImage: string
}

function ChatView({ character, userImage, systemPrompt, firstMessage }: ChatViewProps) {
  const { messages, activeTranscript } = useVapi({ character, systemPrompt, firstMessage })

  return (
    <div className="flex flex-col min-h-screen size-full">
      <TranscriptView messages={messages} activeTranscript={activeTranscript} character={character} userImage={userImage} />
    </div>
  )
}

export { ChatView as Display }
