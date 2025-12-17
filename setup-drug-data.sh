#!/bin/bash
# Quick Start Script for Drug & Medicine Data Integration

echo "🏥 Pharmacy Drug & Medicine Integration Setup"
echo "=============================================="
echo ""

# Check if csv-parser is installed
echo "📦 Installing required dependencies..."
npm install csv-parser

echo ""
echo "✅ Dependencies installed!"
echo ""

# Display database schema info
echo "📚 Database Schema Information:"
echo "Tables to be created:"
echo "  1. drugs - Main drug database"
echo "  2. medicines - Global medicine dataset" 
echo "  3. medicines_india - Indian pharmaceutical medicines"
echo "  4. drug_reviews - Reviews and sentiment analysis"
echo "  5. pharma_companies - Pharmaceutical company data"
echo "  6. search_history - User search tracking"
echo ""

echo "🔄 Ready to import data!"
echo ""
echo "Next steps:"
echo "1. Make sure MySQL is running"
echo "2. Update .env with your database credentials"
echo "3. Run: cd database && node import-all-data.cjs"
echo "4. Then start: npm run dev"
echo ""
echo "✨ For more details, see DATA_INTEGRATION_GUIDE.md"
