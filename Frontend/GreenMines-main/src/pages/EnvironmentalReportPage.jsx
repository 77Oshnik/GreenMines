import React, { useState, useRef } from 'react';
import { Container, Alert, CircularProgress, Box, Grid } from '@mui/material';
import ReportGenerator from '../Components/EnvironmentalReport/ReportGenerator';
import ReportDisplay from '../Components/EnvironmentalReport/ReportDisplay';
import ReportStats from '../Components/EnvironmentalReport/ReportStats';
import PDFDownloadButton from '../Components/EnvironmentalReport/PDFDownloadButton';
import { 
    fetchDailyEnvironmentalReport, 
    fetchMonthlyEnvironmentalReport, 
    fetchWeeklyEnvironmentalReport 
} from '../services/environmentalReportService';

const EnvironmentalReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [currentReportType, setCurrentReportType] = useState('daily');

    // Create refs for charts and stats
    const donutChartRef = useRef(null);
    const barGraphRef = useRef(null);
    const lineGraphRef = useRef(null);
    const statsRef = useRef(null);

    const handleGenerateReport = async (type) => {
        setLoading(true);
        setError(null);
        setCurrentReportType(type);

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
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <PDFDownloadButton 
                                    reportContent={reportData.report}
                                    reportType={currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)}
                                    chartRefs={[
                                        donutChartRef, 
                                        barGraphRef, 
                                        lineGraphRef
                                    ]}
                                    statsRef={statsRef}
                                />
                            </Grid>
                        </Grid>

                        <div ref={statsRef}>
                            <ReportStats 
                                data={reportData.data} 
                                reportType={currentReportType}
                                chartRefs={{
                                    donutChartRef,
                                    barGraphRef,
                                    lineGraphRef
                                }}
                            />
                        </div>
                        <ReportDisplay report={reportData.report} />
                    </>
                )}
            </Box>
        </Container>
    );
};

export default EnvironmentalReportPage;