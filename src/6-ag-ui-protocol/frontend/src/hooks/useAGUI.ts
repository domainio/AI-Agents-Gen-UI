import { useState } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Message creation utilities
const createMessage = (role: 'user' | 'assistant', content: string, idOffset = 0): Message => ({
  id: (Date.now() + idOffset).toString(),
  role,
  content,
  timestamp: new Date()
})

const createUserMessage = (content: string): Message => createMessage('user', content)
const createAssistantMessage = (content: string): Message => createMessage('assistant', content, 1)
const createErrorMessage = (error: Error): Message => createMessage('assistant', `Error: ${error.message}`, 1)

// API communication
const sendToAGUIBackend = async (userMessage: Message): Promise<string> => {
  const response = await fetch('http://localhost:8000/awp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: 'main-thread',
      runId: Date.now().toString(),
      messages: [{ id: userMessage.id, role: 'user', content: userMessage.content }],
      tools: [],
      context: []
    })
  })

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`)
  }

  return response.text()
}

// Response processing
const parseAGUIResponse = (responseText: string): string => {
  return responseText
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
}

export const useAGUI = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const sendMessage = async (content: string): Promise<void> => {
    // 1. Create and add user message
    const userMessage = createUserMessage(content)
    addMessage(userMessage)
    setIsLoading(true)

    try {
      // 2. Send to AG-UI backend
      const responseText = await sendToAGUIBackend(userMessage)
      
      // 3. Parse response and create assistant message
      const assistantContent = parseAGUIResponse(responseText)
      const assistantMessage = createAssistantMessage(assistantContent)
      addMessage(assistantMessage)
      
    } catch (error) {
      // 4. Handle errors by creating error message
      const errorMessage = createErrorMessage(error as Error)
      addMessage(errorMessage)
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