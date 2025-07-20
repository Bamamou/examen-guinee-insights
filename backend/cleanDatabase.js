const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

console.log('Cleaning up duplicate records...');

// First, let's see the current state
db.get('SELECT COUNT(*) as total FROM exam_results', (err, result) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('Current total records:', result.total);
  
  // Create a new table with unique records only
  console.log('Creating clean table...');
  
  db.serialize(() => {
    // Create temporary table
    db.run(`
      CREATE TABLE IF NOT EXISTS exam_results_clean AS
      SELECT 
        MIN(id) as id,
        year,
        exam_type,
        region,
        rank,
        ex_aequo,
        student_name,
        center,
        pv_number,
        school_origin,
        mention,
        passed,
        MIN(created_at) as created_at
      FROM exam_results
      GROUP BY year, exam_type, region, rank, student_name, center, pv_number, school_origin, mention
    `, (err) => {
      if (err) {
        console.error('Error creating clean table:', err);
        return;
      }
      
      // Check how many unique records we have
      db.get('SELECT COUNT(*) as total FROM exam_results_clean', (err, result) => {
        if (err) {
          console.error('Error counting clean records:', err);
          return;
        }
        
        console.log('Unique records:', result.total);
        
        // Replace the original table
        db.serialize(() => {
          db.run('DROP TABLE exam_results');
          db.run('ALTER TABLE exam_results_clean RENAME TO exam_results');
          
          console.log('Database cleaned! Duplicates removed.');
          
          // Verify the cleanup
          db.get('SELECT COUNT(*) as total FROM exam_results', (err, final) => {
            if (err) {
              console.error('Error verifying cleanup:', err);
            } else {
              console.log('Final record count:', final.total);
            }
            db.close();
          });
        });
      });
    });
  });
});
