import { Response } from "express"
import { RunAgentInput, EventType, Message } from "@ag-ui/core"
import { EventEncoder } from "@ag-ui/encoder"
import { v4 as uuidv4 } from "uuid"
import { getOrCreateAgentExecutor } from "./agent.js"
// import { ToolEventHandler } from "./tool-event-handler.js"

export class AGUIService {
  private encoder = new EventEncoder()

  async processAgentRequest(input: RunAgentInput, response: Response): Promise<void> {
    const messageId = uuidv4()
    
    try {
      // 1. Start protocol flow
      this.emit(response, EventType.RUN_STARTED, { threadId: input.threadId, runId: input.runId })
      this.emit(response, EventType.TEXT_MESSAGE_START, { messageId, role: "assistant" })

      // 2. Execute agent
      const agentResponse = await this.executeAgent(input, response, messageId)
      
      // 3. Send response
      this.emit(response, EventType.TEXT_MESSAGE_CONTENT, { 
        messageId, 
        delta: agentResponse || "I couldn't generate a response." 
      })

      // 4. Complete protocol flow
      this.emit(response, EventType.TEXT_MESSAGE_END, { messageId })
      this.emit(response, EventType.RUN_FINISHED, { threadId: input.threadId, runId: input.runId })

    } catch (error) {
      this.emit(response, EventType.TEXT_MESSAGE_CONTENT, { 
        messageId, 
        delta: `Error: ${(error as Error).message}` 
      })
    } finally {
      response.end()
    }
  }

  private async executeAgent(input: RunAgentInput, response: Response, messageId: string): Promise<string> {
    const userMessage = input.messages.filter(msg => msg.role === "user").pop()?.content || ""
    
    // Real agent execution with tool notifications
    const agentExecutor = getOrCreateAgentExecutor(input.threadId)
    // const toolHandler = new ToolEventHandler(response, messageId, this.emit.bind(this))
    
    const result = await agentExecutor.invoke(
      { input: userMessage },
    //   { callbacks: [toolHandler] }
    )
    
    return result.output
  }

  private emit(response: Response, eventType: EventType, data: Record<string, any>): void {
    response.write(this.encoder.encode({ type: eventType, ...data }))
  }
} 