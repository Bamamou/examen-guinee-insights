const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

console.log('Checking mention data correctly...');

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
      console.log(`  "${m.mention}": ${m.count} records`);
    });
    
    // Check a specific high-performing school to verify mentions
    console.log('\nChecking mentions for COLLEGE BAMBO:');
    db.all(`
      SELECT mention, COUNT(*) as count, passed
      FROM exam_results 
      WHERE school_origin = 'COLLEGE BAMBO' AND region = 'N''ZEREKORE'
      GROUP BY mention, passed
      ORDER BY count DESC
    `, (err2, schoolMentions) => {
      if (err2) {
        console.error('Error:', err2);
      } else {
        schoolMentions.forEach(m => {
          console.log(`  "${m.mention}" (passed=${m.passed}): ${m.count} students`);
        });
        
        // Now check the school stats calculation issue
        console.log('\nTesting current vs corrected mention counting:');
        db.all(`
          SELECT 
            school_origin as school,
            COUNT(*) as total_candidates,
            SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed,
            ROUND((SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) as pass_rate,
            SUM(CASE WHEN mention = 'TBIEN' THEN 1 ELSE 0 END) as tbien_current,
            SUM(CASE WHEN mention = 'BIEN' THEN 1 ELSE 0 END) as bien_current,
            SUM(CASE WHEN mention = 'ABIEN' THEN 1 ELSE 0 END) as abien_current,
            -- Corrected counting
            SUM(CASE WHEN TRIM(mention) = 'TBIEN' THEN 1 ELSE 0 END) as tbien_corrected,
            SUM(CASE WHEN TRIM(mention) = 'BIEN' THEN 1 ELSE 0 END) as bien_corrected,
            SUM(CASE WHEN TRIM(mention) = 'ABIEN' THEN 1 ELSE 0 END) as abien_corrected
          FROM exam_results 
          WHERE school_origin = 'COLLEGE BAMBO' AND region = 'N''ZEREKORE'
          GROUP BY school_origin
        `, (err3, result) => {
          if (err3) {
            console.error('Error:', err3);
          } else {
            console.log('COLLEGE BAMBO statistics:');
            console.log(result[0]);
          }
          db.close();
        });
      }
    });
  }
});
