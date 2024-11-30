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
  

  const calculateEmissionsByDay = (data) => {
    // Initialize emissionsByDay with all the days of the week
    const emissionsByDay = {
      Sunday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 },
      Monday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 },
      Tuesday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 },
      Wednesday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 },
      Thursday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 },
      Friday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 },
      Saturday: { electricity: 0, fuelCombustion: 0, shipping: 0, explosion: 0 },
    };
  
    const addEmissionToDay = (date, emission, category) => {
      const day = getDayOfWeek(date); // Get the day of the week
      if (emissionsByDay[day]) {
        emissionsByDay[day][category] += emission; // Add emission to the respective category
      }
    };
  
    // Electricity
    data.electricity.forEach(entry => {
      const co2Emission = entry.result.CO2.value;
      addEmissionToDay(entry.createdAt, co2Emission, 'electricity');
    });
  
    // Fuel Combustion
    data.fuelCombustion.forEach(entry => {
      const co2Emission = entry.result.CO2.value;
      addEmissionToDay(entry.createdAt, co2Emission, 'fuelCombustion');
    });
  
    // Shipping
    data.shipping.forEach(entry => {
      const co2Emission = parseFloat(entry.result.carbonEmissions.kilograms);
      addEmissionToDay(entry.createdAt, co2Emission, 'shipping');
    });
  
    // Explosion
    data.explosion.forEach(entry => {
      const co2Emission = parseFloat(entry.emissions.CO2);
      addEmissionToDay(entry.createdAt, co2Emission, 'explosion');
    });
  
    return emissionsByDay;
  };
  
  // Utility function to get the day of the week
  const getDayOfWeek = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = new Date(date).getDay();
    return days[day];
  };
  
  // Ensure fetchWeekData is not null before calling the function
  const totalEmissionsByDay = fetchWeekData ? calculateEmissionsByDay(fetchWeekData) : null;
  
  console.log(totalEmissionsByDay);
  
  const weekData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Electricity",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.electricity : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.electricity : 0),
        ],
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4,
      },
      {
        label: "Explosion",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.explosion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.explosion : 0),
        ],
        borderColor: "#11c610",
        backgroundColor: "#11c610",
        tension: 0.4,
      },
      {
        label: "Fuel",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.fuelCombustion : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.fuelCombustion : 0),
        ],
        borderColor: "#d5d502",
        backgroundColor: "#d5d502",
        tension: 0.4,
      },
      {
        label: "Shipping",
        data: [
          (totalEmissionsByDay && totalEmissionsByDay.Monday ? totalEmissionsByDay.Monday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Tuesday ? totalEmissionsByDay.Tuesday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Wednesday ? totalEmissionsByDay.Wednesday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Thursday ? totalEmissionsByDay.Thursday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Friday ? totalEmissionsByDay.Friday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Saturday ? totalEmissionsByDay.Saturday.shipping : 0),
          (totalEmissionsByDay && totalEmissionsByDay.Sunday ? totalEmissionsByDay.Sunday.shipping : 0),
        ],
        borderColor: "#6302d5",
        backgroundColor: "#6302d5",
        tension: 0.4,
      },
    ],
  };
  
  
  
  // console.log(weekData);
  const [fetchMonthData, setFetchMonthData] = useState(null);
  const [MonthData,setMonthData]=useState(null);

  // Function to fetch last month's data
  const fetchLastMonthData = async () => {
    // Calculate the start and end dates for the last month
    const today = new Date();
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // 0 is the last day of the previous month
    
    // Format dates as YYYY-MM-DD for the API request
    const startDate = firstDayOfLastMonth.toISOString().split('T')[0];
    const endDate = lastDayOfLastMonth.toISOString().split('T')[0];

    // Fetch data from the backend
    try {
      const response = await axios.get(`http://localhost:5000/api/data/${startDate}/${endDate}`);
      console.log('Last Month data:', response.data); // Log the response for debugging
      setFetchMonthData(response.data);
    } catch (error) {
      console.error('Error fetching last month data:', error);
      return null;
    }
  };

  // Use useEffect to call the function when the page loads (component mount)
  useEffect(() => {
    fetchLastMonthData();
  }, [])
