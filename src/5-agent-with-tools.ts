import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import chalk from "chalk";
import { weatherTool } from "./tools/get-weather";
import { stockPriceTool } from "./tools/get-stock-price";
import calculatorTool from "./tools/calculator";
import { createInterface } from "readline/promises";
import agentPrompt from "./prompts/agent-prompt";

dotenv.config();

async function main() {
    const llm = new ChatOpenAI({
        modelName: "gpt-4",
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const tools = [stockPriceTool, weatherTool, calculatorTool];

    // Proper React agent prompt template
    const agent = await createReactAgent({
        llm,
        tools,
        prompt: agentPrompt
    });

    const agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: true,
    });

    interface ChatMessage {
        role: "user" | "assistant" | "system";
        content: string;
    }

    const messages: ChatMessage[] = [];

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const userInput = await rl.question("You: ");

        if (userInput.toLowerCase() === "exit") {
            console.log(chalk.yellow("Assistant: Goodbye!"));
            break;
        }

        messages.push({ role: "user", content: userInput });

        try {
            const result = await agentExecutor.invoke({ input: userInput });
            // Log only the assistant's reply, not the entire object
            console.log(chalk.yellow(`Assistant: ${result.me}`));

            messages.push({ role: "assistant", content: result.output });
        } catch (error) {
            console.error(chalk.red("Error during agent execution:"), error);
        }
    }

    rl.close();

    console.log(`\nConversation ended. Total messages: ${messages.length}`);
    console.log(`\nChat history:\n`, JSON.stringify(messages, null, 2));
}

main().catch((e) => {
    console.error("Fatal error:", e);
});
