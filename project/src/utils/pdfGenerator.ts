import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SustainabilityMetrics } from '../types/sustainability';

export class PDFGenerator {
  static async generateSustainabilityReport(data: SustainabilityMetrics): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35);
    };

    // Header with logo and title
    pdf.setFillColor(5, 150, 105); // Green color
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🌱 Sustainability Report', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Deepwoods Green Initiatives Pvt Ltd', 20, 32);

    // Reset text color
    pdf.setTextColor(0, 0, 0);
    yPosition = 50;

    // Executive Summary Section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const summaryText = `Based on our comprehensive analysis of your uploaded documents and data, your organization demonstrates a good level of sustainability performance with an ESG score of ${data.esgScore}/100. Your current carbon footprint stands at ${data.carbonFootprint} tCO₂e, with energy consumption of ${data.energyUsage.toLocaleString()} kWh and water usage of ${data.waterConsumption.toLocaleString()} liters.`;
    yPosition = addText(summaryText, 20, yPosition, pageWidth - 40);
    yPosition += 10;

    // Key Metrics Section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Performance Metrics', 20, yPosition);
    yPosition += 15;

    // Metrics table
    const metrics = [
      ['Metric', 'Current Value', 'Unit', 'Benchmark'],
      ['ESG Score', data.esgScore.toString(), '/100', 'Good'],
      ['Carbon Footprint', data.carbonFootprint.toString(), 'tCO₂e', '15% below median'],
      ['Energy Usage', data.energyUsage.toLocaleString(), 'kWh', '17% better than peers'],
      ['Water Consumption', data.waterConsumption.toLocaleString(), 'L', '18% higher than median'],
      ['Waste Generation', data.wasteGeneration.toString(), 'kg', '21% better than peers']
    ];

    // Draw table
    const cellWidth = (pageWidth - 40) / 4;
    const cellHeight = 8;
    
    metrics.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = 20 + (colIndex * cellWidth);
        const y = yPosition + (rowIndex * cellHeight);
        
        // Header row styling
        if (rowIndex === 0) {
          pdf.setFillColor(240, 240, 240);
          pdf.rect(x, y - 2, cellWidth, cellHeight, 'F');
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }
        
        pdf.setFontSize(9);
        pdf.text(cell, x + 2, y + 4);
        
        // Draw cell border
        pdf.rect(x, y - 2, cellWidth, cellHeight);
      });
    });
    
    yPosition += (metrics.length * cellHeight) + 15;

    // Performance Breakdown Section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Performance Breakdown', 20, yPosition);
    yPosition += 15;

    const performanceData = [
      { category: 'Carbon Management', score: 75, color: [16, 185, 129] },
      { category: 'Energy Efficiency', score: 65, color: [245, 158, 11] },
      { category: 'Water Conservation', score: 60, color: [59, 130, 246] },
      { category: 'Waste Management', score: 80, color: [249, 115, 22] }
    ];

    performanceData.forEach((item, index) => {
      const barY = yPosition + (index * 12);
      
      // Category name
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(item.category, 20, barY + 4);
      
      // Progress bar background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(100, barY, 80, 6, 'F');
      
      // Progress bar fill
      pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      pdf.rect(100, barY, (80 * item.score) / 100, 6, 'F');
      
      // Score text
      pdf.text(`${item.score}%`, 185, barY + 4);
    });
    
    yPosition += (performanceData.length * 12) + 15;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    // Recommendations Section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommended Actions', 20, yPosition);
    yPosition += 15;

    const recommendations = [
      {
        title: 'Conduct Energy Audit',
        description: 'Identify equipment inefficiencies and upgrade opportunities',
        impact: 'Potential impact: 20% energy reduction'
      },
      {
        title: 'Install Smart Water Meters',
        description: 'Monitor usage patterns and detect leaks early',
        impact: 'Potential impact: 15% water savings'
      },
      {
        title: 'Implement Waste Segregation',
        description: 'Set up proper recycling and composting systems',
        impact: 'Potential impact: 35% waste diversion'
      }
    ];

    recommendations.forEach((rec, index) => {
      // Recommendation box
      pdf.setFillColor(248, 250, 252);
      pdf.rect(20, yPosition - 2, pageWidth - 40, 20, 'F');
      pdf.rect(20, yPosition - 2, pageWidth - 40, 20);
      
      // Number circle
      pdf.setFillColor(5, 150, 105);
      pdf.circle(30, yPosition + 8, 4, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text((index + 1).toString(), 28, yPosition + 10);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      
      // Title
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(rec.title, 40, yPosition + 5);
      
      // Description
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(rec.description, 40, yPosition + 10);
      
      // Impact
      pdf.setFontSize(8);
      pdf.setTextColor(5, 150, 105);
      pdf.text(rec.impact, 40, yPosition + 15);
      pdf.setTextColor(0, 0, 0);
      
      yPosition += 25;
    });

    // Footer
    yPosition = pageHeight - 30;
    pdf.setFillColor(5, 150, 105);
    pdf.rect(0, yPosition, pageWidth, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Generated by AI Sustainability Analyzer', 20, yPosition + 10);
    pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, yPosition + 18);
    pdf.text('Deepwoods Green Initiatives Pvt Ltd', 20, yPosition + 26);

    // Save the PDF
    pdf.save('Sustainability_Report.pdf');
  }

  static async generateCertificate(data: SustainabilityMetrics): Promise<void> {
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Certificate background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    pdf.setLineWidth(2);
    pdf.setDrawColor(5, 150, 105);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Inner border
    pdf.setLineWidth(1);
    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Header
    pdf.setTextColor(5, 150, 105);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    const title = 'SUSTAINABILITY CERTIFICATE';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 40);

    // Subtitle
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    const subtitle = 'Green Positive Certification';
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 55);

    // Company name
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const companyName = 'Deepwoods Green Initiatives Pvt Ltd';
    const companyWidth = pdf.getTextWidth(companyName);
    pdf.text(companyName, (pageWidth - companyWidth) / 2, 80);

    // Achievement text
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    const achievementText = 'has demonstrated exceptional commitment to environmental sustainability';
    const achievementWidth = pdf.getTextWidth(achievementText);
    pdf.text(achievementText, (pageWidth - achievementWidth) / 2, 95);

    // ESG Score
    pdf.setFontSize(48);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(5, 150, 105);
    const scoreText = `${data.esgScore}/100`;
    const scoreWidth = pdf.getTextWidth(scoreText);
    pdf.text(scoreText, (pageWidth - scoreWidth) / 2, 130);

    // Grade
    const getGrade = (score: number) => {
      if (score >= 80) return 'A+';
      if (score >= 70) return 'A';
      if (score >= 60) return 'B';
      return 'C';
    };

    pdf.setFontSize(24);
    const grade = `Grade: ${getGrade(data.esgScore)}`;
    const gradeWidth = pdf.getTextWidth(grade);
    pdf.text(grade, (pageWidth - gradeWidth) / 2, 150);

    // Date and signature area
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const date = `Date: ${new Date().toLocaleDateString()}`;
    pdf.text(date, 50, pageHeight - 40);
    
    pdf.text('Authorized by:', pageWidth - 100, pageHeight - 50);
    pdf.text('AI Sustainability Analyzer', pageWidth - 100, pageHeight - 40);

    // Save certificate
    pdf.save('Sustainability_Certificate.pdf');
  }
}