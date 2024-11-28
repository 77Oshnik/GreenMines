import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom marker
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OverviewSection from "./OverviewSection";
import CarbonSinkEstimation from "./CarbonSinkEstimation";
import FinancialAnalysis from "./FinancialAnalysis";
import ReportsAndAlerts from "./ReportsAndAlerts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const customMarker = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Replace with your desired icon URL
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png", // Shadow of the marker
  shadowSize: [41, 41], // Size of the shadow
  shadowAnchor: [12, 41], // Anchor for the shadow
});

function DashBoard() {
  // State for user location
  const [location, setLocation] = useState(""); // To capture the user input location
  const [mapLocation, setMapLocation] = useState([19.076, 72.8777]); // Default to Mumbai

  // Geocoding function to convert address to coordinates (using OpenStreetMap Nominatim)
  const geocodeLocation = async (address) => {
    if (address) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0]; // Get the first result
        setMapLocation([lat, lon]); // Update map center with the new coordinates
      } else {
        alert("Location not found!");
      }
    }
  };

  // Data for the Doughnut Chart
  const doughnutData = {
    labels: ["Electricity", "Explosion", "Fuel", "Shipping"],
    datasets: [
      {
        data: [50, 30, 20, 45],
        backgroundColor: ["#0046b9", "#11c610", "#d5d502", "#6302d5"],
        hoverBackgroundColor: ["#0046b9", "#11c610", "#d5d502", "#6302d5"],
      },
    ],
  };

  const weekData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Electricity",
        data: [15, 30, 25, 20, 50, 40],
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4,
      },
      {
        label: "Explosion",
        data: [10, 20, 15, 30, 40, 25],
        borderColor: "#11c610",
        backgroundColor: "#11c610",
        tension: 0.4,
      },
      {
        label: "Fuel",
        data: [20, 25, 35, 45, 50, 55],
        borderColor: "#d5d502",
        backgroundColor: "#d5d502",
        tension: 0.4,
      },
      {
        label: "Shipping",
        data: [5, 10, 15, 20, 25, 30],
        borderColor: "#6302d5",
        backgroundColor: "#6302d5",
        tension: 0.4,
      },
    ],
  };

  const monthData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Electricity",
        data: [
          50, 60, 55, 65, 70, 80, 85, 75, 90, 95, 100, 110, 120, 125, 130, 140,
          135, 150, 145, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210,
        ],
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4,
      },
      {
        label: "Explosion",
        data: [
          20, 25, 30, 35, 40, 50, 60, 65, 70, 75, 80, 90, 85, 95, 100, 110, 115,
          120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180,
        ],
        borderColor: "#11c610",
        backgroundColor: "#11c610",
        tension: 0.4,
      },
      {
        label: "Fuel",
        data: [
          40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 115, 120, 125,
          130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195,
        ],
        borderColor: "#d5d502",
        backgroundColor: "#d5d502",
        tension: 0.4,
      },
      {
        label: "Shipping",
        data: [
          15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
          100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160,
        ],
        borderColor: "#6302d5",
        backgroundColor: "#6302d5",
        tension: 0.4,
      },
    ],
  };

  const yearData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Electricity",
        data: [500, 600, 750, 800, 850, 900, 950, 1000, 1100, 1150, 1200, 1250],
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4,
      },
      {
        label: "Explosion",
        data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
        borderColor: "#11c610",
        backgroundColor: "#11c610",
        tension: 0.4,
      },
      {
        label: "Fuel",
        data: [
          400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500,
        ],
        borderColor: "#d5d502",
        backgroundColor: "#d5d502",
        tension: 0.4,
      },
      {
        label: "Shipping",
        data: [150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700],
        borderColor: "#6302d5",
        backgroundColor: "#6302d5",
        tension: 0.4,
      },
    ],
  };

  const [currentData, setCurrentData] = useState(weekData);

  const weekProfitData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Profit",
        data: [80000, 50000, 75000, 65000, 70000, 100000],
        fill: true,
        backgroundColor: function (context) {
          const midwayMark = 74000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "rgba(200, 200, 200, 0.2)";
        },
        borderColor: function (context) {
          const midwayMark = 74000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "#cccccc";
        },
        tension: 0.4,
      },
    ],
  };

  const monthProfitData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Profit",
        data: [320000, 250000, 300000, 275000],
        fill: true,
        backgroundColor: function (context) {
          const midwayMark = 270000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "rgba(200, 200, 200, 0.2)";
        },
        borderColor: function (context) {
          const midwayMark = 270000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "#cccccc";
        },
        tension: 0.4,
      },
    ],
  };

  const yearProfitData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Profit",
        data: [
          300000, 400000, 350000, 500000, 450000, 480000, 530000, 600000,
          550000, 590000, 620000, 700000,
        ],
        fill: true,
        backgroundColor: function (context) {
          const midwayMark = 500000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "rgba(200, 200, 200, 0.2)";
        },
        borderColor: function (context) {
          const midwayMark = 500000;
          const value = context.dataset.data[context.dataIndex];
          return value > midwayMark ? "#ff0000" : "#cccccc";
        },
        tension: 0.4,
      },
    ],
  };

  // State for the current data displayed on the graph
  const [selectedProfitData, setSelectedProfitData] = useState(weekProfitData);

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-x-hidden">
      <Navbar className="mb-2 pt-4" />

      {/* Dashboard Grid Layout */}
      <div className="px-10">
        <OverviewSection />
      </div>
      <div className="grid grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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

          {/* User Profile Div (Squarish and fits beside the data entries) */}
         
        </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-8 p-1 justify-between xl:col-span-3">
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Electricity</h2>
            <p className="text-3xl font-semibold mb-2">60 MWh</p>
            <p className="text-red-500">+15% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Explosion</h2>
            <p className="text-3xl font-semibold mb-2">40 tCO2e</p>
            <p className="text-green-500">-5% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Fuel</h2>
            <p className="text-3xl font-semibold mb-2">50 tCO2e</p>
            <p className="text-red-500">+10% from last week</p>
          </div>

          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 text-center flex-1">
            <h2 className="text-lg font-bold mb-2">Shipping</h2>
            <p className="text-3xl font-semibold mb-2">35 tCO2e</p>
            <p className="text-green-500">-8% from last week</p>
          </div>
        </div>

       {/* Emission Line and Bar Chart Below Doughnut and Data Entries */}
