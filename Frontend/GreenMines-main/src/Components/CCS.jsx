import React, { useState } from 'react';
import axios from 'axios';

export default function CCSCalculator() {
  // State for form data
  const [formData, setFormData] = useState({
    mineName: '',
    annualEmissions: '',
    mineSize: '',
    ccsTechnology: '',
    installationCostPerTon: '',
    annualMaintenanceCost: ''
  });

  // State for result, error, and loading
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/ccs', formData);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while calculating CCS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-indigo-500 font-semibold text-2xl mb-1">
              Carbon Capture and Storage (CCS)
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mine Name */}
              <div>
                <label htmlFor="mineName" className="block text-lg font-medium text-gray-700">
                  Mine Name
                </label>
                <input
                  type="text"
                  name="mineName"
                  id="mineName"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the mine name"
                  value={formData.mineName}
                  onChange={handleChange}
                />
              </div>
              
              {/* Annual Emissions */}
              <div>
                <label htmlFor="annualEmissions" className="block text-lg font-medium text-gray-700">
                  Annual Emissions (tons)
                </label>
                <input
                  type="number"
                  name="annualEmissions"
                  id="annualEmissions"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter annual emissions in tons"
                  value={formData.annualEmissions}
                  onChange={handleChange}
                />
              </div>
              
              {/* Mine Size */}
              <div>
                <label htmlFor="mineSize" className="block text-lg font-medium text-gray-700">
                  Mine Size
                </label>
                <select
                  type="text"
                  name="mineSize"
                  id="mineSize"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the size of the mine"
                  value={formData.mineSize}
                  onChange={handleChange}
                ><option value="">Select mine size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              </div>
              
              {/* CCS Technology */}
              <div>
                <label htmlFor="ccsTechnology" className="block text-lg font-medium text-gray-700">
                  CCS Technology
                </label>
                <select
                  name="ccsTechnology"
                  id="ccsTechnology"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.ccsTechnology}
                  onChange={handleChange}
                >
                  <option value="">Select CCS Technology</option>
                  <option value="PostCombustion">Post-Combustion Capture</option>
                  <option value="PreCombustion">Pre-Combustion Capture</option>
                  <option value="OxyCombustion">Oxy-Combustion Capture</option>
                </select>
              </div>
              
              {/* Installation Cost Per Ton */}
              <div>
                <label htmlFor="installationCostPerTon" className="block text-lg font-medium text-gray-700">
                  Installation Cost Per Ton (₹)
                </label>
                <input
                  type="number"
                  name="installationCostPerTon"
                  id="installationCostPerTon"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter installation cost per ton (Optional)"
                  value={formData.installationCostPerTon}
                  onChange={handleChange}
                />
              </div>
              
              {/* Annual Maintenance Cost */}
              <div>
                <label htmlFor="annualMaintenanceCost" className="block text-lg font-medium text-gray-700">
                  Annual Maintenance Cost (₹)
                </label>
                <input
                  type="number"
                  name="annualMaintenanceCost"
                  id="annualMaintenanceCost"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter annual maintenance cost (Optional)"
                  value={formData.annualMaintenanceCost}
                  onChange={handleChange}
                />
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Calculating...' : 'Calculate CCS'}
                </button>
              </div>
            </form>
  
            {/* Error Message */}
            {error && (
              <div className="mt-4 text-red-600">{error}</div>
            )}
  
            {/* Result Display */}
            {result && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Results:</h2>
                <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                  {Object.entries(result).map(([key, value]) => (
                    <div key={key} className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">{key}</dt>
                      <dd className="text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}