'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CarbonSinkEstimation() {
  // Static data for the bar chart for different time ranges
  const weekData = [600000, 1000000]; // Example for the past week
  const monthData = [500000, 1200000]; // Example for the past month
  const yearData = [400000, 1100000]; // Example for the past year

  // State to manage the selected time range filter for the sink estimation chart
  const [selectedTimeRange, setSelectedTimeRange] = useState('week'); // Default to 'week'

  // Data updates based on selected time range filter
  const barData = {
    labels: ['Existing Sinks', 'Required Sinks'],
    datasets: [
      {
        label: 'Carbon Sequestration Capacity (tons CO2)',
        data: selectedTimeRange === 'week' ? weekData :
              selectedTimeRange === 'month' ? monthData : yearData,
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E2E8F0', // Legend text color
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sink Type',
          font: {
            size: 14,
          },
          color: '#4A5568',
        },
        ticks: {
          color: '#E2E8F0', // Tick label color
        },
        grid: {
          color: '#4A5568', // Grid line color
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Capacity (tons CO2)',
          font: {
            size: 14,
          },
          color: '#4A5568',
        },
        ticks: {
          color: '#E2E8F0', // Tick label color
        },
        grid: {
          color: '#4A5568', // Grid line color
        },
      },
    },
  };

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[100%] max-h-[900px] mt-6">
      {/* Title Section */}
      <h2 className="text-lg font-bold text-white mb-4">Carbon Sink Estimation</h2>
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-400">Sequestration Capacity Overview</span>
        <span className="text-3xl font-bold text-white">Overview</span>
      </div>

      {/* Time Range Filters for Sink Estimation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedTimeRange('week')}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
        >
          Past Week
        </button>
        <button
          onClick={() => setSelectedTimeRange('month')}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
        >
          Past Month
        </button>
        <button
          onClick={() => setSelectedTimeRange('year')}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
        >
          Past Year
        </button>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[400px] md:h-[600px] lg:h-[330px]">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}

export default CarbonSinkEstimation;

