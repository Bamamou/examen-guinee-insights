// Check BAC centers and their distribution
const { DatabaseManager } = require('./dist/database/database.js');

async function checkBacCenters() {
  try {
    console.log('🔍 Analyzing BAC centers...\n');
    
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    const db = dbManager.getDatabase();
    
    // Check all BAC exam types
    const bacTypes = ['BAC-SM', 'BAC-SE', 'BAC-SS'];
    
    for (const bacType of bacTypes) {
      console.log(`📊 ${bacType} Centers:`);
      
      // Get centers with candidate counts
      const centers = await db.all(`
        SELECT 
          center,
          COUNT(*) as total_candidates,
          SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed,
          ROUND((SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) as pass_rate
        FROM exam_results 
        WHERE exam_type = ? AND year = 2025
        GROUP BY center
        ORDER BY total_candidates DESC
        LIMIT 10
      `, [bacType]);
      
      console.log(`   Total centers: ${centers.length}`);
      console.log('   Top centers by candidates:');
      centers.slice(0, 5).forEach((center, i) => {
        console.log(`   ${i+1}. ${center.center}: ${center.total_candidates} candidates (${center.pass_rate}% pass rate)`);
      });
      console.log('');
    }
    
    // Check regions for comparison
    console.log('🌍 Regions in BAC data:');
    const regions = await db.all(`
      SELECT DISTINCT region, COUNT(*) as count
      FROM exam_results 
      WHERE exam_type LIKE 'BAC-%' AND year = 2025
      GROUP BY region
      ORDER BY count DESC
    `);
    
    regions.forEach(region => {
      console.log(`   ${region.region}: ${region.count} records`);
    });
    
    console.log('\n✅ Analysis completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBacCenters();
