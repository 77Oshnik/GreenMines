import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NeutralityForm() {

  const VEGETATION_RATES = {
    forest: 5.0,
    grassland: 1.5,
    wetland: 3.5,
    agricultural: 1.0,
    mangrove: 4.0,
    tropical_rainforest: 6.5,
    temperate_forest: 4.5,
    boreal_forest: 3.0,
    savanna: 0.8,
    desert_vegetation: 0.1,
    other: 0
  };

  const [formType, setFormType] = useState('sink');
  const [sinkData, setSinkData] = useState({
    name: '',
    vegetationType: 'forest',
    otherVegetationType: '',
    areaCovered: '',
    carbonSequestrationRate: VEGETATION_RATES.forest, // Ensure this is always set
    additionalDetails: '',
  });

  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  // Effect to ensure carbonSequestrationRate is always set
  useEffect(() => {
    if (!sinkData.carbonSequestrationRate && sinkData.vegetationType !== 'other') {
      setSinkData(prevData => ({
        ...prevData,
        carbonSequestrationRate: VEGETATION_RATES[sinkData.vegetationType] || VEGETATION_RATES.forest
      }));
    }
  }, [sinkData.vegetationType, sinkData.carbonSequestrationRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'vegetationType') {
      const newRate = VEGETATION_RATES[value];
      
      setSinkData(prevData => ({
        ...prevData,
        vegetationType: value,
        carbonSequestrationRate: value === 'other' ? '' : newRate,
        otherVegetationType: value === 'other' ? '' : prevData.otherVegetationType
      }));
    } else {
      setSinkData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure carbonSequestrationRate is set before submission
    const payload = {
      ...sinkData,
      carbonSequestrationRate: sinkData.carbonSequestrationRate === '' 
        ? 0 
        : parseFloat(sinkData.carbonSequestrationRate),
      areaCovered: parseFloat(sinkData.areaCovered),
      timeframe: 1
    };

    try {
      const apiEndpoint = formType === 'sink' ? 'http://localhost:5000/api/sinks' : 'http://localhost:5000/api/existing-sinks';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
        setResult(data.data);
        
        // Reset form with default values
        setSinkData({
          name: '',
          vegetationType: 'forest',
          otherVegetationType: '',
          areaCovered: '',
          carbonSequestrationRate: VEGETATION_RATES.forest, // Reset to default
          additionalDetails: '',
        });
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error('Failed to submit form', errorData);
        // Optionally show error to user
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFormTypeChange = (e) => {
    const newFormType = e.target.value;
    setFormType(newFormType);
    
    // Reset form with default values
    setSinkData({
      name: '',
      vegetationType: 'forest',
      otherVegetationType: '',
      areaCovered: '',
      carbonSequestrationRate: VEGETATION_RATES.forest, // Always set a default
      additionalDetails: '',
    });
    setResult(null);
  };

  const sectionStyle = "bg-[#342F49] p-6 rounded-lg shadow-lg border border-[#66C5CC]";
  const titleStyle = "text-2xl font-semibold text-[#66C5CC] mb-4";
  const inputStyle = "p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66C5CC] text-lg placeholder-black";
  const buttonStyle = "px-6 py-3 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 bg-[#66C5CC] hover:bg-[#55B2B6] focus:outline-none focus:ring-2 focus:ring-[#55B2B6]";
  const radioStyle = "mr-4 text-white font-bold";

  return (
    <div className="p-6 md:p-10 mt-24 lg:p-20 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#342F49] to-[#2B263F] relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-r from-[#66C5CC] to-[#55B2B6] opacity-30 animate-gradient overflow-hidden"></div>
    </div>
    
    <h1 className="text-4xl font-bold text-[#cad9ed] mb-10 text-center">Carbon Sink</h1>
  
    {/* Radio Buttons for Toggle */}
    <div className="flex space-x-6 mb-8">
      <label className={`cursor-pointer text-lg font-medium text-[#cad9ed]`}>
        <input
          type="radio"
          name="formType"
          value="sink"
          checked={formType === 'sink'}
          onChange={handleFormTypeChange}
          className="mr-2 accent-[#66C5CC]"
        />
        Carbon Sink
      </label>
      <label className={`cursor-pointer text-lg font-medium text-[#cad9ed]`}>
        <input
          type="radio"
          name="formType"
          value="existing"
          checked={formType === 'existing'}
          onChange={handleFormTypeChange}
          className="mr-2 accent-[#66C5CC]"
        />
        Existing Sink
      </label>
    </div>
  
    <form className="space-y-8 w-full max-w-4xl bg-[#2B263F] p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-6">
        <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2">Name</h2>
        <input
          type="text"
          name="name"
          value={sinkData.name}
          onChange={handleChange}
          placeholder="Name or identifier for the carbon sink"
          className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
        />
      </div>
  
{/* Vegetation Type */}
<div className="mb-6">
  <div className="flex items-center">
    <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2 mr-2">Vegetation Type</h2>
    <div 
      className="group relative cursor-pointer"
      title="Carbon sequestration rates are approximate and can vary based on specific conditions"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-[#66C5CC] opacity-50 hover:opacity-100" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
    </div>
  </div>
  <select
    name="vegetationType"
    value={sinkData.vegetationType}
    onChange={handleChange}
    className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
  >
    <optgroup label="Forests">
      <option value="tropical_rainforest">Tropical Rainforest (6.5 tons CO2/ha/year)</option>
      <option value="temperate_forest">Temperate Forest (4.5 tons CO2/ha/year)</option>
      <option value="boreal_forest">Boreal Forest (3.0 tons CO2/ha/year)</option>
    </optgroup>
    <optgroup label="Other Vegetation">
      <option value="grassland">Grassland (1.5 tons CO2/ha/year)</option>
      <option value="wetland">Wetland (3.5 tons CO2/ha/year)</option>
      <option value="agricultural">Agricultural Land (1.0 tons CO2/ha/year)</option>
      <option value="mangrove">Mangrove (4.0 tons CO2/ha/year)</option>
      <option value="savanna">Savanna (0.8 tons CO2/ha/year)</option>
      <option value="desert_vegetation">Desert Vegetation (0.1 tons CO2/ha/year)</option>
    </optgroup>
    <option value="other">Other (Manual Input)</option>
  </select>

  {/* Conditional rendering for Other Vegetation Type */}
  {sinkData.vegetationType === 'other' && (
    <div className="mt-4 space-y-4">
      <input
        type="text"
        name="otherVegetationType"
        value={sinkData.otherVegetationType}
        onChange={handleChange}
        placeholder="Specify vegetation type"
        className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
      />
      <input
        type="number"
        name="carbonSequestrationRate"
        value={sinkData.carbonSequestrationRate}
        onChange={handleChange}
        placeholder="Carbon Sequestration Rate (tons CO2/hectare/year)"
        className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
      />
      <p className="text-sm text-[#66C5CC] italic">
        Note: Please provide a scientifically backed rate or consult local environmental experts.
      </p>
    </div>
  )}
</div>
  
      {/* Area Covered */}
      <div className="mb-6">
        <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2">Area Covered (hectares)</h2>
        <input
          type="number"
          name="areaCovered"
          value={sinkData.areaCovered}
          onChange={handleChange}
          placeholder="Total area covered by the sink"
          className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
        />
      </div>
  

  
      {/* Additional Details */}
      <div className="mb-6">
        <h2 className="text-2xl text-[#cad9ed] font-semibold mb-2">Additional Details</h2>
        <textarea
          name="additionalDetails"
          value={sinkData.additionalDetails}
          onChange={handleChange}
          placeholder="Any additional details"
          className="w-full p-3 rounded-md bg-[#342F49] text-[#cad9ed] border border-[#66C5CC] focus:ring focus:ring-[#66C5CC]"
        />
      </div>
  
      <div className="text-center">
        <button
          type="submit"
          className="py-3 px-6 bg-[#66C5CC] hover:bg-[#55B2B6] text-[#2B263F] font-bold rounded-md transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  
    {/* Display Result */}
    {result && (
      <div className="mt-10 p-8 bg-[#342F49] text-[#cad9ed] rounded-lg shadow-lg border border-[#66C5CC] text-center w-full max-w-4xl mx-auto">
      <h2 className="text-4xl font-semibold text-[#66C5CC] mb-6">Result</h2>
      <p className="text-2xl mb-2"><strong>Daily Sequestration Rate:</strong> {result.dailySequestrationRate}</p>
      <p className="text-2xl"><strong>Total Sequestration:</strong> {result.totalSequestration}</p>
    </div>
    
    
    
    )}
  </div>
  
  );
}

export default NeutralityForm;
