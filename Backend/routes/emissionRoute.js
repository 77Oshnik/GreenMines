const express = require("express");
const router = express.Router();
const electricityController = require("../controller/Emission");
const fuelCombustionController = require("../controller/Emission");
const shippingController = require("../controller/Emission");
const explosionController = require("../controller/Emission");



// Route to handle electricity consumption calculation
router.get("/electricity-consumption", electricityController.getElectricityConsumption);
router.get("/fuel-combustion", fuelCombustionController.getFuelCombustion);
router.post("/shipping-emissions", shippingController.calculateShippingEmissions);
router.post("/explosion-emissions", explosionController.calculateExplosionEmissions);




module.exports = router;
