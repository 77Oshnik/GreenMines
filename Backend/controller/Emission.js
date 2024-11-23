const axios = require("axios");
const Electricity = require("../models/Electricity");
const FuelCombustion = require("../models/FuelCombustion");
const Shipping = require("../models/Shipping");
const Explosion=require("../models/Explosion")



exports.getElectricityConsumption = async (req, res) => {
  const { stateName, "values.EnergyperTime": energyPerTime, "values.Responsiblearea": responsibleArea, "values.Totalarea": totalArea } = req.query;

  try {
    const response = await axios.get(
      "https://api.carbonkit.net/3.6/categories/Electricity_India_By_State/calculation",
      {
        params: {
          stateName,
          "values.EnergyperTime": energyPerTime,
          "values.Responsiblearea": responsibleArea,
          "values.Totalarea": totalArea,
        },
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + Buffer.from("sujal6990:sujal9867").toString("base64"),
        },
      }
    );

    const result = response.data.output.amounts.reduce((acc, curr) => {
      acc[curr.type] = {
        value: curr.value,
        unit: "kg/day", // Adding unit explicitly as per your logic
      };
      return acc;
    }, {});

    const electricityData = new Electricity({
      stateName,
      energyPerTime,
      responsibleArea,
      totalArea,
      result,
    });

    await electricityData.save();

    res.json({ result });
  } catch (error) {
    console.error(
      "Error fetching data from CarbonKit API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.getFuelCombustion = async (req, res) => {
  const { fuel, "values.Volume": Volume } = req.query;

  try {
    const response = await axios.get(
      "https://api.carbonkit.net/3.6/categories/DEFRA_transport_fuel_methodology/calculation",
      {
        params: {
          fuel,
          "values.Volume": Volume,
        },
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + Buffer.from("sujal6990:sujal9867").toString("base64"),
        },
      }
    );

    const result = response.data.output.amounts.reduce((acc, curr) => {
      if (
        [
          "CO2",
          "nitrousOxideCO2e",
          "methaneCO2e",
          "totalDirectCO2e",
          "indirectCO2e",
          "lifeCycleCO2e",
        ].includes(curr.type)
      ) {
        acc[curr.type] = {
          value: curr.value,
          unit: curr.unit,
        };
      }
      return acc;
    }, {});

    const fuelCombustionData = new FuelCombustion({
      fuel,
      quantityFuelConsumed: Volume,
      result,
    });

    await fuelCombustionData.save();

    res.json({ result });
  } catch (error) {
    console.error(
      "Error fetching data from CarbonKit API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.calculateShippingEmissions = async (req, res) => {
  let { weight_unit, weight_value, distance_unit, distance_value, transport_method } = req.body;

  weight_value = parseFloat(weight_value);
  distance_value = parseFloat(distance_value);

  if (!weight_unit || !distance_unit || !transport_method || isNaN(weight_value) || isNaN(distance_value)) {
    return res.status(400).json({
      error: "Invalid input: Please ensure all fields are filled out correctly.",
    });
  }

  try {
    const response = await axios.post(
      "https://www.carboninterface.com/api/v1/estimates",
      {
        type: "shipping",
        weight_unit,
        weight_value,
        distance_unit,
        distance_value,
        transport_method,
      },
      {
        headers: {
          Authorization: `Bearer ZguQ1dBUb7qSLQhpZQV3KQ`,
          "Content-Type": "application/json",
        },
      }
    );

    const carbonData = response.data.data.attributes;
    const result = {
      distance: `${carbonData.distance_value} ${carbonData.distance_unit}`,
      weight: `${carbonData.weight_value} ${carbonData.weight_unit}`,
      carbonEmissions: {
        grams: `${carbonData.carbon_g} g`,
        kilograms: `${carbonData.carbon_kg} kg`,
        metricTonnes: `${carbonData.carbon_mt} mt`,
      },
    };

    const shippingData = new Shipping({
      weight_unit,
      weight_value,
      distance_unit,
      distance_value,
      transport_method,
      result,
    });

    await shippingData.save();

    res.json(result);
  } catch (error) {
    console.error(
      "Error fetching data from Carbon Interface API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
};


exports.calculateExplosionEmissions = async (req, res) => {
  const { explosiveType, amount } = req.body;

  
  const emissionFactors = {
    'Black powder': { CO: 85, H2S: 12, CO2: 3100 },
    'Smokeless powder': { CO: 38, H2S: 10, CO2: 38 },
    'Dynamite, straight': { CO: 141, H2S: 3, CO2: 2320 },
    'Dynamite, ammonia': { CO: 32, H2S: 16, CO2: 32 },
    'Dynamite, gelatin': { CO: 52, NOx: 26, SO2: 1, CO2: 52 },
    'ANFO': { CO: 34, NOx: 8, SO2: 1, CO2: 34 },
    'TNT': { CO: 398, NH3: 14, HCN: 13, CO2: 1360 },
    'RDX': { CO: 98, NH3: 22, CO2: 1190 },
    'PETN': { CO: 149, NH3: 1.3, CO2: 696 }
  };

  try {
    if (!emissionFactors[explosiveType]) {
      return res.status(400).json({ error: "Invalid explosive type" });
    }

    const factors = emissionFactors[explosiveType];
    const emissions = {
      CO: (amount * factors.CO / 1000).toFixed(2) + " kg",
      NOx: (amount * (factors.NOx || 0) / 1000).toFixed(2) + " kg",
      NH3: (amount * (factors.NH3 || 0) / 1000).toFixed(2) + " kg",
      HCN: (amount * (factors.HCN || 0) / 1000).toFixed(2) + " kg",
      H2S: (amount * (factors.H2S || 0) / 1000).toFixed(2) + " kg",
      SO2: (amount * (factors.SO2 || 0) / 1000).toFixed(2) + " kg",
      CO2: (amount * factors.CO2 / 1000).toFixed(2) + " kg",
    };

    const explosionData = new Explosion({
      explosiveType,
      amount,
      emissions,
    });

    await explosionData.save();

    res.json({ emissions, explosiveType, amount });
  } catch (error) {
    console.error("Error calculating emissions:", error.message);
    res.status(500).json({ error: "Failed to calculate emissions" });
  }
};
