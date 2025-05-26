import type { Message, EventType, RunAgentInput } from '@ag-ui/core'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface AgentEvent {
  type: EventType
  messageId?: string
  delta?: string
  role?: string
  threadId?: string
  runId?: string
}

export type { Message, EventType, RunAgentInput } 