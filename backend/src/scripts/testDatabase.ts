import { DatabaseManager } from '../database/database';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const db = DatabaseManager.getInstance();
    await db.initialize();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const result = await db.getDatabase().get('SELECT COUNT(*) as count FROM exam_results');
    console.log(`📊 Current records in database: ${result?.count || 0}`);
    
    await db.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testConnection();
