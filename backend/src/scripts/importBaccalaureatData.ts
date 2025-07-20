import { CSVImporter } from '../utils/csvImporter';
import { DatabaseManager } from '../database/database';
import * as path from 'path';

async function importBaccalaureatData() {
  try {
    console.log('🚀 Starting Baccalauréat data import...');
    
    // Initialize database
    const db = DatabaseManager.getInstance();
    await db.initialize();
    console.log('✅ Database connected');

    const importer = new CSVImporter();
    const dataDir = path.join(__dirname, '../../data');
    
    // Import SE (Sciences Expérimentales)
    console.log('📚 Importing SE (Sciences Expérimentales) data...');
    await importer.importBaccalaureatFromCSV(
      path.join(dataDir, 'SE.csv'), 
      2025, 
      'SE'
    );
    
    // Import SM (Sciences Mathématiques)
    console.log('📚 Importing SM (Sciences Mathématiques) data...');
    await importer.importBaccalaureatFromCSV(
      path.join(dataDir, 'SM.csv'), 
      2025, 
      'SM'
    );
    
    // Import SS (Sciences Sociales)
    console.log('📚 Importing SS (Sciences Sociales) data...');
    await importer.importBaccalaureatFromCSV(
      path.join(dataDir, 'SS.csv'), 
      2025, 
      'SS'
    );
    
    // Check results
    const database = db.getDatabase();
    
    const seCount = await database.get(`
      SELECT COUNT(*) as count 
      FROM exam_results 
      WHERE exam_type = 'BAC-SE' AND year = 2025
    `);
    
    const smCount = await database.get(`
      SELECT COUNT(*) as count 
      FROM exam_results 
      WHERE exam_type = 'BAC-SM' AND year = 2025
    `);
    
    const ssCount = await database.get(`
      SELECT COUNT(*) as count 
      FROM exam_results 
      WHERE exam_type = 'BAC-SS' AND year = 2025
    `);
    
    console.log(`✅ Successfully imported:`);
    console.log(`   - SE: ${seCount.count} records`);
    console.log(`   - SM: ${smCount.count} records`);
    console.log(`   - SS: ${ssCount.count} records`);
    
    // Check total records
    const totalResult = await database.get('SELECT COUNT(*) as count FROM exam_results');
    console.log(`📊 Total records in database: ${totalResult.count}`);
    
    // Show all available exam types
    const examTypes = await database.all('SELECT DISTINCT exam_type FROM exam_results ORDER BY exam_type');
    console.log('📝 Available exam types:', examTypes.map(t => t.exam_type));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Baccalauréat import failed:', error);
    process.exit(1);
  }
}

// Run the import
importBaccalaureatData();
