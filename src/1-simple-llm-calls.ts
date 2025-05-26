import dotenv from "dotenv";
import OpenAI from "openai";
import chalk from "chalk";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response1 = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
        {
            role: "user",
            content: "Hi, my name is bob."
        }
    ]
});

console.log("Response 1: ", chalk.green(response1.choices[0].message.content)); 

const response2 = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
        {
            role: "user",
            content: "What is my name?"
        }
    ]
});

console.log("Response 2: ", chalk.red(response2.choices[0].message.content)); 