#!/bin/bash
# Local deployment test script

echo "🚀 Testing Guinea Exam Insights Deployment"
echo "=========================================="

echo "📋 1. Installing dependencies..."
npm install

echo "📋 2. Building frontend for production..."
npm run build

echo "📋 3. Building backend..."
cd backend
npm install
npm run build

echo "📋 4. Testing backend data import..."
if [ ! -f "./data/exams.db" ]; then
  echo "Importing exam data..."
  node reImportData.js
fi

echo "📋 5. Starting backend server..."
npm run start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

echo "📋 6. Testing API endpoints..."
echo "Testing health endpoint..."
curl -f http://localhost:3001/health || echo "❌ Health check failed"

echo "Testing dashboard stats..."
curl -f "http://localhost:3001/api/exam/stats/dashboard?year=2025&examType=BEPC" || echo "❌ Dashboard stats failed"

echo "📋 7. Cleanup..."
kill $BACKEND_PID

echo "✅ Local deployment test completed!"
echo ""
echo "🌐 Ready for production deployment:"
echo "   Frontend: Push to GitHub for Pages deployment"
echo "   Backend: Deploy to Render.com with GitHub integration"
