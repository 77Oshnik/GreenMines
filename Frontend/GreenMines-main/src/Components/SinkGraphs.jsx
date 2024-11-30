import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import CarbonSinkEstimation from "./CarbonSinkEstimation";
import axios from "axios";

interface SinkEntry {
  _id?: string;
  type: string;
  co2Absorbed: number;
  date?: string;
}

const SinkGraphs = () => {
  const [sinkEntries, setSinkEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sinkTypeFilter, setSinkTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch sink entries
 // Updated data-fetching logic in fetchSinkEntries function
 const fetchSinkEntries = async () => {
  setLoading(true);
  setError(null);

  try {
    let url = `http://localhost:5000/api/existingsinks`; // Default endpoint
    const params: any = {};

    // Include the sink type filter in the query parameters
    if (sinkTypeFilter.trim() !== '') {
      params.type = sinkTypeFilter.trim().toLowerCase(); // Ensure consistency in casing
    }

    // Handle date-based filtering
    if (startDate && endDate) {
      url = `http://localhost:5000/api/existingsinks/date-range/${startDate}/${endDate}`;
    } else if (startDate) {
      url = `http://localhost:5000/api/existingsinks/date/${startDate}`;
    } else {
      url = `http://localhost:5000/api/existingsinks/date/${getCurrentDate()}`;
    }

    // Fetch data with query parameters
    const response = await axios.get(url, { params });

    console.log("API Response:", response.data);

    // Map API response to the required format
    const sinkData = response.data.existingSinkData.map((entry: any) => ({
      _id: entry._id,
      type: entry.vegetationType, // Display vegetation type as sink type
      co2Absorbed: entry.dailySequestrationRate, // Use dailySequestrationRate for CO2 absorption
    }));

    // Update the sink entries state
    setSinkEntries(sinkData);

    if (sinkData.length === 0) {
      console.log("No data found for the specified criteria.");
    }
  } catch (err) {
    console.error("Error fetching sink entries:", err);

    if (err.response) {
      console.error("Response error:", err.response.data);
    }

    setError("Failed to fetch sink entries. Please try again.");
    setSinkEntries([]); // Reset sink entries on error
  } finally {
    setLoading(false);
  }
};


  // Fetch entries on component mount and when filters change
  useEffect(() => {
    fetchSinkEntries();
  }, [startDate, endDate, sinkTypeFilter]);

  // Handle deleting a sink entry
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/existingsinks/${id}`);
      setSinkEntries(prevEntries => 
        prevEntries.filter(entry => entry._id !== id)
      );
    } catch (err) {
      console.error('Error deleting sink entry:', err.response ? err.response.data : err.message);
      setError('Failed to delete sink entry');
    }
  };

  // Handle showing more entries
  const handleShowMore = () => {
    setCurrentIndex((prevIndex) => prevIndex + 4);
  };

  // Handle showing previous entries
  const handleShowLess = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 4 >= 0 ? prevIndex - 4 : 0));
  };

  // Filtered sink entries to display (only 4 at a time)
  const displayedEntries = sinkEntries
    .slice(currentIndex, currentIndex + 4);

  // Existing chart data and state (kept from previous implementation)
  const weekProfitData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Profit",
        data: [80000, 50000, 75000, 65000, 70000, 100000],
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  const monthProfitData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Profit",
        data: [320000, 250000, 300000, 275000],
        backgroundColor: "#FF9800",
        borderColor: "#F57C00",
        borderWidth: 1,
      },
    ],
  };

  const yearProfitData = {
    labels: [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Profit",
        data: [
          300000, 400000, 350000, 500000, 450000, 480000, 
          530000, 600000, 550000, 590000, 620000, 700000
        ],
        backgroundColor: "#E91E63",
        borderColor: "#C2185B",
        borderWidth: 1,
      },
    ],
  };

  const [selectedProfitData, setSelectedProfitData] = useState(weekProfitData);

  return (
    <div className="flex gap-8 xl:col-span-3 p-1 mb-6">
    {/* Left Hand Section - Sink Entries and Carbon Sink Estimation */}
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-[30%] min-w-[300px]">
      {/* Sink Entries Filter Section */}
      <div className="space-y-4 mb-4">
        <div className="flex gap-4">

          <div className="flex gap-2">
            <input
              type="date"
              className="p-2 rounded-lg bg-gray-700 text-gray-300"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="p-2 rounded-lg bg-gray-700 text-gray-300"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-gray-300 mb-4">Loading sink entries...</div>
      )}
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* No Data Message */}
      {!loading && sinkEntries.length === 0 && (
        <div className="text-gray-300 mb-4">No sink entries found.</div>
      )}

      {/* Sink Entries */}
      <h2 className="text-lg font-bold text-gray-300 mb-4">Sink Entries</h2>
      <div className="space-y-4">
        {displayedEntries.map((entry, index) => (
          <div key={entry._id || index} className="flex justify-between items-center">
            {/* Sink Type */}
            <div className="text-gray-300 w-1/3">
              <p><strong>{entry.type}</strong></p>
            </div>
            {/* CO2 Absorbed */}
            <div className="text-gray-300 w-1/3">
              <p>{entry.co2Absorbed} CO2 absorbed</p>
            </div>
            {/* Delete Button */}
            <div className="w-1/3 text-right">
              <button
                onClick={() => entry._id && handleDelete(entry._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleShowLess}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          disabled={currentIndex === 0}
        >
          &lt; Prev
        </button>
        <button
          onClick={handleShowMore}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          disabled={currentIndex + 4 >= sinkEntries.length}
        >
          Next &gt;
        </button>
      </div>

        {/* Carbon Sink Estimation - placed below Sink Entries */}
       
          <CarbonSinkEstimation />
        
      </div>

      {/* Right Hand Section - Kept as previous implementation */}
      <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-[70%]">
        <h2 className="text-lg font-bold text-gray-300 mb-4">Sink Status</h2>

        {/* Time Range Filters for Graph */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSelectedProfitData(weekProfitData)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Past Week
          </button>
          <button
            onClick={() => setSelectedProfitData(monthProfitData)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Past Month
          </button>
          <button
            onClick={() => setSelectedProfitData(yearProfitData)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Past Year
          </button>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-[400px] mb-6">
          <Bar
            data={selectedProfitData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    color: "#4A5568",
                  },
                  ticks: {
                    color: "#E2E8F0",
                  },
                },
                y: {
                  grid: {
                    color: "#4A5568",
                  },
                  ticks: {
                    color: "#E2E8F0",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#E2E8F0",
                  },
                },
              },
            }}
          />
        </div>

        {/* Line Chart */}
        <div className="w-full h-[400px]">
          <Line
            data={selectedProfitData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    color: "#4A5568",
                  },
                  ticks: {
                    color: "#E2E8F0",
                  },
                },
                y: {
                  grid: {
                    color: "#4A5568",
                  },
                  ticks: {
                    color: "#E2E8F0",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#E2E8F0",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SinkGraphs;