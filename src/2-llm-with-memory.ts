import dotenv from "dotenv";
import OpenAI from "openai";
import * as readline from "readline";

dotenv.config();

const client: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

const messages: ChatMessage[] = [];

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

// Simple while loop like the Python version
while (true) {
    const userInput = await getUserInput("You: ");
    
    if (userInput.toLowerCase() === "exit" || 
        userInput.toLowerCase() === "quit" || 
        userInput.toLowerCase() === "bye") {
        console.log("Assistant: Goodbye!");
        break;
    }
    
    messages.push({ role: "user", content: userInput });
    
    const completion = await client.chat.completions.create({
        model: "gpt-4",
        messages: messages
    });
    
    const assistantResponse = completion.choices[0].message.content || "";
    messages.push({ role: "assistant", content: assistantResponse });
    console.log(`Assistant: ${assistantResponse}`);
}

console.log(`\nConversation ended. Total messages: ${messages.length}`);
console.log(`\nChat:`, JSON.stringify(messages, null, 2));

rl.close(); 