const http = require('http');

console.log('🧪 Testing Backend Connection...');
console.log('📡 Checking if backend is running on http://localhost:3001');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend Status: ${res.statusCode}`);
  console.log(`📊 Response Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📋 Response Body:', data);
    
    if (res.statusCode === 200) {
      console.log('🎉 Backend is running successfully!');
      console.log('🌐 You can now start the frontend with: npm run dev');
    } else {
      console.log('⚠️ Backend responded but with unexpected status');
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Backend Connection Failed:', error.message);
  console.log('🔧 Make sure the backend is running on port 3001');
});

req.on('timeout', () => {
  console.log('⏰ Request timed out - backend may not be running');
  req.destroy();
});

req.end();
