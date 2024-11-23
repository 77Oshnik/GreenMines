const Sink = require("../models/Sink");
const ExistingSink = require("../models/ExistingSink");

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