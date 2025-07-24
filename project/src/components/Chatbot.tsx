import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: any;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, analysisData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your sustainability assistant. I can help you understand your environmental data and suggest improvements. What would you like to know?",
      isBot: true,
      timestamp: new Date()
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

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('energy') && message.includes('change')) {
      return "Based on your recent data, your energy usage has increased by 2% this month. This is primarily due to increased cooling costs. I recommend switching to LED lighting and optimizing your HVAC schedule to reduce consumption by up to 25%.";
    }
    
    if (message.includes('emissions') || message.includes('carbon')) {
      return "Your main emission sources are electricity consumption (60%) and transportation (25%). To reduce your carbon footprint, consider: 1) Installing solar panels, 2) Switching to electric vehicles for company transport, 3) Implementing a remote work policy to reduce commuting.";
    }
    
    if (message.includes('reduce') && message.includes('cost')) {
      return "Here are 3 low-cost ways to reduce your environmental impact: 1) **Switch to LED bulbs** - Save 75% on lighting costs, 2) **Fix water leaks** - Can save 10-15% on water bills, 3) **Implement paperless processes** - Reduce paper waste by 80% and save on printing costs.";
    }
    
    if (message.includes('water')) {
      return "Your water consumption is 18% higher than sector median. Consider installing water-efficient fixtures, fixing any leaks, and implementing rainwater harvesting. These measures could reduce your water usage by 30-40%.";
    }
    
    if (message.includes('waste')) {
      return "Your waste management is performing well with a 12% reduction this quarter. To further improve, implement a comprehensive recycling program and consider composting organic waste. This could divert 40% more waste from landfills.";
    }
    
    if (message.includes('score') || message.includes('esg')) {
      return `Your current ESG score is ${analysisData?.esgScore || 72}/100, which is considered 'Good'. To improve your score, focus on energy efficiency (could add 8-10 points) and waste reduction initiatives (could add 5-7 points).`;
    }
    
    if (message.includes('help') || message.includes('what can you')) {
      return "I can help you with: 📊 Understanding your sustainability metrics, 💡 Energy efficiency recommendations, 💧 Water conservation tips, ♻️ Waste reduction strategies, 🌱 Carbon footprint reduction, 📈 ESG score improvement, and 🎯 Setting sustainability goals.";
    }
    
    return "I understand you're asking about sustainability topics. Could you be more specific? For example, you could ask: 'How did my energy usage change?' or 'What are low-cost ways to reduce carbon footprint?' I'm here to help with all your environmental questions!";
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

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How did my energy usage change this month?",
    "Which process causes most emissions?",
    "Suggest 3 low-cost ways to reduce carbon footprint",
    "How can I improve my ESG score?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Sustainability Assistant</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isBot ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                  {message.isBot ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.isBot 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-blue-600 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-xs">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Try asking:</p>
            <div className="space-y-1">
              {suggestedQuestions.slice(0, 2).map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  className="text-xs text-blue-600 hover:text-blue-800 block text-left"
                >
                  • {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your sustainability data..."
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
        </div>
      </div>
    </div>
  );
};