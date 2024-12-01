// pages/EnvironmentalReportPage.jsx
import React, { useState } from 'react';
import { Container, Alert, CircularProgress, Box } from '@mui/material';
import ReportGenerator from '../Components/EnvironmentalReport/ReportGenerator';
import ReportDisplay from '../Components/EnvironmentalReport/ReportDisplay';
import ReportStats from '../Components/EnvironmentalReport/ReportStats';
import { 
    fetchDailyEnvironmentalReport, 
    fetchMonthlyEnvironmentalReport, 
    fetchWeeklyEnvironmentalReport 
} from '../services/environmentalReportService';

const EnvironmentalReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState(null);

    const handleGenerateReport = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const response = type === 'daily' 
                ? await fetchDailyEnvironmentalReport()
                : type === 'weekly'
                ? await fetchWeeklyEnvironmentalReport()
                : await fetchMonthlyEnvironmentalReport();
            setReportData(response);
        } catch (error) {
            setError('Failed to generate report. Please try again.');
            console.error('Report generation error:', error);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <ReportGenerator onGenerateReport={handleGenerateReport} />
                
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                
                {error && (
                    <Alert severity="error" sx={{ my: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {reportData && (
                    <>
                        <ReportStats data={reportData.data} />
                        <ReportDisplay report={reportData.report} />
                    </>
                )}
            </Box>
        </Container>
    );
};

export default EnvironmentalReportPage;