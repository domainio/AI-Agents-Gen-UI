import dotenv from "dotenv";
import OpenAI from "openai";

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

console.log(response.choices[0].message.content);

// import { getStockPrice } from './tools/get-stock-price';

// const stockPrice: number = await getStockPrice("AAPL");
// console.log(stockPrice);


// const tools = [{
//     type: "function" as const,
//     function: {
//         name: "getStockPrice",
//         description: "Get the current stock price for a given company symbol using Yahoo Finance API.",
//         parameters: {
//             type: "object",
//             properties: {
//                 symbol: {
//                     type: "string",
//                     description: "Stock ticker symbol, e.g., AAPL for Apple, TSLA for Tesla"
//                 }
//             },
//             required: ["symbol"],
//             additionalProperties: false
//         },
//         strict: true
//     }
// }];

// const responseWithTools = await client.chat.completions.create({
//     model: "gpt-4.1",
//     messages: [
//         {
//             role: "user",
//             content: "what is apple stock value?",
//            // content: "what is the weather today in Tel Aviv?",
//         }
//     ],
//     tools: tools,
// });

// console.log(JSON.stringify(responseWithTools.choices[0].message, null, 2));