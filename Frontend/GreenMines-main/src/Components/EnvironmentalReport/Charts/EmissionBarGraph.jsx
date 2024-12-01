import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const EmissionBarGraph = ({ data }) => {
   

     // Calculate totals for each category
     const calculateTotalEmissions = (items) => {
        return items.reduce((sum, item) => {
            let co2Value = 0;
            if (item.result && item.result.CO2) {
                co2Value = parseFloat(item.result.CO2.value) / 1000; // Convert to tons
            } else if (item.emissions && item.emissions.CO2) {
                co2Value = parseFloat(item.emissions.CO2) / 1000;
            } else if (item.result && item.result.carbonEmissions) {
                co2Value = parseFloat(item.result.carbonEmissions.kilograms) / 1000;
            }
            return sum + (isNaN(co2Value) ? 0 : co2Value);
        }, 0);
    };

    const barData = {
        labels: ['Electricity', 'Explosion', 'Fuel Combustion', 'Shipping'],
        datasets: [{
            label: 'Emissions (kg CO2)',
            data: [
                calculateTotalEmissions(data.electricity),
                calculateTotalEmissions(data.explosion),
                calculateTotalEmissions(data.fuelCombustion),
                calculateTotalEmissions(data.shipping)
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)'
            ]
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Emissions Comparison'
            }
        }
    };

    return <Bar data={barData} options={options} />;
};

export default EmissionBarGraph;