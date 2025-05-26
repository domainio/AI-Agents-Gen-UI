import dotenv from "dotenv";
import OpenAI from "openai";
import { createInterface } from "readline/promises";
import chalk from "chalk";
dotenv.config();

const client: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

const messages: ChatMessage[] = [];

// Create readline interface for user input
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

while (true) {
    const userInput = await rl.question("You: ");
    
    if (userInput.toLowerCase() === "exit") {
        console.log(chalk.yellow("Assistant: Goodbye!"));
        break;
    }
    
    messages.push({ role: "user", content: userInput });
    
    const completion = await client.chat.completions.create({
        model: "gpt-4",
        messages: messages
    });
    
    const assistantResponse = completion.choices[0].message.content || "";
    messages.push({ role: "assistant", content: assistantResponse });
    console.log(chalk.yellow(`Assistant: ${assistantResponse}`));
}

console.log(`\nConversation ended. Total messages: ${messages.length}`);
console.log(`\nChat:`, JSON.stringify(messages, null, 2));

rl.close(); 