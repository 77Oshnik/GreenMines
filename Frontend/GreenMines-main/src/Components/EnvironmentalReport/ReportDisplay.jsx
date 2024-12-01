import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const ReportDisplay = ({ report }) => {
    if (!report) return null;

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
                Environmental Impact Report
            </Typography>
            <Box sx={{ whiteSpace: 'pre-wrap' }}>
                {report}
            </Box>
        </Paper>
    );
};

export default ReportDisplay;