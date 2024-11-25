const Sink = require("../models/Sink");
const ExistingSink = require("../models/ExistingSink");
const Renewable = require("../models/Renewable");
const CCS = require('../models/ccs');


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
      const { solutionName, co2EmissionsPerDay, selectedRenewable, desiredReductionPercentage, availableLand } = req.body;
  
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
          timeMultiplier: 3, // Used for scaling larger projects if needed
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
  
      // Time Calculation in Days:
      let timeToAchieveNeutrality;
      const totalReductionPerDay = requiredUnits * renewable.co2ReductionPerUnit;
  
      if (availableLandNum >= landRequired) {
        timeToAchieveNeutrality = Math.ceil((targetCo2Reduction / totalReductionPerDay) * 1); // Normal case
      } else {
        const landFactor = availableLandNum / landRequired;
        timeToAchieveNeutrality = Math.ceil((targetCo2Reduction / totalReductionPerDay) / landFactor); // Adjusted for land shortage
      }
  
      // Convert time to days (if it's less than 1 day, it'll round up to 1 day)
      timeToAchieveNeutrality = Math.max(1, timeToAchieveNeutrality);
  
      const implementationCost = requiredUnits * renewable.costPerUnit;
  
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
  


// Predefined capture efficiencies based on CCS technology
const captureEfficiencyMap = {
  "Post-combustion": 0.85,  // 85% efficiency for post-combustion
  "Pre-combustion": 0.90,   // 90% efficiency for pre-combustion
  "Oxy-fuel combustion": 0.95 // 95% efficiency for oxy-fuel combustion
};

// Controller to calculate CCS results based on inputs
exports.calculateCCS = async (req, res) => {
  try {
    const { 
      mineName, 
      annualEmissions, 
      mineSize, 
      ccsTechnology, 
      installationCostPerTon, // Optional
      annualMaintenanceCost // Optional
    } = req.body;

    // Default values if not provided
    const defaultInstallationCostPerTon = 2000; // ₹2000 per ton
    const defaultAnnualMaintenanceCost = 10000000; // ₹10 million/year
    const carbonCreditPrice = 1500; // ₹1500 per ton

    // Get the capture efficiency based on the CCS technology
    const captureEfficiency = captureEfficiencyMap[ccsTechnology] || 0.85; // Default to 85% if technology is unknown

    // Use user input values or default if not provided
    const costPerTon = installationCostPerTon || defaultInstallationCostPerTon;
    const maintenanceCost = annualMaintenanceCost || defaultAnnualMaintenanceCost;

    // Calculate captured CO₂ (tons)
    const capturedCO2 = annualEmissions * captureEfficiency;  // in tons of CO₂

    // Calculate installation cost (₹)
    const installationCost = capturedCO2 * costPerTon; // ₹

    // Calculate potential carbon credit revenue (₹)
    const carbonCreditRevenue = capturedCO2 * carbonCreditPrice; // ₹

    // Calculate the total cost for the first year (₹)
    const totalCostForFirstYear = installationCost + maintenanceCost; // ₹

    // Calculate the total revenue for the first year (₹)
    const totalRevenueForFirstYear = carbonCreditRevenue; // ₹

    // Net profit for the first year (installation + maintenance + revenue)
    const netProfitForFirstYear = totalRevenueForFirstYear - totalCostForFirstYear; // ₹

    // Calculate the net profit for the following 9 years
    const annualNetProfit = carbonCreditRevenue - maintenanceCost; // ₹

    // Total profit for 10 years
    const totalProfitForTenYears = netProfitForFirstYear + (annualNetProfit * 9); // ₹

    // Save the data to the database
    const ccsData = new CCS({
      mineName,
      annualEmissions,
      mineSize,
      ccsTechnology,
      installationCostPerTon: costPerTon,
      annualMaintenanceCost: maintenanceCost,
      captureEfficiency,
      capturedCO2,
      installationCost,
      maintenanceCost,
      carbonCreditRevenue,
      totalCostForFirstYear,
      totalRevenueForFirstYear,
      netProfitForFirstYear,
      annualNetProfit,
      totalProfitForTenYears
    });

    await ccsData.save();

    // Send the response with results for both 1 year and 10 years and proper units
    res.status(200).json({
      message: "CCS calculation successful for 1 year and 10 years",
      data: {
        mineName,
        annualEmissions,
        mineSize,
        ccsTechnology,
        captureEfficiency: `${(captureEfficiency * 100).toFixed(2)}%`,  // in percentage
        capturedCO2: `${capturedCO2.toFixed(2)} tons`,  // in tons of CO₂
        installationCost: `₹${installationCost.toFixed(2)}`,  // in ₹
        maintenanceCost: `₹${maintenanceCost.toFixed(2)}`,  // in ₹
        carbonCreditRevenue: `₹${carbonCreditRevenue.toFixed(2)}`,  // in ₹
        totalCostForFirstYear: `₹${totalCostForFirstYear.toFixed(2)}`,  // in ₹
        totalRevenueForFirstYear: `₹${totalRevenueForFirstYear.toFixed(2)}`,  // in ₹
        netProfitForFirstYear: `₹${netProfitForFirstYear.toFixed(2)}`,  // in ₹
        annualNetProfit: `₹${annualNetProfit.toFixed(2)}`,  // in ₹ per year
        totalProfitForTenYears: `₹${totalProfitForTenYears.toFixed(2)}`  // in ₹ for 10 years
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};