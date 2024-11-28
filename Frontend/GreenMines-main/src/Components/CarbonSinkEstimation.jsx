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
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Carbon Sink Estimation</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Sequestration Capacity</h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Proposed Afforestation Zones</h3>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Geospatial Map Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarbonSinkEstimation;
