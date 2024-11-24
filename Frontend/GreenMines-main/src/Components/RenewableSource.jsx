import React, { useState } from 'react';
import axios from 'axios';

const RenewableEnergyForm = () => {
  const [solutionName, setSolutionName] = useState('');
  const [co2EmissionsPerDay, setCo2EmissionsPerDay] = useState('');
  const [desiredReductionPercentage, setDesiredReductionPercentage] = useState('');
  const [selectedRenewable, setSelectedRenewable] = useState('Solar');
  const [availableLand, setAvailableLand] = useState('1');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that values are converted to numbers before sending
    const formData = {
      solutionName,
      co2EmissionsPerDay: Number(co2EmissionsPerDay),
      selectedRenewable,
      desiredReductionPercentage: Number(desiredReductionPercentage),
      availableLand: Number(availableLand),
    };

    // Validate data
    if (isNaN(formData.co2EmissionsPerDay) || isNaN(formData.desiredReductionPercentage) || isNaN(formData.availableLand)) {
      setErrorMessage('Please enter valid numbers for all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/renewable', formData);
      setResult(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Error calculating renewable impact. Please try again later.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Renewable Energy Calculator</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Solution Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="solutionName">Solution Name</label>
          <input
            id="solutionName"
            type="text"
            placeholder="Enter solution name"
            value={solutionName}
            onChange={(e) => setSolutionName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* CO₂ Emissions Per Day */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="co2EmissionsPerDay">CO₂ Emissions Per Day (tonnes)</label>
          <input
            id="co2EmissionsPerDay"
            type="number"
            placeholder="Enter CO₂ emissions per day"
            value={co2EmissionsPerDay}
            onChange={(e) => setCo2EmissionsPerDay(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Desired CO₂ Reduction Percentage */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="desiredReductionPercentage">Desired CO₂ Reduction (%)</label>
          <input
            id="desiredReductionPercentage"
            type="number"
            placeholder="Enter reduction percentage"
            value={desiredReductionPercentage}
            onChange={(e) => setDesiredReductionPercentage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Select Renewable Energy */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="selectedRenewable">Select Renewable Energy</label>
          <select
            id="selectedRenewable"
            value={selectedRenewable}
            onChange={(e) => setSelectedRenewable(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Solar">Solar</option>
            <option value="Wind">Wind</option>
            <option value="Hydropower">Hydropower</option>
            <option value="HydrogenElectric">Hydrogen Electric</option>
          </select>
        </div>

        {/* Available Land */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="availableLand">Available Land (hectares)</label>
          <input
            id="availableLand"
            type="number"
            placeholder="Enter available land in hectares"
            value={availableLand}
            onChange={(e) => setAvailableLand(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Calculate Impact
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-lg">
          <h3 className="text-xl font-semibold text-green-700">Calculation Results</h3>
          <ul className="space-y-2 mt-4 text-gray-700">
            <li><strong>Solution Name:</strong> {result.solutionName}</li>
            <li><strong>Renewable Energy Source:</strong> {result.selectedRenewable}</li>
            <li><strong>Implementation Cost:</strong> {result.implementationCost}</li>
            <li><strong>Target CO₂ Reduction:</strong> {result.targetCo2Reduction} tonnes per day</li>
            <li><strong>Total CO₂ Reduction:</strong> {result.totalCo2ReductionPerDay} tonnes per day</li>
            <li><strong>Land Provided:</strong> {result.landProvided} hectares</li>
            <li><strong>Time to Achieve Neutrality:</strong> {result.timeToAchieveNeutrality}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RenewableEnergyForm;
