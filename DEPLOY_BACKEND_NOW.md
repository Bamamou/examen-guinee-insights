# 🚀 Backend Deployment - Render.com Setup

## **URGENT: Deploy Backend to Fix Port Issues**

Your frontend is live but can't connect to the backend because it's not deployed yet. Follow these steps:

---

## **Step 1: Deploy to Render.com (Free)**

### **1.1 Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### **1.2 Create New Web Service**
1. Click **"New"** → **"Web Service"**
2. Connect your repository: `Bamamou/examen-guinee-insights`
3. Select the repository from the list

### **1.3 Configure Service Settings**
```
Name: examen-guinee-insights-backend
Environment: Node
Region: Any (US East recommended for speed)
Branch: main
Root Directory: backend
Build Command: npm run render-build
Start Command: npm run render-start
```

### **1.4 Set Environment Variables**
```
NODE_ENV=production
PORT=$PORT
```

### **1.5 Configure Plan**
- **Instance Type**: Free (sufficient for this app)
- **Auto-Deploy**: Yes (recommended)

---

## **Step 2: Add Data Files**

Since Render.com needs the CSV data, let me copy the data file to the backend directory:

```bash
# Run this in your local terminal:
cd backend
mkdir -p data
cp ../public/Resultats-CEE-DCE-DPE-2025.csv data/
```

---

## **Step 3: Update Repository**

```bash
# Commit the backend changes
git add .
git commit -m "Add backend deployment configuration and auto data import"
git push origin main
```

---

## **Step 4: Deploy!**

1. Click **"Create Web Service"** on Render.com
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://examen-guinee-insights-backend.onrender.com`

---

## **Step 5: Update Frontend API URL**

Once your backend is deployed, the frontend will automatically connect to:
```
https://examen-guinee-insights-backend.onrender.com
```

---

## **Verification Steps:**

### **Test Backend Health**
Visit: `https://your-app-name.onrender.com/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-07-20T...",
  "service": "Guinea Exam Insights API"
}
```

### **Test API Endpoints**
```
Dashboard: https://your-app-name.onrender.com/api/exam/stats/dashboard?year=2025&examType=BEPC
Search: https://your-app-name.onrender.com/api/exam/results?search=72052
```

---

## **Expected Timeline:**
- **Render.com signup**: 2 minutes
- **Service configuration**: 3 minutes  
- **First deployment**: 5-10 minutes
- **Total time**: ~15 minutes

After deployment, your GitHub Pages frontend will automatically connect to the live backend and the port errors will be resolved! 🎉

---

## **Alternative: Temporary Mock Data**

If you want to test the frontend immediately without deploying the backend, I can configure it to use mock data temporarily.
