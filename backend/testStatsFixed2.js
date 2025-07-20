// Test script to verify fixed mention mapping with proper initialization
const { DatabaseManager } = require('./dist/database/database.js');
const { ExamService } = require('./dist/services/examService.js');

async function testStats() {
  try {
    // Initialize database first
    console.log('Initializing database...');
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    
    const examService = new ExamService();
    
    console.log('Testing Dashboard Stats...');
    const dashboardStats = await examService.getDashboardStats(2025, 'BEPC');
    console.log('Dashboard Stats:', JSON.stringify(dashboardStats, null, 2));
    
    console.log('\nTesting Region Stats...');
    const regionStats = await examService.getRegionStats(2025, 'BEPC');
    console.log('Number of regions:', regionStats.length);
    
    // Show stats for a few regions
    const sampleRegions = regionStats.slice(0, 3);
    sampleRegions.forEach(region => {
      console.log(`Region: ${region.region}`);
      console.log(`  Total: ${region.total_candidates}`);
      console.log(`  Passed: ${region.passed}`);
      console.log(`  Pass Rate: ${region.pass_rate}%`);
      console.log(`  Mentions - TBIEN: ${region.tbien_count}, BIEN: ${region.bien_count}, ABIEN: ${region.assez_bien_count}, Passable (Non spécifié + passed): ${region.passable_count}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testStats();
