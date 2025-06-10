import { Message, MessageTypeEnum, TranscriptMessage } from '@/types/conversation.type'

export const formatMessages = (messages: Message[]) => {
  return messages.map((message) => {
    if (message.type === MessageTypeEnum.TRANSCRIPT) {
      const transcriptMessage = message as TranscriptMessage
      return {
        role: transcriptMessage.role.toLowerCase(),
        content: transcriptMessage.transcript,
      }
    }
    return {
      role: 'system',
      content: '',
    }
  })
}
