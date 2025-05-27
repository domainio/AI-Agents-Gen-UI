import { DynamicTool } from "@langchain/core/tools";

export const calculatorTool = new DynamicTool({
    name: "calculator",
    description: "Useful for performing mathematical calculations. Input should be a mathematical expression.",
    func: async (input: string): Promise<string> => {
        try {
            // Simple eval for basic math (in production, use a safer math parser)
            const result = eval(input);
            return `The result of ${input} is ${result}`;
        } catch (error) {
            return `Error calculating ${input}: ${error}`;
        }
    },
});