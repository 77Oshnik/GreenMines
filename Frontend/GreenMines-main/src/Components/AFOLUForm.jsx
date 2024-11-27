import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

const AFOLUForm = () => {
  const [landSize, setLandSize] = useState('');
  const [currentLandUse, setCurrentLandUse] = useState('');
  const [carbonStock, setCarbonStock] = useState('');
  const [clearingMethod, setClearingMethod] = useState('');
  const [climateDescription, setClimateDescription] = useState('');
  const [newLandUse, setNewLandUse] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  // Inline styles for the formatted response
  const htmlStyles = `
    .parsed-html-content h3 {
      font-size: 1.25rem;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: #1a202c;
    }
    .parsed-html-content ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .parsed-html-content li {
      margin-bottom: 0.5rem;
      color: #2d3748;
    }
    .parsed-html-content p {
      margin-bottom: 0.75rem;
    }
  `;

  const renderHTMLContent = (htmlContent) => {
    // Sanitize the HTML content
    const cleanHTML = DOMPurify.sanitize(htmlContent);
    
    return (
      <>
        <style>{htmlStyles}</style>
        <div 
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
          className="parsed-html-content"
        />
      </>
    );
  };

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
    <div className="min-h-screen bg-[#231E3D] flex items-center justify-center p-4">
    <div className="w-full max-w-6xl bg-[#342F49] shadow-2xl rounded-lg border border-[#66C5CC] overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#66C5CC]">
          AFOLU Environmental Impact Calculator
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="landSize" className="block text-white mb-2">Land Size (hectares):</label>
              <input
                type="number"
                id="landSize"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full p-3 bg-[#2A2640] text-white border border-[#66C5CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
                required
              />
            </div>
            <div>
              <label htmlFor="currentLandUse" className="block text-white mb-2">Current Land Use:</label>
              <input
                type="text"
                id="currentLandUse"
                value={currentLandUse}
                onChange={(e) => setCurrentLandUse(e.target.value)}
                className="w-full p-3 bg-[#2A2640] text-white border border-[#66C5CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
                required
              />
            </div>
            <div>
              <label htmlFor="carbonStock" className="block text-white mb-2">Carbon Stock (tons of CO2):</label>
              <input
                type="number"
                id="carbonStock"
                value={carbonStock}
                onChange={(e) => setCarbonStock(e.target.value)}
                className="w-full p-3 bg-[#2A2640] text-white border border-[#66C5CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
                required
              />
            </div>
            <div>
              <label htmlFor="clearingMethod" className="block text-white mb-2">Clearing Method:</label>
              <input
                type="text"
                id="clearingMethod"
                value={clearingMethod}
                onChange={(e) => setClearingMethod(e.target.value)}
                className="w-full p-3 bg-[#2A2640] text-white border border-[#66C5CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
                required
              />
            </div>
            <div>
              <label htmlFor="climateDescription" className="block text-white mb-2">Climate Description:</label>
              <input
                type="text"
                id="climateDescription"
                value={climateDescription}
                onChange={(e) => setClimateDescription(e.target.value)}
                className="w-full p-3 bg-[#2A2640] text-white border border-[#66C5CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
                required
              />
            </div>
            <div>
              <label htmlFor="newLandUse" className="block text-white mb-2">New Land Use:</label>
              <input
                type="text"
                id="newLandUse"
                value={newLandUse}
                onChange={(e) => setNewLandUse(e.target.value)}
                className="w-full p-3 bg-[#2A2640] text-white border border-[#66C5CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#66C5CC]"
                required
              />
            </div>
          </div>
          <button
  type="submit"
  className="px-6 py-3 bg-[#66C5CC] text-[#342F49] rounded-md hover:bg-[#5AB1B7] transition duration-300 font-semibold text-lg mx-auto block"
>
  Calculate Impact
</button>

        </form>

        {error && (
          <div className="mt-6 p-4 border border-red-500 rounded-md bg-red-100 text-red-800">
            <p>{error}</p>
          </div>
        )}

        {responseMessage && (
          <div className="mt-6 p-6 border border-[#66C5CC] rounded-md bg-[#5c5394e0] text-white font-bold">
            <h3 className="text-xl font-semibold text-[#66C5CC] mb-4">Environmental Impact Analysis:</h3>
            <div className="text-white font-bold">
              {renderHTMLContent(responseMessage)}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AFOLUForm;
