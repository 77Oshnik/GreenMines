import React from "react";

// Function to parse the emission data and number the points for each section
const parseEmissionsData = (text) => {
  // Split the response into sections by titles (marked with stars **)
  const emissionSections = text.split(/(?=\*\*.*\*\*)/);

  return emissionSections.map((section) => {
    // Split into title and points
    const [title, ...points] = section
      .split("\n")
      .map((line) => line.trim().replace(/\*\*/g, "")) // Remove stars (**)
      .filter((line) => line); // Remove empty lines

    // Process points into bold and non-bold parts
    const parsedPoints = points.map((point) => {
      const boldParts = [];
      const nonBoldParts = [];
      let isBold = false;
      let temp = "";

      // Iterate through each character to separate bold and non-bold text
      for (let char of point) {
        if (char === "*" && !isBold) {
          if (temp) nonBoldParts.push(temp);
          temp = "";
          isBold = true; // Start bold
        } else if (char === "*" && isBold) {
          boldParts.push(temp);
          temp = "";
          isBold = false; // End bold
        } else {
          temp += char;
        }
      }
      if (temp) (isBold ? boldParts : nonBoldParts).push(temp);

      return { boldParts, nonBoldParts, fullText: point }; // Store full text for logic checking
    });

    return {
      title,
      points: parsedPoints,
    };
  });
};

// Function to apply semi-bold style to text enclosed in - and :
const applySemiBoldStyle = (text) => {
  return text.replace(/(-.*?:)/g, (match) => {
    return `<span class="font-semibold text-gray-800">${match}</span>`;
  });
};

function EmissionsResult({ result }) {
  const emissionsData = parseEmissionsData(result.aiAnalysis);

  return (
    <div className="mt-8 max-w-full mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
      <h3 className="text-2xl font-medium mb-6 text-gray-800 col-span-2">
        Emissions Impact Analysis
      </h3>

      {emissionsData.map((item, sectionIndex) => (
        <div
          key={sectionIndex}
          className="p-6 bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          {/* Emission Type Title */}
          <h4 className="text-xl font-semibold mb-4 text-gray-800">
            {item.title} {/* Titles are now clean without stars */}
          </h4>

          {/* Emission Points */}
          <div className="space-y-4">
            {item.points.map((point, pointIndex) => (
              <div key={pointIndex} className="flex items-start space-x-2">
                {/* Numbering for each point */}
                <span className="font-medium text-gray-600">{pointIndex + 1}. </span>

                {/* Render bold and non-bold parts separately */}
                {point.boldParts.map((boldText, boldIndex) => (
                  <span
                    key={boldIndex}
                    className="bg-gray-200 inline-block py-1 px-2 rounded text-gray-800 font-semibold"
                  >
                    {boldText}
                  </span>
                ))}

                {/* Render non-bold text */}
                {point.nonBoldParts.map((text, textIndex) => (
                  <span
                    key={textIndex}
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: applySemiBoldStyle(text),
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmissionsResult;
