import React from 'react'
import '../styles/TypingIndicator.css'

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default TypingIndicator 