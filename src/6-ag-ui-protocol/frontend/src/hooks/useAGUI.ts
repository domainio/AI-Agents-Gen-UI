import { useState } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export const useAGUI = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string): Promise<void> => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/awp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: 'main-thread',
          runId: Date.now().toString(),
          messages: [{ id: userMessage.id, role: 'user', content }],
          tools: [],
          context: []
        })
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      // Extract assistant response from SSE
      const responseText = await response.text()
      const assistantContent = responseText
        .split('\n')
        .filter(line => line.startsWith('data: '))
        .map(line => {
          try {
            const event = JSON.parse(line.replace('data: ', ''))
            return event.type === 'TEXT_MESSAGE_CONTENT' ? event.delta : ''
          } catch {
            return ''
          }
        })
        .join('')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${(error as Error).message}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    sendMessage
  }
} 