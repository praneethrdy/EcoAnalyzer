import { ExtractedData } from '../types/sustainability';

export class OCRProcessor {
  // Simulated OCR processing - in production, this would call a Python backend
  static async processDocument(file: File): Promise<ExtractedData> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const fileName = file.name.toLowerCase();
    const fileSize = file.size;

    // Mock data extraction based on file characteristics
    if (fileName.includes('electricity') || fileName.includes('power') || fileName.includes('mseb')) {
      return {
        billType: 'electricity',
        energyUsage: Math.floor(Math.random() * 500) + 200, // 200-700 kWh
        amount: Math.floor(Math.random() * 5000) + 2000, // ₹2000-7000
        billDate: new Date().toISOString().split('T')[0],
        vendor: 'Maharashtra State Electricity Board'
      };
    }

    if (fileName.includes('water') || fileName.includes('municipal')) {
      return {
        billType: 'water',
        waterConsumption: Math.floor(Math.random() * 10000) + 5000, // 5000-15000 L
        amount: Math.floor(Math.random() * 1500) + 500, // ₹500-2000
        billDate: new Date().toISOString().split('T')[0],
        vendor: 'Municipal Water Department'
      };
    }

    if (fileName.includes('fuel') || fileName.includes('petrol') || fileName.includes('diesel')) {
      return {
        billType: 'fuel',
        fuelConsumption: Math.floor(Math.random() * 100) + 50, // 50-150 L
        amount: Math.floor(Math.random() * 8000) + 4000, // ₹4000-12000
        billDate: new Date().toISOString().split('T')[0],
        vendor: 'Indian Oil Corporation'
      };
    }

    // Default case
    return {
      billType: 'other',
      amount: Math.floor(Math.random() * 3000) + 1000,
      billDate: new Date().toISOString().split('T')[0],
      vendor: 'Unknown Vendor'
    };
  }

  // Extract text patterns using regex (simplified NLP)
  static extractKeyFields(text: string): Partial<ExtractedData> {
    const patterns = {
      energy: /(\d+(?:\.\d+)?)\s*(?:kwh|kw|units?)/i,
      water: /(\d+(?:\.\d+)?)\s*(?:litres?|liters?|l\b)/i,
      amount: /(?:₹|rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
      date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/
    };

    const extracted: Partial<ExtractedData> = {};

    const energyMatch = text.match(patterns.energy);
    if (energyMatch) extracted.energyUsage = parseFloat(energyMatch[1]);

    const waterMatch = text.match(patterns.water);
    if (waterMatch) extracted.waterConsumption = parseFloat(waterMatch[1]);

    const amountMatch = text.match(patterns.amount);
    if (amountMatch) extracted.amount = parseFloat(amountMatch[1].replace(/,/g, ''));

    const dateMatch = text.match(patterns.date);
    if (dateMatch) extracted.billDate = dateMatch[1];

    return extracted;
  }
}