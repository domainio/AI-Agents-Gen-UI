import React, { createContext, useContext, useState, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AGUIContextType {
  messages: Message[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
}

const AGUIContext = createContext<AGUIContextType | null>(null)

export const useAGUI = () => {
  const context = useContext(AGUIContext)
  if (!context) {
    throw new Error('useAGUI must be used within AGUIRuntime')
  }
  return context
}

interface AGUIRuntimeProps {
  children: React.ReactNode
  runtimeUrl: string
}

export const AGUIRuntime: React.FC<AGUIRuntimeProps> = ({ children, runtimeUrl }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Send to AG-UI backend
      const response = await fetch(runtimeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          threadId: 'main-thread',
          runId: Date.now().toString(),
          messages: [{
            id: userMessage.id,
            role: 'user',
            content
          }],
          tools: [],
          context: []
        })
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      // Parse SSE response
      const responseText = await response.text()
      const events = responseText.split('\n').filter(line => line.startsWith('data: '))
      
      let assistantContent = ''
      
      for (const event of events) {
        try {
          const eventData = JSON.parse(event.replace('data: ', ''))
          if (eventData.type === 'TEXT_MESSAGE_CONTENT') {
            assistantContent += eventData.delta
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
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
  }, [runtimeUrl])

  return (
    <AGUIContext.Provider value={{ messages, isLoading, sendMessage }}>
      {children}
    </AGUIContext.Provider>
  )
} 