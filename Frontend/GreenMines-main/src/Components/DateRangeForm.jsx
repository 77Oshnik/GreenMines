
import React, { useState } from "react";
import axios from "axios";

function DateRangeForm({ onAnalysisComplete }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/genai/emissions-analysis', { startDate, endDate });
      onAnalysisComplete(response.data);
    } catch (err) {
      setError("Failed to fetch emissions data.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="w-full max-w-4xl mx-auto p-8 bg-[#231E3D] shadow-lg rounded-xl border border-[#66C5CC]">
  <h2 className="text-3xl font-bold mb-8 text-[#66C5CC]">Select Date Range</h2>
  <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-6">
    <div className="flex-1 min-w-[200px]">
      <label htmlFor="startDate" className="block text-lg font-bold text-white mb-2">
        Start Date
      </label>
      <input
        type="date"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full px-4 py-3 text-lg font-bold bg-[#342F49] text-white border border-[#66C5CC] rounded-md shadow-sm focus:ring-[#66C5CC] focus:border-[#66C5CC]"
      />
    </div>
    <div className="flex-1 min-w-[200px]">
      <label htmlFor="endDate" className="block text-lg font-bold text-white mb-2">
        End Date
      </label>
      <input
        type="date"
        id="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full px-4 py-3 text-lg font-bold bg-[#342F49] text-white border border-[#66C5CC] rounded-md shadow-sm focus:ring-[#66C5CC] focus:border-[#66C5CC]"
      />
    </div>
    <div className="flex-1 min-w-[200px]">
      <button
        type="submit"
        className={`w-full px-6 py-3 text-xl font-bold text-[#342F49] bg-[#66C5CC] rounded-md shadow-sm hover:bg-[#4da5aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66C5CC] ${
          loading ? "opacity-50 cursor-wait" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Emissions"}
      </button>
    </div>
  </form>
  {error && <p className="mt-4 text-lg font-bold text-red-500">{error}</p>}
</div>
  );
}

export default DateRangeForm;
