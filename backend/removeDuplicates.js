// Remove duplicate records from the database
const { DatabaseManager } = require('./dist/database/database.js');

async function removeDuplicates() {
  try {
    console.log('🧹 Removing duplicate records...\n');
    
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    const db = dbManager.getDatabase();
    
    // Check total records before cleanup
    const beforeCount = await db.get('SELECT COUNT(*) as count FROM exam_results');
    console.log(`📊 Records before cleanup: ${beforeCount.count}`);
    
    // Find duplicates based on key fields (student_name, pv_number, exam_type, year)
    console.log('\n🔍 Finding duplicates...');
    const duplicates = await db.all(`
      SELECT student_name, pv_number, exam_type, year, COUNT(*) as count, MIN(ROWID) as keep_id
      FROM exam_results 
      GROUP BY student_name, pv_number, exam_type, year
      HAVING count > 1
      ORDER BY count DESC
    `);
    
    console.log(`Found ${duplicates.length} sets of duplicate records`);
    
    if (duplicates.length > 0) {
      console.log('\n🗑️ Removing duplicates (keeping first occurrence)...');
      
      await db.exec('BEGIN TRANSACTION');
      
      let totalRemoved = 0;
      for (const duplicate of duplicates) {
        // Delete all but the first occurrence (lowest ROWID)
        const result = await db.run(`
          DELETE FROM exam_results 
          WHERE student_name = ? AND pv_number = ? AND exam_type = ? AND year = ? 
          AND ROWID != ?
        `, [duplicate.student_name, duplicate.pv_number, duplicate.exam_type, duplicate.year, duplicate.keep_id]);
        
        const removed = duplicate.count - 1; // Keep one, remove the rest
        totalRemoved += removed;
        console.log(`   Removed ${removed} duplicates for ${duplicate.student_name} (PV: ${duplicate.pv_number})`);
      }
      
      await db.exec('COMMIT');
      
      // Check total records after cleanup
      const afterCount = await db.get('SELECT COUNT(*) as count FROM exam_results');
      console.log(`\n📊 Records after cleanup: ${afterCount.count}`);
      console.log(`✅ Successfully removed ${totalRemoved} duplicate records!`);
      
      // Verify specific case
      console.log('\n🔍 Verifying MOÏSE ZEZE BEAVOGUI...');
      const verification = await db.all(`
        SELECT * FROM exam_results 
        WHERE student_name LIKE '%MOÏSE%ZEZE%BEAVOGUI%'
      `);
      console.log(`Now has ${verification.length} record(s) (should be 1)`);
      
    } else {
      console.log('✅ No duplicates found to remove');
    }
    
    console.log('\n✅ Duplicate removal completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    process.exit(1);
  }
}

removeDuplicates();
