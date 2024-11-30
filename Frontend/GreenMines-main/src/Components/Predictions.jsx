import React, { useState } from "react";
import Navbar from "./Navbar"; // Assuming Navbar is in the same directory
import axios from "axios";

function EmissionPredictionPage() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("fuel");

  const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value; // Get the date in YYYY-MM-DD format
    setStartDate(selectedDate);

    // Calculate the end date as 6 days later
    const endDateObj = new Date(selectedDate);
    endDateObj.setDate(endDateObj.getDate() + 6);

    // Cap the end date to today's date if it exceeds today
    const todayDate = new Date(today);
    if (endDateObj > todayDate) {
      setEndDate(today); // Use today if the calculated end date exceeds today's date
    } else {
      const formattedEndDate = endDateObj.toISOString().split("T")[0]; // Format end date to YYYY-MM-DD
      setEndDate(formattedEndDate);
    }
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setError("Please select a valid date range.");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      // Fetching data from your Flask API
      const response = await axios.get(`http://localhost:5000/api/data/${startDate}/${endDate}`);

      const categoryData = response.data[selectedCategory] || [];

      // Check if there's no data for the selected category
      if (categoryData.length === 0) {
        setError(`No data available for the selected category (${selectedCategory}) in the past 7 days.`);
        setPredictions(null);
        return;
      }

      // Format the data
      const formattedData = formatDataForCategory(selectedCategory, categoryData);

      console.log("Formatted Data to send to Flask:", formattedData); // Log the formatted data before sending it to Flask

      // Send the formatted data to Flask
      const flaskRoute = getFlaskRoute(selectedCategory);
      const apiResponse = await axios.post(flaskRoute, formattedData);
      console.log("API Response from Flask:", apiResponse.data); // Log response from Flask

      setPredictions(apiResponse.data); // Set the full response object
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDataForCategory = (category, data) => {
    console.log(`Formatting data for category: ${category}`); // Log category selection

    switch (category) {
      case "fuelCombustion":
        return formatFuelData(data);
      case "electricity":
        return formatElectricityData(data);
      case "explosion":
        return formatExplosionData(data);
      case "shipping":
        return formatTransportData(data);
      default:
        throw new Error("Invalid category selected.");
    }
  };

  // Format fuel data
  const formatFuelData = (fuelData) => {
    const daysData = [];

    // Check if data is empty
    if (fuelData.length === 0) {
      console.log("Fuel data is empty.");
    }

    // Loop through the fuel data
    fuelData.forEach(fuel => {

        // Create an array for each fuel entry with fuel type and quantity
        const fuelEntry = [fuel.fuel, fuel.quantityFuelConsumed];
        
        daysData.push([fuelEntry]);  // Push as an array of arrays
    });

    return { days_data: daysData };
  };

  // Format electricity data
  const formatElectricityData = (data) => {
    // If data is empty, return a default structure
    
  
    let stateName = "Karnataka";  // Default fallback state name
  
    // Iterate through the data to find the first valid entry with a stateName
    for (let entry of data) {
      if (entry?.stateName) {
        stateName = entry.stateName;  // Assign the state name from the first valid entry
        break;  // Once we find a valid stateName, stop iterating
      }
    }
  
    // Map the rest of the data for the days_data array
    const daysData = data.map((entry) => ({
      energyPerTime: entry.energyPerTime,
      responsibleArea: entry.responsibleArea,
      totalArea: entry.totalArea,
    }));
  
    return {
      state_name: stateName,
      days_data: daysData,
    };
  };
  
  


  // Format explosion data
  const formatExplosionData = (data) => {
    const groupedByDate = {};
  
    // Iterate over each entry in the data
    data.forEach((entry) => {
      const date = new Date(entry.createdAt).toISOString().split('T')[0];  // Extract the date in YYYY-MM-DD format
  
      // Initialize the array for that date if it doesn't exist yet
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
  
      // Push the explosive data (type and amount) into the array for that date
      groupedByDate[date].push([entry.explosiveType, entry.amount]);
    });
  
    // Convert groupedByDate into the required days_data format
    const days_data = Object.values(groupedByDate);
  
    return {
      days_data: days_data
    };
  };
  
  // Format transport data
  const formatTransportData = (data) => {
    // Group the data by day
    const groupedByDay = {};

    // Iterate over the data and group by 'createdAt' (or any other date field)
    data.forEach(entry => {
        const date = new Date(entry.createdAt).toISOString().split('T')[0]; // Extract date (YYYY-MM-DD)

        // Initialize the array for that day if it doesn't exist yet
        if (!groupedByDay[date]) {
            groupedByDay[date] = [];
        }

        // Push the transport record in the desired format
        if (
            entry.weight_unit &&
            entry.weight_value &&
            entry.distance_unit &&
            entry.distance_value &&
            entry.transport_method
        ) {
            groupedByDay[date].push([
                entry.weight_unit,
                entry.weight_value,
                entry.distance_unit,
                entry.distance_value,
                entry.transport_method
            ]);
        } else {
            console.error("Missing data in entry", entry);
        }
    });

    // Convert groupedByDay into an array of days with the respective transport data
    const formattedData = Object.values(groupedByDay);

    return { days_data: formattedData };
};

  


  const getFlaskRoute = (category) => {
    switch (category) {
      case "fuelCombustion":
        return "http://127.0.0.1:8800/ml/fuel";
      case "electricity":
        return "http://127.0.0.1:8800/ml/electricity";
      case "explosion":
        return "http://127.0.0.1:8800/ml/explosive";
      case "shipping":
        return "http://127.0.0.1:8800/ml/transport";
      default:
        throw new Error("Invalid category selected.");
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto bg-[#231E3D] rounded-2xl shadow-lg overflow-hidden border-2 border-[#66C5CC]">
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-[#66C5CC] mb-8 text-center">
            Emission Prediction Dashboard
          </h1>

          {/* Date Range Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <label className="block text-[#4da5aa] mb-2">Start Date</label>
              <input
                type="date"
                className="w-full p-3 rounded-lg border border-[#66C5CC] bg-[#342F49] text-white"
                value={startDate}
                max={today}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[#4da5aa] mb-2">End Date</label>
              <input
                type="date"
                className="w-full p-3 rounded-lg border border-[#66C5CC] bg-[#342F49] text-white"
                value={endDate}
                readOnly
              />
            </div>
          </div>

          {/* Radio Button Section */}
          <div className="mb-8">
            <label className="block text-[#4da5aa] mb-4">Predict Emission Category</label>
            <div className="flex justify-between gap-6">
              {["fuelCombustion", "electricity", "explosion", "shipping"].map((category) => (
                <label key={category} className="flex items-center text-lg">
                  <input
                    type="radio"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mr-3 w-6 h-6"
                  />
                  <span className="text-white capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Predict Risk Button */}
          <div className="text-center">
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-[#66C5CC] text-white text-lg font-bold rounded-lg hover:bg-[#4da5aa] transition"
            >
              Fetch and Predict Risk
            </button>
          </div>

          {/* Loading or Error Message */}
          {loading && <div className="text-center mt-6 text-[#66C5CC]">Loading...</div>}
          {error && <div className="text-center mt-6 text-red-500">{error}</div>}

          {/* Display Predictions */}
          {predictions && !loading && (
            <div className="mt-6 bg-[#1d1d1f] p-6 rounded-lg text-[#66C5CC]">
              <h3 className="text-2xl mb-4">Predictions</h3>
              <pre>{JSON.stringify(predictions, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmissionPredictionPage;
