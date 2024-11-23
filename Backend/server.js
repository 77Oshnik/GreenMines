const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');



// Route Imports
const emissionRoute = require("./routes/emissionRoute");
const sinkRoute = require("./routes/sinkRoute");
// Add other routes similarly

dotenv.config();
connectDB();


const app = express();
app.use(express.json());

app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000' // Adjust to match your frontend URL
}));

// Register routes
app.use("/api",emissionRoute );
app.use("/api", sinkRoute);
// Add other routes similarly

const PORT =  5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
