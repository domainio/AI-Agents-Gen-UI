import { Response } from "express"
import { RunAgentInput, EventType, Message } from "@ag-ui/core"
import { EventEncoder } from "@ag-ui/encoder"
import { v4 as uuidv4 } from "uuid"
import { getOrCreateAgentExecutor } from "./agent.js"

export class AGUIService {
  private encoder = new EventEncoder()

  async processAgentRequest(input: RunAgentInput, response: Response): Promise<void> {
    const messageId = uuidv4()
    
    try {
      // 1. Start the AG-UI protocol flow
      this.emit(response, EventType.RUN_STARTED, { threadId: input.threadId, runId: input.runId })
      this.emit(response, EventType.TEXT_MESSAGE_START, { messageId, role: "assistant" })

      // 2. Execute the agent and get response
      const agentResponse = await this.executeAgent(input)
      
      // 3. Send the response content
      this.emit(response, EventType.TEXT_MESSAGE_CONTENT, { messageId, delta: agentResponse })

      // 4. Complete the AG-UI protocol flow
      this.emit(response, EventType.TEXT_MESSAGE_END, { messageId })
      this.emit(response, EventType.RUN_FINISHED, { threadId: input.threadId, runId: input.runId })

    } catch (error) {
      // Handle any errors by sending error content
      const errorMessage = `Service Error: ${(error as Error).message}`
      this.emit(response, EventType.TEXT_MESSAGE_CONTENT, { messageId, delta: errorMessage })
    } finally {
      // Always end the response stream
      response.end()
    }
  }

  private async executeAgent(input: RunAgentInput): Promise<string> {
    try {
      const agentExecutor = getOrCreateAgentExecutor(input.threadId)
      const userMessage = this.getLastUserMessage(input.messages)
      
      const result = await agentExecutor.invoke({ input: userMessage })
      return result.output
      
    } catch (error) {
      throw new Error(`Agent execution failed: ${(error as Error).message}`)
    }
  }

  private getLastUserMessage(messages: Message[]): string {
    const lastUserMessage = messages.filter(msg => msg.role === "user").pop()
    return lastUserMessage?.content || ""
  }

  private emit(response: Response, eventType: EventType, data: Record<string, any>): void {
    const event = {
      type: eventType,
      ...data,
    }
    response.write(this.encoder.encode(event))
  }
} 