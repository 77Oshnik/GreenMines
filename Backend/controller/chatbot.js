const OpenAI = require('openai'); // Adjust based on the SDK version
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');



const GEMINI_API_URL = "https://gemini-ai-api-url/v1/chat"; // Replace with actual Gemini API URL


  
const carbonKnowledgeContext = {
    expertise: [
        'Carbon emissions in coal mining',
        'Carbon sequestration strategies',
        'Carbon neutrality frameworks',
        'Carbon credit mechanisms'
    ],
    definitionFramework: {
        carbonEmissions: 'Greenhouse gases released during coal extraction, processing, and transportation',
        carbonSequestration: 'Process of capturing and storing atmospheric carbon dioxide',
        carbonNeutrality: 'Balancing carbon emissions with carbon removal or offsetting',
        carbonCredits: 'Tradable permits representing reduction of greenhouse gas emissions'
    }
};

  // Universal Chat Endpoint
  exports.chatBot = async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({
            status: 'error',
            message: 'User input is required'
        });
    }

    try {
        // Construct professional, context-rich prompt
        const professionalPrompt = `
            Professional Context:
            - You are an expert in coal mining environmental sustainability
            - Provide precise, actionable insights
            - Use industry-standard terminology
            - Focus on practical applications

            Knowledge Framework: ${JSON.stringify(carbonKnowledgeContext)}

            Professional Query: ${userInput}

            Response Guidelines:
            1. Define key technical terms
            2. Provide quantitative insights
            3. Suggest practical mitigation strategies
            4. Reference industry best practices
        `;

        // Gemini AI Processing
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(professionalPrompt);

        // Assuming the response is in result.response.text()
        const aiResponse = result.response.text();
        const formattedResponse = formatResponse(aiResponse);


        // Example parsing function to structure the response into usable sections


        res.json({
            status: 'success',
            input: userInput,
            response:formattedResponse,
            confidence: 'high',
            sourceFramework: 'Coal Carbon Management Expertise'
        });
    } catch (error) {
        console.error('Error generating professional insights:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Professional insight generation failed',
            errorDetails: error.message
        });
    }
};

function formatResponse(aiResponse) {
    // Remove all occurrences of \n in the input
    aiResponse = aiResponse.replace(/\\n/g, '').trim();

    // Split the response into sections by double line breaks
    const sections = aiResponse.split('\n\n');

    let formattedResponse = '';

    sections.forEach(section => {
        // Check for headings or emphasized sections
        if (section.startsWith('**') || section.match(/^[A-Za-z\s]+:/)) {
            // Format headings or key sections with <h3> for readability
            formattedResponse += `<h3>${section.replace(/\*\*/g, '').trim()}</h3>`;
        } 
        // Handle bullet points or list items
        else if (section.trim().startsWith('-') || section.trim().startsWith('*')) {
            const bulletPoints = section.split('\n').map(point => point.replace(/^-|\*/g, '').trim());
            formattedResponse += '<ul>';
            bulletPoints.forEach(point => {
                if (point) formattedResponse += `<li>${point}</li>`;
            });
            formattedResponse += '</ul>';
        } 
        // Handle plain paragraphs
        else {
            formattedResponse += `<p>${section.trim()}</p>`;
        }
    });

    return formattedResponse;
}