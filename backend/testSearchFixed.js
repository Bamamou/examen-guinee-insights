// Test search functionality after duplicate removal
const { ExamService } = require('./dist/services/examService.js');
const { DatabaseManager } = require('./dist/database/database.js');

async function testSearchAfterCleanup() {
  try {
    console.log('🧪 Testing search functionality after duplicate removal...\n');
    
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    
    const examService = new ExamService();
    
    // Test search for MOÏSE ZEZE BEAVOGUI
    console.log('🔍 Searching for "MOÏSE ZEZE BEAVOGUI":');
    const searchResults = await examService.getExamResults({
      year: 2025,
      examType: 'BAC-SM',
      searchQuery: 'MOÏSE ZEZE BEAVOGUI',
      searchType: 'name',
      limit: 10,
      offset: 0
    });
    
    console.log(`   Found ${searchResults.total} total results`);
    console.log(`   Returned ${searchResults.results.length} results:`);
    
    searchResults.results.forEach((result, i) => {
      console.log(`   ${i+1}. ${result.student_name} (PV: ${result.pv_number}) - Rank: ${result.rank}`);
    });
    
    // Test search for a common name to see if duplicates exist
    console.log('\n🔍 Searching for "THIERNO":');
    const commonSearch = await examService.getExamResults({
      year: 2025,
      examType: 'BAC-SM',
      searchQuery: 'THIERNO',
      searchType: 'name',
      limit: 5,
      offset: 0
    });
    
    console.log(`   Found ${commonSearch.total} total results`);
    console.log(`   First 5 results:`);
    
    commonSearch.results.forEach((result, i) => {
      console.log(`   ${i+1}. ${result.student_name} (PV: ${result.pv_number}) - Rank: ${result.rank}`);
    });
    
    // Check if any duplicates still exist by PV number
    console.log('\n🔍 Checking for any remaining duplicates by PV...');
    const db = dbManager.getDatabase();
    const remainingDuplicates = await db.all(`
      SELECT pv_number, student_name, COUNT(*) as count
      FROM exam_results 
      WHERE exam_type LIKE 'BAC-%'
      GROUP BY pv_number, student_name
      HAVING count > 1
      LIMIT 5
    `);
    
    if (remainingDuplicates.length > 0) {
      console.log('❌ Still found duplicates:');
      remainingDuplicates.forEach(dup => {
        console.log(`   PV ${dup.pv_number} (${dup.student_name}): ${dup.count} records`);
      });
    } else {
      console.log('✅ No duplicates found - search should work perfectly now!');
    }
    
    console.log('\n✅ Search functionality test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testSearchAfterCleanup();
