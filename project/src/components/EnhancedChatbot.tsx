import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';
import { SustainabilityMetrics } from '../types/sustainability';

interface EnhancedChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: SustainabilityMetrics | null;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  metrics?: {
    value: number;
    unit: string;
    change: string;
  };
}

export const EnhancedChatbot: React.FC<EnhancedChatbotProps> = ({ isOpen, onClose, analysisData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI sustainability advisor. I can help you understand your environmental data, suggest cost-effective improvements, and answer questions about ESG reporting. What would you like to explore?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "Analyze my energy trends",
        "Cost-effective carbon reduction tips",
        "Explain my ESG score",
        "Water conservation strategies"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAdvancedResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('energy') && (message.includes('trend') || message.includes('change') || message.includes('usage'))) {
      const energyData = analysisData?.trends.energy || [1200, 1180, 1250, 1220, 1250];
      const currentUsage = energyData[energyData.length - 1];
      const previousUsage = energyData[energyData.length - 2];
      const change = ((currentUsage - previousUsage) / previousUsage * 100).toFixed(1);
      
      return {
        id: Date.now().toString(),
        text: `Your energy consumption analysis shows interesting patterns. This month you used ${currentUsage} kWh, which is a ${change}% ${parseFloat(change) > 0 ? 'increase' : 'decrease'} from last month.\n\n**Key Insights:**\n• Peak usage occurs during 2-4 PM (likely AC load)\n• Weekend consumption is 25% lower\n• Your energy intensity is 0.85 kWh/₹ revenue\n\n**Cost-saving opportunities:**\n• Time-of-use optimization could save ₹2,400/month\n• LED retrofit: ₹3,200/month savings\n• Smart thermostat: ₹1,800/month savings`,
        isBot: true,
        timestamp: new Date(),
        metrics: {
          value: currentUsage,
          unit: 'kWh',
          change: `${change}%`
        },
        suggestions: [
          "Show me LED retrofit ROI",
          "Peak hour optimization tips",
          "Compare with industry benchmark"
        ]
      };
    }
    
    if (message.includes('carbon') || message.includes('emission')) {
      const carbonData = analysisData?.carbonFootprint || 2.4;
      return {
        id: Date.now().toString(),
        text: `Your carbon footprint analysis reveals actionable insights:\n\n**Current Status:** ${carbonData} tCO₂e/month\n**Sector Comparison:** 15% below industry median (excellent!)\n\n**Emission Breakdown:**\n🔌 Electricity: 60% (1.44 tCO₂e)\n🚗 Transportation: 25% (0.6 tCO₂e)\n💧 Water treatment: 10% (0.24 tCO₂e)\n🗑️ Waste: 5% (0.12 tCO₂e)\n\n**Quick Wins for Reduction:**\n1. **Solar installation** → 40% electricity emission cut\n2. **EV transition** → 80% transport emission cut\n3. **Waste segregation** → 50% waste emission cut\n\n**Financial Impact:** These changes could save ₹45,000/year while reducing emissions by 35%.`,
        isBot: true,
        timestamp: new Date(),
        metrics: {
          value: carbonData,
          unit: 'tCO₂e',
          change: '-15%'
        },
        suggestions: [
          "Calculate solar panel ROI",
          "EV transition timeline",
          "Waste reduction program"
        ]
      };
    }
    
    if (message.includes('cost') && (message.includes('reduce') || message.includes('save') || message.includes('low'))) {
      return {
        id: Date.now().toString(),
        text: `Here are **proven low-cost sustainability measures** with immediate ROI:\n\n**🏆 Top 3 Quick Wins:**\n\n**1. Smart Power Strips (₹2,000 investment)**\n• Eliminates phantom loads\n• Saves: ₹800/month\n• Payback: 2.5 months\n\n**2. Water Leak Detection (₹1,500 investment)**\n• Smart sensors for early detection\n• Saves: ₹600/month\n• Payback: 2.5 months\n\n**3. Waste Segregation System (₹3,000 investment)**\n• Reduces disposal costs\n• Saves: ₹1,200/month\n• Payback: 2.5 months\n\n**💡 Behavioral Changes (₹0 investment):**\n• AC temperature +2°C → ₹1,500/month savings\n• Lights-off policy → ₹800/month savings\n• Print reduction → ₹400/month savings\n\n**Total potential savings: ₹5,300/month with ₹6,500 investment!**`,
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          "Create implementation timeline",
          "Calculate total ROI",
          "Employee engagement tips"
        ]
      };
    }
    
    if (message.includes('water')) {
      const waterData = analysisData?.waterConsumption || 850;
      return {
        id: Date.now().toString(),
        text: `Your water usage analysis shows optimization opportunities:\n\n**Current Consumption:** ${waterData}L/month\n**Benchmark Status:** 18% above sector median\n**Cost Impact:** ₹${Math.round(waterData * 0.05)}/month\n\n**Smart Conservation Strategies:**\n\n**🔧 Technical Solutions:**\n• Low-flow fixtures → 30% reduction\n• Leak detection system → 15% savings\n• Rainwater harvesting → 25% offset\n\n**📊 Usage Patterns:**\n• Peak usage: 9-11 AM (cleaning)\n• Efficiency opportunity: Restroom fixtures\n• Potential savings: ₹1,800/month\n\n**🎯 Action Plan:**\n1. Install aerators (₹500) → ₹600/month savings\n2. Fix identified leaks → ₹400/month savings\n3. Employee awareness → ₹300/month savings`,
        isBot: true,
        timestamp: new Date(),
        metrics: {
          value: waterData,
          unit: 'L',
          change: '+18%'
        },
        suggestions: [
          "Rainwater harvesting feasibility",
          "Leak detection setup",
          "Employee water conservation tips"
        ]
      };
    }
    
    if (message.includes('esg') || message.includes('score')) {
      const esgScore = analysisData?.esgScore || 72;
      return {
        id: Date.now().toString(),
        text: `Your ESG score breakdown and improvement roadmap:\n\n**Current Score: ${esgScore}/100** (Good tier)\n\n**📊 Component Analysis:**\n• **Environmental (E):** 75/100 ⭐\n• **Social (S):** 68/100 ⚠️\n• **Governance (G):** 73/100 ✅\n\n**🎯 Score Improvement Strategy:**\n\n**Quick Wins (+8-12 points):**\n• Energy efficiency program → +5 points\n• Waste reduction initiative → +3 points\n• Water conservation → +4 points\n\n**Medium-term (+10-15 points):**\n• Employee sustainability training → +6 points\n• Supply chain assessment → +5 points\n• Community engagement → +4 points\n\n**Target: 85+ score in 6 months**\nThis would place you in the "Excellent" tier and improve access to green financing options.`,
        isBot: true,
        timestamp: new Date(),
        metrics: {
          value: esgScore,
          unit: '/100',
          change: 'Good'
        },
        suggestions: [
          "Create ESG improvement plan",
          "Employee training program",
          "Green financing options"
        ]
      };
    }
    
    if (message.includes('benchmark') || message.includes('compare') || message.includes('industry')) {
      return {
        id: Date.now().toString(),
        text: `**Industry Benchmarking Analysis** for your sector:\n\n**🏭 Your Performance vs. MSME Median:**\n\n**Energy Intensity:**\n• You: 0.85 kWh/₹ revenue\n• Median: 1.02 kWh/₹ revenue\n• **17% better than peers** ✅\n\n**Carbon Intensity:**\n• You: 0.12 tCO₂e/₹ revenue\n• Median: 0.14 tCO₂e/₹ revenue\n• **14% better than peers** ✅\n\n**Water Efficiency:**\n• You: 4.2 L/₹ revenue\n• Median: 3.6 L/₹ revenue\n• **18% higher than median** ⚠️\n\n**Waste Generation:**\n• You: 0.22 kg/₹ revenue\n• Median: 0.28 kg/₹ revenue\n• **21% better than peers** ✅\n\n**🎯 Ranking:** Top 25% in your sector\n**Improvement Focus:** Water efficiency for top 10% ranking`,
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          "Water efficiency improvement plan",
          "Top 10% achievement roadmap",
          "Sector-specific best practices"
        ]
      };
    }
    
    if (message.includes('help') || message.includes('what can you')) {
      return {
        id: Date.now().toString(),
        text: `I'm your comprehensive sustainability advisor! Here's how I can help:\n\n**📊 Data Analysis:**\n• Trend analysis and pattern recognition\n• Benchmark comparisons with industry peers\n• Cost-benefit analysis of improvements\n\n**💡 Smart Recommendations:**\n• Personalized efficiency measures\n• ROI calculations for green investments\n• Implementation timelines and priorities\n\n**🎯 Goal Setting:**\n• ESG score improvement strategies\n• Carbon reduction pathways\n• Cost-saving opportunities\n\n**📈 Reporting Support:**\n• ESG report explanations\n• Compliance guidance\n• Investor-ready metrics\n\n**🔍 Ask me specific questions like:**\n• "What's my biggest emission source?"\n• "How much can solar panels save me?"\n• "Create a 6-month sustainability plan"\n• "Explain my water usage patterns"`,
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          "Create 6-month sustainability plan",
          "Solar panel feasibility study",
          "Biggest emission source analysis"
        ]
      };
    }
    
    return {
      id: Date.now().toString(),
      text: `I understand you're interested in sustainability topics. Let me provide some context-aware insights based on your data.\n\n**Your Current Sustainability Profile:**\n• ESG Score: ${analysisData?.esgScore || 72}/100\n• Carbon Footprint: ${analysisData?.carbonFootprint || 2.4} tCO₂e\n• Energy Efficiency: Above sector median\n• Water Usage: Optimization opportunity identified\n\n**💬 Try asking me:**\n• "How can I reduce my carbon footprint by 25%?"\n• "What are my peak energy usage hours?"\n• "Calculate ROI for LED lighting upgrade"\n• "Create a waste reduction strategy"\n\nI'm here to provide data-driven, cost-effective sustainability solutions tailored to your business!`,
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "Reduce carbon footprint by 25%",
        "LED lighting ROI calculation",
        "Peak energy usage analysis"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = generateAdvancedResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50"
      >
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-lg shadow-2xl w-full max-w-lg h-[600px] flex flex-col"
        >
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <span className="font-semibold">AI Sustainability Advisor</span>
                <p className="text-xs text-green-100">Powered by advanced ESG analytics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isBot ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {message.isBot ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.isBot 
                        ? 'bg-gray-50 text-gray-900 border border-gray-200' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                      
                      {/* Metrics Display */}
                      {message.metrics && (
                        <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Current Value</span>
                            <span className="text-xs text-gray-500">Change</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              {message.metrics.value.toLocaleString()} {message.metrics.unit}
                            </span>
                            <span className={`text-sm font-medium ${
                              message.metrics.change.startsWith('+') ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {message.metrics.change}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs text-gray-500 mb-2">💡 Try asking:</p>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
                            >
                              • {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-2 max-w-xs">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Analyzing your data...</p>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about energy trends, cost savings, ESG scores..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Lightbulb className="h-3 w-3" />
                <span>Smart insights</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>Trend analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-3 w-3" />
                <span>Goal tracking</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};