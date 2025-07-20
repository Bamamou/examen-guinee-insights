// Check students with "Non spécifié" mention who passed
const { DatabaseManager } = require('./dist/database/database.js');

async function checkPassableStudents() {
  try {
    const dbManager = DatabaseManager.getInstance();
    await dbManager.initialize();
    const db = dbManager.getDatabase();
    
    // Check students with "Non spécifié" who passed
    const passableStudents = await db.all(`
      SELECT COUNT(*) as count 
      FROM exam_results 
      WHERE mention = 'Non spécifié' AND passed = 1
    `);
    
    console.log('Students with "Non spécifié" mention who passed:', passableStudents[0].count);
    
    // Check distribution of all passed students by mention
    const mentionDistribution = await db.all(`
      SELECT mention, COUNT(*) as count 
      FROM exam_results 
      WHERE passed = 1
      GROUP BY mention
      ORDER BY count DESC
    `);
    
    console.log('\nDistribution of passed students by mention:');
    mentionDistribution.forEach(row => {
      console.log(`${row.mention}: ${row.count}`);
    });
    
    // Check total passed students
    const totalPassed = await db.get(`
      SELECT COUNT(*) as count 
      FROM exam_results 
      WHERE passed = 1
    `);
    
    console.log('\nTotal passed students:', totalPassed.count);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPassableStudents();
