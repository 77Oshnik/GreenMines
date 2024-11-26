const axios = require("axios");
const { fetchDateRangeData } = require("./datafetching");

exports.analyzeEmissionsWithGenAI = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start and end dates are required." });
  }

  try {
    // Fetch data for the given date range
    const emissionsData = await fetchDateRangeData({ params: { startDate, endDate } });
    console.log("Fetched Emissions Data:", emissionsData);

    // Initialize impactfulData object to store categorized emissions data
    const impactfulData = {};

    // Process each category: electricity, fuelCombustion, shipping, explosion
    ["electricity", "fuelCombustion", "shipping", "explosion"].forEach((category) => {
      impactfulData[category] = emissionsData[category]?.map((entry) => {
        // Add explosion data structure if category is "explosion"
        if (category === "explosion") {
          return {
            date: entry.createdAt,
            explosiveType: entry.explosiveType,  // Adding explosive type
            amount: entry.amount,  // Adding the amount used
            emissions: entry.emissions,  // Including detailed emissions data like CO2, H2S, etc.
          };
        } else {
          return {
            date: entry.createdAt,
            keyEmissions: entry.result,  // For other categories, use the result field
          };
        }
      });
    });

    console.log("Impactful Data Sent to AI:", impactfulData);

    // Define the thresholds and response categories for each emission type
    const emissionThresholds = {
      CO2: {
        low: 1000,  // Low threshold for CO2 (in kg)
        moderate: 10000,  // Moderate threshold for CO2 (in kg)
        high: 100000,  // High threshold for CO2 (in kg)
      },
      CO: {
        low: 100,  // Low threshold for CO (in kg)
        high: 1000,  // High threshold for CO (in kg)
      },
      H2S: {
        low: 100,  // Low threshold for H2S (in kg)
        high: 500,  // High threshold for H2S (in kg)
      },
      // Add other emissions like SO2, NOx, etc. if necessary
    };

    // Prepare the prompt for Cohere AI to generate a "blame-based" response
    const prompt = `
    You are an AI environmental impact expert. Based on the emission data provided, analyze the damage caused by these emissions over the date range of ${startDate} to ${endDate}. Instead of predicting future effects, blame the source of the emissions for the specific environmental harm that has already occurred. Be direct and clear about the consequences of these emissions, attributing each harm directly to the high levels of pollutants emitted. Focus on the immediate effects on animals, plants, people, and the environment.
    
    Emission Data:
    - **Electricity Emissions:** ${JSON.stringify(impactfulData.electricity || [])}
    - **Fuel Combustion Emissions:** ${JSON.stringify(impactfulData.fuelCombustion || [])}
    - **Shipping Emissions:** ${JSON.stringify(impactfulData.shipping || [])}
    - **Explosion Emissions:** ${JSON.stringify(impactfulData.explosion || [])}
    
    Response Requirements:
    - For each emission type, please generate a blame-based environmental impact report, including:
        1. Animal and Bird Deaths: Identify the specific number of animals and birds killed due to toxic air, water, or habitat destruction caused by these emissions. For example, "Because of these high levels of CO2, 290 animals and 390 birds have already died due to habitat destruction and air toxicity."
        2. Biodiversity Hazard: Explain how the emissions have led to disruptions in local ecosystems and endangered species. For example, "The explosion emissions have caused soil contamination and have led to the near extinction of local plant species."
        3. Ozone Layer Depletion: If relevant emissions (CO2, NOx) are high, explain the role of these pollutants in ozone layer depletion, contributing to increased UV radiation and human health issues. For example, "Due to the high levels of CO and NOx, the ozone layer has been significantly depleted, causing increased cases of skin cancer."
        4. Soil and Water Contamination: For emissions like H2S or SO2, identify the contamination of local soil and water, with clear consequences. For example, "The high levels of SO2 emissions from the explosions have contaminated local rivers, affecting water quality and agricultural yields."
        5. Heat Island Effect: Describe how CO2 and other greenhouse gases have led to the heat island effect, making urban areas unbearable. For example, "Due to the high CO2 emissions, the local urban areas have become significantly hotter, causing heat stress among the population."
        6. Climate Refugees: For severe emissions, explain how these emissions have led to rising sea levels or extreme weather, causing people to leave their homes. For example, "Due to the high levels of CO2 and other greenhouse gases, rising sea levels have forced hundreds of families to become climate refugees."
        7. Public Health Hazards: Identify specific health problems in humans caused by air pollution and toxic emissions. For example, "Due to the high NOx emissions, local populations are experiencing a surge in respiratory issues, including asthma and bronchitis."
        8. Agricultural Disruption: Explain how high emissions have damaged crops, either through soil degradation, acid rain, or temperature changes. For example, "The emissions of H2S and CO2 have caused widespread crop failure in nearby agricultural regions."
        9. Increased Natural Disasters: Attribute the increased frequency of storms, floods, or wildfires to the high levels of emissions. For example, "These emissions have significantly contributed to the rise in natural disasters, including more intense wildfires and storms, devastating local ecosystems."
        10. Weather Impact: Directly link high emissions to extreme weather events, such as temperature spikes or unpredictable rainfall patterns. For example, "Due to these emissions, we are already seeing an increase in extreme weather, with an unprecedented rise in global temperatures."
        
    Please format the results as follows:
    - Animals Death: [Number of animals] animals (e.g., 290 animals)
    - Birds Affected: [Number of birds] birds (e.g., 390 birds)
    - Biodiversity Hazard: [Specific species affected]
    - Ozone Layer Depletion: [Effect and consequences]
    - Soil and Water Contamination: [Details of affected areas]
    - Heat Island Effect: [Effect on urban areas]
    - Climate Refugees: [Number of displaced people]
    - Public Health Hazards: [Health issues caused]
    - Agricultural Disruption: [Effect on crops]
    - Increased Natural Disasters: [Specific disasters linked to emissions]
    - Weather Impact: [Impact on local and global weather patterns]
    
    Output Format Example:
    **Electricity Emissions:**
    - Animal and Bird Deaths: 290 animals, 390 birds
    - Biodiversity Hazard: Destruction of local habitats
    - Ozone Layer Depletion: Significant depletion, increased UV radiation risk
    - Soil and Water Contamination: Local water bodies affected, agricultural disruption
    - Heat Island Effect: Urban areas become significantly hotter
    - Climate Refugees: 50 families displaced due to rising sea levels
    - Public Health Hazards: Respiratory problems from high NOx levels
    - Agricultural Disruption: Crop failure due to soil contamination
    - Increased Natural Disasters: Rising storms and floods
    - Weather Impact: Increased temperature variability
    
    Please be clear and direct, making it obvious that the harm occurred because of these emissions.
    `;
    

    // Make API request to Cohere AI for generating the analysis
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command-xlarge-nightly",
        prompt,
        max_tokens: 2000,  // Increased max tokens to get a more detailed response
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer OKICrZ8sfYP2mHbuPH31VTfZelAOhz8k5QfRzrhY`,  // Ensure the API key is correct
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Cohere AI Response:", response.data);

    // Extract the response text from the API response
    const aiResponse = response.data?.generations?.[0]?.text || "No response generated.";
    res.json({ startDate, endDate, aiAnalysis: aiResponse });

  } catch (error) {
    // Handle errors (network, server, etc.)
    if (error.response) {
      console.error("Error analyzing emissions with GenAI:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error("Error analyzing emissions with GenAI:", error.message);
      res.status(500).json({ error: "Failed to analyze emissions data with GenAI." });
    }
  }
};
