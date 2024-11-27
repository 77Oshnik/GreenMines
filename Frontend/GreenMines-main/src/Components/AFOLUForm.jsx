import React, { useState } from 'react';
import axios from 'axios';

const AFOLUForm = () => {
  const [landSize, setLandSize] = useState('');
  const [currentLandUse, setCurrentLandUse] = useState('');
  const [carbonStock, setCarbonStock] = useState('');
  const [clearingMethod, setClearingMethod] = useState('');
  const [climateDescription, setClimateDescription] = useState('');
  const [newLandUse, setNewLandUse] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponseMessage('');

    const data = {
      landSize: parseFloat(landSize),
      currentLandUse,
      carbonStock: parseFloat(carbonStock),
      clearingMethod,
      climateDescription,
      newLandUse,
    };

    try {
      console.log('Sending data:', data); // Debugging log
      const response = await axios.post('http://localhost:5000/api/afolu', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response received:', response.data); // Debugging log
      setResponseMessage(response.data.response); // Assuming the formatted response is under `response` key
    } catch (error) {
      console.error('Error:', error.response || error);
      setError(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">
        AFOLU Environmental Impact Calculator
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="landSize" className="block">Land Size (hectares):</label>
          <input
            type="number"
            id="landSize"
            value={landSize}
            onChange={(e) => setLandSize(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="currentLandUse" className="block">Current Land Use:</label>
          <input
            type="text"
            id="currentLandUse"
            value={currentLandUse}
            onChange={(e) => setCurrentLandUse(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="carbonStock" className="block">Carbon Stock (tons of CO2):</label>
          <input
            type="number"
            id="carbonStock"
            value={carbonStock}
            onChange={(e) => setCarbonStock(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="clearingMethod" className="block">Clearing Method:</label>
          <input
            type="text"
            id="clearingMethod"
            value={clearingMethod}
            onChange={(e) => setClearingMethod(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="climateDescription" className="block">Climate Description:</label>
          <input
            type="text"
            id="climateDescription"
            value={climateDescription}
            onChange={(e) => setClimateDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="newLandUse" className="block">New Land Use:</label>
          <input
            type="text"
            id="newLandUse"
            value={newLandUse}
            onChange={(e) => setNewLandUse(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Calculate Impact
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 border rounded-md bg-red-100 text-red-800">
          <p>{error}</p>
        </div>
      )}

      {responseMessage && (
        <div className="mt-4 p-4 border rounded-md bg-green-50">
          <h3 className="text-lg font-semibold">Environmental Impact Analysis:</h3>
          <p className="whitespace-pre-wrap">{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AFOLUForm;
