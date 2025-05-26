# AG-UI Protocol Meetup

This project demonstrates the AG-UI protocol with a React frontend and Express backend, showcasing a LangChain React Agent with tools integration.

## Project Structure

```
ag-ui/
├── src/
│   ├── 6-ag-ui-protocol/         # AG-UI protocol implementation
│   │   ├── frontend/             # React frontend
│   │   │   ├── src/
│   │   │   │   ├── components/   # React components
│   │   │   │   ├── types/        # TypeScript interfaces
│   │   │   │   ├── main.tsx      # React entry point
│   │   │   │   └── App.tsx       # Root component
│   │   │   ├── index.html        # HTML template
│   │   │   ├── package.json      # Frontend dependencies
│   │   │   ├── vite.config.ts    # Vite configuration
│   │   │   └── tsconfig.json     # Frontend TypeScript config
│   │   └── backend/              # Express backend
│   │       ├── backend.ts        # Express server with SSE
│   │       ├── agent.ts          # LangChain React Agent
│   │       └── test-backend.sh   # Backend test script
│   ├── tools/                    # Agent tools
│   ├── prompts/                  # Agent prompts
│   └── ...                       # Other examples
├── dist/                         # Compiled backend code
├── package.json                  # Backend dependencies & scripts
└── tsconfig.json                 # Backend TypeScript config
```

## Architecture

### Frontend (src/6-ag-ui-protocol/frontend/)
- **React 18** with TypeScript
- **Vite** for development and building
- **Component-based architecture** with proper separation of concerns
- **Server-Sent Events (SSE)** for real-time communication
- **Modern CSS** with component-specific styling

### Backend (src/6-ag-ui-protocol/backend/)
- **Express.js** server with CORS support
- **LangChain React Agent** with memory and tools
- **AG-UI protocol** implementation with SSE streaming
- **TypeScript** with ES modules

## Development Workflow

### Prerequisites
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm run install:frontend
```

### Development
```bash
# Terminal 1: Start backend (port 8000)
npm run dev:backend

# Terminal 2: Start frontend (port 3000)
npm run dev:frontend
```

### Production Build
```bash
# Build backend
npm run build

# Build frontend
npm run build:frontend

# Preview frontend build
npm run preview:frontend
```

## Available Scripts

### Backend Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev:backend` - Build and start backend server

### Frontend Scripts
- `npm run dev:frontend` - Start Vite development server
- `npm run build:frontend` - Build frontend for production
- `npm run preview:frontend` - Preview production build
- `npm run install:frontend` - Install frontend dependencies

## AG-UI Protocol Implementation

### Backend Endpoints
- `POST /awp` - Agent Workflow Protocol endpoint
  - Accepts `RunAgentInput` with threadId, runId, and messages
  - Returns Server-Sent Events stream with agent responses

### Event Types
- `RUN_STARTED` - Agent execution begins
- `TEXT_MESSAGE_START` - Message generation starts
- `TEXT_MESSAGE_CONTENT` - Streaming message content
- `TEXT_MESSAGE_END` - Message generation complete
- `RUN_FINISHED` - Agent execution complete

### Frontend Features
- **Real-time chat interface** with message streaming
- **Typing indicators** during agent processing
- **Message history** with user/assistant distinction
- **Error handling** for connection issues
- **Responsive design** for mobile and desktop

## Agent Capabilities

The LangChain React Agent includes:
- **Weather Tool** - Get current weather for any location
- **Stock Price Tool** - Fetch real-time stock prices
- **Calculator Tool** - Perform mathematical calculations
- **Memory** - Maintains conversation context per thread

## Testing

### Backend Testing
Use the provided test script to verify backend functionality:
```bash
# Make script executable (if needed)
chmod +x src/6-ag-ui-protocol/backend/test-backend.sh

# Run backend tests
src/6-ag-ui-protocol/backend/test-backend.sh
```

## Environment Setup

Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- CSS3 with modern features

### Backend
- Node.js
- Express.js
- TypeScript
- LangChain
- OpenAI GPT-4

### Protocol
- AG-UI Core & Encoder
- Server-Sent Events (SSE)
- CORS for cross-origin requests

## Development Best Practices

1. **Organized Structure** - Frontend and backend colocated within the AG-UI protocol folder
2. **Type Safety** - Full TypeScript coverage with proper interfaces
3. **Modern Tooling** - Vite for frontend, ES modules for backend
4. **Component Architecture** - Modular React components with single responsibilities
5. **Error Handling** - Proper error boundaries and user feedback
6. **Performance** - Streaming responses and efficient state management

## Troubleshooting

### Backend Issues
- Ensure `.env` file contains valid `OPENAI_API_KEY`
- Check that port 8000 is available
- Verify all dependencies are installed with `npm install`

### Frontend Issues
- Ensure frontend dependencies are installed with `npm run install:frontend`
- Check that port 3000 is available
- Verify backend is running and accessible at `http://localhost:8000`

### CORS Issues
- Backend includes CORS configuration for `http://localhost:3000`
- Ensure frontend is running on the correct port

## Contributing

1. Follow TypeScript best practices
2. Maintain component separation
3. Add proper error handling
4. Update documentation for new features
5. Test both frontend and backend changes 