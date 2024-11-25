const express = require("express");
const router = express.Router();
const sinkController = require("../controller/sink");
const existingSinkController = require("../controller/sink");
const renwableController = require("../controller/sink");

// Route for creating a carbon sink
router.post("/sinks", sinkController.createSink);
router.post("/existing-sinks", existingSinkController.createExistingSink);
router.post("/renewable",renwableController.calculateRenewableImpact)
router.post("/ccs",sinkController.calculateCCS)

module.exports = router;
