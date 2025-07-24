import { ExtractedData, EmissionFactors } from '../types/sustainability';

// India-specific emission factors (2024 data)
export const EMISSION_FACTORS: EmissionFactors = {
  electricity: 0.82, // kg CO2/kWh (India grid average)
  water: 0.0003, // kg CO2/L (treatment and distribution)
  petrol: 2.31, // kg CO2/L
  diesel: 2.68, // kg CO2/L
  waste: 0.5, // kg CO2/kg (landfill methane)
};

export class EmissionCalculator {
  static calculateCarbonFootprint(data: ExtractedData[]): number {
    let totalEmissions = 0;

    data.forEach(item => {
      switch (item.billType) {
        case 'electricity':
          if (item.energyUsage) {
            totalEmissions += item.energyUsage * EMISSION_FACTORS.electricity;
          }
          break;
        case 'water':
          if (item.waterConsumption) {
            totalEmissions += item.waterConsumption * EMISSION_FACTORS.water;
          }
          break;
        case 'fuel':
          if (item.fuelConsumption) {
            // Assume diesel if not specified
            totalEmissions += item.fuelConsumption * EMISSION_FACTORS.diesel;
          }
          break;
        case 'waste':
          if (item.wasteGeneration) {
            totalEmissions += item.wasteGeneration * EMISSION_FACTORS.waste;
          }
          break;
      }
    });

    return totalEmissions / 1000; // Convert to tonnes CO2e
  }

  static calculateESGScore(metrics: {
    carbonIntensity: number;
    energyEfficiency: number;
    waterEfficiency: number;
    wasteReduction: number;
  }): number {
    // Weighted ESG scoring algorithm
    const weights = {
      carbon: 0.4,
      energy: 0.25,
      water: 0.2,
      waste: 0.15
    };

    const scores = {
      carbon: Math.max(0, 100 - (metrics.carbonIntensity * 10)),
      energy: Math.min(100, metrics.energyEfficiency * 20),
      water: Math.min(100, metrics.waterEfficiency * 15),
      waste: Math.min(100, metrics.wasteReduction * 25)
    };

    return Math.round(
      scores.carbon * weights.carbon +
      scores.energy * weights.energy +
      scores.water * weights.water +
      scores.waste * weights.waste
    );
  }

  static benchmarkAgainstSector(value: number, sectorMedian: number): {
    percentile: number;
    comparison: 'better' | 'worse' | 'average';
    message: string;
  } {
    const ratio = value / sectorMedian;
    let percentile: number;
    let comparison: 'better' | 'worse' | 'average';

    if (ratio <= 0.8) {
      percentile = 80 + (0.8 - ratio) * 50; // 80-100th percentile
      comparison = 'better';
    } else if (ratio <= 1.2) {
      percentile = 40 + (1.2 - ratio) * 100; // 40-80th percentile
      comparison = 'average';
    } else {
      percentile = Math.max(5, 40 - (ratio - 1.2) * 50); // 5-40th percentile
      comparison = 'worse';
    }

    const messages = {
      better: `Better than ${Math.round(percentile)}% of peers`,
      worse: `${Math.round((ratio - 1) * 100)}% higher than median`,
      average: `Close to sector median (${Math.round(percentile)}th percentile)`
    };

    return {
      percentile: Math.round(percentile),
      comparison,
      message: messages[comparison]
    };
  }
}