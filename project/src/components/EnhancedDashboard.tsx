import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Droplets, Recycle, Leaf, Target, Award } from 'lucide-react';
import { SustainabilityMetrics } from '../types/sustainability';
import { EmissionCalculator } from '../utils/emissionCalculator';

interface EnhancedDashboardProps {
  data: SustainabilityMetrics;
  onNavigateToGamification: () => void;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ data, onNavigateToGamification }) => {
  const [animatedValues, setAnimatedValues] = useState({
    carbonFootprint: 0,
    energyUsage: 0,
    waterConsumption: 0,
    wasteGeneration: 0,
    esgScore: 0
  });

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        carbonFootprint: data.carbonFootprint * easeOutQuart,
        energyUsage: data.energyUsage * easeOutQuart,
        waterConsumption: data.waterConsumption * easeOutQuart,
        wasteGeneration: data.wasteGeneration * easeOutQuart,
        esgScore: data.esgScore * easeOutQuart
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues({
          carbonFootprint: data.carbonFootprint,
          energyUsage: data.energyUsage,
          waterConsumption: data.waterConsumption,
          wasteGeneration: data.wasteGeneration,
          esgScore: data.esgScore
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [data]);

  const metrics = [
    {
      title: 'Carbon Footprint',
      value: animatedValues.carbonFootprint,
      unit: 'tCO₂e',
      icon: Leaf,
      color: 'green',
      trend: '+5%',
      trendUp: true,
      benchmark: EmissionCalculator.benchmarkAgainstSector(data.carbonFootprint, 2.8)
    },
    {
      title: 'Energy Usage',
      value: animatedValues.energyUsage,
      unit: 'kWh',
      icon: Zap,
      color: 'yellow',
      trend: '-2%',
      trendUp: false,
      benchmark: EmissionCalculator.benchmarkAgainstSector(data.energyUsage, 1400)
    },
    {
      title: 'Water Consumption',
      value: animatedValues.waterConsumption,
      unit: 'L',
      icon: Droplets,
      color: 'blue',
      trend: '+8%',
      trendUp: true,
      benchmark: EmissionCalculator.benchmarkAgainstSector(data.waterConsumption, 720)
    },
    {
      title: 'Waste Generated',
      value: animatedValues.wasteGeneration,
      unit: 'kg',
      icon: Recycle,
      color: 'orange',
      trend: '-12%',
      trendUp: false,
      benchmark: EmissionCalculator.benchmarkAgainstSector(data.wasteGeneration, 52)
    }
  ];

  // Prepare chart data
  const trendData = data.trends.carbon.map((_, index) => ({
    month: `Month ${index + 1}`,
    carbon: data.trends.carbon[index],
    energy: data.trends.energy[index],
    water: data.trends.water[index],
    waste: data.trends.waste[index]
  }));

  const emissionBreakdown = [
    { name: 'Electricity', value: 60, color: '#10B981' },
    { name: 'Transportation', value: 25, color: '#F59E0B' },
    { name: 'Water Treatment', value: 10, color: '#3B82F6' },
    { name: 'Waste', value: 5, color: '#EF4444' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Sustainability Dashboard</h1>
        <p className="text-lg text-gray-600">
          AI-powered insights with real-time analytics and peer benchmarking
        </p>
      </div>

      {/* ESG Score with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">ESG Score</h2>
              <p className="text-green-100">AI-calculated sustainability performance</p>
              <button
                onClick={onNavigateToGamification}
                className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Award className="h-4 w-4" />
                <span>View Achievements</span>
              </button>
            </div>
            <div className="text-right">
              <motion.div 
                className="text-5xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {Math.round(animatedValues.esgScore)}
              </motion.div>
              <div className="text-sm text-green-100">out of 100</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-4">
              <motion.div 
                className="bg-white h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${animatedValues.esgScore}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(metric.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trendUp ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className={`text-sm font-medium ${metric.trendUp ? 'text-red-500' : 'text-green-500'}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
                  <span className="text-lg font-normal text-gray-500 ml-1">{metric.unit}</span>
                </p>
              </div>

              {/* Benchmark */}
              <div className="text-xs text-gray-500 mb-3">
                <span className={`font-medium ${
                  metric.benchmark.comparison === 'better' ? 'text-green-600' : 
                  metric.benchmark.comparison === 'worse' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {metric.benchmark.message}
                </span>
              </div>

              {/* Mini trend chart */}
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line 
                      type="monotone" 
                      dataKey={metric.title.toLowerCase().split(' ')[0]} 
                      stroke={`var(--color-${metric.color}-500)`}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="carbon" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="energy" stackId="2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Emission Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emission Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emissionBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {emissionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Contribution']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {emissionBreakdown.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Energy Pattern:</strong> Peak consumption detected during 2-4 PM. 
                Consider load shifting to reduce demand charges by ₹2,400/month.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Water Efficiency:</strong> 18% higher usage than sector median. 
                Installing smart fixtures could save ₹1,800/month.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Waste Optimization:</strong> 65% recyclable content identified. 
                Proper segregation could reduce disposal costs by 40%.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Recommendations</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">LED Retrofit Program</h4>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">High Impact</span>
              </div>
              <p className="text-sm text-green-600">ROI: 18 months | Savings: ₹3,200/month</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-800">Rainwater Harvesting</h4>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Medium Impact</span>
              </div>
              <p className="text-sm text-blue-600">ROI: 24 months | Savings: ₹1,500/month</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-orange-800">Composting System</h4>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">Quick Win</span>
              </div>
              <p className="text-sm text-orange-600">ROI: 6 months | Savings: ₹800/month</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};