import React, { useState } from 'react'
import { useAGUI } from './AGUIRuntime'

export const SimpleChat: React.FC = () => {
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
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Hello! I'm your AI assistant. I can help you with:</p>
            <ul>
              <li>🧮 Calculations (try: "What is 25 * 8 + 15?")</li>
              <li>🌤️ Weather information (try: "What's the weather in London?")</li>
              <li>📈 Stock prices (try: "What's the Tesla stock price?")</li>
              <li>❓ General questions</li>
            </ul>
          </div>
        )}
        
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
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
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