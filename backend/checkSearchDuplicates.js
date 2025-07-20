// Check for duplicate records in the database
const { DatabaseManager } = require('./dist/database/database.js');

async function checkDuplicates() {
  try {
    console.log('🔍 Checking for duplicate records...\n');
    
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    const db = dbManager.getDatabase();
    
    // Check for duplicate students by PV number
    console.log('📊 Checking duplicates by PV number:');
    const pvDuplicates = await db.all(`
      SELECT pv_number, student_name, exam_type, COUNT(*) as count
      FROM exam_results 
      WHERE exam_type LIKE 'BAC-%'
      GROUP BY pv_number, student_name, exam_type
      HAVING count > 1
      ORDER BY count DESC, pv_number
      LIMIT 10
    `);
    
    if (pvDuplicates.length > 0) {
      console.log('❌ Found PV duplicates:');
      pvDuplicates.forEach(dup => {
        console.log(`   PV ${dup.pv_number} (${dup.student_name}, ${dup.exam_type}): ${dup.count} records`);
      });
    } else {
      console.log('✅ No PV duplicates found');
    }
    
    // Check for duplicate students by name and exam type
    console.log('\n📊 Checking duplicates by student name:');
    const nameDuplicates = await db.all(`
      SELECT student_name, exam_type, COUNT(*) as count
      FROM exam_results 
      WHERE exam_type LIKE 'BAC-%'
      GROUP BY student_name, exam_type
      HAVING count > 1
      ORDER BY count DESC, student_name
      LIMIT 10
    `);
    
    if (nameDuplicates.length > 0) {
      console.log('❌ Found name duplicates:');
      nameDuplicates.forEach(dup => {
        console.log(`   ${dup.student_name} (${dup.exam_type}): ${dup.count} records`);
      });
    } else {
      console.log('✅ No name duplicates found');
    }
    
    // Check specific example from screenshot
    console.log('\n📊 Checking specific case: MOÏSE ZEZE BEAVOGUI');
    const specificCase = await db.all(`
      SELECT * FROM exam_results 
      WHERE student_name LIKE '%MOÏSE%ZEZE%BEAVOGUI%'
      ORDER BY pv_number
    `);
    
    console.log(`Found ${specificCase.length} records for MOÏSE ZEZE BEAVOGUI:`);
    specificCase.forEach((record, i) => {
      console.log(`   ${i+1}. PV: ${record.pv_number}, Rank: ${record.rank}, School: ${record.school_origin}, Center: ${record.center}`);
    });
    
    console.log('\n✅ Duplicate analysis completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDuplicates();
