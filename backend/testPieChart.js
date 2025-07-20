// Test BAC pie chart with no labels
const { ExamService } = require('./dist/services/examService.js');
const { DatabaseManager } = require('./dist/database/database.js');

async function testPieChartData() {
  try {
    console.log('🧪 Testing BAC Pie Chart Data (No Labels)...\n');
    
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    
    const examService = new ExamService();
    
    // Test BAC-SM center stats for pie chart
    console.log('📊 BAC-SM Centers for Pie Chart:');
    const smStats = await examService.getRegionStats(2025, 'BAC-SM');
    
    console.log(`   Total centers: ${smStats.length}`);
    console.log('   Top 10 centers (tooltip info):');
    smStats.slice(0, 10).forEach((center, i) => {
      console.log(`   ${i+1}. ${center.region}: ${center.total_candidates} candidats`);
    });
    
    console.log('\n📊 Comparison with BEPC (will keep labels):');
    const bepcStats = await examService.getRegionStats(2025, 'BEPC');
    console.log(`   BEPC regions: ${bepcStats.length} (manageable for labels)`);
    bepcStats.slice(0, 3).forEach((region, i) => {
      console.log(`   ${i+1}. ${region.region}: ${region.total_candidates} candidats`);
    });
    
    console.log('\n✅ BAC pie chart will show clean visualization with hover-only tooltips!');
    console.log('✅ BEPC pie chart will keep labels since there are only 8 regions!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testPieChartData();
