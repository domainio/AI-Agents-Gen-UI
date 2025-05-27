# AG-UI Protocol Integration

A complete React.js frontend and Express.js backend implementation demonstrating the AG-UI protocol with LangChain React Agent integration.

## 🏗️ Architecture

```
┌─────────────────┐    HTTP POST     ┌─────────────────┐
│  React Frontend │ ──────────────► │ Express Backend │
│   (Port 3001)   │    AG-UI JSON    │   (Port 8000)   │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ LangChain Agent │
                                    │   + Tools       │
                                    └─────────────────┘
```

## 📁 Project Structure

```
src/6-ag-ui-protocol/
├── backend/
│   ├── backend.ts          # Express server with AG-UI protocol
│   ├── agent.ts           # LangChain React Agent setup
│   └── test-backend.sh    # Backend testing script
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AGUIRuntime.tsx    # AG-UI protocol client
    │   │   ├── SimpleChat.tsx     # Chat interface
    │   │   └── ...
    │   ├── styles/
    │   │   └── App.css           # Beautiful gradient UI
    │   └── App.tsx               # Main React app
    ├── package.json              # Frontend dependencies
    └── vite.config.ts           # Vite configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key (set in `.env` file)

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd src/6-ag-ui-protocol/frontend
npm install
cd ../../..
```

### 2. Setup Environment
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Full Integration
```bash
# Run both backend and frontend together
npm run dev:6-ag-ui-protocol
```

Or run them separately:
```bash
# Terminal 1: Backend
npm run build
npm run dev:backend

# Terminal 2: Frontend  
npm run dev:frontend
```

### 4. Test the Integration
```bash
npm run test:integration
```

## 🌐 Access Points

- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8000
- **AG-UI Endpoint**: http://localhost:8000/awp

## 🛠️ Available Tools

The LangChain React Agent includes these tools:

1. **Calculator** - Perform mathematical calculations
2. **Weather** - Get current weather information  
3. **Stock Price** - Fetch real-time stock prices

### Example Queries
- "What is 15 * 23?"
- "What's the weather in New York?"
- "What is Tesla's stock price?"

## 📡 AG-UI Protocol

### Request Format
```json
{
  "threadId": "unique-thread-id",
  "runId": "unique-run-id", 
  "messages": [
    {
      "id": "msg-id",
      "role": "user",
      "content": "Your message here"
    }
  ],
  "tools": [],
  "context": []
}
```

### Response Format (Server-Sent Events)
```
data: {"type":"RUN_STARTED","threadId":"...","runId":"..."}
data: {"type":"TEXT_MESSAGE_START","messageId":"...","role":"assistant"}
data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"...","delta":"Response text"}
data: {"type":"TEXT_MESSAGE_END","messageId":"..."}
data: {"type":"RUN_FINISHED","threadId":"...","runId":"..."}
```

## 🎨 UI Features

- **Beautiful Gradient Design** - Purple gradient background with glassmorphism
- **Real-time Chat** - Instant message exchange with typing indicators
- **Responsive Layout** - Full-width design that adapts to screen size
- **Message History** - Persistent conversation within session
- **Error Handling** - Graceful error display and recovery

## 🔧 Development

### Backend Development
```bash
# Build TypeScript
npm run build

# Start backend only
npm run dev:backend

# Test backend directly
curl -X POST http://localhost:8000/awp \
  -H "Content-Type: application/json" \
  -d '{"threadId":"test","runId":"test","messages":[{"id":"1","role":"user","content":"hello"}],"tools":[],"context":[]}'
```

### Frontend Development
```bash
# Start frontend only
npm run dev:frontend

# Build frontend
cd src/6-ag-ui-protocol/frontend
npm run build
```

### Integration Testing
```bash
# Run comprehensive integration test
npm run test:integration
```

## 📦 Dependencies

### Backend
- `@ag-ui/core` - AG-UI protocol types and schemas
- `@ag-ui/encoder` - Server-Sent Events encoding
- `langchain` - LangChain framework
- `@langchain/openai` - OpenAI integration
- `express` - Web server framework

### Frontend  
- `react` - UI framework
- `react-dom` - React DOM rendering
- `vite` - Build tool and dev server
- `typescript` - Type safety

## 🐛 Troubleshooting

### TypeScript Warnings
If you see ES2023 target warnings, ensure the root `tsconfig.json` uses ES2022:
```json
{
  "compilerOptions": {
    "target": "ES2022"
  }
}
```

### CORS Issues
Backend is configured for `http://localhost:3001`. If using different ports, update the CORS configuration in `backend/backend.ts`.

### Port Conflicts
- Backend: Port 8000
- Frontend: Port 3001

Change ports in `vite.config.ts` and `backend.ts` if needed.

## 🎯 Key Features Demonstrated

✅ **Direct AG-UI Protocol** - No GraphQL, pure AG-UI communication  
✅ **LangChain Integration** - React Agent with multiple tools  
✅ **Server-Sent Events** - Real-time streaming responses  
✅ **Modern React** - Hooks, Context API, TypeScript  
✅ **Beautiful UI** - Gradient design with glassmorphism effects  
✅ **Production Ready** - Error handling, loading states, responsive design

## 📄 License

MIT License - Feel free to use this as a reference for your own AG-UI protocol implementations! 