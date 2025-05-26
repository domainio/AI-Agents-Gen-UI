import { ChatOpenAI } from "@langchain/openai"
import { AgentExecutor, createReactAgent } from "langchain/agents"
import { BufferMemory } from "langchain/memory"
import dotenv from "dotenv"
import { weatherTool } from "../tools/get-weather"
import { stockPriceTool } from "../tools/get-stock-price"
import calculatorTool from "../tools/calculator"
import agentPrompt from "../prompts/agent-prompt"

dotenv.config()

const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
})

const tools = [stockPriceTool, weatherTool, calculatorTool]

const agent = await createReactAgent({
  llm,
  tools,
  prompt: agentPrompt
})

// Cache both memories and agent executors per thread
const threadMemories = new Map<string, BufferMemory>()
const threadAgentExecutors = new Map<string, AgentExecutor>()

const getOrCreateMemory = (threadId: string): BufferMemory => {
  if (!threadMemories.has(threadId)) {
    threadMemories.set(threadId, new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: false,
      outputKey: "output",
    }))
  }
  return threadMemories.get(threadId)!
}

export const getOrCreateAgentExecutor = (threadId: string): AgentExecutor => {
  // Return cached executor if it exists
  if (threadAgentExecutors.has(threadId)) {
    return threadAgentExecutors.get(threadId)!
  }

  // Create new executor with memory for this thread
  const memory = getOrCreateMemory(threadId)
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    memory,
    verbose: false,
  })

  // Cache it for future requests
  threadAgentExecutors.set(threadId, agentExecutor)

  return agentExecutor
}

export { tools }
