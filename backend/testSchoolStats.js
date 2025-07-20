const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/exams.db');

console.log('Testing school statistics calculations...');

// Test with a specific school to verify calculations
db.all(`
  SELECT 
    school_origin as school,
    region,
    COUNT(*) as total_candidates,
    SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed,
    ROUND(AVG(CASE WHEN passed = 1 THEN 100.0 ELSE 0.0 END), 2) as pass_rate_current,
    ROUND((SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) as pass_rate_correct,
    MIN(rank) as best_rank,
    SUM(CASE WHEN mention = 'TBIEN' THEN 1 ELSE 0 END) as tbien_count,
    SUM(CASE WHEN mention = 'BIEN' THEN 1 ELSE 0 END) as bien_count
  FROM exam_results 
  WHERE year = 2025 AND exam_type = 'BEPC'
  GROUP BY school_origin, region
  HAVING total_candidates >= 10
  ORDER BY total_candidates DESC
  LIMIT 5
`, (err, schools) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Top 5 schools by number of candidates:');
    console.log('');
    schools.forEach((school, i) => {
      console.log(`${i+1}. ${school.school} (${school.region})`);
      console.log(`   Total: ${school.total_candidates} candidates`);
      console.log(`   Passed: ${school.passed} candidates`);
      console.log(`   Current pass rate (incorrect): ${school.pass_rate_current}%`);
      console.log(`   Correct pass rate: ${school.pass_rate_correct}%`);
      console.log(`   Best rank: ${school.best_rank}`);
      console.log(`   Très Bien: ${school.tbien_count}, Bien: ${school.bien_count}`);
      console.log('');
    });
  }
  db.close();
});
