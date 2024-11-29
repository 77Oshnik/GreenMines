import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FinancialAnalysis() {
  const barData = {
    labels: ['Clean Tech', 'Renewable Energy', 'Afforestation'],
    datasets: [
      {
        label: 'Cost (Million INR)',
        data: [500, 750, 250],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Savings (Million INR)',
        data: [600, 900, 300],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
    
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[50%] max-h-[1800px] mb-4">
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-md p-6">
    <h2 className="text-lg font-bold text-white mb-4">Financial Analysis</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Cost vs Savings Analysis</h3>
        <div className="h-[400px] w-full"> {/* Adjust container size for the Bar Chart */}
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">ROI Potential</h3>
        <p className="text-2xl font-bold text-green-600">22%</p>
        <p className="text-sm text-gray-400">Estimated ROI over 5 years</p>
      </div>
    </div>
  </div>
  </div>
  
  );
}
