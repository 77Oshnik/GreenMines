import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmissionDonutChart = ({ data }) => {

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

    const donutData = {
        labels: ['Electricity', 'Explosion', 'Fuel Combustion', 'Shipping'],
        datasets: [{
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
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
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
                text: 'Emissions Distribution'
            }
        }
    };

    return <Doughnut data={donutData} options={options} />;
};

export default EmissionDonutChart;