// services/geminiReportService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY3);

const generateEnvironmentalReportContent = async (data) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Helper function to safely parse numbers
        const parseNumber = (value) => {
            if (!value) return 0;
            const parsed = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        };

        // Calculate Electricity Emissions
        const totalElectricityEmissions = data.electricity.reduce((sum, item) => {
            try {
                if (item.result) {
                    const resultObj = Object.fromEntries(item.result);
                    if (resultObj.CO2 && resultObj.CO2.value) {
                        const value = parseNumber(resultObj.CO2.value);
                        console.log('Individual Electricity CO2:', value);
                        return sum + value;
                    }
                }
                return sum;
            } catch (error) {
                console.error('Error processing electricity item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Electricity Emissions:', totalElectricityEmissions);

        // Calculate Explosion Emissions
        const totalExplosionEmissions = data.explosion.reduce((sum, item) => {
            try {
                if (item.emissions && item.emissions.CO2) {
                    const value = parseNumber(item.emissions.CO2);
                    console.log('Individual Explosion CO2:', value);
                    return sum + value;
                }
                return sum;
            } catch (error) {
                console.error('Error processing explosion item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Explosion Emissions:', totalExplosionEmissions);

        // Calculate Fuel Emissions
        const totalFuelEmissions = data.fuelCombustion.reduce((sum, item) => {
            try {
                if (item.result && item.result.CO2 && item.result.CO2.value) {
                    const value = parseNumber(item.result.CO2.value);
                    console.log('Individual Fuel CO2:', value);
                    return sum + value;
                }
                return sum;
            } catch (error) {
                console.error('Error processing fuel item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Fuel Emissions:', totalFuelEmissions);

        // Calculate Shipping Emissions
        const totalShippingEmissions = data.shipping.reduce((sum, item) => {
            try {
                if (item.result && item.result.carbonEmissions && item.result.carbonEmissions.kilograms) {
                    const value = parseNumber(item.result.carbonEmissions.kilograms);
                    console.log('Individual Shipping CO2:', value);
                    return sum + value;
                }
                return sum;
            } catch (error) {
                console.error('Error processing shipping item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Shipping Emissions:', totalShippingEmissions);

        const totalCarbonSequestration = data.sinks.reduce((sum, item) => {
            const dailyRate = item.dailySequestrationRate || 
                (item.carbonSequestrationRate / 365);
            const value = dailyRate * item.areaCovered;
            console.log('Sink absorption value:', value);
            return sum + value;
        }, 0);
        console.log('Total Carbon Sequestration:', totalCarbonSequestration);

        // Format detailed data for better reporting
        const formatElectricityData = data.electricity.map(item => {
            const resultObj = Object.fromEntries(item.result);
            return {
                stateName: item.stateName,
                energyPerTime: item.energyPerTime,
                area: `${item.responsibleArea}/${item.totalArea}`,
                emissions: resultObj,
                co2Emissions: parseNumber(resultObj.CO2.value)
            };
        });

        const formatExplosionData = data.explosion.map(item => ({
            type: item.explosiveType,
            amount: item.amount,
            emissions: item.emissions,
            co2Emissions: parseNumber(item.emissions.CO2)
        }));

        const formatFuelData = data.fuelCombustion.map(item => ({
            fuelType: item.fuel,
            quantity: item.quantityFuelConsumed,
            emissions: item.result,
            co2Emissions: parseNumber(item.result.CO2.value) 
        }));

        const formatShippingData = data.shipping.map(item => ({
            weight: `${item.weight_value} ${item.weight_unit}`,
            distance: `${item.distance_value} ${item.distance_unit}`,
            method: item.transport_method,
            emissions: item.result,
            co2Emissions: parseNumber(item.result.carbonEmissions.kilograms) 
        }));

        // Log the raw data for debugging
        console.log('Raw Electricity Data:', JSON.stringify(data.electricity[0]?.result));
        console.log('Raw Explosion Data:', JSON.stringify(data.explosion[0]?.emissions));
        console.log('Raw Fuel Data:', JSON.stringify(data.fuelCombustion[0]?.result));
        console.log('Raw Shipping Data:', JSON.stringify(data.shipping[0]?.result));

        const emissionsInTons = {
            electricity: totalElectricityEmissions / 1000, // Convert kg to metric tons
            explosion: totalExplosionEmissions / 1000,
            fuel: totalFuelEmissions / 1000,
            shipping: totalShippingEmissions / 1000
        };

        console.log('\nFinal Emissions in Metric Tons:', emissionsInTons);

        const prompt = `Generate a comprehensive environmental impact report based on the following data:

        1. Electricity Emissions:
        - Total Entries: ${data.electricity.length}
        - Total CO2 Emissions: ${emissionsInTons.electricity.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalElectricityEmissions.toFixed(2)} kg CO2e
        
        2. Explosion Emissions:
        - Total Entries: ${data.explosion.length}
        - Total CO2 Emissions: ${emissionsInTons.explosion.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalExplosionEmissions.toFixed(2)} kg CO2e
        
        3. Fuel Combustion Emissions:
        - Total Entries: ${data.fuelCombustion.length}
        - Total CO2 Emissions: ${emissionsInTons.fuel.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalFuelEmissions.toFixed(2)} kg CO2e
        
        4. Shipping Emissions:
        - Total Entries: ${data.shipping.length}
        - Total CO2 Emissions: ${emissionsInTons.shipping.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalShippingEmissions.toFixed(2)} kg CO2e

        5. Carbon Sinks:
        - Total Entries: ${data.sinks.length}
        - Total Daily Carbon Sequestration: ${totalCarbonSequestration.toFixed(2)} tonnes CO2e
        

        
        Summary Metrics:
        - Total Combined Emissions: ${(emissionsInTons.electricity + emissionsInTons.explosion + emissionsInTons.fuel + emissionsInTons.shipping).toFixed(2)} metric tons CO2e
                
Please provide a detailed environmental impact report including:

1. Executive Summary
2. Detailed Analysis of Each Emission Source:
   - Electricity Usage Analysis
   - Explosion-Related Emissions Analysis
   - Fuel Combustion Analysis
   - Shipping Emissions Analysis
   - Carbon Sinks (provide details of above carbon emission and absorbtion and compare it and give an analysis of how much emission will be covered in this sink how much more sink we will need to neutralize all the carbon emission)
3. Comparative Analysis
4. Trends and Patterns
5. Environmental Impact Assessment
6. Recommendations for Emission Reduction
7. Conclusion

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