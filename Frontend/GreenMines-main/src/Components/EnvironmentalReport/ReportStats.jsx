import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const ReportStats = ({ data }) => {
    if (!data) return null;

    return (
        <Grid container spacing={3}>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Electricity</Typography>
                        <Typography>{data.electricity.length} entries</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Fuel Combustion</Typography>
                        <Typography>{data.fuelCombustion.length} entries</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Shipping</Typography>
                        <Typography>{data.shipping.length} entries</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Explosion</Typography>
                        <Typography>{data.explosion.length} entries</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ReportStats;