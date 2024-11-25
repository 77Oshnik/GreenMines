const Sink = require("../models/Sink");
const ExistingSink = require("../models/ExistingSink");
const Renewable = require("../models/Renewable");

exports.createSink = async (req, res) => {
    try {
      const {
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        location,
        additionalDetails,
        timeframe,
      } = req.body;
  
      const dailySequestrationRate = carbonSequestrationRate / 365; // CSR per day
  
      // Calculate total carbon sequestration based on the provided timeframe
      const totalSequestration = 
        areaCovered * carbonSequestrationRate * (timeframe || 1); // Default timeframe to 1 year if not provided
  
      // Create and save the new sink
      const newSink = new Sink({
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        dailySequestrationRate, // Save daily sequestration rate
        location,
        additionalDetails,
      });
  
      await newSink.save();
  
      // Respond with the calculated sequestration and saved sink data
      res.status(201).json({
        message: "Carbon sink created successfully",
        data: {
          sink: newSink,
          dailySequestrationRate: 
            `${dailySequestrationRate.toFixed(2)} tons of CO2 per hectare per day`,
          totalSequestration: 
            `${totalSequestration.toFixed(2)} tons of CO2 over ${timeframe || 1} year(s)`,
        },
      });
    } catch (error) {
      console.error("Error saving carbon sink:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  exports.createExistingSink = async (req, res) => {
    try {
      const {
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        location,
        additionalDetails,
        timeframe,
      } = req.body;
  
      // Calculate daily sequestration rate
      const dailySequestrationRate = carbonSequestrationRate / 365; // CSR per day
  
      // Calculate total sequestration based on the provided timeframe
      const totalSequestration = 
        areaCovered * carbonSequestrationRate * (timeframe || 1); // Default to 1 year if not provided
  
      // Create and save the new existing sink
      const newExistingSink = new ExistingSink({
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        dailySequestrationRate,
        location,
        additionalDetails,
      });
  
      await newExistingSink.save();
  
      // Respond with the calculated sequestration and saved sink data
      res.status(201).json({
        message: "Existing carbon sink created successfully",
        data: {
          sink: newExistingSink,
          dailySequestrationRate: 
            `${dailySequestrationRate.toFixed(2)} tons of CO2 per hectare per day`,
          totalSequestration: 
            `${totalSequestration.toFixed(2)} tons of CO2 over ${timeframe || 1} year(s)`,
        },
      });
    } catch (error) {
      console.error("Error saving existing carbon sink:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  exports.calculateRenewableImpact = async (req, res) => {
    try {
        const {
            solutionName,
            co2EmissionsPerDay,
            selectedRenewable,
            desiredReductionPercentage,
            availableLand
        } = req.body;

        if (!solutionName || !co2EmissionsPerDay || !selectedRenewable || !desiredReductionPercentage || !availableLand) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const co2EmissionsPerDayNum = Number(co2EmissionsPerDay);
        const desiredReductionPercentageNum = Number(desiredReductionPercentage);
        const availableLandNum = Number(availableLand);

        if (isNaN(co2EmissionsPerDayNum) || isNaN(desiredReductionPercentageNum) || isNaN(availableLandNum)) {
            return res.status(400).json({ error: 'Inputs must be valid numbers.' });
        }

        if (co2EmissionsPerDayNum <= 0 || desiredReductionPercentageNum <= 0 || availableLandNum <= 0) {
            return res.status(400).json({ error: 'Inputs must be positive values.' });
        }

        const renewableOptions = {
            Solar: {
                co2ReductionPerUnit: 0.4,
                landRequirementPerUnit: 0.01,
                costPerUnit: 8000,
                timeMultiplier: 1.5,
            },
            Wind: {
                co2ReductionPerUnit: 1.5,
                landRequirementPerUnit: 0.05,
                costPerUnit: 300000,
                timeMultiplier: 2,
            },
            Hydropower: {
                co2ReductionPerUnit: 5,
                landRequirementPerUnit: 2,
                costPerUnit: 5000000,
                timeMultiplier: 3,
            },
            HydrogenElectric: {
                co2ReductionPerUnit: 3,
                landRequirementPerUnit: 1,
                costPerUnit: 2000000,
                timeMultiplier: 2.5,
            },
        };

        const renewable = renewableOptions[selectedRenewable];
        if (!renewable) {
            return res.status(404).json({ error: 'Selected renewable energy source not found.' });
        }

        const targetCo2Reduction = (co2EmissionsPerDayNum * desiredReductionPercentageNum) / 100;

        const requiredUnits = Math.ceil(targetCo2Reduction / renewable.co2ReductionPerUnit);
        const landRequired = requiredUnits * renewable.landRequirementPerUnit;

        let totalReductionPerDay;
        let timeToAchieveNeutrality;
        let implementationCost;

        if (availableLandNum >= landRequired) {
            // Land is sufficient
            totalReductionPerDay = requiredUnits * renewable.co2ReductionPerUnit;
            timeToAchieveNeutrality = Math.ceil(targetCo2Reduction / totalReductionPerDay);
            implementationCost = requiredUnits * renewable.costPerUnit;
        } else {
            // Land is insufficient - scale reduction and cost accordingly
            const deployableUnits = Math.floor(availableLandNum / renewable.landRequirementPerUnit);
            totalReductionPerDay = deployableUnits * renewable.co2ReductionPerUnit;

            if (totalReductionPerDay > 0) {
                timeToAchieveNeutrality = Math.ceil(targetCo2Reduction / totalReductionPerDay);
            } else {
                // Handle the smallest possible deployment scenario
                const fractionalReductionPerDay = availableLandNum * (renewable.co2ReductionPerUnit / renewable.landRequirementPerUnit);
                totalReductionPerDay = fractionalReductionPerDay;
                timeToAchieveNeutrality = Math.ceil(targetCo2Reduction / totalReductionPerDay);
            }

            implementationCost = deployableUnits * renewable.costPerUnit;
        }

        // Avoid edge cases where calculations result in zero values
        if (totalReductionPerDay <= 0) totalReductionPerDay = 0.01;

        res.json({
            solutionName,
            selectedRenewable,
            implementationCost: `₹${implementationCost.toLocaleString()}`,
            targetCo2Reduction: targetCo2Reduction.toFixed(2),
            totalCo2ReductionPerDay: totalReductionPerDay.toFixed(2),
            landProvided: availableLandNum.toFixed(2),
            timeToAchieveNeutrality: `${timeToAchieveNeutrality} day${timeToAchieveNeutrality > 1 ? 's' : ''}`,
        });
    } catch (error) {
        console.error('Error calculating renewable impact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
