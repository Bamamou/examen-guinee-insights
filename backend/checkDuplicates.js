const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

console.log('Checking for duplicate PV 72052 records...');

db.all('SELECT * FROM exam_results WHERE pv_number = "72052"', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Found', rows.length, 'records for PV 72052:');
    rows.forEach((row, i) => {
      console.log(`${i+1}:`, {
        id: row.id,
        name: row.student_name,
        pv: row.pv_number,
        center: row.center,
        rank: row.rank,
        created_at: row.created_at
      });
    });
    
    // Check for other duplicate PVs
    console.log('\nChecking for other duplicate PVs...');
    db.all(`
      SELECT pv_number, COUNT(*) as count 
      FROM exam_results 
      GROUP BY pv_number 
      HAVING COUNT(*) > 1 
      ORDER BY count DESC 
      LIMIT 10
    `, (err2, duplicates) => {
      if (err2) {
        console.error('Error checking duplicates:', err2);
      } else {
        console.log('Top duplicate PVs:');
        duplicates.forEach(dup => {
          console.log(`PV ${dup.pv_number}: ${dup.count} records`);
        });
        
        // Check total records
        db.get('SELECT COUNT(*) as total FROM exam_results', (err3, total) => {
          if (err3) {
            console.error('Error getting total:', err3);
          } else {
            console.log(`\nTotal records in database: ${total.total}`);
          }
          db.close();
        });
      }
    });
  }
});
