#!/usr/bin/env node

// Simple deployment verification script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying deployment configuration...\n');

// Check if dist folder exists and has content
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ Build artifacts found in /dist');
  const files = fs.readdirSync(distPath);
  console.log(`   Files: ${files.join(', ')}`);
} else {
  console.log('❌ /dist folder not found. Run: npm run build');
}

// Check environment files
const envProd = path.join(__dirname, '.env.production');
if (fs.existsSync(envProd)) {
  console.log('✅ Production environment file found');
} else {
  console.log('❌ .env.production not found');
}

// Check GitHub Actions workflow
const workflowPath = path.join(__dirname, '.github/workflows/deploy.yml');
if (fs.existsSync(workflowPath)) {
  console.log('✅ GitHub Actions deployment workflow found');
} else {
  console.log('❌ GitHub Actions workflow not found');
}

// Check backend deployment files
const backendPath = path.join(__dirname, 'backend');
const buildScript = path.join(backendPath, 'build.sh');
const startScript = path.join(backendPath, 'start.sh');

if (fs.existsSync(buildScript) && fs.existsSync(startScript)) {
  console.log('✅ Backend deployment scripts found');
} else {
  console.log('❌ Backend deployment scripts missing');
}

// Check API configuration
const apiPath = path.join(__dirname, 'src/lib/api.ts');
if (fs.existsSync(apiPath)) {
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  if (apiContent.includes('import.meta.env.VITE_API_BASE_URL')) {
    console.log('✅ API configured for environment variables');
  } else {
    console.log('❌ API not configured for environment variables');
  }
} else {
  console.log('❌ API configuration file not found');
}

console.log('\n🚀 Deployment checklist:');
console.log('1. Push code to GitHub (triggers frontend deployment)');
console.log('2. Create Render.com web service connected to this repo');
console.log('3. Configure Render with build/start commands from backend/package.json');
console.log('4. Enable GitHub Pages with Actions source in repo settings');
console.log('\n✨ Your app will be live at:');
console.log('   Frontend: https://bamamou.github.io/examen-guinee-insights/');
console.log('   Backend:  https://your-render-app-name.onrender.com');
