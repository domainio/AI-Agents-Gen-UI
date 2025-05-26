import express, { Request, Response } from "express"
import {
  RunAgentInputSchema,
  RunAgentInput,
  EventType,
  Message,
} from "@ag-ui/core"
import { EventEncoder } from "@ag-ui/encoder"
import { v4 as uuidv4 } from "uuid"
import { getOrCreateAgentExecutor } from "./agent"

const app = express()

app.use(express.json())

app.post("/awp", async (req: Request, res: Response) => {
  try {
    console.log("req.body", req.body);
    
    // Parse and validate the request body
    const input: RunAgentInput = RunAgentInputSchema.parse(req.body)

    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    // Create an event encoder
    const encoder = new EventEncoder()

    // Send run started event
    const runStarted = {
      type: EventType.RUN_STARTED,
      threadId: input.threadId,
      runId: input.runId,
    }
    res.write(encoder.encode(runStarted))

    // Create agent executor with memory for this thread
    const agentExecutor = getOrCreateAgentExecutor(input.threadId)

    const lastUserMessage = input.messages.findLast((msg: Message) => msg.role === "user")
    
    const messageId = uuidv4()

    // Send text message start event
    const textMessageStart = {
      type: EventType.TEXT_MESSAGE_START,
      messageId,
      role: "assistant",
    }
    res.write(encoder.encode(textMessageStart))

    try {
      // Execute the agent
      const result = await agentExecutor.invoke({ input: lastUserMessage?.content })
      
      // Send the complete response as content
      const textMessageContent = {
        type: EventType.TEXT_MESSAGE_CONTENT,
        messageId,
        delta: result.output,
      }
      res.write(encoder.encode(textMessageContent))

    } catch (error) {
      // Send error as content
      const errorMessage = `Error: ${(error as Error).message}`
      const textMessageContent = {
        type: EventType.TEXT_MESSAGE_CONTENT,
        messageId,
        delta: errorMessage,
      }
      res.write(encoder.encode(textMessageContent))
    }

    // Send text message end event
    const textMessageEnd = {
      type: EventType.TEXT_MESSAGE_END,
      messageId,
    }
    res.write(encoder.encode(textMessageEnd))

    // Send run finished event
    const runFinished = {
      type: EventType.RUN_FINISHED,
      threadId: input.threadId,
      runId: input.runId,
    }
    res.write(encoder.encode(runFinished))

    // End the response
    res.end()
  } catch (error) {
    res.status(422).json({ error: (error as Error).message })
  }
})

app.listen(8000, () => {
  console.log("🤖 LangChain React Agent Server running on http://localhost:8000")
})