import React from 'react';
import { Download, Award, TrendingUp, Target, Users } from 'lucide-react';
import { PDFGenerator } from '../utils/pdfGenerator';

interface ReportsProps {
  data: {
    carbonFootprint: number;
    energyUsage: number;
    waterConsumption: number;
    wasteGeneration: number;
    esgScore: number;
  };
}

export const Reports: React.FC<ReportsProps> = ({ data }) => {
  const generateReport = async () => {
    try {
      await PDFGenerator.generateSustainabilityReport(data);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const generateCertificate = async () => {
    try {
      await PDFGenerator.generateCertificate(data);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    }
  };

  const getSustainabilityGrade = (score: number): { grade: string; color: string; description: string } => {
    if (score >= 80) return { grade: 'A+', color: 'text-green-600', description: 'Excellent' };
    if (score >= 70) return { grade: 'A', color: 'text-green-500', description: 'Good' };
    if (score >= 60) return { grade: 'B', color: 'text-yellow-600', description: 'Fair' };
    if (score >= 50) return { grade: 'C', color: 'text-orange-600', description: 'Needs Improvement' };
    return { grade: 'D', color: 'text-red-600', description: 'Poor' };
  };

  const gradeInfo = getSustainabilityGrade(data.esgScore);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sustainability Report</h1>
        <p className="text-lg text-gray-600">
          Comprehensive analysis of your environmental performance and recommendations
        </p>
      </div>

      {/* Certificate-style Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white mb-8">
        <div className="text-center">
          <Award className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Green Positive Certification</h2>
          <p className="text-xl mb-4">Deepwoods Green Initiatives Pvt Ltd</p>
          <div className="inline-flex items-center bg-white/20 rounded-lg px-6 py-3">
            <span className="text-2xl font-bold mr-2">Grade: {gradeInfo.grade}</span>
            <span className="text-lg">({gradeInfo.description})</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-6 w-6 mr-2 text-green-600" />
          Executive Summary
        </h3>
        <div className="prose text-gray-700">
          <p className="mb-4">
            Based on our comprehensive analysis of your uploaded documents and data, your organization 
            demonstrates a <strong className={gradeInfo.color}>{gradeInfo.description.toLowerCase()}</strong> level 
            of sustainability performance with an ESG score of <strong>{data.esgScore}/100</strong>.
          </p>
          <p className="mb-4">
            Your current carbon footprint stands at <strong>{data.carbonFootprint} tCO₂e</strong>, 
            with energy consumption of <strong>{data.energyUsage.toLocaleString()} kWh</strong> and 
            water usage of <strong>{data.waterConsumption.toLocaleString()} liters</strong>.
          </p>
          <p>
            Our analysis indicates significant opportunities for improvement, particularly in energy 
            efficiency and water conservation, which could reduce your environmental impact by up to 35%.
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Performance Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Carbon Management</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Energy Efficiency</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Water Conservation</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium">60%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Waste Management</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium">80%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Peer Benchmarking
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">Better than 68% of peers</span>
                <span className="text-sm text-green-600">Carbon Intensity</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-yellow-800">18% higher than median</span>
                <span className="text-sm text-yellow-600">Energy per Unit</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">Better than 45% of peers</span>
                <span className="text-sm text-blue-600">Water Efficiency</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals and Recommendations */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Goals for 2025</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Carbon Reduction</h4>
            <p className="text-3xl font-bold text-green-600 mb-1">-25%</p>
            <p className="text-sm text-green-700">Target: 1.8 tCO₂e</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Energy Efficiency</h4>
            <p className="text-3xl font-bold text-blue-600 mb-1">-30%</p>
            <p className="text-sm text-blue-700">Target: 875 kWh</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Waste Reduction</h4>
            <p className="text-3xl font-bold text-orange-600 mb-1">-40%</p>
            <p className="text-sm text-orange-700">Target: 27 kg</p>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Immediate Action Items</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="font-medium text-gray-900">Conduct Energy Audit</h4>
              <p className="text-sm text-gray-600">Identify equipment inefficiencies and upgrade opportunities</p>
              <span className="text-xs text-green-600 font-medium">Potential impact: 20% energy reduction</span>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="font-medium text-gray-900">Install Smart Water Meters</h4>
              <p className="text-sm text-gray-600">Monitor usage patterns and detect leaks early</p>
              <span className="text-xs text-blue-600 font-medium">Potential impact: 15% water savings</span>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="font-medium text-gray-900">Implement Waste Segregation</h4>
              <p className="text-sm text-gray-600">Set up proper recycling and composting systems</p>
              <span className="text-xs text-orange-600 font-medium">Potential impact: 35% waste diversion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={generateReport}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Full Report (PDF)
          </button>
          <button
            onClick={generateCertificate}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Award className="h-5 w-5 mr-2" />
            Download Certificate (PDF)
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Complete detailed analysis with technical specifications and sustainability certificate
        </p>
      </div>
    </div>
  );
};