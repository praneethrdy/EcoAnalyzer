import React from 'react';
import { TrendingUp, TrendingDown, Zap, Droplets, Recycle, Leaf } from 'lucide-react';

interface DashboardProps {
  data: {
    carbonFootprint: number;
    energyUsage: number;
    waterConsumption: number;
    wasteGeneration: number;
    esgScore: number;
    trends: {
      carbon: number[];
      energy: number[];
      water: number[];
      waste: number[];
    };
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Carbon Footprint',
      value: data.carbonFootprint,
      unit: 'tCO₂e',
      icon: Leaf,
      color: 'green',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Energy Usage',
      value: data.energyUsage,
      unit: 'kWh',
      icon: Zap,
      color: 'yellow',
      trend: '-2%',
      trendUp: false
    },
    {
      title: 'Water Consumption',
      value: data.waterConsumption,
      unit: 'L',
      icon: Droplets,
      color: 'blue',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Waste Generated',
      value: data.wasteGeneration,
      unit: 'kg',
      icon: Recycle,
      color: 'orange',
      trend: '-12%',
      trendUp: false
    }
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

  const renderMiniChart = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50;
          return (
            <div
              key={index}
              className={`w-2 bg-${color}-400 rounded-t transition-all duration-300`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sustainability Dashboard</h1>
        <p className="text-lg text-gray-600">
          Real-time insights into your environmental performance
        </p>
      </div>

      {/* ESG Score */}
      <div className="mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ESG Score</h2>
              <p className="text-gray-600">Overall sustainability performance</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600">{data.esgScore}</div>
              <div className="text-sm text-gray-500">out of 100</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${data.esgScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value.toLocaleString()} <span className="text-lg font-normal text-gray-500">{metric.unit}</span>
                </p>
              </div>
              <div className="mt-4">
                {renderMiniChart(
                  data.trends[metric.title.toLowerCase().split(' ')[0] as keyof typeof data.trends], 
                  metric.color
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Your energy efficiency has improved by 15% compared to last quarter</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Water consumption is 18% higher than sector median - consider water-saving measures</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Waste reduction initiatives show promising results with 12% decrease</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Switch to LED Lighting</h4>
              <p className="text-sm text-green-600">Potential savings: 25% energy reduction</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Install Water-Efficient Fixtures</h4>
              <p className="text-sm text-blue-600">Potential savings: 30% water reduction</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800">Implement Recycling Program</h4>
              <p className="text-sm text-orange-600">Potential impact: 40% waste diversion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};