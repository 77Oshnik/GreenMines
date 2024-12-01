import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const ReportDisplay = ({ report }) => {
    if (!report) return null;

    // Remove asterisks and extra formatting
    const cleanReport = report
        .replace(/\*+/g, '') // Remove asterisks
        .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
        .trim();

    // Function to render text with dynamic styling
    const renderFormattedText = (text) => {
        const lines = text.split('\n');
        const formattedContent = [];
        let currentParagraph = [];

        lines.forEach((line, index) => {
            // Detect different types of content
            const isMainHeading = /^[A-Z][A-Z\s]+$/.test(line);
            const isSubHeading = line.trim().startsWith('###');

            // Handle existing paragraph before adding new content
            if (currentParagraph.length > 0 && (isMainHeading || isSubHeading)) {
                formattedContent.push(
                    <Typography 
                        key={`para-${formattedContent.length}`}
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.1rem', 
                            lineHeight: 1.7, 
                            color: '#333', 
                            marginBottom: 2 
                        }}
                    >
                        {currentParagraph.join(' ')}
                    </Typography>
                );
                currentParagraph = [];
            }

            // Add different types of content
            if (isMainHeading) {
                formattedContent.push(
                    <Typography 
                        key={index} 
                        variant="h3" 
                        sx={{ 
                            fontSize: '2rem', 
                            fontWeight: 'bold', 
                            color: '#2c3e50', 
                            marginBottom: 2,
                            marginTop: 3,
                            borderBottom: '2px solid #2c3e50',
                            paddingBottom: 1
                        }}
                    >
                        {line}
                    </Typography>
                );
            } else if (isSubHeading) {
                // Remove '###' and trim the line
                const cleanedSubHeading = line.replace(/^#+\s*/, '').trim();
                
                formattedContent.push(
                    <Typography 
                        key={index} 
                        variant="h4" 
                        sx={{ 
                            fontSize: '1.4rem', 
                            fontWeight: 'bold', 
                            color: '#34495e', 
                            marginBottom: 2,
                            marginTop: 2,
                            backgroundColor: '#f0f0f0',
                            padding: 1,
                            borderLeft: '4px solid #3498db',
                            borderRadius: 1
                        }}
                    >
                        {cleanedSubHeading}
                    </Typography>
                );
            } else if (line.trim() !== '') {
                // Collect paragraphs
                currentParagraph.push(line.trim());
            }
        });

        // Add final paragraph if exists
        if (currentParagraph.length > 0) {
            formattedContent.push(
                <Typography 
                    key={`final-para`}
                    variant="body1" 
                    sx={{ 
                        fontSize: '1.1rem', 
                        lineHeight: 1.7, 
                        color: '#333', 
                        marginBottom: 2 
                    }}
                >
                    {currentParagraph.join(' ')}
                </Typography>
            );
        }

        return formattedContent;
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 4, 
                mt: 3, 
                backgroundColor: '#f4f4f4' 
            }}
        >
            <Typography 
                variant="h2" 
                sx={{ 
                    fontWeight: 'bold', 
                    color: '#333', 
                    marginBottom: 3,
                    fontSize: '3rem',
                    textAlign: 'center',
                    borderBottom: '4px solid #333',
                    paddingBottom: 2
                }}
            >
                Environmental Impact Report
            </Typography>
            <Box 
                sx={{ 
                    whiteSpace: 'pre-wrap', 
                    color: '#555'
                }}
            >
                {renderFormattedText(cleanReport)}
            </Box>
        </Paper>
    );
};

export default ReportDisplay;