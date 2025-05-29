'use client'

import { useEffect, useRef } from 'react'
import { HistoricalFigure } from '@/types'

import { Message, MessageTypeEnum, TranscriptMessage } from '@/types/conversation.type'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TranscriptViewProps {
  messages: Message[]
  activeTranscript: TranscriptMessage | null
  character: HistoricalFigure
  userImage: string
}

export function TranscriptView({ messages, activeTranscript, character, userImage }: TranscriptViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeTranscript])

  // Filter out empty messages and those without content/transcript
  const filteredMessages = messages.filter((message) => {
    if (message.type === MessageTypeEnum.TRANSCRIPT) {
      return message.transcript && message.transcript.trim() !== ''
    }

    // @ts-expect-error type error
    return message.content && message.content.trim() !== ''
  })

  return (
    <div className="relative size-full bg-background border-l border-border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-medium">Live Transcript</h2>
        </div>
      </div>

      <div className="flex flex-col space-y-4 p-4 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {filteredMessages.map((message, index) => (
          // @ts-expect-error type error
          <div key={index} className={cn('group flex items-start space-x-2 relative', message.role === 'user' ? 'justify-end' : 'justify-start')}>
            {/* @ts-expect-error type error */}
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Avatar className="w-8 h-8 border-2 border-border">
                  <AvatarImage className="object-cover" src={character.imageUrl} alt={character.name.slice(0, 2)} />
                  <AvatarFallback className="text-2xl bg-border">{character.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
            )}
            {/* @ts-expect-error type error */}
            <div className={cn('relative flex flex-col max-w-[80%] space-y-2', message.role === 'user' ? 'items-end' : 'items-start')}>
              {/* @ts-expect-error type error */}
              <div className={cn('rounded-2xl px-4 py-2 inline-block break-words', message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900')}>
                {/* @ts-expect-error type error */}
                <p className="text-sm">{message.type === MessageTypeEnum.TRANSCRIPT ? message.transcript : message.content}</p>
              </div>
            </div>
            {/* @ts-expect-error type error */}
            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Avatar className="w-8 h-8 border-2 border-border">
                  <AvatarImage className="object-cover" src={userImage} alt="You" />
                  <AvatarFallback className="text-2xl bg-border">You</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        ))}

        {activeTranscript && activeTranscript.transcript.trim() !== '' && (
          <div className="group flex items-start space-x-2 justify-start">
            <div className="h-8 w-8 rounded-full bg-blue-600/50 flex items-center justify-center">
              <span className="text-sm font-medium text-white">AI</span>
            </div>
            <div className="relative flex flex-col max-w-[80%] space-y-2 items-start">
              <div className="rounded-2xl px-4 py-2 inline-block break-words bg-gray-100/80">
                {/* <div className="flex items-center gap-2 mb-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-600/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-600/40 animate-bounce"></div>
                  </div>
                </div> */}
                <p className="text-sm text-gray-900">{activeTranscript.transcript}</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
