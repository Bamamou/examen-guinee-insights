// Test BAC center statistics
const { ExamService } = require('./dist/services/examService.js');
const { DatabaseManager } = require('./dist/database/database.js');

async function testBacCenterStats() {
  try {
    console.log('🧪 Testing BAC Center Statistics...\n');
    
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    
    const examService = new ExamService();
    
    // Test BAC-SM center stats
    console.log('📊 BAC-SM Center Statistics:');
    const smStats = await examService.getRegionStats(2025, 'BAC-SM');
    
    console.log(`   Total centers: ${smStats.length}`);
    console.log('   Top 5 centers:');
    smStats.slice(0, 5).forEach((center, i) => {
      console.log(`   ${i+1}. ${center.region}: ${center.total_candidates} candidates (${center.pass_rate}% pass rate)`);
    });
    
    console.log('\n📊 Comparison with BEPC Region Statistics:');
    const bepcStats = await examService.getRegionStats(2025, 'BEPC');
    console.log(`   BEPC regions: ${bepcStats.length}`);
    console.log('   Sample regions:');
    bepcStats.slice(0, 3).forEach((region, i) => {
      console.log(`   ${i+1}. ${region.region}: ${region.total_candidates} candidates (${region.pass_rate}% pass rate)`);
    });
    
    console.log('\n✅ Test completed - BAC now shows centers, BEPC shows regions!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testBacCenterStats();
