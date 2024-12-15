import React from 'react';

const NeutralityGraph = () => {
  const data = [
    { label: 'Field 1', value: 65 },
    { label: 'Field 2', value: 40 },
    { label: 'Field 3', value: 80 },
    { label: 'Field 4', value: 55 },
  ];

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="w-screen bg-gray-800 rounded-lg justify-center shadow-md p-4 sm:p-6 mb-4 mr-5">
      <div className="w-[99%] bg-gray-900 rounded-lg shadow-md p-1 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
          Emissions Impact Analysis
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-right text-gray-300 font-medium">{item.label}</div>
              <div className="flex-grow bg-gray-800 rounded-lg h-6 overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-500 ease-out"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="w-12 text-gray-300 font-medium">{item.value}%</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {[1, 2].map((sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-gray-800 rounded-lg shadow-md p-4 transition duration-300 hover:shadow-xl"
            >
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-white pb-2 border-b border-gray-700">
                Section {sectionIndex}
              </h4>

              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((pointIndex) => (
                  <div key={pointIndex} className="flex items-start space-x-2">
                    <span className="font-medium text-gray-300 min-w-[1.5rem] text-base sm:text-lg">{pointIndex}.</span>
                    <div>
                      <span className="bg-green-600 inline-block py-1 px-2 rounded text-white font-medium text-sm sm:text-base mr-1 mb-1">
                        Bold Part
                      </span>
                      <span className="text-gray-300 text-sm sm:text-base">
                        Non-bold part with <span className="font-medium">semi-bold</span> text.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeutralityGraph;
