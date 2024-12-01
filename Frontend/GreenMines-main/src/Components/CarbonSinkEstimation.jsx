// services/geminiReportService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY3);

const generateEnvironmentalReportContent = async (data) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Calculate emissions with proper unit conversion
        const calculateEmissions = (items) => {
            return items.reduce((sum, item) => {
                let co2Value = 0;

                // Handle different data structures
                if (item.result && item.result.CO2) {
                    // For electricity and fuel combustion: convert kg to tons
                    co2Value = parseFloat(item.result.CO2.value) / 1000;
                } else if (item.emissions && item.emissions.CO2) {
                    // For explosion data: convert kg to tons
                    co2Value = parseFloat(item.emissions.CO2) / 1000;
                } else if (item.result && item.result.carbonEmissions) {
                    // For shipping data: already in metric tons
                    co2Value = parseFloat(item.result.carbonEmissions.metricTonnes);
                }

                return sum + (!isNaN(co2Value) ? co2Value : 0);
            }, 0);
        };

        // Calculate emissions for each category
        const totalElectricityEmissions = calculateEmissions(data.electricity);
        const totalExplosionEmissions = calculateEmissions(data.explosion);
        const totalFuelEmissions = calculateEmissions(data.fuelCombustion);
        const totalShippingEmissions = calculateEmissions(data.shipping);

        // Log the calculated values
        console.log('\n=== EMISSIONS CALCULATIONS ===');
        console.log('Electricity Emissions (tons CO2):', totalElectricityEmissions.toFixed(2));
        console.log('Explosion Emissions (tons CO2):', totalExplosionEmissions.toFixed(2));
        console.log('Fuel Emissions (tons CO2):', totalFuelEmissions.toFixed(2));
        console.log('Shipping Emissions (tons CO2):', totalShippingEmissions.toFixed(2));

        // Format detailed data for the report
        const formatEmissionsData = (items, type) => {
            return items.map(item => {
                let co2Value = 0;
                if (item.result && item.result.CO2) {
                    co2Value = parseFloat(item.result.CO2.value) / 1000;
                } else if (item.emissions && item.emissions.CO2) {
                    co2Value = parseFloat(item.emissions.CO2) / 1000;
                } else if (item.result && item.result.carbonEmissions) {
                    co2Value = parseFloat(item.result.carbonEmissions.metricTonnes);
                }

                switch (type) {
                    case 'electricity':
                        return {
                            stateName: item.stateName,
                            energyUsage: item.energyPerTime,
                            area: `${item.responsibleArea}/${item.totalArea}`,
                            co2Emissions: co2Value.toFixed(2)
                        };
                    case 'explosion':
                        return {
                            type: item.explosiveType,
                            amount: item.amount,
                            co2Emissions: co2Value.toFixed(2),
                            otherEmissions: item.emissions
                        };
                    case 'fuel':
                        return {
                            fuelType: item.fuel,
                            quantity: item.quantityFuelConsumed,
                            co2Emissions: co2Value.toFixed(2)
                        };
                    case 'shipping':
                        return {
                            weight: `${item.weight_value} ${item.weight_unit}`,
                            distance: `${item.distance_value} ${item.distance_unit}`,
                            method: item.transport_method,
                            co2Emissions: co2Value.toFixed(2)
                        };
                    default:
                        return item;
                }
            });
        };

        // Calculate total emissions
        const totalEmissions = totalElectricityEmissions + 
                             totalExplosionEmissions + 
                             totalFuelEmissions + 
                             totalShippingEmissions;

        const prompt = `Generate a comprehensive environmental impact report based on the following data:

1. Electricity Emissions:
- Total Entries: ${data.electricity.length}
- Total CO2 Emissions: ${totalElectricityEmissions.toFixed(2)} metric tons CO2e
- Details: ${JSON.stringify(formatEmissionsData(data.electricity, 'electricity'))}

2. Explosion Emissions:
- Total Entries: ${data.explosion.length}
- Total CO2 Emissions: ${totalExplosionEmissions.toFixed(2)} metric tons CO2e
- Details: ${JSON.stringify(formatEmissionsData(data.explosion, 'explosion'))}

3. Fuel Combustion Emissions:
- Total Entries: ${data.fuelCombustion.length}
- Total CO2 Emissions: ${totalFuelEmissions.toFixed(2)} metric tons CO2e
- Details: ${JSON.stringify(formatEmissionsData(data.fuelCombustion, 'fuel'))}

4. Shipping Emissions:
- Total Entries: ${data.shipping.length}
- Total CO2 Emissions: ${totalShippingEmissions.toFixed(2)} metric tons CO2e
- Details: ${JSON.stringify(formatEmissionsData(data.shipping, 'shipping'))}

Summary Metrics:
- Total Combined Emissions: ${totalEmissions.toFixed(2)} metric tons CO2e
- Breakdown by Source:
  * Electricity: ${((totalElectricityEmissions/totalEmissions)*100).toFixed(1)}%
  * Explosions: ${((totalExplosionEmissions/totalEmissions)*100).toFixed(1)}%
  * Fuel Combustion: ${((totalFuelEmissions/totalEmissions)*100).toFixed(1)}%
  * Shipping: ${((totalShippingEmissions/totalEmissions)*100).toFixed(1)}%

Please provide a detailed environmental impact report including:

1. Executive Summary
2. Detailed Analysis of Each Emission Source:
   - Electricity Usage and Emissions
   - Explosion-related Emissions
   - Fuel Combustion Analysis
   - Shipping Emissions
3. Comparative Analysis of Different Sources
4. Trends and Patterns
5. Key Areas of Concern
6. Recommendations for Emission Reduction:
   - Short-term Actions
   - Long-term Strategies
   - Technology Adoption Suggestions
7. Conclusion and Next Steps

Please format the report in a clear, structured manner with appropriate headings and subheadings.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating environmental report:', error);
        throw error;
    }
};

module.exports = { generateEnvironmentalReportContent };