<div className="flex gap-8 xl:col-span-3 p-2 ml-3">
  {/* Line Chart */}
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[65%] max-h-[1800px] mt-6">
    <h2 className="text-lg font-bold mb-4">Emission Line Chart</h2>
    <div className="flex justify-between items-center mb-6">
      <span className="text-gray-400">
        Emission and Global warming trend in Emissions
      </span>
      <span className="text-3xl font-bold">Analysis</span>
    </div>

    {/* Time Range Filters */}
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => setCurrentData(weekData)}
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
      >
        Past Week
      </button>
      <button
        onClick={() => setCurrentData(monthData)}
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
      >
        Past Month
      </button>
      <button
        onClick={() => setCurrentData(yearData)}
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
      >
        Past Year
      </button>
    </div>

    {/* Line Chart */}
    <div className="h-[500px] overflow-hidden">
      <Line
        data={currentData}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  </div>

 {/* Bar Chart */}
<div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[35%] max-h-[1800px] mt-6">
  <h2 className="text-lg font-bold mb-4">Emission Bar Chart</h2>
  <div className="flex justify-between items-center mb-6">
    <span className="text-gray-400">Emission Contribution by Source</span>
    <span className="text-3xl font-bold">Overview</span>
  </div>

  {/* Bar Chart */}
  <div className="flex-1">
    <Bar
      data={{
        labels: ['Electricity', 'Explosion', 'Fuel', 'Shipping'],
        datasets: [
          {
            label: 'Emission (tons CO2)',
            data: [120, 150, 200, 100], // Example data
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to adjust to its container
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sources',
              font: {
                size: 14,
              },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Emissions (tons CO2)',
              font: {
                size: 14,
              },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
            },
          },
        },
      }}
    />
  </div>
</div>

</div>

<div className="flex gap-8 xl:col-span-3 p-1 mb-6">
  {/* Sink Bar - 30% Width */}
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-[30%] min-w-[300px]">
    <CarbonSinkEstimation />
  </div>
  
  {/* Sink Graph - 70% Width */}
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-[70%]">
    <h2 className="text-lg font-bold text-gray-300 mb-4">Sink Status</h2>

    {/* Time Range Filters */}
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => setSelectedProfitData(weekProfitData)}
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
      >
        Past Week
      </button>
      <button
        onClick={() => setSelectedProfitData(monthProfitData)}
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
      >
        Past Month
      </button>
      <button
        onClick={() => setSelectedProfitData(yearProfitData)}
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
      >
        Past Year
      </button>
    </div>

    {/* Line Chart */}
    <div className="w-full h-[400px]">
      <Line
        data={selectedProfitData}
        options={{
          responsive: true,
          maintainAspectRatio: false, // Ensure the chart adapts to container dimensions
          scales: {
            x: {
              grid: {
                color: "#4A5568", // Optional grid customization
              },
              ticks: {
                color: "#E2E8F0", // Optional tick customization
              },
            },
            y: {
              grid: {
                color: "#4A5568",
              },
              ticks: {
                color: "#E2E8F0",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#E2E8F0", // Adjust legend text color
              },
            },
          },
        }}
      />
    </div>
  </div>
</div>

        <div className="flex flex-col xl:flex-row gap-8 xl:col-span-3 p-4">
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[50%] max-h-[1800px] mb-4">
    <h2 className="text-lg font-bold text-white mb-4">Financial Analysis</h2>
    <FinancialAnalysis />
  </div>
  <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[50%] max-h-[1800px] mb-4">
    <h2 className="text-lg font-bold text-white mb-4">Reports and Alerts</h2>
    <ReportsAndAlerts />
  </div>
</div>


      </div>
      <Footer className="w-full bg-gray-800 text-white py-4 text-center" />
    </div>
  );
}

export default DashBoard;
