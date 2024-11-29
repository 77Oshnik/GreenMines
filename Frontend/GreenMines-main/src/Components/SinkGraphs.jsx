import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import CarbonSinkEstimation from "./CarbonSinkEstimation";

const SinkGraphs = () => {
  // Sample data for entries
  const initialSinkEntries = [
    { type: "Forest", co2Absorbed: 50000 },
    { type: "Mangroves", co2Absorbed: 35000 },
    { type: "Wetlands", co2Absorbed: 40000 },
    { type: "Grasslands", co2Absorbed: 25000 },
    { type: "Ocean", co2Absorbed: 80000 },
    { type: "Desert", co2Absorbed: 12000 },
    { type: "Urban Forest", co2Absorbed: 30000 },
    { type: "Agroforestry", co2Absorbed: 55000 },
  ];

  const [sinkEntries, setSinkEntries] = useState(initialSinkEntries);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sinkTypeFilter, setSinkTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Handle deleting a sink entry
  const handleDelete = (index) => {
    const newEntries = sinkEntries.filter((_, i) => i !== index);
    setSinkEntries(newEntries);
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
    .filter((entry) =>
      (sinkTypeFilter ? entry.type.toLowerCase().includes(sinkTypeFilter.toLowerCase()) : true)
    )
    .slice(currentIndex, currentIndex + 4);

  // Time Range Filter Data
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Profit",
        data: [
          300000, 400000, 350000, 500000, 450000, 480000, 530000, 600000,
          550000, 590000, 620000, 700000,
        ],
        backgroundColor: "#E91E63",
        borderColor: "#C2185B",
        borderWidth: 1,
      },
    ],
  };

  // Handle the selected profit data (week, month, or year)
  const [selectedProfitData, setSelectedProfitData] = useState(weekProfitData);

  return (
    <div className="flex gap-8 xl:col-span-3 p-1 mb-6">
      {/* Left Hand Section - Sink Entries and Carbon Sink Estimation */}
      <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-[30%] min-w-[300px]">
        {/* Sink Entries Filter Section */}
        <div className="space-y-4 mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Filter by Sink Type"
              className="p-2 rounded-lg bg-gray-700 text-gray-300 w-1/2"
              value={sinkTypeFilter}
              onChange={(e) => setSinkTypeFilter(e.target.value)}
            />
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

        {/* Sink Entries */}
        <h2 className="text-lg font-bold text-gray-300 mb-4">Sink Entries</h2>
        <div className="space-y-4">
          {displayedEntries.map((entry, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="text-gray-300">
                <p><strong>{entry.type}</strong></p>
                <p>{entry.co2Absorbed} CO2 absorbed</p>
              </div>
              <button
                onClick={() => handleDelete(index + currentIndex)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
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
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <CarbonSinkEstimation />
        </div>
      </div>

      {/* Right Hand Section - Sink Status Graph */}
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
