import React, { useState } from "react";
import Navbar from "./Navbar"; // Assuming Navbar is in the same directory
import axios from "axios";
import ChatAssistant from "./ChatAssistant";
import { toast } from 'react-toastify'; // Ensure you have this import

function EmissionPredictionPage() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()-1); // Default to current year
  const [selectedCategory, setSelectedCategory] = useState("fuel");

  const handleYearChange = (e) => {
    const inputYear = parseInt(e.target.value, 10);
    const currentYear = new Date().getFullYear();

    if (inputYear < currentYear) {
      setSelectedYear(inputYear);
      setError(null);  // Clear the error if the year is valid
    } else {
      setError("Year cannot be greater than the current year.");  // Set error message
    }
  };

  const fetchData = async () => {
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;

    setLoading(true);
    setError(null);

    try {
      // Fetching data from your Flask API
      const response = await axios.get(
        `http://localhost:5000/api/data/${startDate}/${endDate}`
      );

      const categoryData = response.data[selectedCategory] || [];

      // Check if there's no data for the selected category
      if (categoryData.length === 0) {
        setError(
          `No data available for the selected category (${selectedCategory}) for the year ${selectedYear}.`
        );
        setPredictions(null);
        return;
      }

      // Format the data
      const formattedData = formatDataForCategory(selectedCategory, categoryData);

     
      // Send the formatted data to Flask
      const flaskRoute = getFlaskRoute(selectedCategory);
      const apiResponse = await axios.post(flaskRoute, formattedData);

      
      setPredictions(apiResponse.data);
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };
  const formatDataForCategory = (category, data) => {
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
    // Create an object to group fuel data by date
    const groupedByDate = {};
  
    // Iterate over the fuel data
    fuelData.forEach((fuel) => {
      const date = new Date(fuel.createdAt).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
  
      // If the date doesn't exist in the grouped object, initialize it
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
  
      // Push the fuel data (type and quantity) into the array for that date
      groupedByDate[date].push([fuel.fuel, fuel.quantityFuelConsumed]);
    });
  
    // Convert the grouped object into an array of arrays for `days_data`
    const daysData = Object.values(groupedByDate);
  
    return { days_data: daysData };
  };
  

  // Format electricity data
  const formatElectricityData = (data) => {
    if (!data || data.length === 0) {
      console.log("No data available for electricity. Returning default payload.");
      return {
        state_name: "Unknown",
        days_data: [],
      };
    }
  
    // Try to determine `state_name` from the first valid entry in the data
    let stateName = "Unknown"; // Default fallback
    for (let entry of data) {
      if (entry?.stateName) {
        stateName = entry.stateName;
        break;
      }
    }
  
    // Transform the `data` array into `days_data`
    const daysData = data
      .filter(entry => entry.energyPerTime !== undefined) // Filter out invalid entries
      .map(entry => ({
        energyPerTime: entry.energyPerTime || 0,
        responsibleArea: entry.responsibleArea || "N/A",
        totalArea: entry.totalArea || "N/A",
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
      <div className="w-full">
    <Navbar />
    <ChatAssistant />
  </div>
      <div className="w-full max-w-4xl mt-10 mx-auto bg-[#231E3D] rounded-2xl shadow-lg overflow-hidden border-2 border-[#66C5CC]">
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-[#66C5CC] mb-8 text-center">
            Emission Prediction Dashboard
          </h1>

           {/* Year Selection Section */}
           <div className="mb-6">
            <label className="block text-[#4da5aa] mb-2">Select Year</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg border border-[#66C5CC] bg-[#342F49] text-white"
              value={selectedYear}
              min="1900" // Optional: Earliest year you want to allow
              max={new Date().getFullYear()}
              onChange={handleYearChange}
            />
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
    <h3 className="text-2xl mb-4">Predictions for {selectedCategory}</h3>
    {selectedCategory === 'fuelCombustion' && predictions.predictions && (
      <div className="space-y-4">
        {predictions.predictions.predictions.map((prediction, index) => (
          <div key={index} className="border-b border-[#66C5CC] pb-4">
            <h4 className="text-xl font-semibold mb-2">Day {prediction.day}</h4>
            <p className="mb-2">
              <strong>Fuel Type:</strong> {prediction.fuel_data.fuel_type}
            </p>
            <p className="mb-2">
              <strong>Quantity Consumed:</strong>{" "}
              {prediction.fuel_data.quantity_fuel_consumed_liters} liters
            </p>
            <div className="mb-2">
              <h5 className="font-medium">Emissions:</h5>
              <ul className="ml-4 list-disc">
                {Object.entries(prediction.fuel_data.emissions).map(
                  ([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h5 className="font-medium">Risk Levels:</h5>
              <ul className="ml-4 list-disc">
                {Object.entries(prediction.fuel_data.risk_levels).map(
                  ([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}

{selectedCategory === 'electricity' && (
  <div className="space-y-4">
    {predictions && predictions.predictions ? (
      <>
        <p className="text-lg"><strong>State:</strong> {predictions.state}</p>
        {Array.isArray(predictions.predictions) ? (
          predictions.predictions.map((prediction, index) => (
            <div key={index} className="border-b border-[#66C5CC] pb-4">
              <h4 className="text-xl font-semibold mb-2">Entry No. {prediction['Entry No ']}</h4>
              <p className="mb-2">
                <strong>Predicted CO2:</strong> {prediction.predicted_co2}
              </p>
              <p>
                <strong>Risk Level:</strong> {prediction.risk_level}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-red-500">
            No predictions available for electricity
          </div>
        )}
      </>
    ) : (
      <div className="text-center text-red-500">
        Unexpected predictions format
      </div>
    )}
  </div>
)}

{selectedCategory === 'explosion' && (
  <div className="space-y-4">
    {predictions ? (
      Object.entries(predictions).map(([day, dayPredictions]) => (
        <div key={day} className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">{day}</h3>
          {Array.isArray(dayPredictions) ? (
            dayPredictions.map((predictionGroup, groupIndex) => (
              <div key={groupIndex} className="border-b border-[#66C5CC] pb-4 mb-4">
                {Array.isArray(predictionGroup) ? (
                  predictionGroup.map((prediction, predIndex) => (
                    <div key={predIndex}>
                      <p className="mb-2">
                        <strong>Explosive Type:</strong> {prediction['Explosive Type']}
                      </p>
                      <div className="mb-2">
                        <h5 className="font-medium">Emissions:</h5>
                        <ul className="ml-4 list-disc">
                          {Object.entries(prediction)
                            .filter(([key]) => ['CO', 'CO2', 'H2S', 'HCN', 'NH3', 'NOx', 'SO2'].includes(key))
                            .map(([key, value]) => (
                              <li key={key}>
                                <strong>{key}:</strong> {value}
                              </li>
                            ))}
                        </ul>
                      </div>
                      {prediction['Risk Evaluation'] && (
                        <div>
                          <h5 className="font-medium">Risk Levels:</h5>
                          <ul className="ml-4 list-disc">
                            {Array.isArray(prediction['Risk Evaluation']) ? (
                              prediction['Risk Evaluation'].map((risk, riskIndex) => (
                                <li key={riskIndex}>{risk}</li>
                              ))
                            ) : (
                              <li>{prediction['Risk Evaluation']}</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-red-500">
                    Unexpected prediction group format
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-red-500">
              No predictions available for explosion
            </div>
          )}
        </div>
      ))
    ) : (
      <div className="text-center text-red-500">
        Unexpected predictions format
      </div>
    )}
  </div>
)}

{selectedCategory === 'shipping' && (
  <div className="space-y-4">
    {/* Check if predictions is an array */}
    {Array.isArray(predictions) ? (
      predictions.map((dayPrediction, dayIndex) => (
        <div key={dayIndex}>
          <h3 className="text-2xl font-semibold mb-4">Day {dayPrediction.Day}</h3>
          {dayPrediction.Results.map((result, resultIndex) => (
            <div key={resultIndex} className="border-b border-[#66C5CC] pb-4 mb-4">
              <p className="mb-2">
                <strong>Transport Method:</strong> {result["Trasport Method"]}
              </p>
              <p className="mb-2">
                <strong>Predicted Emission:</strong> {result["Predicted Emission"]}
              </p>
              <p>
                <strong>Risk Level:</strong> {result["Risk Level"]}
              </p>
            </div>
          ))}
        </div>
      ))
    ) : (
      <div className="text-center text-red-500">
        No predictions available for shipping
      </div>
    )}
  </div>
)}

  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default EmissionPredictionPage;
