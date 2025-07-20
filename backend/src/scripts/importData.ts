import { CSVImporter } from '../utils/csvImporter';
import { DatabaseManager } from '../database/database';
import * as path from 'path';

async function main() {
  try {
    console.log('🚀 Starting data import process...');
    
    // Initialize database
    const db = DatabaseManager.getInstance();
    await db.initialize();
    console.log('✅ Database initialized');

    // Initialize CSV importer
    const importer = new CSVImporter();
    
    // CSV file path (update this to match your actual file location)
    const csvFilePath = path.join(__dirname, '../../data/Resulats-BEPC-DCE-DPE-2025.csv');
    const year = 2025;
    const examType = 'BEPC';

    console.log(`📂 Importing from: ${csvFilePath}`);
    console.log(`📊 Target: ${examType} ${year}`);

    // Import the data
    await importer.importFromCSV(csvFilePath, year, examType);
    
    console.log('✅ Data import completed successfully!');
    console.log('🔍 You can now start the server and test the API endpoints');

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    try {
      const db = DatabaseManager.getInstance();
      await db.close();
      console.log('✅ Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
    }
    process.exit(0);
  }
}

main();
