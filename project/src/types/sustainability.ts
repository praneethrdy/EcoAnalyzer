export interface ExtractedData {
  energyUsage?: number; // kWh
  waterConsumption?: number; // Liters
  fuelConsumption?: number; // Liters
  wasteGeneration?: number; // kg
  amount?: number; // INR
  billDate?: string;
  vendor?: string;
  billType: 'electricity' | 'water' | 'fuel' | 'waste' | 'other';
}

export interface EmissionFactors {
  electricity: number; // kg CO2/kWh - India grid factor
  water: number; // kg CO2/L
  petrol: number; // kg CO2/L
  diesel: number; // kg CO2/L
  waste: number; // kg CO2/kg
}

export interface SustainabilityMetrics {
  carbonFootprint: number; // tCO2e
  energyUsage: number; // kWh
  waterConsumption: number; // L
  wasteGeneration: number; // kg
  esgScore: number; // 0-100
  trends: {
    carbon: number[];
    energy: number[];
    water: number[];
    waste: number[];
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number; // 0-100
}

export interface Pledge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  category: 'energy' | 'water' | 'carbon' | 'waste';
  status: 'active' | 'completed' | 'failed';
}