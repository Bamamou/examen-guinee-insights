const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

console.log('Searching for PV 72052 in database...');

db.all("SELECT * FROM exam_results WHERE pv_number LIKE '%72052%'", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Found rows with 72052:', rows.length);
    if (rows.length > 0) {
      console.log('First result:');
      console.log(rows[0]);
    }
  }
  
  // Also check exact match
  db.all("SELECT * FROM exam_results WHERE pv_number = '72052'", (err2, rows2) => {
    if (err2) {
      console.error('Error2:', err2);
    } else {
      console.log('Exact match for 72052:', rows2.length);
      if (rows2.length > 0) {
        console.log('Exact match result:');
        console.log(rows2[0]);
      }
    }
    
    // Check a few sample PV numbers to see the format
    db.all("SELECT pv_number FROM exam_results LIMIT 10", (err3, rows3) => {
      if (err3) {
        console.error('Error3:', err3);
      } else {
        console.log('Sample PV numbers:');
        rows3.forEach(row => console.log(`"${row.pv_number}"`));
      }
      db.close();
    });
  });
});
