// Components/EnvironmentalReport/ReportStats.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Divider, Alert } from '@mui/material';

const ReportStats = ({ data }) => {
    if (!data) return null;

    const formatNumber = (num) => Number(num).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

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

    // Calculate total sink absorption
    const calculateTotalAbsorption = (sinks) => {
        return sinks.reduce((sum, sink) => {
            const dailyRate = sink.dailySequestrationRate || 
                (sink.carbonSequestrationRate / 365);
            return sum + (dailyRate * sink.areaCovered);
        }, 0);
    };


    const totals = {
        electricity: calculateTotalEmissions(data.electricity),
        explosion: calculateTotalEmissions(data.explosion),
        fuel: calculateTotalEmissions(data.fuelCombustion),
        shipping: calculateTotalEmissions(data.shipping)
    };

    const totalEmissions = Object.values(totals).reduce((a, b) => a + b, 0);
    const totalAbsorption = calculateTotalAbsorption(data.sinks);
    const carbonGap = totalEmissions - totalAbsorption;
    const absorptionPercentage = (totalAbsorption / totalEmissions) * 100;
    
    // Calculate required additional sink area
    const averageSequestrationRate = data.sinks.length > 0 
        ? data.sinks.reduce((sum, sink) => sum + sink.carbonSequestrationRate, 0) / data.sinks.length 
        : 0;
    const additionalSinkAreaNeeded = carbonGap > 0 && averageSequestrationRate > 0
        ? (carbonGap * 365) / averageSequestrationRate
        : 0;
    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
                Environmental Impact Statistics
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Electricity
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Number of Entries
                                </Typography>
                                <Typography variant="h6">
                                    {data.electricity.length}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Emissions
                                </Typography>
                                <Typography variant="h6" color="error">
                                    {formatNumber(totals.electricity)} tons CO₂e
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {((totals.electricity / totalEmissions) * 100).toFixed(1)}% of total emissions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Explosion
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Number of Entries
                                </Typography>
                                <Typography variant="h6">
                                    {data.explosion.length}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Emissions
                                </Typography>
                                <Typography variant="h6" color="error">
                                    {formatNumber(totals.explosion)} tons CO₂e
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {((totals.explosion / totalEmissions) * 100).toFixed(1)}% of total emissions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Fuel Combustion
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Number of Entries
                                </Typography>
                                <Typography variant="h6">
                                    {data.fuelCombustion.length}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Emissions
                                </Typography>
                                <Typography variant="h6" color="error">
                                    {formatNumber(totals.fuel)} tons CO₂e
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {((totals.fuel / totalEmissions) * 100).toFixed(1)}% of total emissions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Shipping
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Number of Entries
                                </Typography>
                                <Typography variant="h6">
                                    {data.shipping.length}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Emissions
                                </Typography>
                                <Typography variant="h6" color="error">
                                    {formatNumber(totals.shipping)} tons CO₂e
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {((totals.shipping / totalEmissions) * 100).toFixed(1)}% of total emissions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Total Environmental Impact
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Emissions
                                </Typography>
                                <Typography variant="h5" color="error">
                                    {formatNumber(totalEmissions)} tons CO₂e
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Entries
                                </Typography>
                                <Typography variant="h5">
                                    {data.electricity.length + data.explosion.length + 
                                     data.fuelCombustion.length + data.shipping.length}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Average Emissions per Entry
                                </Typography>
                                <Typography variant="h5" color="warning.main">
                                    {formatNumber(totalEmissions / (data.electricity.length + data.explosion.length + 
                                     data.fuelCombustion.length + data.shipping.length))} tons CO₂e
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" color="primary">
                            Carbon Sinks
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Number of Sinks
                            </Typography>
                            <Typography variant="h6">
                                {data.sinks.length}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Absorption
                            </Typography>
                            <Typography variant="h6" color="success.main">
                                {formatNumber(totalAbsorption)} tons CO₂e/day
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {formatNumber(absorptionPercentage)}% of emissions offset
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Carbon Balance Analysis Card */}
            <Box sx={{ mt: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Carbon Balance Analysis
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Daily Emissions
                                </Typography>
                                <Typography variant="h5" color="error">
                                    {formatNumber(totalEmissions)} tons CO₂e
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total Daily Absorption
                                </Typography>
                                <Typography variant="h5" color="success.main">
                                    {formatNumber(totalAbsorption)} tons CO₂e
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Net Carbon Balance
                                </Typography>
                                <Typography variant="h5" color={carbonGap > 0 ? "error.main" : "success.main"}>
                                    {carbonGap > 0 ? '+' : ''}{formatNumber(carbonGap)} tons CO₂e
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Carbon Gap Analysis */}
                        <Box sx={{ mt: 3 }}>
                            <Alert severity={carbonGap > 0 ? "warning" : "success"} sx={{ mb: 2 }}>
                                <Typography variant="body1">
                                    {carbonGap > 0 
                                        ? `Current carbon sinks are offsetting ${formatNumber(absorptionPercentage)}% of emissions. Additional carbon sinks are needed.`
                                        : "Carbon neutrality achieved! Current sinks are sufficient to offset all emissions."}
                                </Typography>
                            </Alert>

                            {carbonGap > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Recommendations for Carbon Neutrality
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        To achieve carbon neutrality, you need either:
                                    </Typography>
                                    <ul>
                                        <li>
                                            <Typography variant="body1">
                                                Additional sink area of approximately {formatNumber(additionalSinkAreaNeeded)} hectares
                                                (based on current average sequestration rate)
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="body1">
                                                Reduction in emissions by {formatNumber(carbonGap)} tons CO₂e per day
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="body1">
                                                A combination of both approaches
                                            </Typography>
                                        </li>
                                    </ul>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ReportStats;