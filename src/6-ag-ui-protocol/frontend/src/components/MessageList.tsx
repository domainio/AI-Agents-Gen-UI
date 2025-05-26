import React from 'react'
import type { ChatMessage } from '../types'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import '../styles/MessageList.css'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  messagesEndRef 
}) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      
      {isLoading && messages.length > 0 && !messages[messages.length - 1]?.isStreaming && (
        <TypingIndicator />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList 