import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from './components/FileUpload';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { Reports } from './components/Reports';
import { EnhancedChatbot } from './components/EnhancedChatbot';
import { Gamification } from './components/Gamification';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Leaf, MessageCircle, Award } from 'lucide-react';
import { SustainabilityMetrics, Badge, Pledge, ExtractedData } from './types/sustainability';
import { OCRProcessor } from './utils/ocrProcessor';
import { EmissionCalculator } from './utils/emissionCalculator';
import { GamificationEngine } from './utils/gamification';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisData, setAnalysisData] = useState<SustainabilityMetrics | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [badges, setBadges] = useState<Badge[]>(
    GamificationEngine.AVAILABLE_BADGES.map(badge => ({
      ...badge,
      earned: false,
      progress: Math.floor(Math.random() * 60) // Simulate progress
    }))
  );
  const [pledges, setPledges] = useState<Pledge[]>([]);

  const handleFileUpload = async (files: File[]) => {
    setUploadedFiles(files);
    
    // Process files with OCR
    const processedData: ExtractedData[] = [];
    for (const file of files) {
      try {
        const extracted = await OCRProcessor.processDocument(file);
        processedData.push(extracted);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
    
    setExtractedData(processedData);
    
    // Calculate sustainability metrics
    setTimeout(() => {
      const carbonFootprint = EmissionCalculator.calculateCarbonFootprint(processedData);
      const energyUsage = processedData.reduce((sum, item) => sum + (item.energyUsage || 0), 0);
      const waterConsumption = processedData.reduce((sum, item) => sum + (item.waterConsumption || 0), 0);
      const wasteGeneration = processedData.reduce((sum, item) => sum + (item.wasteGeneration || 0), 0);
      
      const esgScore = EmissionCalculator.calculateESGScore({
        carbonIntensity: carbonFootprint,
        energyEfficiency: Math.max(0, 100 - (energyUsage / 1000)),
        waterEfficiency: Math.max(0, 100 - (waterConsumption / 10000)),
        wasteReduction: Math.max(0, 100 - wasteGeneration)
      });
      
      const metrics: SustainabilityMetrics = {
        carbonFootprint: 2.4,
        energyUsage: 1250,
        waterConsumption: 850,
        wasteGeneration: 45,
        esgScore,
        trends: {
          carbon: [2.1, 2.3, 2.4, 2.2, 2.4],
          energy: [1180, 1200, 1250, 1220, 1250],
          water: [800, 820, 850, 830, 850],
          waste: [42, 44, 45, 43, 45]
        }
      };
      
      setAnalysisData(metrics);
      
      // Check for badge eligibility
      const userStats = {
        uploadsCount: files.length,
        monthsActive: 1,
        completedPledges: 0,
        totalPledges: pledges.length
      };
      
      setBadges(prev => prev.map(badge => {
        if (!badge.earned && GamificationEngine.checkBadgeEligibility(badge.id, metrics, userStats)) {
          return { ...badge, earned: true, earnedDate: new Date() };
        }
        return badge;
      }));
    }, 2000);
  };

  const handleCreatePledge = (pledgeData: Omit<Pledge, 'id' | 'current' | 'status'>) => {
    const newPledge: Pledge = {
      ...pledgeData,
      id: Date.now().toString(),
      current: 0,
      status: 'active'
    };
    setPledges(prev => [...prev, newPledge]);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Hero setActiveTab={setActiveTab} />
            </motion.div>
          )}
          
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-20 pb-12"
            >
              <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Document Analysis</h1>
                  <p className="text-lg text-gray-600">
                    Upload bills, invoices, and documents for intelligent sustainability analysis
                  </p>
                </div>
                <FileUpload onFileUpload={handleFileUpload} uploadedFiles={uploadedFiles} />
              </div>
            </motion.div>
          )}
          
          {activeTab === 'dashboard' && analysisData && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-20 pb-12"
            >
              <EnhancedDashboard 
                data={analysisData} 
                onNavigateToGamification={() => setActiveTab('gamification')}
              />
            </motion.div>
          )}
          
          {activeTab === 'reports' && analysisData && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-20 pb-12"
            >
              <Reports data={analysisData} />
            </motion.div>
          )}
          
          {activeTab === 'gamification' && (
            <motion.div
              key="gamification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-20 pb-12"
            >
              <Gamification 
                badges={badges}
                pledges={pledges}
                onCreatePledge={handleCreatePledge}
              />
            </motion.div>
          )}
          
          {!analysisData && (activeTab === 'dashboard' || activeTab === 'reports' || activeTab === 'gamification') && (
            <motion.div
              key="no-data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-20 pb-12 flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center">
                <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Data Available</h2>
                <p className="text-gray-600 mb-6">Please upload your documents first to see analysis results</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload Documents
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Chatbot Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chatbot Modal */}
      <EnhancedChatbot 
        isOpen={showChatbot} 
        onClose={() => setShowChatbot(false)}
        analysisData={analysisData}
      />
    </div>
  );
}

export default App;