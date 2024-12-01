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
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4'
        });

        // Get page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Function to capture full element image
        const captureFullElementImage = async (element, options = {}) => {
            if (!element) return null;
            
            try {
                // Clone the element to avoid modifying original
                const clonedElement = element.cloneNode(true);
                
                // Temporarily add to body to ensure full rendering
                document.body.appendChild(clonedElement);
                
                // Adjust clone styles for full visibility
                clonedElement.style.position = 'absolute';
                clonedElement.style.left = '0';
                clonedElement.style.top = '0';
                clonedElement.style.width = 'auto';
                clonedElement.style.height = 'auto';
                clonedElement.style.overflow = 'visible';
                
                // Capture with high-quality settings
                const canvas = await html2canvas(clonedElement, {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    foreignObjectRendering: true,
                    backgroundColor: '#ffffff',
                    ...options
                });

                // Remove cloned element
                document.body.removeChild(clonedElement);
                
                return canvas.toDataURL('image/png');
            } catch (error) {
                console.error('Error capturing full element:', error);
                return null;
            }
        };

        // Clean and format report text
        const cleanContent = reportContent
            .replace(/\*+/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        // Capture specific elements
        const capturedImages = {
            entries: null,
            charts: null
        };

        // Separate capture for entries and charts
        if (statsRef?.current) {
            // Split the stats ref into entries and charts
            const statsElement = statsRef.current;
            
            // Find entries and charts sections
            const entriesSection = statsElement.querySelector('[data-testid="entries-section"]') || 
                                   statsElement.children[0];
            const chartsSection = statsElement.querySelector('[data-testid="charts-section"]') || 
                                  statsElement.children[1];

            // Capture entries
            if (entriesSection) {
                capturedImages.entries = await captureFullElementImage(entriesSection);
            }

            // Capture charts section
            if (chartsSection) {
                capturedImages.charts = await captureFullElementImage(chartsSection);
            }
        }

        // Create first page with report title and key information
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Environmental Impact Report', pageWidth/2, 100, {align: 'center'});

        // Add report type
        pdf.setFontSize(20);
        pdf.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, pageWidth/2, 150, {align: 'center'});

        // Add date
        pdf.setFontSize(12);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth/2, 200, {align: 'center'});

        // Add brief summary or key highlights
        pdf.setFontSize(20);
        const summaryLines = [
            'This report provides a comprehensive analysis of',
            'environmental impact, including emissions from',
            'various sources and carbon sequestration efforts.'
        ];
        summaryLines.forEach((line, index) => {
            pdf.text(line, pageWidth/2, 250 + (index * 20), {align: 'center'});
        });

        // Add captured images
        if (capturedImages.entries) {
            pdf.addPage();
            pdf.addImage(
                capturedImages.entries, 
                'PNG', 
                0, 
                0, 
                pageWidth, 
                pageHeight, 
                undefined, 
                'FAST'
            );
        }

        if (capturedImages.charts) {
            pdf.addPage();
            pdf.addImage(
                capturedImages.charts, 
                'PNG', 
                0, 
                0, 
                pageWidth, 
                pageHeight, 
                undefined, 
                'FAST'
            );
        }

        // Add text report
        pdf.addPage();
        const splitText = pdf.splitTextToSize(cleanContent, pageWidth - 40);
        const linesPerPage = Math.floor((pageHeight - 40) / 15);
        
        for (let i = 0; i < splitText.length; i += linesPerPage) {
            if (i > 0) pdf.addPage();
            
            pdf.text(
                splitText.slice(i, i + linesPerPage), 
                20, 
                40
            );
        }

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