// Test the API endpoints directly
const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/dashboard/stats?year=2025&examType=BEPC',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Dashboard API Response:');
      console.log(JSON.parse(data));
      
      // Test region stats too
      testRegionStats();
    });
  });

  req.on('error', (error) => {
    console.error('API test failed:', error.message);
    console.log('Backend server may not be running. Starting backend...');
    
    // Start backend server
    const { spawn } = require('child_process');
    const backend = spawn('node', ['dist/server.js'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // Test again after 3 seconds
    setTimeout(() => {
      testAPI();
    }, 3000);
  });

  req.end();
}

function testRegionStats() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/regions/stats?year=2025&examType=BEPC',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\nRegion Stats API Response (first 3 regions):');
      const regions = JSON.parse(data).data.slice(0, 3);
      regions.forEach(region => {
        console.log(`${region.region}: ${region.passed}/${region.total_candidates} = ${region.pass_rate}%`);
      });
      
      console.log('\nAPI test completed successfully! ✅');
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('Region API test failed:', error.message);
    process.exit(1);
  });

  req.end();
}

console.log('Testing API endpoints...');
testAPI();
