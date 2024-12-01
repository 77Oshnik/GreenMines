import React, { useState } from 'react';
import { Container, Alert, CircularProgress } from '@mui/material';
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
                : await fetchMonthlyEnvironmentalReport(); // Handle monthly report
            setReportData(response);
        } catch (error) {
            setError('Failed to generate report. Please try again.');
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="lg">
            <ReportGenerator onGenerateReport={handleGenerateReport} />
            
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            
            {reportData && (
                <>
                    <ReportStats data={reportData.data} />
                    <ReportDisplay report={reportData.report} />
                </>
            )}
        </Container>
    );
};

export default EnvironmentalReportPage;