const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY3);

const generateEnvironmentalReportContent = async (data) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate a detailed environmental impact report based on the following data:
            Electricity Usage: ${JSON.stringify(data.electricity)}
            Fuel Combustion: ${JSON.stringify(data.fuelCombustion)}
            Shipping: ${JSON.stringify(data.shipping)}
            Explosion: ${JSON.stringify(data.explosion)}
            
            Please provide:
            1. Executive Summary
            2. Detailed Analysis of each category
            3. Trends and Patterns
            4. Recommendations for Improvement
            5. Environmental Impact Assessment`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating environmental report:', error);
        throw error;
    }
};

module.exports = { generateEnvironmentalReportContent };