# AI Sustainability Analyzer Backend

FastAPI-based backend for OCR processing and sustainability data extraction.

## Features

- **Advanced OCR**: Tesseract-based text extraction from utility bills
- **Smart Pattern Recognition**: India-specific patterns for electricity, water, and fuel bills
- **Emission Calculations**: Real-time carbon footprint calculations using Indian grid factors
- **Vendor Detection**: Automatic identification of utility providers
- **Data Validation**: Confidence scoring for extracted data

## Setup

### Prerequisites

1. **Python 3.8+**
2. **Tesseract OCR**:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin
   
   # macOS
   brew install tesseract
   
   # Windows
   # Download from: https://github.com/UB-Mannheim/tesseract/wiki
   ```

### Installation

1. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /process-document
Upload and process utility bills/invoices.

**Request**: Multipart form with image file
**Response**:
```json
{
  "billType": "electricity",
  "energyUsage": 245.5,
  "amount": 3250.0,
  "vendor": "Maharashtra State Electricity Board",
  "billDate": "15/11/2024",
  "confidence": 0.9
}
```

### POST /calculate-emissions
Calculate carbon emissions from extracted data.

**Request**:
```json
{
  "documents": [
    {
      "billType": "electricity",
      "energyUsage": 245.5
    }
  ]
}
```

**Response**:
```json
{
  "totalEmissions": 0.201,
  "breakdown": {
    "electricity": 201.31
  },
  "unit": "tCO2e"
}
```

## Supported Document Types

- **Electricity Bills**: MSEB, BESCOM, TNEB, Tata Power, Adani
- **Water Bills**: Municipal corporations, Jal boards
- **Fuel Receipts**: IOC, BPCL, HPCL, Shell, BP

## Emission Factors (India-specific)

- **Electricity**: 0.82 kg CO₂/kWh (India grid average)
- **Water**: 0.0003 kg CO₂/L (treatment + distribution)
- **Petrol**: 2.31 kg CO₂/L
- **Diesel**: 2.68 kg CO₂/L
- **Waste**: 0.5 kg CO₂/kg (landfill methane)

## Development

### Testing
```bash
# Test OCR functionality
curl -X POST "http://localhost:8000/process-document" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@sample_bill.jpg"
```

### Health Check
```bash
curl http://localhost:8000/health
```

## Production Deployment

### Docker
```dockerfile
FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-hin \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
```bash
export TESSERACT_CMD=/usr/bin/tesseract
export OCR_LANGUAGE=eng+hin
export LOG_LEVEL=INFO
```