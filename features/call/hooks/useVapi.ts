'use client'

import { useEffect, useState } from 'react'
import { HistoricalFigure } from '@/types'
import { CreateAssistantDTO } from '@vapi-ai/web/dist/api'

import { Message, MessageTypeEnum, TranscriptMessage, TranscriptMessageTypeEnum } from '@/types/conversation.type'
import { vapi } from '@/lib/vapi'

import { CALL_STATUS, VapiCallProps } from '../types'

type UseVapiProps = VapiCallProps & {
  character: HistoricalFigure
}

export function useVapi({ character, systemPrompt, firstMessage }: UseVapiProps) {
  const [isSpeechActive, setIsSpeechActive] = useState(false)
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(CALL_STATUS.INACTIVE)

  const [messages, setMessages] = useState<Message[]>([])

  const [activeTranscript, setActiveTranscript] = useState<TranscriptMessage | null>(null)

  const [audioLevel, setAudioLevel] = useState(0)

  const assistant: Omit<CreateAssistantDTO, 'clientMessages' | 'serverMessages'> = {
    name: character.name,
    firstMessage,
    model: {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
      ],
    },
    voice: {
      provider: '11labs',
      voiceId: 'rW2lcIFbB5AVdzWcOG9n',
    },
    server: {
      url: process.env.NEXT_PUBLIC_SERVER_URL ? process.env.NEXT_PUBLIC_SERVER_URL : 'https://08ae-202-43-120-244.ngrok-free.app/api/webhook',
    },
  }

  useEffect(() => {
    const onSpeechStart = () => setIsSpeechActive(true)
    const onSpeechEnd = () => {
      console.log('Speech has ended')
      setIsSpeechActive(false)
    }

    const onCallStartHandler = () => {
      console.log('Call has started')
      setCallStatus(CALL_STATUS.ACTIVE)
    }

    const onCallEnd = () => {
      console.log('Call has stopped')
      setCallStatus(CALL_STATUS.INACTIVE)
    }

    const onVolumeLevel = (volume: number) => {
      setAudioLevel(volume)
    }

    const onMessageUpdate = (message: Message) => {
      // console.log('message', message);
      if (message.type === MessageTypeEnum.TRANSCRIPT && message.transcriptType === TranscriptMessageTypeEnum.PARTIAL) {
        setActiveTranscript(message)
      } else {
        setMessages((prev) => [...prev, message])
        setActiveTranscript(null)
      }
    }

    const onError = (e: Error) => {
      setCallStatus(CALL_STATUS.INACTIVE)
      console.error(e)
    }

    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('call-start', onCallStartHandler)
    vapi.on('call-end', onCallEnd)
    vapi.on('volume-level', onVolumeLevel)
    vapi.on('message', onMessageUpdate)
    vapi.on('error', onError)

    return () => {
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('call-start', onCallStartHandler)
      vapi.off('call-end', onCallEnd)
      vapi.off('volume-level', onVolumeLevel)
      vapi.off('message', onMessageUpdate)
      vapi.off('error', onError)
    }
  }, [])

  const start = async () => {
    setCallStatus(CALL_STATUS.LOADING)
    const response = vapi.start(assistant as CreateAssistantDTO)

    response.then((res) => {
      console.log('call', res)
    })
  }

  const stop = () => {
    setCallStatus(CALL_STATUS.LOADING)
    vapi.stop()
  }

  const toggleCall = () => {
    if (callStatus == CALL_STATUS.ACTIVE) {
      stop()
    } else {
      start()
    }
  }

  return {
    isSpeechActive,
    callStatus,
    audioLevel,
    activeTranscript,
    messages,
    start,
    stop,
    toggleCall,
  }
}
