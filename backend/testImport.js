// Simple test to import some basic data
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'exams.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Insert some test data
const testData = [
  {
    year: 2025,
    exam_type: 'BEPC',
    region: 'Conakry',
    rank: 1,
    ex_aequo: 0,
    student_name: 'Test Student 1',
    center: 'Conakry/Centre Test',
    pv_number: 'PV001',
    school_origin: 'Ecole Test',
    mention: 'TBIEN',
    passed: 1
  },
  {
    year: 2025,
    exam_type: 'BEPC', 
    region: 'Conakry',
    rank: 2,
    ex_aequo: 0,
    student_name: 'Test Student 2',
    center: 'Conakry/Centre Test',
    pv_number: 'PV002',
    school_origin: 'Ecole Test',
    mention: 'BIEN',
    passed: 1
  }
];

const stmt = db.prepare(`
  INSERT OR REPLACE INTO exam_results 
  (year, exam_type, region, rank, ex_aequo, student_name, center, pv_number, school_origin, mention, passed)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

testData.forEach((data) => {
  stmt.run([
    data.year,
    data.exam_type,
    data.region,
    data.rank,
    data.ex_aequo,
    data.student_name,
    data.center,
    data.pv_number,
    data.school_origin,
    data.mention,
    data.passed
  ]);
});

stmt.finalize((err) => {
  if (err) {
    console.error('Error inserting data:', err);
  } else {
    console.log('Test data inserted successfully');
  }
  
  // Close database
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
});
