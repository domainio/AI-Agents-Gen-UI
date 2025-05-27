type WeatherResponse = {
    current: {
        temperature_2m: number;
    };
};

async function getWeather(latitude: number, longitude: number): Promise<number> {
    const url = `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,wind_speed_10m` +
        `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API request failed: ${response.statusText}`);
    }
    const data: WeatherResponse = await response.json();
    return data.current.temperature_2m;
}

export default getWeather;


// import { DynamicTool } from "@langchain/core/tools";

// export const weatherTool = new DynamicTool({
//     name: "get_current_weather",
//     description: "Get the current temperature in Celsius. Input format: 'latitude,longitude' (e.g., '40.7128,-74.0060').",
//     func: (input: string): Promise<number> => {
//         const [latStr, lonStr] = input.split(",");
//         const latitude = parseFloat(latStr);
//         const longitude = parseFloat(lonStr);
//         return getWeather(latitude, longitude);
//     }
// })