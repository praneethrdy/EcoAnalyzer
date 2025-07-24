import { Badge, Pledge } from '../types/sustainability';
import { SustainabilityMetrics } from '../types/sustainability';

export class GamificationEngine {
  static readonly AVAILABLE_BADGES: Omit<Badge, 'earned' | 'earnedDate' | 'progress'>[] = [
    {
      id: 'first-upload',
      name: 'Getting Started',
      description: 'Upload your first sustainability document',
      type: 'bronze',
      icon: '🌱'
    },
    {
      id: 'energy-saver',
      name: 'Energy Saver',
      description: 'Reduce energy consumption by 10%',
      type: 'silver',
      icon: '⚡'
    },
    {
      id: 'water-warrior',
      name: 'Water Warrior',
      description: 'Achieve 20% water savings',
      type: 'silver',
      icon: '💧'
    },
    {
      id: 'carbon-crusher',
      name: 'Carbon Crusher',
      description: 'Reduce carbon footprint by 25%',
      type: 'gold',
      icon: '🌍'
    },
    {
      id: 'waste-wizard',
      name: 'Waste Wizard',
      description: 'Achieve 40% waste reduction',
      type: 'gold',
      icon: '♻️'
    },
    {
      id: 'esg-champion',
      name: 'ESG Champion',
      description: 'Maintain ESG score above 80 for 3 months',
      type: 'platinum',
      icon: '🏆'
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Upload data for 6 consecutive months',
      type: 'gold',
      icon: '📊'
    },
    {
      id: 'green-pioneer',
      name: 'Green Pioneer',
      description: 'Complete all sustainability pledges',
      type: 'platinum',
      icon: '🌟'
    }
  ];

  static readonly DEFAULT_PLEDGES: Omit<Pledge, 'id' | 'current' | 'status'>[] = [
    {
      title: 'Energy Efficiency Drive',
      description: 'Reduce monthly electricity consumption by 15%',
      target: 15,
      unit: '%',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      category: 'energy'
    },
    {
      title: 'Water Conservation Challenge',
      description: 'Cut water usage by 20% through efficiency measures',
      target: 20,
      unit: '%',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      category: 'water'
    },
    {
      title: 'Carbon Footprint Reduction',
      description: 'Lower carbon emissions by 25% this quarter',
      target: 25,
      unit: '%',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      category: 'carbon'
    },
    {
      title: 'Zero Waste Initiative',
      description: 'Achieve 50% waste diversion from landfills',
      target: 50,
      unit: '%',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      category: 'waste'
    }
  ];

  static checkBadgeEligibility(
    badgeId: string, 
    metrics: SustainabilityMetrics, 
    userStats: {
      uploadsCount: number;
      monthsActive: number;
      completedPledges: number;
      totalPledges: number;
    }
  ): boolean {
    switch (badgeId) {
      case 'first-upload':
        return userStats.uploadsCount >= 1;
      
      case 'energy-saver':
        // Check if energy usage decreased by 10% (simplified)
        const energyTrend = metrics.trends.energy;
        if (energyTrend.length >= 2) {
          const reduction = (energyTrend[0] - energyTrend[energyTrend.length - 1]) / energyTrend[0];
          return reduction >= 0.1;
        }
        return false;
      
      case 'water-warrior':
        const waterTrend = metrics.trends.water;
        if (waterTrend.length >= 2) {
          const reduction = (waterTrend[0] - waterTrend[waterTrend.length - 1]) / waterTrend[0];
          return reduction >= 0.2;
        }
        return false;
      
      case 'carbon-crusher':
        const carbonTrend = metrics.trends.carbon;
        if (carbonTrend.length >= 2) {
          const reduction = (carbonTrend[0] - carbonTrend[carbonTrend.length - 1]) / carbonTrend[0];
          return reduction >= 0.25;
        }
        return false;
      
      case 'waste-wizard':
        const wasteTrend = metrics.trends.waste;
        if (wasteTrend.length >= 2) {
          const reduction = (wasteTrend[0] - wasteTrend[wasteTrend.length - 1]) / wasteTrend[0];
          return reduction >= 0.4;
        }
        return false;
      
      case 'esg-champion':
        return metrics.esgScore >= 80 && userStats.monthsActive >= 3;
      
      case 'consistency-king':
        return userStats.monthsActive >= 6;
      
      case 'green-pioneer':
        return userStats.completedPledges === userStats.totalPledges && userStats.totalPledges > 0;
      
      default:
        return false;
    }
  }

  static calculatePledgeProgress(pledge: Pledge, currentValue: number): number {
    if (pledge.category === 'energy' || pledge.category === 'water' || 
        pledge.category === 'carbon' || pledge.category === 'waste') {
      // For reduction targets, progress is based on how much has been reduced
      const progress = (currentValue / pledge.target) * 100;
      return Math.min(100, Math.max(0, progress));
    }
    return 0;
  }

  static generateMotivationalMessage(badge: Badge): string {
    const messages = {
      bronze: [
        "Great start! Every journey begins with a single step. 🌱",
        "You're on your way to making a real difference! 💚",
        "Small actions lead to big changes. Keep going! 🌿"
      ],
      silver: [
        "Impressive progress! You're becoming a sustainability champion! 🥈",
        "Your efforts are paying off. The planet thanks you! 🌍",
        "You're setting a great example for other businesses! ⭐"
      ],
      gold: [
        "Outstanding achievement! You're a true environmental leader! 🥇",
        "Exceptional commitment to sustainability. Well done! 🏆",
        "Your dedication is inspiring. Keep leading the way! 🌟"
      ],
      platinum: [
        "Extraordinary! You've reached the pinnacle of sustainability excellence! 💎",
        "You're not just making a difference - you're transforming the future! 🚀",
        "Legendary achievement! You're a sustainability superhero! 🦸‍♂️"
      ]
    };

    const typeMessages = messages[badge.type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }
}