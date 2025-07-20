// Script to re-import data with correct "Non spécifié" = passed logic
const { DatabaseManager } = require('./dist/database/database.js');
const { CSVImporter } = require('./dist/utils/csvImporter.js');
const fs = require('fs');

async function reImportData() {
  try {
    console.log('🔄 Re-importing data with correct "Non spécifié" = passed logic...');
    
    // Remove existing database
    const dbPath = './data/exams.db';
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('🗑️ Removed old database');
    }
    
    // Initialize fresh database
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    console.log('✅ Fresh database initialized');
    
    // Re-import with correct logic
    const importer = new CSVImporter();
    await importer.importMultipleFiles('./data', 2025, 'BEPC');
    
    console.log('🎉 Data re-imported successfully!');
    
    // Verify the new data
    const db = dbManager.getDatabase();
    
    // Check total records
    const total = await db.get('SELECT COUNT(*) as count FROM exam_results');
    console.log(`📊 Total records: ${total.count}`);
    
    // Check passed vs failed with new logic
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
             SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed_with_mention,
             SUM(CASE WHEN passed = 0 THEN 1 ELSE 0 END) as failed_with_mention
      FROM exam_results 
      GROUP BY mention 
      ORDER BY count DESC
    `);
    
    console.log('\n📋 Mention Distribution:');
    mentions.forEach(m => {
      console.log(`${m.mention}: ${m.count} total (${m.passed_with_mention} passed, ${m.failed_with_mention} failed)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

reImportData();
