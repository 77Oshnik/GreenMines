import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFDownloadButton = ({ 
    reportContent, 
    reportType = 'Environmental', 
    chartRefs,
    statsRef,
    children 
}) => {
    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;

        // Clean and format report text
        const cleanContent = reportContent
            .replace(/\*+/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        // Function to capture element as image with error handling
        const captureElementAsImage = async (element) => {
            if (!element) return null;
            
            try {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    foreignObjectRendering: true
                });
                
                return canvas.toDataURL('image/png');
            } catch (error) {
                console.error('Error capturing element:', error);
                return null;
            }
        };

        // Capture all elements
        const capturedElements = await Promise.all([
            // Capture chart elements
            ...(chartRefs || []).map(ref => 
                ref.current ? captureElementAsImage(ref.current) : Promise.resolve(null)
            ),
            // Capture stats
            statsRef?.current ? captureElementAsImage(statsRef.current) : Promise.resolve(null)
        ]);

        // Add text report first
        pdf.setFontSize(12);
        const splitText = pdf.splitTextToSize(cleanContent, pageWidth - 2 * margin);
        
        // Add text across multiple pages
        const linesPerPage = Math.floor((pageHeight - 2 * margin) / 7);
        for (let i = 0; i < splitText.length; i += linesPerPage) {
            if (i > 0) pdf.addPage();
            
            pdf.text(
                splitText.slice(i, i + linesPerPage), 
                margin, 
                margin
            );
        }

        // Add captured elements
        capturedElements.forEach((imgData) => {
            if (!imgData) return;
            
            pdf.addPage();
            pdf.addImage(
                imgData, 
                'PNG', 
                margin, 
                margin, 
                pageWidth - 2 * margin, 
                pageHeight - 2 * margin,
                undefined,
                'FAST'
            );
        });

        // Add metadata
        pdf.setProperties({
            title: `${reportType} Environmental Report`,
            subject: 'Environmental Impact Analysis',
            author: 'GreenMines'
        });

        // Save PDF
        pdf.save(`GreenMines_${reportType}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <Button 
            variant="contained" 
            color="primary" 
            onClick={generatePDF}
            sx={{ 
                marginTop: 2, 
                marginBottom: 2  
            }}
        >
            {children || 'Download Full Report'}
        </Button>
    );
};

export default PDFDownloadButton;