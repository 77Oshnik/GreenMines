import React from 'react';

export default function OverviewSection() {
  const totalEmissions = 1000000; // in tons of CO2
  const totalAbsorption = 600000; // in tons of CO2
  const gap = totalEmissions - totalAbsorption;
  const neutralityProgress = (totalAbsorption / totalEmissions) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Total Carbon Emissions</p>
          <p className="text-2xl font-bold text-red-600">{totalEmissions.toLocaleString()} tons</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Carbon Absorption by Sinks</p>
          <p className="text-2xl font-bold text-green-600">{totalAbsorption.toLocaleString()} tons</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Gap Analysis</p>
          <p className="text-2xl font-bold text-yellow-600">{gap.toLocaleString()} tons</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Carbon Neutrality Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${neutralityProgress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">{neutralityProgress.toFixed(2)}% Complete</p>
        </div>
      </div>
    </div>
  );
}
