# 🚀 Deployment Guide for Guinea Exam Insights

## Overview
This project is configured for deployment with:
- **Frontend**: GitHub Pages (Static hosting)
- **Backend**: Render.com (Free tier with persistent storage)

## 🎯 Live Application
- **Frontend**: https://bamamou.github.io/examen-guinee-insights/
- **Backend API**: https://examen-guinee-insights-backend.onrender.com

## 📋 Deployment Steps

### 1. Backend Deployment (Render.com)

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Connect GitHub Repository**: 
   - Go to Dashboard → New → Web Service
   - Connect your GitHub account
   - Select the `examen-guinee-insights` repository

3. **Configure Service**:
   - **Name**: `examen-guinee-insights-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm run render-start`
   - **Plan**: Free
   
4. **Environment Variables**:
   ```
   NODE_ENV=production
   ```

5. **Deploy**: Click "Create Web Service"

### 2. Frontend Deployment (GitHub Pages)

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

2. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

3. **GitHub Actions**: The workflow will automatically:
   - Install dependencies
   - Build the React app with production API URL
   - Deploy to GitHub Pages

## 🔧 Configuration Files

### Frontend Configuration
- `vite.config.ts`: Base path for GitHub Pages
- `.env.production`: Production API URL
- `.github/workflows/deploy.yml`: GitHub Actions workflow

### Backend Configuration
- `render.yaml`: Render.com service configuration
- `.env.production`: Production environment variables
- `build.sh` & `start.sh`: Deployment scripts

## 🌐 API Endpoints

### Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://examen-guinee-insights-backend.onrender.com`

### Available Endpoints
- `GET /health` - Health check
- `GET /api/exam/results` - Search exam results
- `GET /api/exam/stats/dashboard` - Dashboard statistics
- `GET /api/exam/stats/regions` - Regional statistics
- `GET /api/exam/stats/schools` - School statistics

## 📊 Data Management

### Database
- **Development**: Local SQLite file
- **Production**: Persistent disk storage on Render.com

### Data Import
- Automatic data import on first deployment
- 90K+ BEPC 2025 records with proper mention handling
- "Non spécifié" students correctly marked as passed

## 🔒 Security Features

- **CORS**: Configured for GitHub Pages domain
- **Environment Variables**: Separate dev/prod configurations
- **Error Handling**: Graceful API error responses
- **Rate Limiting**: Built into Render.com free tier

## 📱 Features

### Frontend (React + TypeScript)
- **Neumorphic UI**: Modern, tactile design system
- **Responsive**: Mobile-friendly interface
- **Real-time Search**: Live exam result filtering
- **Interactive Charts**: Regional and school statistics
- **Error Handling**: User-friendly error messages

### Backend (Node.js + Express)
- **REST API**: Full CRUD operations
- **SQLite Database**: Efficient data storage
- **TypeScript**: Type-safe backend code
- **Data Import**: CSV processing for large datasets
- **Statistics**: Complex aggregations and analytics

## 🚀 Deployment Status

✅ **Frontend**: GitHub Pages deployment ready  
✅ **Backend**: Render.com deployment ready  
✅ **Database**: Data import configured  
✅ **CORS**: Cross-origin requests configured  
✅ **Environment**: Production/development separation  

## 🔄 Updates and Maintenance

### Frontend Updates
- Push to `main` branch triggers automatic deployment
- Build artifacts cached for faster deployments

### Backend Updates
- Auto-deploy on push to connected repository
- Zero-downtime deployments on Render.com
- Persistent data storage maintained

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs for frontend issues
2. Check Render.com logs for backend issues
3. Verify CORS configuration if API calls fail
4. Ensure environment variables are properly set

The application is now production-ready with professional hosting! 🎉
