# AI Sustainability Analyzer for MSMEs

A comprehensive AI-powered platform that helps Indian MSMEs track, analyze, and improve their sustainability performance through intelligent document processing and ESG reporting.

## 🚀 Features

- **Smart Document Processing**: OCR-powered extraction from utility bills, invoices, and receipts
- **Real-time Analytics**: Interactive dashboard with sustainability metrics and trends
- **ESG Scoring**: Automated Environmental, Social, and Governance performance evaluation
- **Gamification**: Badge system and sustainability pledges to drive engagement
- **AI Chatbot**: Intelligent assistant for sustainability guidance and insights
- **PDF Reports**: Professional sustainability reports and certificates
- **Peer Benchmarking**: Compare performance against industry standards

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Framer Motion
- **Charts**: Recharts for interactive data visualizations
- **PDF Generation**: jsPDF + html2canvas for report generation
- **Backend**: Python FastAPI with Tesseract OCR (optional)
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sustainability-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Or connect your GitHub repository to Vercel dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the build settings

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository to Netlify

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file for any API keys:

```env
VITE_API_URL=your-backend-url
VITE_OCR_API_KEY=your-ocr-api-key
```

### Backend Setup (Optional)

If you want to use the Python OCR backend:

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Tesseract OCR**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install tesseract-ocr
   
   # macOS
   brew install tesseract
   ```

4. **Run the backend server**
   ```bash
   python app.py
   ```

## 📊 Usage

1. **Upload Documents**: Drag and drop utility bills, invoices, or receipts
2. **View Analytics**: Check your sustainability dashboard for insights
3. **Track Progress**: Monitor your ESG score and environmental metrics
4. **Set Goals**: Create sustainability pledges and earn badges
5. **Get Insights**: Chat with the AI assistant for personalized recommendations
6. **Generate Reports**: Download professional PDF reports and certificates

## 🎯 Key Features Explained

### Document Processing
- Supports PDF, Excel, and image files
- Extracts energy usage, water consumption, fuel consumption, and costs
- Recognizes major Indian utility providers (MSEB, BESCOM, etc.)

### ESG Scoring
- Uses India-specific emission factors
- Benchmarks against industry standards
- Provides actionable improvement recommendations

### Gamification
- Bronze, Silver, Gold, and Platinum badges
- Sustainability pledges with progress tracking
- Achievement system to drive engagement

### AI Chatbot
- Context-aware responses based on your data
- Personalized sustainability recommendations
- ROI calculations for green investments
- Trend analysis and insights

## 🌱 Sustainability Impact

This platform helps MSMEs:
- Reduce carbon footprint by up to 35%
- Improve energy efficiency by 20-30%
- Achieve water savings of 15-25%
- Increase waste diversion by 40%
- Meet ESG reporting requirements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Deepwoods Green Initiatives Pvt Ltd
- Designed to support Indian MSME sustainability goals
- Powered by modern web technologies and AI

## 📞 Support

For support and questions, please contact:
- Email: support@deepwoodsgreen.com
- Website: [deepwoodsgreen.com](https://deepwoodsgreen.com)

---

**Made with ❤️ for a sustainable future**
