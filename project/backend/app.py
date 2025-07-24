"""
AI Sustainability Analyzer Backend
FastAPI server for OCR processing and sustainability data extraction
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import pytesseract
from PIL import Image
import io
import re
import json
from typing import Dict, Any, Optional
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sustainability OCR API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SustainabilityExtractor:
    """Extract sustainability data from utility bills and invoices"""
    
    # India-specific patterns for different utilities
    PATTERNS = {
        'energy': {
            'usage': [
                r'(\d+(?:\.\d+)?)\s*(?:kwh|kw|units?|यूनिट)',
                r'consumption[:\s]*(\d+(?:\.\d+)?)',
                r'total\s*units[:\s]*(\d+(?:\.\d+)?)'
            ],
            'amount': [
                r'(?:₹|rs\.?|inr|amount)[:\s]*(\d+(?:,\d+)*(?:\.\d+)?)',
                r'total[:\s]*(?:₹|rs\.?)[:\s]*(\d+(?:,\d+)*(?:\.\d+)?)'
            ],
            'vendor_patterns': [
                r'(mseb|maharashtra state electricity board)',
                r'(tata power|adani electricity)',
                r'(bescom|bangalore electricity)',
                r'(tneb|tamil nadu electricity)'
            ]
        },
        'water': {
            'usage': [
                r'(\d+(?:\.\d+)?)\s*(?:litres?|liters?|l\b|kilolitres?)',
                r'consumption[:\s]*(\d+(?:\.\d+)?)\s*(?:kl|litres?)',
                r'water\s*consumed[:\s]*(\d+(?:\.\d+)?)'
            ],
            'amount': [
                r'(?:₹|rs\.?|water\s*charges?)[:\s]*(\d+(?:,\d+)*(?:\.\d+)?)',
                r'total[:\s]*(?:₹|rs\.?)[:\s]*(\d+(?:,\d+)*(?:\.\d+)?)'
            ],
            'vendor_patterns': [
                r'(municipal corporation|nagar nigam)',
                r'(water department|jal board)',
                r'(bmw|bangalore water supply)'
            ]
        },
        'fuel': {
            'usage': [
                r'(\d+(?:\.\d+)?)\s*(?:litres?|liters?|l\b)',
                r'quantity[:\s]*(\d+(?:\.\d+)?)',
                r'fuel[:\s]*(\d+(?:\.\d+)?)\s*(?:ltr|litres?)'
            ],
            'amount': [
                r'(?:₹|rs\.?|amount)[:\s]*(\d+(?:,\d+)*(?:\.\d+)?)',
                r'total[:\s]*(?:₹|rs\.?)[:\s]*(\d+(?:,\d+)*(?:\.\d+)?)'
            ],
            'vendor_patterns': [
                r'(indian oil|ioc|bharat petroleum|bpcl)',
                r'(hindustan petroleum|hpcl|reliance)',
                r'(shell|bp|total)'
            ]
        }
    }
    
    @staticmethod
    def preprocess_image(image: Image.Image) -> Image.Image:
        """Preprocess image for better OCR accuracy"""
        # Convert to grayscale
        if image.mode != 'L':
            image = image.convert('L')
        
        # Resize if too small
        width, height = image.size
        if width < 800:
            scale_factor = 800 / width
            new_width = int(width * scale_factor)
            new_height = int(height * scale_factor)
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        return image
    
    @staticmethod
    def extract_text_from_image(image: Image.Image) -> str:
        """Extract text using Tesseract OCR"""
        try:
            # Preprocess image
            processed_image = SustainabilityExtractor.preprocess_image(image)
            
            # OCR configuration for better accuracy
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz₹.,:-/\s'
            
            # Extract text
            text = pytesseract.image_to_string(processed_image, config=custom_config)
            return text.strip()
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return ""
    
    @staticmethod
    def identify_bill_type(text: str) -> str:
        """Identify the type of utility bill"""
        text_lower = text.lower()
        
        # Check for electricity keywords
        electricity_keywords = ['electricity', 'power', 'kwh', 'units', 'mseb', 'bescom', 'tneb']
        if any(keyword in text_lower for keyword in electricity_keywords):
            return 'electricity'
        
        # Check for water keywords
        water_keywords = ['water', 'municipal', 'jal', 'litres', 'kilolitres']
        if any(keyword in text_lower for keyword in water_keywords):
            return 'water'
        
        # Check for fuel keywords
        fuel_keywords = ['petrol', 'diesel', 'fuel', 'indian oil', 'bpcl', 'hpcl']
        if any(keyword in text_lower for keyword in fuel_keywords):
            return 'fuel'
        
        return 'other'
    
    @staticmethod
    def extract_numeric_value(text: str, patterns: list) -> Optional[float]:
        """Extract numeric value using regex patterns"""
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                try:
                    # Clean and convert to float
                    value_str = matches[0].replace(',', '')
                    return float(value_str)
                except (ValueError, IndexError):
                    continue
        return None
    
    @staticmethod
    def extract_vendor_info(text: str, patterns: list) -> Optional[str]:
        """Extract vendor information"""
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                return matches[0].title()
        return None
    
    @staticmethod
    def extract_date(text: str) -> Optional[str]:
        """Extract bill date"""
        date_patterns = [
            r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})',
            r'(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{2,4})',
            r'date[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})'
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                return matches[0]
        return None
    
    @classmethod
    def process_document(cls, text: str) -> Dict[str, Any]:
        """Main processing function"""
        bill_type = cls.identify_bill_type(text)
        
        result = {
            'billType': bill_type,
            'billDate': cls.extract_date(text),
            'vendor': None,
            'amount': None,
            'confidence': 0.0
        }
        
        if bill_type in cls.PATTERNS:
            patterns = cls.PATTERNS[bill_type]
            
            # Extract usage data
            if bill_type == 'electricity':
                usage = cls.extract_numeric_value(text, patterns['usage'])
                if usage:
                    result['energyUsage'] = usage
            elif bill_type == 'water':
                usage = cls.extract_numeric_value(text, patterns['usage'])
                if usage:
                    result['waterConsumption'] = usage
            elif bill_type == 'fuel':
                usage = cls.extract_numeric_value(text, patterns['usage'])
                if usage:
                    result['fuelConsumption'] = usage
            
            # Extract amount
            amount = cls.extract_numeric_value(text, patterns['amount'])
            if amount:
                result['amount'] = amount
            
            # Extract vendor
            vendor = cls.extract_vendor_info(text, patterns['vendor_patterns'])
            if vendor:
                result['vendor'] = vendor
            
            # Calculate confidence score
            confidence_factors = []
            if result.get('amount'): confidence_factors.append(0.3)
            if result.get('billDate'): confidence_factors.append(0.2)
            if result.get('vendor'): confidence_factors.append(0.2)
            if bill_type != 'other': confidence_factors.append(0.3)
            
            result['confidence'] = sum(confidence_factors)
        
        return result

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Sustainability OCR API is running", "version": "1.0.0"}

@app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    """Process uploaded document and extract sustainability data"""
    
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are supported")
    
    try:
        # Read file content
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        
        # Extract text using OCR
        extracted_text = SustainabilityExtractor.extract_text_from_image(image)
        
        if not extracted_text:
            raise HTTPException(status_code=400, detail="No text could be extracted from the image")
        
        # Process extracted text
        result = SustainabilityExtractor.process_document(extracted_text)
        
        # Add metadata
        result['filename'] = file.filename
        result['fileSize'] = len(content)
        result['processedAt'] = datetime.now().isoformat()
        result['extractedText'] = extracted_text[:500]  # First 500 chars for debugging
        
        logger.info(f"Successfully processed {file.filename}: {result['billType']} bill")
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error processing document {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/calculate-emissions")
async def calculate_emissions(data: Dict[str, Any]):
    """Calculate carbon emissions from extracted data"""
    
    # India-specific emission factors
    EMISSION_FACTORS = {
        'electricity': 0.82,  # kg CO2/kWh
        'water': 0.0003,      # kg CO2/L
        'petrol': 2.31,       # kg CO2/L
        'diesel': 2.68,       # kg CO2/L
        'waste': 0.5          # kg CO2/kg
    }
    
    try:
        total_emissions = 0.0
        breakdown = {}
        
        for item in data.get('documents', []):
            bill_type = item.get('billType')
            
            if bill_type == 'electricity' and 'energyUsage' in item:
                emissions = item['energyUsage'] * EMISSION_FACTORS['electricity']
                total_emissions += emissions
                breakdown['electricity'] = emissions
                
            elif bill_type == 'water' and 'waterConsumption' in item:
                emissions = item['waterConsumption'] * EMISSION_FACTORS['water']
                total_emissions += emissions
                breakdown['water'] = emissions
                
            elif bill_type == 'fuel' and 'fuelConsumption' in item:
                # Assume diesel if not specified
                emissions = item['fuelConsumption'] * EMISSION_FACTORS['diesel']
                total_emissions += emissions
                breakdown['fuel'] = emissions
        
        result = {
            'totalEmissions': round(total_emissions / 1000, 3),  # Convert to tonnes
            'breakdown': breakdown,
            'unit': 'tCO2e',
            'calculatedAt': datetime.now().isoformat()
        }
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error calculating emissions: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test OCR functionality
        test_image = Image.new('RGB', (100, 50), color='white')
        test_text = pytesseract.image_to_string(test_image)
        
        return {
            "status": "healthy",
            "ocr_available": True,
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)