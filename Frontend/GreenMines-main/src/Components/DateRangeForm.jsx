
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
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Select Date Range</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-semibold">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
              loading ? "cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Analyze Emissions"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DateRangeForm;
