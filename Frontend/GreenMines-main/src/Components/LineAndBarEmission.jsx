import React, { useState , useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LineAndBarEmission = ({data}) => {

  const [fetchWeekData, setWeekData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLastWeekData = async () => {
      try {
        setLoading(true);

        // Get today's date
        const today = new Date(); // Today's date will be something like November 29, 2024

        // Calculate the start of the current week (this week's Monday)
        const currentWeekMonday = new Date(today);
        currentWeekMonday.setDate(today.getDate() - today.getDay() + 1); // Set to Monday of the current week (November 25, 2024)
        currentWeekMonday.setHours(0, 0, 0, 0); // Set to midnight (00:00:00)

        // Calculate the start of last week (Monday of previous week)
        const lastWeekMonday = new Date(currentWeekMonday);
        lastWeekMonday.setDate(currentWeekMonday.getDate() - 7); // Go back 7 days to get last week's Monday (November 18, 2024)
        
        // Calculate the end of last week (Sunday of previous week)
        const lastWeekSunday = new Date(lastWeekMonday);
        lastWeekSunday.setDate(lastWeekMonday.getDate() + 6); // Set to Sunday of last week (November 24, 2024)
        lastWeekSunday.setHours(23, 59, 59, 999); // Set to the end of the day (23:59:59)

        // Format the dates to YYYY-MM-DD
        const formattedStartDate = lastWeekMonday.toISOString().split('T')[0]; // "2024-11-18"
        const formattedEndDate = lastWeekSunday.toISOString().split('T')[0]; // "2024-11-24"

        // Make the API call with the start and end date for last week
        const response = await axios.get(`http://localhost:5000/api/data/${formattedStartDate}/${formattedEndDate}`);

        console.log('Last week data:', response.data); // Log the response for debugging

        // Set the fetched data to state
        setWeekData(response.data);
        setLoading(false);

      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error(err);
      }
    };

    // Call the fetch function immediately when the component loads
    fetchLastWeekData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts
  console.log(fetchWeekData);
  

  // Utility function to get the day of the week
const getDayOfWeek = (date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = new Date(date).getDay();
  return days[day];
};

// Function to calculate total CO2 emissions per day
const calculateEmissionsByDay = (data) => {
  const emissionsByDay = {};

  const addEmissionToDay = (date, emission) => {
    const day = getDayOfWeek(date);
    if (!emissionsByDay[day]) {
      emissionsByDay[day] = 0;
    }
    emissionsByDay[day] += emission;
  };

  // Electricity
  data.electricity.forEach(entry => {
    const co2Emission = entry.result.CO2.value;
    addEmissionToDay(entry.createdAt, co2Emission);
  });

  // Fuel Combustion
  data.fuelCombustion.forEach(entry => {
    const co2Emission = entry.result.CO2.value;
    addEmissionToDay(entry.createdAt, co2Emission);
  });

  // Shipping
  data.shipping.forEach(entry => {
    const co2Emission = parseFloat(entry.result.carbonEmissions.kilograms);
    addEmissionToDay(entry.createdAt, co2Emission);
  });

  // Explosion
  data.explosion.forEach(entry => {
    const co2Emission = parseFloat(entry.emissions.CO2);
    addEmissionToDay(entry.createdAt, co2Emission);
  });

  return emissionsByDay;
};

// Get total CO2 emissions for each day of the week
const totalEmissionsByDay = fetchWeekData ? calculateEmissionsByDay(fetchWeekData) : null;
console.log(totalEmissionsByDay);



  const weekData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
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
        data: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
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


  const electricityCO2 = data.electricity.reduce((total, item) => total + item.result.CO2.value, 0);
  const fuelCO2 = data.fuelCombustion.reduce((total, item) => total + item.result.CO2.value, 0);
  const shippingCO2 = data.shipping.reduce((total, item) => total + parseFloat(item.result.carbonEmissions.kilograms), 0);
  const explosionCO2 = data.explosion.reduce((total, item) => total + parseFloat(item.emissions.CO2), 0);
  const barData={
    labels: ['Electricity', 'Explosion', 'Fuel', 'Shipping'],
    datasets: [
      {
        label: 'Emission (tons CO2)',
        data: [electricityCO2, explosionCO2, fuelCO2,shippingCO2 ], // Example data
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
  }

  return (
    <div className="flex gap-8 xl:col-span-3 p-2 ml-3">
      {/* Line Chart */}
      <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-[65%] max-h-[1800px] mt-6">
        <h2 className="text-lg font-bold mb-4">Emission Line Chart</h2>
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
        <div className="h-[500px] overflow-hidden">
          <Line data={currentData} options={{ responsive: true }} />
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
      data={barData}
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
  );
};

export default LineAndBarEmission;
