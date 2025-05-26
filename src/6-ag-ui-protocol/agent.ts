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

const threadMemories = new Map<string, BufferMemory>()

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

export const createAgentExecutor = (threadId: string): AgentExecutor => {
  const memory = getOrCreateMemory(threadId)
  
  return new AgentExecutor({
    agent,
    tools,
    memory,
    verbose: false,
  })
}

export { tools }
