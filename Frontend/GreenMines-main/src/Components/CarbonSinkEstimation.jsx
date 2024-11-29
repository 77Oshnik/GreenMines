'use client';

import React from 'react';
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
  // Static data for the bar chart
  const barData = {
    labels: ['Existing Sinks', 'Required Sinks'],
    datasets: [
      {
        label: 'Carbon Sequestration Capacity (tons CO2)',
        data: [600000, 1000000],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  // Chart options to ensure adaptability and proper display
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart adjusts to container size
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

      {/* Chart Container */}
      <div className="w-full h-[400px] md:h-[600px] lg:h-[350px]">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}

export default CarbonSinkEstimation;
