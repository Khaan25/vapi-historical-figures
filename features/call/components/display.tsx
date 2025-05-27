// import { Message, MessageTypeEnum } from "@/types/conversation.type";
import React, { useEffect } from 'react'
import { shows } from '@/data/shows'
import { Artifact, ClientMessage, MessagePlan, ServerMessageStatusUpdate } from '@vapi-ai/web/dist/api'

import { Message, MessageTypeEnum } from '@/types/conversation.type'
import { vapi } from '@/lib/vapi'

import { useVapi } from '../hooks/useVapi'
import { ShowsComponent } from './shows'
import { Ticket } from './ticket'
import { TranscriptView } from './TranscriptView'

function Display() {
  const [showList, setShowList] = React.useState<Array<(typeof shows)[number]>>([])

  const [status, setStatus] = React.useState<'show' | 'confirm' | 'ticket'>('show')

  const [selectedShow, setSelectedShow] = React.useState<(typeof shows)[number] | null>(null)

  const [confirmDetails, setConfirmDetails] = React.useState<{}>()
  const { messages, activeTranscript } = useVapi()

  useEffect(() => {
    const onMessageUpdate = (message: Message) => {
      if (message.type === MessageTypeEnum.TOOL_CALLS) {
        console.log('message :', message)

        if (message.toolCalls[0].name === 'suggestShows') {
          console.log('✅')
        }
      }

      if (message.type === 'tool-calls' && message.toolCalls[0].function.name === 'suggestShows') {
        setStatus('show')
        vapi.send({
          type: MessageTypeEnum.ADD_MESSAGE,
          message: {
            role: 'system',
            content: `Here is the list of suggested shows: ${JSON.stringify(shows.map((show) => show.title))}`,
          },
        })
        setShowList(shows)
      } else if (message.type === MessageTypeEnum.TOOL_CALLS && (message.toolCalls[0].name === 'confirmDetails' || message.toolCalls[0].name === 'bookTickets')) {
        const params = message.toolCalls[0].parameters

        setConfirmDetails(params)
        console.log('parameters', params)

        const result = shows.find((show) => show.title.toLowerCase() == params.show.toLowerCase())
        setSelectedShow(result ?? shows[0])

        setStatus(message.toolCalls[0].name === 'confirmDetails' ? 'confirm' : 'ticket')
      }
    }

    const reset = () => {
      setStatus('show')
      setShowList([])
      setSelectedShow(null)
    }

    vapi.on('message', onMessageUpdate)
    vapi.on('call-end', reset)
    return () => {
      vapi.off('message', onMessageUpdate)
      vapi.off('call-end', reset)
    }
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <TranscriptView messages={messages} activeTranscript={activeTranscript} />

      <div>
        {showList.length > 0 && status == 'show' ? <ShowsComponent showList={showList} /> : null}
        {status !== 'show' ? <Ticket type={status} show={selectedShow ?? shows[0]} params={confirmDetails} /> : null}
      </div>
    </div>
  )
}

export { Display }
