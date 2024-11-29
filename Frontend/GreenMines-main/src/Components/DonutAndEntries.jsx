import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const DonutAndEntries = ({ data }) => {
  console.log(data);
  

  const electricityCO2 = data.electricity.reduce((total, item) => total + item.result.CO2.value, 0);
  const fuelCO2 = data.fuelCombustion.reduce((total, item) => total + item.result.CO2.value, 0);
  const shippingCO2 = data.shipping.reduce((total, item) => total + parseFloat(item.result.carbonEmissions.kilograms), 0);
  const explosionCO2 = data.explosion.reduce((total, item) => total + parseFloat(item.emissions.CO2), 0);

  // Data for the Doughnut Chart
  const doughnutData = {
    labels: ["Electricity", "Explosion", "Fuel", "Shipping"],
    datasets: [
      {
        data: [ electricityCO2 ,explosionCO2 ,fuelCO2, shippingCO2],
        backgroundColor: ["#0046b9", "#11c610", "#d5d502", "#6302d5"],
        hoverBackgroundColor: ["#0046b9", "#11c610", "#d5d502", "#6302d5"],
      },
    ],
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:col-span-3 p-4">
      {/* Total Emission Card */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-full sm:w-[40%] md:w-[40%] lg:w-[40%] xl:w-[40%] max-w-full mx-auto">
        <h2 className="text-lg font-bold mb-4">Total Emission</h2>
        <div className="flex justify-between items-center mb-6"></div>
        <div className="flex justify-center p-4">
          <div className="w-full max-w-[400px] sm:max-w-[400px]">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>

      {/* Data Entries Table */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-full max-w-full xl:max-w-none xl:flex-1 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Emission Data Entries</h2>
        <div className="flex justify-end mb-4"></div>
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-4">Type</th>
              <th className="py-4">Amount (kg CO₂)</th>
              <th className="py-4">Impact</th>
              <th className="py-4">Time</th>
              <th className="py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                type: "Electricity",
                amount: "60,000",
                impact: "Critical",
                time: "2024-11-20",
              },
              {
                type: "Explosion",
                amount: "40,000",
                impact: "Medium",
                time: "2024-11-19",
              },
              {
                type: "Fuel",
                amount: "50,000",
                impact: "High",
                time: "2024-11-18",
              },
              {
                type: "Shipping",
                amount: "35,000",
                impact: "Low",
                time: "2024-11-17",
              },
            ].map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700 transition"
              >
                <td className="py-4">{row.type}</td>
                <td className="py-4">{row.amount}</td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm text-white ${
                      row.impact === "Critical"
                        ? "bg-red-500"
                        : row.impact === "High"
                        ? "bg-yellow-500"
                        : row.impact === "Medium"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {row.impact}
                  </span>
                </td>
                <td className="py-4">{row.time}</td>
                <td className="py-4">
                  <button className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonutAndEntries;
