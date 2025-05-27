import React from 'react'

export const LoadingIndicator: React.FC = () => {
  return (
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
  )
} 