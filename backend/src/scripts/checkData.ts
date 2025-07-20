import { DatabaseManager } from '../database/database';

async function checkData() {
  const db = DatabaseManager.getInstance();
  await db.initialize();
  
  const database = db.getDatabase();
  
  // Check total records
  const total = await database.get('SELECT COUNT(*) as count FROM exam_results');
  console.log(`Total records: ${total.count}`);
  
  // Check BEPC records
  const bepc = await database.get('SELECT COUNT(*) as count FROM exam_results WHERE exam_type = "BEPC"');
  console.log(`BEPC records: ${bepc.count}`);
  
  // Check CEE records
  const cee = await database.get('SELECT COUNT(*) as count FROM exam_results WHERE exam_type = "CEE"');
  console.log(`CEE records: ${cee.count}`);
  
  // Check distinct exam types
  const types = await database.all('SELECT DISTINCT exam_type FROM exam_results');
  console.log('Available exam types:', types.map(t => t.exam_type));
  
  process.exit(0);
}

checkData().catch(console.error);
