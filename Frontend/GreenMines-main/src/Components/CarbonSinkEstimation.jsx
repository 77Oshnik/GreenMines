'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CarbonSinkEstimation() {
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to scale with container
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Sink Type',
          font: {
            size: 14,
          },
          color: '#4A5568',
        },
        ticks: {
          color: '#4A5568', // Dark gray
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
          color: '#4A5568', // Dark gray
        },
      },
    },
  };

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[100%] max-h-[1800px] mt-6">
    <h2 className="text-lg font-bold text-white mb-4">Carbon Sink Estimation</h2>
    <div className="flex justify-between items-center mb-6">
      <span className="text-gray-400">Sequestration Capacity Overview</span>
      <span className="text-3xl font-bold text-white">Overview</span>
    </div>
    <div className="w-full h-full"> {/* Ensure full height and width for chart container */}
      <Bar
        data={barData}
        options={{
          responsive: true, // Ensure the chart is responsive
          maintainAspectRatio: false, // Allow the chart to adjust to the container size
          scales: {
            x: {
              grid: {
                color: "#4A5568", // Optional grid line color
              },
              ticks: {
                color: "#E2E8F0", // Tick label color
              },
            },
            y: {
              grid: {
                color: "#4A5568", // Optional grid line color
              },
              ticks: {
                color: "#E2E8F0", // Tick label color
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
  


  );
}

export default CarbonSinkEstimation;
