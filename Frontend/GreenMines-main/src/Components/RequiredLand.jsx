import React, { useState } from 'react';
import axios from 'axios';

const CarbonSinkForm = () => {
  const [targetCarbonSequestration, setTargetCarbonSequestration] = useState('');
  const [landType, setLandType] = useState('forest');
  const [forestType, setForestType] = useState('tropical');
  const [projectDuration, setProjectDuration] = useState(20);
  const [soilCondition, setSoilCondition] = useState('ideal');
  const [calculationResults, setCalculationResults] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      targetCarbonSequestration,
      landType,
      forestType,
      projectDuration,
      soilCondition
    };

    try {
      const response = await axios.post('http://localhost:5000/api/requiredland ', data);
      setCalculationResults(response.data.data);
      setError(null); // Reset any previous errors
    } catch (error) {
      setError(error.response.data.error || 'An error occurred');
      setCalculationResults(null); // Clear previous results
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5">
      <h1 className="text-2xl font-semibold mb-4">Carbon Sink Land Calculation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Target Carbon Sequestration (tonnes)</label>
          <input
            type="number"
            value={targetCarbonSequestration}
            onChange={(e) => setTargetCarbonSequestration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Land Type</label>
          <select
            value={landType}
            onChange={(e) => setLandType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="forest">Forest</option>
            <option value="mangrove">Mangrove</option>
            <option value="grassland">Grassland</option>
            <option value="wetland">Wetland</option>
            <option value="agroforestry">Agroforestry</option>
          </select>
        </div>

        {landType === 'forest' && (
          <div>
            <label className="block text-sm font-medium mb-2">Forest Type</label>
            <select
              value={forestType}
              onChange={(e) => setForestType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="tropical">Tropical</option>
              <option value="temperate">Temperate</option>
              <option value="boreal">Boreal</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Project Duration (years)</label>
          <input
            type="number"
            value={projectDuration}
            onChange={(e) => setProjectDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Soil Condition</label>
          <select
            value={soilCondition}
            onChange={(e) => setSoilCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="ideal">Ideal( Fertile soil, excellent vegetation.)</option>
            <option value="moderately_suitable">Moderately Suitable(Slightly degraded soil.)</option>
            <option value="marginally_suitable">Marginally Suitable(Poor soil quality.)</option>
            <option value="unsuitable">Unsuitable(Highly degraded land.)</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Calculate
          </button>
        </div>
      </form>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {calculationResults && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold">Calculation Results</h2>
          <div className="mt-2">
            <p><strong>Required Land:</strong> {calculationResults.requiredLand} hectares</p>
            <p><strong>Sequestration Rate:</strong> {calculationResults.sequestrationRate} tonnes/ha/year</p>
            <p><strong>Total Carbon Sequestered:</strong> {calculationResults.totalCarbonSequestered.toFixed(2)} tonnes</p>
             {/* <p><strong>Land Utilization Efficiency:</strong> {calculationResults.landUtilizationEfficiency.toFixed(2)}%</p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonSinkForm;
