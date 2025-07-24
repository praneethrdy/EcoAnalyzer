import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Calendar, TrendingUp, Award, Star } from 'lucide-react';
import { Badge, Pledge } from '../types/sustainability';
import { GamificationEngine } from '../utils/gamification';

interface GamificationProps {
  badges: Badge[];
  pledges: Pledge[];
  onCreatePledge: (pledge: Omit<Pledge, 'id' | 'current' | 'status'>) => void;
}

export const Gamification: React.FC<GamificationProps> = ({ badges, pledges, onCreatePledge }) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'pledges'>('badges');
  const [showCreatePledge, setShowCreatePledge] = useState(false);
  const [newPledge, setNewPledge] = useState({
    title: '',
    description: '',
    target: 0,
    unit: '%',
    category: 'energy' as const,
    deadline: ''
  });

  const earnedBadges = badges.filter(b => b.earned);
  const availableBadges = badges.filter(b => !b.earned);
  const activePledges = pledges.filter(p => p.status === 'active');
  const completedPledges = pledges.filter(p => p.status === 'completed');

  const getBadgeColor = (type: Badge['type']) => {
    const colors = {
      bronze: 'from-amber-600 to-amber-800',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-purple-600'
    };
    return colors[type];
  };

  const getPledgeStatusColor = (status: Pledge['status']) => {
    const colors = {
      active: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status];
  };

  const handleCreatePledge = () => {
    if (newPledge.title && newPledge.target > 0 && newPledge.deadline) {
      onCreatePledge({
        ...newPledge,
        deadline: new Date(newPledge.deadline)
      });
      setNewPledge({
        title: '',
        description: '',
        target: 0,
        unit: '%',
        category: 'energy',
        deadline: ''
      });
      setShowCreatePledge(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sustainability Journey</h1>
        <p className="text-lg text-gray-600">
          Track your progress, earn badges, and achieve your sustainability goals
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'badges'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Trophy className="h-4 w-4 inline mr-2" />
          Badges
        </button>
        <button
          onClick={() => setActiveTab('pledges')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'pledges'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Target className="h-4 w-4 inline mr-2" />
          Pledges
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Badges Earned</p>
                    <p className="text-3xl font-bold text-green-600">{earnedBadges.length}</p>
                  </div>
                  <Award className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-3xl font-bold text-blue-600">{earnedBadges.length * 100}</p>
                  </div>
                  <Star className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Next Badge</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {availableBadges[0]?.name || 'All Earned!'}
                    </p>
                  </div>
                  <Trophy className="h-12 w-12 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Achievements</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${getBadgeColor(badge.type)} opacity-10 rounded-bl-full`}></div>
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getBadgeColor(badge.type)} flex items-center justify-center text-white text-xl`}>
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                          {badge.earnedDate && (
                            <p className="text-xs text-gray-500">
                              Earned {badge.earnedDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Badges */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Badges</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getBadgeColor(badge.type)}`}></div>
                          <span className="text-xs text-gray-500 capitalize">{badge.type}</span>
                        </div>
                        {badge.progress !== undefined && (
                          <div className="mt-2">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${badge.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{badge.progress}% complete</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pledges' && (
          <motion.div
            key="pledges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Create Pledge Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreatePledge(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Create New Pledge
              </button>
            </div>

            {/* Active Pledges */}
            {activePledges.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Pledges</h2>
                <div className="space-y-4">
                  {activePledges.map((pledge) => (
                    <div key={pledge.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{pledge.title}</h3>
                          <p className="text-sm text-gray-600">{pledge.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPledgeStatusColor(pledge.status)}`}>
                          {pledge.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{pledge.current}/{pledge.target} {pledge.unit}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (pledge.current / pledge.target) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {pledge.deadline.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {Math.round((pledge.current / pledge.target) * 100)}% complete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Pledges */}
            {completedPledges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Pledges</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {completedPledges.map((pledge) => (
                    <div key={pledge.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-green-900">{pledge.title}</h3>
                        <Trophy className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm text-green-700">{pledge.description}</p>
                      <p className="text-xs text-green-600 mt-2">
                        Achieved {pledge.target} {pledge.unit} reduction
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Create Pledge Modal */}
            <AnimatePresence>
              {showCreatePledge && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg p-6 w-full max-w-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Pledge</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={newPledge.title}
                          onChange={(e) => setNewPledge({...newPledge, title: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., Reduce Energy Consumption"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newPledge.description}
                          onChange={(e) => setNewPledge({...newPledge, description: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={3}
                          placeholder="Describe your sustainability goal..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                          <input
                            type="number"
                            value={newPledge.target}
                            onChange={(e) => setNewPledge({...newPledge, target: parseFloat(e.target.value)})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="25"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                          <select
                            value={newPledge.unit}
                            onChange={(e) => setNewPledge({...newPledge, unit: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="%">%</option>
                            <option value="kWh">kWh</option>
                            <option value="L">Liters</option>
                            <option value="kg">kg</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={newPledge.category}
                          onChange={(e) => setNewPledge({...newPledge, category: e.target.value as any})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="energy">Energy</option>
                          <option value="water">Water</option>
                          <option value="carbon">Carbon</option>
                          <option value="waste">Waste</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                          type="date"
                          value={newPledge.deadline}
                          onChange={(e) => setNewPledge({...newPledge, deadline: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={handleCreatePledge}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                      >
                        Create Pledge
                      </button>
                      <button
                        onClick={() => setShowCreatePledge(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};