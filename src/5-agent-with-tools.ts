import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import chalk from "chalk";
import { weatherTool } from "./tools/get-weather";
import { stockPriceTool } from "./tools/get-stock-price";
import { calculatorTool } from "./tools/calculator";
import { createInterface } from "readline/promises";
import agentPrompt from "./prompts/agent-prompt";

dotenv.config();

const llm = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    // streaming: true,
    // callbacks: [
    //     {
    //       handleLLMNewToken(token) {
    //         process.stdout.write(token);
    //       },
    //     },
    //   ],
});

const tools = [stockPriceTool, weatherTool, calculatorTool];

const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: false,
    outputKey: "output",
});

const agent = await createReactAgent({
    llm,
    tools,
    prompt: agentPrompt
});

const agentExecutor = new AgentExecutor({
    agent,
    tools,
    memory,
    verbose: false,
});

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
    const result = await agentExecutor.invoke({ input: userInput });
    console.log(chalk.yellow(`Assistant: ${result.output}`));
}

rl.close();

console.log(chalk.blue("\nChat history:"));
const memoryVars = await memory.loadMemoryVariables({});
console.log(memoryVars.chat_history);