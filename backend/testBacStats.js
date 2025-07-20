// Test BAC statistics with official numbers
const { ExamService } = require('./dist/services/examService.js');
const { DatabaseManager } = require('./dist/database/database.js');

async function testBacStats() {
  try {
    console.log('🧪 Testing BAC 2025 Official Statistics...\n');
    
    // Initialize database
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    
    const examService = new ExamService();
    
    // Test each BAC stream
    const streams = ['BAC-SM', 'BAC-SE', 'BAC-SS'];
    
    for (const stream of streams) {
      console.log(`📊 ${stream} Statistics:`);
      
      const stats = await examService.getDashboardStats(2025, stream);
      console.log(`   Total Candidates: ${stats.totalCandidates.toLocaleString()}`);
      console.log(`   Passed: ${stats.passedCandidates.toLocaleString()}`);
      console.log(`   Pass Rate: ${stats.passRate}%`);
      console.log(`   Schools: ${stats.totalSchools}`);
      console.log(`   Regions: ${stats.totalRegions}\n`);
    }
    
    console.log('✅ Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testBacStats();
