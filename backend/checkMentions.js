const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

console.log('Checking mention data and mapping...');

// Check what mention values exist in the database
db.all(`
  SELECT mention, COUNT(*) as count 
  FROM exam_results 
  GROUP BY mention 
  ORDER BY count DESC
`, (err, mentions) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('All mentions in database:');
    mentions.forEach(m => {
      console.log(`  ${m.mention}: ${m.count} records`);
    });
    
    // Check a specific high-performing school to verify mentions
    console.log('\nChecking mentions for COLLEGE BAMBO (best performing school):');
    db.all(`
      SELECT mention, COUNT(*) as count, passed
      FROM exam_results 
      WHERE school_origin = 'COLLEGE BAMBO' AND region = 'N\\'ZEREKORE'
      GROUP BY mention, passed
      ORDER BY count DESC
    `, (err2, schoolMentions) => {
      if (err2) {
        console.error('Error:', err2);
      } else {
        schoolMentions.forEach(m => {
          console.log(`  ${m.mention} (passed=${m.passed}): ${m.count} students`);
        });
      }
      db.close();
    });
  }
});
