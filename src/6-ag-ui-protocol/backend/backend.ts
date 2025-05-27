import express, { Request, Response } from "express"
import cors from "cors"
import {
  RunAgentInputSchema,
  RunAgentInput,
} from "@ag-ui/core"
import { AGUIService } from "./agui-service.js"

const app = express()
const aguiService = new AGUIService()

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}))

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

    await aguiService.processAgentRequest(input, res)

  } catch (error) {
    res.status(422).json({ error: (error as Error).message })
  }
})

app.listen(8000, () => {
  console.log("🤖 LangChain React Agent Server running on http://localhost:8000")
})