const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const path = require("path");

// Route Imports
const emissionRoute = require("./routes/emissionRoute");
const sinkRoute = require("./routes/sinkRoute");
const genaiRoute = require("./routes/genaiRoute");
const authRoutes = require('./routes/authRoutes');  // 2FA related auth routes
const dataRoute = require("./routes/datafetchingRoute");
const chatbotRoute = require("./routes/chatbotRoute");
const afoluRoute = require("./routes/afoluRoute");
const sinkdatafetchRoute = require("./routes/sinkdatafetchRoute");
const existingSinkRoute = require("./routes/existingSinkRoute");
// Add other routes similarly

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON
app.use(cors()); // Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL for CORS
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));

// Security Middleware
const helmet = require("helmet");
app.use(helmet());  // Adding Helmet for security headers

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Register Routes for 2FA and others
app.use("/api", emissionRoute);      // Routes for emissions
app.use("/api", sinkRoute);          // Routes for sinks
app.use("/api", genaiRoute);         // Routes for GenAI
app.use("/api", authRoutes);         // Routes for authentication (includes 2FA)
app.use("/api", dataRoute);          // Routes for data fetching
app.use("/api", chatbotRoute);       // Routes for chatbot
app.use("/api", afoluRoute);         // Routes for Afolu
app.use("/api", sinkdatafetchRoute); // Routes for sink data fetching
app.use("/api", existingSinkRoute);  // Routes for existing sink
// Add other routes similarly

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
