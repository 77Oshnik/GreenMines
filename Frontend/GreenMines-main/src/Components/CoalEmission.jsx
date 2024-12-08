import React, { useState } from 'react';
import axios from 'axios';

const CoalEmission = () => {
  const [coalType, setCoalType] = useState('');
  const [coalConsumption, setCoalConsumption] = useState('');
  const [co2Emissions, setCo2Emissions] = useState(null);
  const [error, setError] = useState('');

  const handleCoalTypeChange = (event) => {
    setCoalType(event.target.value);
  };

  const handleCoalConsumptionChange = (event) => {
    setCoalConsumption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!coalType || !coalConsumption) {
      setError('Please provide both coal type and consumption');
      return;
    }

    try {
      // Sending POST request using axios
      const response = await axios.post('http://localhost:5000/api/coal-emission', {
        coalType,
        coalConsumption: parseFloat(coalConsumption),
      });

      setCo2Emissions(response.data.co2Emissions);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error calculating emissions');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">CO2 Emissions Calculator</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="coalType" className="block text-sm font-medium text-gray-700">Coal Type</label>
          <select
            id="coalType"
            name="coalType"
            value={coalType}
            onChange={handleCoalTypeChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Coal Type</option>
            <option value="Lignite">Lignite</option>
            <option value="Sub-bituminous">Sub-bituminous</option>
            <option value="Bituminous">Bituminous</option>
            <option value="Anthracite">Anthracite</option>
          </select>
        </div>

        <div>
          <label htmlFor="coalConsumption" className="block text-sm font-medium text-gray-700">Coal Consumption (in tons)</label>
          <input
            type="number"
            id="coalConsumption"
            name="coalConsumption"
            value={coalConsumption}
            onChange={handleCoalConsumptionChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter coal consumption in tons"
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Calculate Emissions
        </button>
      </form>

      {co2Emissions !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-gray-800">Calculated CO2 Emissions:</h3>
          <p className="text-gray-700">CO2 Emissions: {co2Emissions.toFixed(2)} kg</p>
        </div>
      )}
    </div>
  );
};

export default CoalEmission;
