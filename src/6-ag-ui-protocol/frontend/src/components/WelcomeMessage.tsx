import React from 'react'

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="welcome-message">
      <p>Hello! I'm your AI assistant. I can help you with:</p>
      <ul>
        <li>🧮 Calculations (try: "What is 25 * 8 + 15?")</li>
        <li>🌤️ Weather information (try: "What's the weather in London?")</li>
        <li>📈 Stock prices (try: "What's the Tesla stock price?")</li>
        <li>❓ General questions</li>
      </ul>
    </div>
  )
} 