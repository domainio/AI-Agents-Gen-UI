import React, { useState, useCallback, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage, AgentEvent, Message, RunAgentInput } from '../types'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import '../styles/ChatApp.css'

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [threadId] = useState(() => uuidv4())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleEventStream = useCallback(async (runId: string, userMessage: ChatMessage) => {
    let currentMessageId = ''
    let currentContent = ''

    const runAgentInput: RunAgentInput = {
      threadId,
      runId,
      messages: [...messages, userMessage].map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content
      })) as Message[],
      tools: [],
      context: []
    }

    try {
      const response = await fetch('http://localhost:8000/awp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runAgentInput)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const eventData = line.slice(6)
            if (eventData === '[DONE]') continue

            try {
              const event: AgentEvent = JSON.parse(eventData)
              
              switch (event.type) {
                case 'RUN_STARTED':
                  console.log('Run started:', event)
                  break
                  
                case 'TEXT_MESSAGE_START':
                  currentMessageId = event.messageId || uuidv4()
                  currentContent = ''
                  
                  const assistantMessage: ChatMessage = {
                    id: currentMessageId,
                    role: 'assistant',
                    content: '',
                    timestamp: new Date(),
                    isStreaming: true
                  }
                  
                  setMessages(prev => [...prev, assistantMessage])
                  break
                  
                case 'TEXT_MESSAGE_CONTENT':
                  if (event.messageId === currentMessageId && event.delta) {
                    currentContent += event.delta
                    
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === currentMessageId 
                          ? { ...msg, content: currentContent }
                          : msg
                      )
                    )
                  }
                  break
                  
                case 'TEXT_MESSAGE_END':
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === currentMessageId 
                        ? { ...msg, isStreaming: false }
                        : msg
                    )
                  )
                  break
                  
                case 'RUN_FINISHED':
                  console.log('Run finished:', event)
                  setIsLoading(false)
                  break
                  
                case 'RUN_ERROR':
                  console.error('Run error:', event)
                  setIsLoading(false)
                  break
              }
            } catch (parseError) {
              console.error('Failed to parse event:', parseError)
            }
          }
        }
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setIsLoading(false)
    }
  }, [threadId, messages])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const runId = uuidv4()
    await handleEventStream(runId, userMessage)
  }, [isLoading, handleEventStream])

  return (
    <div className="chat-app">
      <ChatHeader />
      <MessageList 
        messages={messages} 
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}

export default ChatApp 