import React, { useState, useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
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
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Replace with your desired icon URL
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png", // Shadow of the marker
  shadowSize: [41, 41], // Size of the shadow
  shadowAnchor: [12, 41], // Anchor for the shadow
});



const DashBoars = () => {
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

  // Data for the entries Line Chart (with days of the week as x-axis)
  const lineData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Electricity",
        data: [10, 20, 40, 30, 50, 60],
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4,
      },
      {
        label: "Explosion",
        data: [20, 10, 30, 50, 20, 40],
        borderColor: "#11c610",
        backgroundColor: "#11c610",
        tension: 0.4,
      },
      {
        label: "Fuel",
        data: [30, 40, 20, 10, 60, 50],
        borderColor: "#d5d502",
        backgroundColor: "#d5d502",
        tension: 0.4,
      },
      {
        label: "Shipping",
        data: [15, 40, 25, 20, 20, 35],
        borderColor: "#6302d5",
        backgroundColor: "#6302d5",
        tension: 0.4,
      },
    ],
  };

    // Data for sink
    const profitData = {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Profit",
          data: [80000, 50000, 75000, 65000, 70000, 100000],
          fill: true,
          backgroundColor: function (context) {
            // Define midway mark (e.g., halfway between 0 and 1,000,000)
            const midwayMark = 74000; // Midway mark to determine color
            const value = context.dataset.data[context.dataIndex];
  
            // Set the background color (fill area) based on the value relative to the midway mark
            if (value > midwayMark) {
              return "#ff0000"; // Red fill color if above midway mark
            } else {
              return "rgba(200, 200, 200, 0.2)"; // Neutral color if below midway mark
            }
          },
          borderColor: function (context) {
            const midwayMark = 74000; // Same midway mark for border color
            const value = context.dataset.data[context.dataIndex];
  
            // Set the border color based on whether the value is above or below midway mark
            if (value > midwayMark) {
              return "#ff0000"; // Red if above midway mark
            } else {
              return "#cccccc"; // Light gray if below midway mark
            }
          },
          tension: 0.4,
        },
      ],
    };
  
    const profitOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 18, // Increased legend font size
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return "$" + tooltipItem.raw.toLocaleString();
            },
          },
        },
      },
    };
  
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 16, // Increased x-axis label size
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 16, // Increased y-axis label size
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18, // Increased legend font size
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 14, // Increased tooltip font size
        },
      },
    },
  };


  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
        <Navbar className="z-50 mb-8" />
      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
  <div className="flex gap-8 xl:col-span-3">
    {/* Total Sales Card */}
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 max-w-xs min-w-[550px] mt-6">
      <h2 className="text-lg font-bold mb-4">Total Emission</h2>
      <div className="flex justify-between items-center mb-6">
      </div>
      {/* Doughnut Chart */}
      <div className="flex justify-center p-4">
        <div className="w-full h-full max-w-[400px] max-h-[400px]">
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>

    {/* Data Entries Table */}
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 max-w-xs min-w-[700px]">
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
            { type: "Electricity", amount: "60,000", impact: "Critical", time: "2024-11-20" },
            { type: "Explosion", amount: "40,000", impact: "Medium", time: "2024-11-19" },
            { type: "Fuel", amount: "50,000", impact: "High", time: "2024-11-18" },
            { type: "Shipping", amount: "35,000", impact: "Low", time: "2024-11-17" },
          ].map((row, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition">
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
<div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 w-full max-w-xs h-[580px] xl:max-w-sm">
  {/* Profile Picture */}
  <div className="flex justify-center mb-6">
    <div className="w-32 h-32 rounded-full overflow-hidden">
      <img
        src="https://zesty-cajeta-af510d.netlify.app/image-33.svg"
        alt="User Profile"
        className="object-cover w-full h-full"
      />
    </div>
  </div>

  {/* User Info */}
  <div className="text-center mb-6">
    <h2 className="text-3xl font-bold text-white">N</h2>
    <p className="text-xl text-gray-400">Organization Manager</p>
    <p className="text-xl text-green-500">Active</p>
  </div>

  {/* User Details */}
  <div className="text-center mb-6">
    <p className="text-lg text-gray-400">Email: gugxi@gugu.com</p>
    <p className="text-lg text-gray-400">Department: Operations</p>
  </div>

  {/* System Access */}
  <div className="text-center mb-6">
    <p className="text-lg text-gray-400">Access Level: Full Access</p>
    <p className="text-lg text-gray-400">Role: Admin</p>
  </div>

  {/* Settings */}
  <div className="mt-auto text-center">
    <button className="text-lg bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
      Update Profile
    </button>
  </div>
</div>


  </div>
</div>





        {/* Emission Line Chart Below Doughnut and Data Entries */}
        <div className="flex gap-8 xl:col-span-3 p-4">
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-full lg:min-w-[1720px] max-w-[1000px] max-h-[1000px] mt-6">
            <h2 className="text-lg font-bold mb-4">Emission Line Chart</h2>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Emission and Global warming trend in Emissions</span>
              <span className="text-3xl font-bold">Analysis</span>
            </div>
            {/* Line Chart */}
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Tabs */}
<div className="flex gap-4 p-4 justify-between xl:col-span-3">
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

        <div className="flex gap-8 xl:col-span-3 p-4">
 {/* Sink Graph */}
<div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex-1">
  <h2 className="text-lg font-bold mb-4">Sink Status</h2>
  <div className="flex justify-center items-center h-full">
    {/* Ensure the graph takes up all available space */}
    <div className="w-full h-full">
        
          <Line data={profitData} options={profitOptions} />
        </div>
  </div>
</div>




        {/* Real-Time Map Section */}
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex-1 max-w-xs min-w-[550px]">
          <h2 className="text-lg font-bold mb-4">Real-Time Map</h2>
          <MapContainer
            center={mapLocation}
            zoom={12}
            scrollWheelZoom={false}
            className="h-72"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={mapLocation} icon={customMarker}>
              <Popup>Your predefined location is here!</Popup>
            </Marker>
          </MapContainer>

          <br></br>
          <h2 className="text-lg font-bold mb-4">Enter Location</h2>
          <input
            type="text"
            className="text-black p-2 rounded-md mb-4"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter a location (e.g., New York)"
          />
          <button
            onClick={() => geocodeLocation(location)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Go to Location
          </button>
        </div>
        
      </div>
</div>

    
  


  );
};

export default DashBoars;