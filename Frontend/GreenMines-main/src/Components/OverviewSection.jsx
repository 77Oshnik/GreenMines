import React from 'react';

export default function OverviewSection() {
  const totalEmissions = 1000000; // in tons of CO2
  const totalAbsorption = 600000; // in tons of CO2
  const gap = totalEmissions - totalAbsorption;
  const neutralityProgress = (totalAbsorption / totalEmissions) * 100;

  // Donut chart properties
  const size = 180;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (neutralityProgress / 100) * circumference;

  return (
    <div className="bg-[#140c35] rounded-lg shadow-md p-6 mt-8 relative">
      <div className="absolute top-6 right-6">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#4B5563"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{neutralityProgress.toFixed(0)}%</span>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-[#fcfcfc] mb-4">Overview</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-white">Total Carbon Emissions</p>
          <p className="text-2xl font-bold text-red-600">{totalEmissions.toLocaleString()} tons</p>
        </div>
        <div>
          <p className="text-sm text-white">Carbon Absorption by Sinks</p>
          <p className="text-2xl font-bold text-green-600">{totalAbsorption.toLocaleString()} tons</p>
        </div>
        <div>
          <p className="text-sm text-white">Gap Analysis</p>
          <p className="text-2xl font-bold text-yellow-600">{gap.toLocaleString()} tons</p>
        </div>
        <div>
          <p className="text-sm text-white mb-2">Carbon Neutrality Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${neutralityProgress}%` }}
              role="progressbar"
              aria-valuenow={neutralityProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <p className="text-sm text-white">{neutralityProgress.toFixed(2)}% Complete</p>
        </div>
      </div>
    </div>
  );
}

