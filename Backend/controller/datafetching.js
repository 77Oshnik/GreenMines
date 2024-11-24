const Electricity = require("../models/Electricity");
const FuelCombustion = require("../models/FuelCombustion");
const Shipping = require("../models/Shipping");
const Explosion = require("../models/Explosion");

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for YYYY-MM-DD format
    if (!regex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};



// Function to fetch data from a specific model
const fetchModelData = async (Model, startDate, endDate) => {
    const query = {
        createdAt: {}
    };

    if (startDate) {
        query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
        query.createdAt.$lte = new Date(endDate);
    }

    return await Model.find(query).sort({ createdAt: 1 });
};

// Function to fetch data on specific date
exports.fetchDateData = async (req, res) => {
    try {
        const { date } = req.params;

        if (!isValidDate(date)) {
            return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD format.' });
        }

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const [electricityData, fuelData, shippingData, explosionData] = await Promise.all([
            fetchModelData(Electricity, startDate, endDate),
            fetchModelData(FuelCombustion, startDate, endDate),
            fetchModelData(Shipping, startDate, endDate),
            fetchModelData(Explosion, startDate, endDate)
        ]);

        res.json({
            date,
            electricity: electricityData,
            fuelCombustion: fuelData,
            shipping: shippingData,
            explosion: explosionData
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Function to fetch the data on date range
exports.fetchDateRangeData=async(req,res)=>{
    try {
        const { startDate, endDate } = req.params;

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD format.' });
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ error: 'Start date must be before or equal to end date' });
        }

        const [electricityData, fuelData, shippingData, explosionData] = await Promise.all([
            fetchModelData(Electricity, start, end),
            fetchModelData(FuelCombustion, start, end),
            fetchModelData(Shipping, start, end),
            fetchModelData(Explosion, start, end)
        ]);

        res.json({
            dateRange: {
                startDate,
                endDate
            },
            electricity: electricityData,
            fuelCombustion: fuelData,
            shipping: shippingData,
            explosion: explosionData
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



// Function to delete an entry by ID across all models
exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        const models = [Electricity, FuelCombustion, Shipping, Explosion];

        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let deletedEntry = null;

        // Iterate through models to find and delete the document
        for (const Model of models) {
            const entry = await Model.findOne({ _id: id, createdAt: { $gte: startOfDay, $lte: endOfDay } });

            if (entry) {
                deletedEntry = await Model.findByIdAndDelete(id);
                break; // Stop if the document is found and deleted
            }
        }

        if (!deletedEntry) {
            return res.status(404).json({ error: "Entry not found for the current day." });
        }

        res.status(200).json({ message: "Entry deleted successfully.", data: deletedEntry });
    } catch (error) {
        console.error("Error deleting entry:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
