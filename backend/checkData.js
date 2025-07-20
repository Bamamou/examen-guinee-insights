const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

console.log('Checking database contents...');

db.all('SELECT * FROM exam_results', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Total rows:', rows.length);
    console.log('Sample data:');
    rows.slice(0, 5).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });
    
    // Check for PV 72052
    const foundPV = rows.find(row => row.pv_number && row.pv_number.includes('72052'));
    console.log('\nSearching for PV 72052:', foundPV ? 'FOUND' : 'NOT FOUND');
    
    if (foundPV) {
      console.log('Found PV:', foundPV);
    }
  }
  db.close();
});
