async function getStockPrice(symbol: string): Promise<number> {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const result = data.chart.result[0];
        const currentPrice = result.meta.regularMarketPrice;
        
        return currentPrice || 0;
    } catch (error) {
        console.error(`Error fetching stock price for ${symbol}:`, error);
        return 0;
    }
}

export default getStockPrice;


import { DynamicTool } from "@langchain/core/tools";

export const stockPriceTool = new DynamicTool({
    name: "get_stock_price",
    description: "Get the current stock price for a given company symbol using Yahoo Finance API.",
    func: getStockPrice,
});