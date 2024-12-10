import React, { useState } from 'react';
import axios from 'axios';

const EvSavingsCalculator = () => {
  const [formData, setFormData] = useState({
    vehicleType: 'Dumper Truck',
    numberOfVehicles: 1,
    dailyHours: 8,
    fuelType: 'Diesel',
    fuelPrice: 1.5,
    carbonCreditPrice: 20,
    workingDaysPerYear: 250
  });

  const [results, setResults] = useState(null);

  const vehicleTypes = [
    'Dumper Truck', 
    'Excavator', 
    'Loader', 
    'Haul Truck', 
    'Drill Machine'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'numberOfVehicles' || name === 'dailyHours' || 
              name === 'fuelPrice' || name === 'carbonCreditPrice' || 
              name === 'workingDaysPerYear' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/ev', formData);
      setResults(response.data.data);
    } catch (error) {
      console.error('Calculation error', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mining Fleet EV Emissions Savings Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Vehicle Type</label>
          <select 
            name="vehicleType" 
            value={formData.vehicleType} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Number of Vehicles</label>
          <input 
            type="number" 
            name="numberOfVehicles"
            value={formData.numberOfVehicles}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Daily Hours of Operation</label>
          <input 
            type="number" 
            name="dailyHours"
            value={formData.dailyHours}
            onChange={handleChange}
            min="1"
            max="24"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Fuel Type</label>
          <select 
            name="fuelType" 
            value={formData.fuelType} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Fuel Price (per litre)</label>
          <input 
            type="number" 
            name="fuelPrice"
            value={formData.fuelPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Carbon Credit Price (per ton)</label>
          <input 
            type="number" 
            name="carbonCreditPrice"
            value={formData.carbonCreditPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Working Days per Year</label>
          <input 
            type="number" 
            name="workingDaysPerYear"
            value={formData.workingDaysPerYear}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Calculate Emissions Savings
        </button>
      </form>

      {results && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <h3 className="text-xl font-semibold mb-2">Emissions Savings Results</h3>
          <p>Total Emissions Savings: {results.calculationResults.emissionSavings.toFixed(2)} kg CO₂/day</p>
          <p>Percentage Reduction: {results.calculationResults.percentageReduction.toFixed(2)}%</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Cost Savings</h4>
          <p>Daily Fuel Cost Savings:₹ {results.calculationResults.dailyFuelCostSavings.toFixed(2)}</p>
          <p>Annual Fuel Cost Savings:₹ {results.calculationResults.annualFuelCostSavings.toFixed(2)}</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Carbon Credits</h4>
          <p>Carbon Credits Earned: ₹{results.calculationResults.carbonCreditsEarned.toFixed(2)} credits</p>
          <p>Carbon Credits Revenue: ₹{results.calculationResults.carbonCreditsRevenue.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default EvSavingsCalculator;