import { CSVImporter } from '../utils/csvImporter';
import { DatabaseManager } from '../database/database';
import * as path from 'path';

async function importCEEData() {
  try {
    console.log('🚀 Starting CEE data import...');
    
    // Initialize database
    const db = DatabaseManager.getInstance();
    await db.initialize();
    console.log('✅ Database connected');

    // Import CEE data
    const importer = new CSVImporter();
    const ceeFilePath = path.join(__dirname, '../../data/Resultats-CEE-DCE-DPE-2025.csv');
    
    console.log('📚 Importing CEE data from:', ceeFilePath);
    await importer.importFromCSV(ceeFilePath, 2025, 'CEE');
    
    // Check results
    const database = db.getDatabase();
    const result = await database.get(`
      SELECT COUNT(*) as count 
      FROM exam_results 
      WHERE exam_type = 'CEE' AND year = 2025
    `);
    
    console.log(`✅ Successfully imported ${result.count} CEE records`);
    
    // Check total records
    const totalResult = await database.get('SELECT COUNT(*) as count FROM exam_results');
    console.log(`📊 Total records in database: ${totalResult.count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ CEE import failed:', error);
    process.exit(1);
  }
}

// Run the import
importCEEData();
