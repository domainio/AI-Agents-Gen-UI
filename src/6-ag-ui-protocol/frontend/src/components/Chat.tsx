import React, { useState } from 'react'
import { useAGUI } from '../hooks/useAGUI'
import { LoadingIndicator } from './LoadingIndicator'
import { WelcomeMessage } from './WelcomeMessage'

export const Chat: React.FC = () => {
  const { messages, isLoading, sendMessage } = useAGUI()
  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    await sendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🤖 AG-UI Protocol Chat</h1>
        <p>Direct connection to LangChain React Agent</p>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && <WelcomeMessage />}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && <LoadingIndicator />}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="chat-send-button"
        >
          Send
        </button>
      </form>
    </div>
  )
} 