import React from 'react';
import { ArrowRight, Leaf, Zap, Droplets, Recycle } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <div className="pt-16">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 animate-pulse">
              <Leaf className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI-Powered Sustainability
              <br />
              <span className="text-green-200">For Your Business</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Transform your invoices and bills into actionable sustainability insights. 
              Track, analyze, and improve your environmental impact with AI.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center group transform hover:scale-105"
            >
              Start Analysis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Sustainability Reporting
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI platform extracts and analyzes sustainability data from your documents, 
              providing comprehensive ESG insights and actionable recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carbon Tracking</h3>
              <p className="text-gray-600">Monitor and reduce your carbon footprint with AI-powered insights</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Energy Analysis</h3>
              <p className="text-gray-600">Track energy consumption patterns and identify optimization opportunities</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-200 transition-colors">
                <Droplets className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Water Management</h3>
              <p className="text-gray-600">Analyze water usage and implement conservation strategies</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Recycle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Waste Tracking</h3>
              <p className="text-gray-600">Monitor waste generation and improve recycling efficiency</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Sustainability Reporting?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of MSMEs already using our platform to improve their environmental impact
          </p>
          <button
            onClick={() => setActiveTab('upload')}
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};