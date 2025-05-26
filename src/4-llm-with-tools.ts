import getStockPrice from './tools/get-stock-price';

const stockPrice: number = await getStockPrice("AAPL");
console.log(stockPrice);


// import dotenv from "dotenv";
// import OpenAI from "openai";

// dotenv.config();

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const tools = [
//     {
//         type: "function" as const,
//         function: {
//             name: "getStockPrice",
//             description: "Get the current stock price for a given company symbol using Yahoo Finance API.",
//             parameters: {
//                 type: "object",
//                 properties: {
//                     symbol: {
//                         type: "string",
//                         description: "Stock ticker symbol, e.g., AAPL for Apple, TSLA for Tesla"
//                     }
//                 },
//                 required: ["symbol"],
//                 additionalProperties: false
//             },
//             strict: true
//         },
//     },
//     {
//         type: "function" as const,
//         function: {
//             name: "getWeather",
//             description: "Get the current temperature in Celsius for a given location using coordinates. Uses the Open-Meteo API to fetch real-time weather data.",
//             parameters: {
//                 "type": "object",
//                 "properties": {
//                     "latitude": {
//                         "type": "number",
//                         "description": "The latitude coordinate of the location (e.g., 40.7128 for New York City)"
//                     },
//                     "longitude": {
//                         "type": "number",
//                         "description": "The longitude coordinate of the location (e.g., -74.0060 for New York City)"
//                     }
//                 },
//                 "required": ["latitude", "longitude"],
//                 "additionalProperties": false
//             },
//             "strict": true
//         }
//     }
// ];

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