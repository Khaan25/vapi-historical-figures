export enum MessageTypeEnum {
  TRANSCRIPT = 'transcript',
  FUNCTION_CALL = 'function-call',
  FUNCTION_CALL_RESULT = 'function-call-result',
  ADD_MESSAGE = 'add-message',
  TOOL_CALLS = 'tool-calls',
  TOOL_CALL_RESULT = 'tool-call-result',
}

export enum MessageRoleEnum {
  USER = 'user',
  SYSTEM = 'system',
  ASSISTANT = 'assistant',
}

export enum TranscriptMessageTypeEnum {
  PARTIAL = 'partial',
  FINAL = 'final',
}

export interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT
  role: MessageRoleEnum
  transcriptType: TranscriptMessageTypeEnum
  transcript: string
}

export interface ToolCallMessage extends BaseMessage {
  type: MessageTypeEnum.TOOL_CALLS
  toolCall: {
    name: string
    parameters: any
  }
}

export interface FunctionCallMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL
  functionCall: {
    name: string
    parameters: any
  }
}

export interface FunctionCallResultMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL_RESULT
  functionCallResult: {
    forwardToClientEnabled?: boolean
    result: any
    [a: string]: any
  }
}

export interface BaseMessage {
  type: MessageTypeEnum
}

export type Message = TranscriptMessage | FunctionCallMessage | FunctionCallResultMessage
