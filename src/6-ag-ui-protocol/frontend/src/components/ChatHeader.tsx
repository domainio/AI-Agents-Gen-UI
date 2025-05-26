import React from 'react'
import '../styles/ChatHeader.css'

const ChatHeader: React.FC = () => {
  return (
    <div className="chat-header">
      <h1>🤖 AG-UI Protocol Chat</h1>
      <p>Powered by LangChain React Agent</p>
    </div>
  )
}

export default ChatHeader 