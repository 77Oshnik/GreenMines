import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const ReportDisplay = ({ report }) => {
    if (!report) return null;

    // Remove asterisks and extra formatting
    const cleanReport = report
        .replace(/\*+/g, '') // Remove asterisks
        .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
        .trim();

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                mt: 3, 
                backgroundColor: '#f4f4f4' 
            }}
        >
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    fontWeight: 'bold', 
                    color: '#333', 
                    marginBottom: 2 
                }}
            >
                Environmental Impact Report
            </Typography>
            <Box 
                sx={{ 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '1rem', 
                    lineHeight: 1.6, 
                    color: '#555',
                    '& > *': {
                        marginBottom: 2
                    }
                }}
            >
                {cleanReport}
            </Box>
        </Paper>
    );
};

export default ReportDisplay;