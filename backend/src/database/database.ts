import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database | null = null;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async initialize(): Promise<void> {
    const dbPath = path.join(__dirname, '../../data/exams.db');
    console.log('Initializing database at:', dbPath);
    
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await this.createTables();
    console.log('Database initialized successfully');
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        exam_type TEXT NOT NULL,
        region TEXT NOT NULL,
        rank INTEGER NOT NULL,
        ex_aequo BOOLEAN DEFAULT FALSE,
        student_name TEXT NOT NULL,
        center TEXT NOT NULL,
        pv_number TEXT NOT NULL,
        school_origin TEXT NOT NULL,
        mention TEXT NOT NULL,
        passed BOOLEAN NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_year_exam ON exam_results(year, exam_type);
      CREATE INDEX IF NOT EXISTS idx_region ON exam_results(region);
      CREATE INDEX IF NOT EXISTS idx_school ON exam_results(school_origin);
      CREATE INDEX IF NOT EXISTS idx_student_name ON exam_results(student_name);
      CREATE INDEX IF NOT EXISTS idx_pv_number ON exam_results(pv_number);
      CREATE INDEX IF NOT EXISTS idx_mention ON exam_results(mention);
      CREATE INDEX IF NOT EXISTS idx_passed ON exam_results(passed);
      CREATE INDEX IF NOT EXISTS idx_rank ON exam_results(rank);

      CREATE TABLE IF NOT EXISTS region_stats_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        exam_type TEXT NOT NULL,
        region TEXT NOT NULL,
        total_candidates INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        failed INTEGER NOT NULL,
        pass_rate REAL NOT NULL,
        tbien_count INTEGER NOT NULL,
        bien_count INTEGER NOT NULL,
        assez_bien_count INTEGER NOT NULL,
        passable_count INTEGER NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, exam_type, region)
      );

      CREATE TABLE IF NOT EXISTS school_stats_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        exam_type TEXT NOT NULL,
        school TEXT NOT NULL,
        region TEXT NOT NULL,
        total_candidates INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        pass_rate REAL NOT NULL,
        best_rank INTEGER,
        tbien_count INTEGER NOT NULL,
        bien_count INTEGER NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, exam_type, school)
      );
    `);
  }

  getDatabase(): Database {
    if (!this.db) throw new Error('Database not initialized');
    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
