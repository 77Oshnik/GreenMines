const express = require("express");
const router = express.Router();
const sinkController = require("../controller/sink");
const existingSinkController = require("../controller/sink");


// Route for creating a carbon sink
router.post("/sinks", sinkController.createSink);
router.post("/existing-sinks", existingSinkController.createExistingSink);


module.exports = router;
