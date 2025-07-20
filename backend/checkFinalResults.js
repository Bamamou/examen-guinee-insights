// Quick test to check final import results
const { DatabaseManager } = require('./dist/database/database.js');

async function checkResults() {
  try {
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    const db = dbManager.getDatabase();
    
    // Check total records
    const total = await db.get('SELECT COUNT(*) as count FROM exam_results');
    console.log(`📊 Total records: ${total.count}`);
    
    // Check passed vs failed
    const passedStats = await db.get(`
      SELECT 
        SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed_count,
        SUM(CASE WHEN passed = 0 THEN 1 ELSE 0 END) as failed_count
      FROM exam_results
    `);
    
    console.log(`✅ Passed: ${passedStats.passed_count}`);
    console.log(`❌ Failed: ${passedStats.failed_count}`);
    console.log(`📈 Pass Rate: ${((passedStats.passed_count / total.count) * 100).toFixed(2)}%`);
    
    // Check mention distribution
    const mentions = await db.all(`
      SELECT mention, 
             COUNT(*) as count,
             SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed_with_mention
      FROM exam_results 
      GROUP BY mention 
      ORDER BY count DESC
    `);
    
    console.log('\n📋 Final Mention Distribution:');
    mentions.forEach(m => {
      console.log(`${m.mention}: ${m.count} total (${m.passed_with_mention} passed)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkResults();
