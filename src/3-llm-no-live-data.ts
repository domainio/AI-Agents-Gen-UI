import dotenv from "dotenv";
import OpenAI from "openai";
import chalk from "chalk";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
        {
            role: "user",
            content: `what is apple stock value?
            If you don't have access to real-time financial data, please suggest the best tool, API,
            or data source I can use to retrieve the latest stock value.
            `
        }
    ]
});

console.log(chalk.yellow(response.choices[0].message.content));