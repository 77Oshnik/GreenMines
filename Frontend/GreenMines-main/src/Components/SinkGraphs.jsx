import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import CarbonSinkEstimation from "./CarbonSinkEstimation";

const SinkGraphs = () => {
  const weekProfitData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Profit",
        data: [80000, 50000, 75000, 65000, 70000, 100000],
        fill: true,
        backgroundColor: function (context) {
          const midwayMark = 74000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "rgba(200, 200, 200, 0.2)";
        },
        borderColor: function (context) {
          const midwayMark = 74000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "#cccccc";
        },
        tension: 0.4,
      },
    ],
  };

  const monthProfitData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Profit",
        data: [320000, 250000, 300000, 275000],
        fill: true,
        backgroundColor: function (context) {
          const midwayMark = 270000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "rgba(200, 200, 200, 0.2)";
        },
        borderColor: function (context) {
          const midwayMark = 270000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "#cccccc";
        },
        tension: 0.4,
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
          300000, 400000, 350000, 500000, 450000, 480000, 530000, 600000, 550000,
          590000, 620000, 700000,
        ],
        fill: true,
        backgroundColor: function (context) {
          const midwayMark = 500000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "rgba(200, 200, 200, 0.2)";
        },
        borderColor: function (context) {
          const midwayMark = 500000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "#cccccc";
        },
        tension: 0.4,
      },
    ],
  };

  const [selectedProfitData, setSelectedProfitData] = useState(weekProfitData);

  return (
    <div className="flex gap-8 xl:col-span-3 p-1 mb-6">
      {/* Sink Bar - 30% Width */}
      <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-[30%] min-w-[300px]">
        <CarbonSinkEstimation />
      </div>

      {/* Sink Graph - 70% Width */}
      <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-[70%]">
        <h2 className="text-lg font-bold text-gray-300 mb-4">Sink Status</h2>

        {/* Time Range Filters */}
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

        {/* Line Chart */}
        <div className="w-full h-[400px]">
          <Line
            data={selectedProfitData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Ensure the chart adapts to container dimensions
              scales: {
                x: {
                  grid: {
                    color: "#4A5568", // Optional grid customization
                  },
                  ticks: {
                    color: "#E2E8F0", // Optional tick customization
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
                    color: "#E2E8F0", // Adjust legend text color
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
