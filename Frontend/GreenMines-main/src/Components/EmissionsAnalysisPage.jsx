import React, { useState } from "react";
import DateRangeForm from "./DateRangeForm";
import EmissionsResult from "./EmissionsResult";

function EmissionsAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Emissions Impact Analyzer</h1>
      <DateRangeForm onAnalysisComplete={handleAnalysisComplete} />
      {analysisResult && <EmissionsResult result={analysisResult} />}
    </div>
  );
}

export default EmissionsAnalysisPage;
