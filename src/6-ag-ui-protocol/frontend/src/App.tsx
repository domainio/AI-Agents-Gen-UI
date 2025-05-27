import React from 'react'
import { AGUIRuntime } from './components/AGUIRuntime'
import { SimpleChat } from './components/SimpleChat'
import './styles/App.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <AGUIRuntime runtimeUrl="http://localhost:8000/awp">
        <SimpleChat />
      </AGUIRuntime>
    </div>
  )
}

export default App 