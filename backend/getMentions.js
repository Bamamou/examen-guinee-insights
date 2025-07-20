const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

db.all('SELECT DISTINCT mention FROM exam_results ORDER BY mention', (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Distinct mention values:');
    rows.forEach(r => {
      console.log(`"${r.mention}"`);
    });
  }
  db.close();
});
