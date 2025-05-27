import { Response } from "express"
import { EventType } from "@ag-ui/core"
import { BaseCallbackHandler } from "@langchain/core/callbacks/base"
import { AgentAction } from "@langchain/core/agents"
import { v4 as uuidv4 } from "uuid"

export class ToolEventHandler extends BaseCallbackHandler {
  name = "ToolEventHandler"
  
  constructor(
    private response: Response,
    private messageId: string,
    private emit: (response: Response, eventType: EventType, data: Record<string, any>) => void
  ) {
    super()
  }

  async handleAgentAction(action: AgentAction): Promise<void> {
    const toolCallId = uuidv4()
    this.emit(this.response, EventType.TOOL_CALL_START, {
      toolCallId,
      toolCallName: action.tool,
      parentMessageId: this.messageId
    })
    this.emit(this.response, EventType.TOOL_CALL_ARGS, {
      toolCallId,
      delta: JSON.stringify(action.toolInput)
    })
  }

  async handleToolStart(tool: any): Promise<void> {
    this.emit(this.response, EventType.STEP_STARTED, { stepName: `tool_${tool.name}` })
  }

  async handleToolEnd(): Promise<void> {
    this.emit(this.response, EventType.TOOL_CALL_END, { toolCallId: uuidv4() })
  }
} 