console.log("month data",fetchMonthData);
const parseData = (data) => {
  // If data is null or undefined, return a default dataset
  if (!data || Object.values(data).some(arr => arr == null)) {
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: "Electricity",
          data: [0, 0, 0, 0],
          borderColor: "#0046b9",
          backgroundColor: "#0046b9",
          tension: 0.4
        },
        {
          label: "Fuel Combustion",
          data: [0, 0, 0, 0],
          borderColor: "#FF6384",
          backgroundColor: "#FF6384",
          tension: 0.4
        },
        {
          label: "Shipping",
          data: [0, 0, 0, 0],
          borderColor: "#36A2EB",
          backgroundColor: "#36A2EB",
          tension: 0.4
        },
        {
          label: "Explosions",
          data: [0, 0, 0, 0],
          borderColor: "#FFCE56",
          backgroundColor: "#FFCE56",
          tension: 0.4
        }
      ]
    };
  }

  const parseNumeric = (value) => {
    if (typeof value === 'string') {
      // Extract first numeric value, handle various formats
      const matches = value.match(/[-+]?(\d*\.\d+|\d+)/);
      return matches ? parseFloat(matches[0]) : 0;
    }
    return Number(value) || 0;
  };

  const getAllDates = (dataArray, dateKey = 'createdAt') =>
    dataArray.map(item => new Date(item[dateKey]));

  const generateWeeks = (dates) => {
    if (dates.length === 0) return [];

    const sortedDates = dates.sort((a, b) => a - b);
    const startDate = new Date(sortedDates[0].getFullYear(), sortedDates[0].getMonth(), 1);
    const endDate = new Date(sortedDates[sortedDates.length - 1].getFullYear(),
                              sortedDates[sortedDates.length - 1].getMonth() + 1, 0);

    const weeks = [];
    let currentWeekStart = new Date(startDate);

    while (currentWeekStart <= endDate) {
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

      weeks.push({
        start: new Date(currentWeekStart),
        end: currentWeekEnd > endDate ? endDate : currentWeekEnd
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weeks;
  };

  const getWeekSums = (dataArray, dateKey = 'createdAt', valueKey = 'result.CO2.value') => {
    // If dataArray is null or empty, return an array of zeros
    if (!dataArray || dataArray.length === 0) return new Array(4).fill(0);

    const allDates = getAllDates(dataArray, dateKey);
    const weeks = generateWeeks(allDates);

    return weeks.map(week =>
      dataArray
        .filter(item => {
          const itemDate = new Date(item[dateKey]);
          return itemDate >= week.start && itemDate <= week.end;
        })
        .reduce((sum, item) => {
          const value = getNestedValue(item, valueKey);
          return sum + parseNumeric(value);
        }, 0)
    );
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
  };

  const monthData = {
    labels: generateWeeks(getAllDates(data.electricity)).map((week, index) => `Week ${index + 1}`),
    datasets: [
      {
        label: "Electricity",
        data: getWeekSums(data.electricity, 'createdAt', 'result.CO2.value'),
        borderColor: "#0046b9",
        backgroundColor: "#0046b9",
        tension: 0.4
      },
      {
        label: "Fuel Combustion",
        data: getWeekSums(data.fuelCombustion, 'createdAt', 'result.CO2.value'),
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        tension: 0.4
      },
      {
        label: "Shipping",
        data: getWeekSums(data.shipping, 'createdAt', 'result.carbonEmissions.kilograms'),
        borderColor: "#36A2EB",
        backgroundColor: "#36A2EB",
        tension: 0.4
      },
      {
        label: "Explosions",
        data: getWeekSums(data.explosion, 'createdAt', 'emissions.CO2'),
        borderColor: "#FFCE56",
        backgroundColor: "#FFCE56",
        tension: 0.4
      }
    ]
  };

  return monthData;
};

useEffect(() => {
  if (fetchMonthData !== null) {
    console.log("month data", fetchMonthData);
    const monthData = parseData(fetchMonthData); // Call parseData only when fetchMonthData is not null
    console.log("Parsed month data", monthData);
    setMonthData(monthData)
  }
}, [fetchMonthData]);

// console.log(processMonthlyData(fetchMonthData)); 

  // const monthData = {
  //   labels:["Week 1","Week 2","Week 3","Week 4", ],
  //   datasets: [
  //     {
  //       label: "Electricity",
  //       data: [
  //         200,300,400,500
  //       ],
  //       borderColor: "#0046b9",
  //       backgroundColor: "#0046b9",
  //       tension: 0.4,
  //     },
  //     {
  //       label: "Explosion",
  //       data: [
  //         200,400,400,500
  //       ],
  //       borderColor: "#11c610",
  //       backgroundColor: "#11c610",
  //       tension: 0.4,
  //     },
  //     {
  //       label: "Fuel",
  //       data: [
  //         200,600,400,500
  //       ],
  //       borderColor: "#d5d502",
  //       backgroundColor: "#d5d502",
  //       tension: 0.4,
  //     },
  //     {
  //       label: "Shipping",
  //       data: [
  //         200,700,400,500
  //       ],
  //       borderColor: "#6302d5",
  //       backgroundColor: "#6302d5",
  //       tension: 0.4,
  //     },
  //   ],
  // };

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
            onClick={() => {
              // fetchLastMonthData();
              setCurrentData(MonthData);
            }}
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
