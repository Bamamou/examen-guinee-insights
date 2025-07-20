import { DatabaseManager } from '../database/database';
import { ExamResult, RegionStats, SchoolStats, DashboardStats, SearchFilters } from '../database/schema';

export class ExamService {
  private getDb() {
    return DatabaseManager.getInstance().getDatabase();
  }

  async getExamResults(filters: SearchFilters): Promise<{ results: ExamResult[], total: number }> {
    let query = 'SELECT * FROM exam_results WHERE 1=1';
    const params: (number | string)[] = [];

    if (filters.year) {
      query += ' AND year = ?';
      params.push(filters.year);
    }

    if (filters.examType) {
      query += ' AND exam_type = ?';
      params.push(filters.examType);
    }

    if (filters.region) {
      query += ' AND region = ?';
      params.push(filters.region);
    }

    if (filters.school) {
      query += ' AND school_origin LIKE ?';
      params.push(`%${filters.school}%`);
    }

    if (filters.mention) {
      query += ' AND mention = ?';
      params.push(filters.mention);
    }

    if (filters.searchQuery && filters.searchType) {
      switch (filters.searchType) {
        case 'name':
          query += ' AND student_name LIKE ?';
          params.push(`%${filters.searchQuery}%`);
          break;
        case 'pv':
          query += ' AND pv_number LIKE ?';
          params.push(`%${filters.searchQuery}%`);
          break;
        case 'school':
          query += ' AND school_origin LIKE ?';
          params.push(`%${filters.searchQuery}%`);
          break;
      }
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const countResult = await this.getDb().get(countQuery, params);
    const total = countResult.count;

    // Add ordering and pagination
    query += ' ORDER BY rank ASC, student_name ASC';
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const results = await this.getDb().all(query, params);
    return { results, total };
  }

  async getRegionStats(year: number, examType: string): Promise<RegionStats[]> {
    return await this.getDb().all(`
      SELECT 
        region,
        COUNT(*) as total_candidates,
        SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN passed = 0 THEN 1 ELSE 0 END) as failed,
        ROUND(AVG(CASE WHEN passed = 1 THEN 100.0 ELSE 0.0 END), 2) as pass_rate,
        SUM(CASE WHEN mention = 'TBIEN' THEN 1 ELSE 0 END) as tbien_count,
        SUM(CASE WHEN mention = 'BIEN' THEN 1 ELSE 0 END) as bien_count,
        SUM(CASE WHEN mention = 'ABIEN' THEN 1 ELSE 0 END) as assez_bien_count,
        SUM(CASE WHEN mention = 'Non spécifié' THEN 1 ELSE 0 END) as passable_count
      FROM exam_results 
      WHERE year = ? AND exam_type = ?
      GROUP BY region
      ORDER BY pass_rate DESC, total_candidates DESC
    `, [year, examType]);
  }

  async getSchoolStats(year: number, examType: string, region?: string): Promise<SchoolStats[]> {
    let query = `
      SELECT 
        school_origin as school,
        region,
        COUNT(*) as total_candidates,
        SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed,
        ROUND(AVG(CASE WHEN passed = 1 THEN 100.0 ELSE 0.0 END), 2) as pass_rate,
        MIN(rank) as best_rank,
        SUM(CASE WHEN mention = 'TBIEN' THEN 1 ELSE 0 END) as tbien_count,
        SUM(CASE WHEN mention = 'BIEN' THEN 1 ELSE 0 END) as bien_count
      FROM exam_results 
      WHERE year = ? AND exam_type = ?
    `;
    const params = [year, examType];

    if (region) {
      query += ' AND region = ?';
      params.push(region);
    }

    query += `
      GROUP BY school_origin, region
      HAVING total_candidates >= 3
      ORDER BY pass_rate DESC, best_rank ASC
      LIMIT 50
    `;

    return await this.getDb().all(query, params);
  }

  async getDashboardStats(year: number, examType: string): Promise<DashboardStats> {
    const totalCandidates = await this.getDb().get(`
      SELECT COUNT(*) as count FROM exam_results 
      WHERE year = ? AND exam_type = ?
    `, [year, examType]);

    const passedCandidates = await this.getDb().get(`
      SELECT COUNT(*) as count FROM exam_results 
      WHERE year = ? AND exam_type = ? AND passed = 1
    `, [year, examType]);

    const mentionStats = await this.getDb().get(`
      SELECT 
        SUM(CASE WHEN mention = 'TBIEN' THEN 1 ELSE 0 END) as tbien_count,
        SUM(CASE WHEN mention = 'BIEN' THEN 1 ELSE 0 END) as bien_count,
        SUM(CASE WHEN mention = 'ABIEN' THEN 1 ELSE 0 END) as assez_bien_count,
        SUM(CASE WHEN mention = 'Non spécifié' THEN 1 ELSE 0 END) as passable_count
      FROM exam_results 
      WHERE year = ? AND exam_type = ?
    `, [year, examType]);

    const regionCount = await this.getDb().get(`
      SELECT COUNT(DISTINCT region) as count FROM exam_results 
      WHERE year = ? AND exam_type = ?
    `, [year, examType]);

    const schoolCount = await this.getDb().get(`
      SELECT COUNT(DISTINCT school_origin) as count FROM exam_results 
      WHERE year = ? AND exam_type = ?
    `, [year, examType]);

    const bestRegion = await this.getDb().get(`
      SELECT region, ROUND(AVG(CASE WHEN passed = 1 THEN 100.0 ELSE 0.0 END), 2) as pass_rate
      FROM exam_results 
      WHERE year = ? AND exam_type = ?
      GROUP BY region
      ORDER BY pass_rate DESC
      LIMIT 1
    `, [year, examType]);

    // Use official statistics for 2025 exams
    let realTotalCandidates = totalCandidates.count;
    let realPassRate = ((passedCandidates.count / totalCandidates.count) * 100);
    
    if (year === 2025) {
      if (examType === 'BEPC') {
        // BEPC 2025: Our database contains only admitted students (94,221)
        // Real total candidates from official stats: 180,141
        realTotalCandidates = 180141;
        realPassRate = 52.3; // Official BEPC admission rate
      } else if (examType === 'CEE') {
        // CEE 2025: Our database contains only admitted students (173,185)
        // Official stats: Total candidates: 295,288, Admitted: 173,185
        realTotalCandidates = 295288; // Official total candidates from Guinea Ministry
        realPassRate = 58.65; // Official CEE admission rate (58.88% EG + 56.14% FA = 58.65% overall)
      } else if (examType === 'BAC-SM') {
        // BAC-SM 2025: Official statistics from DGECS
        // Total registered: 20,885 T + 7,774 F = 28,659
        // Total who took exam: 19,983 T + 7,508 F = 27,491
        // Total admitted: 5,622 T + 1,726 F = 7,348
        realTotalCandidates = 27491; // Candidates who actually took the exam
        realPassRate = 26.74; // (7348/27491)*100 = 26.74%
      } else if (examType === 'BAC-SE') {
        // BAC-SE 2025: Official statistics from DGECS
        // Total registered: 18,581 T + 9,517 F = 28,098
        // Total who took exam: 17,702 T + 9,105 F = 26,807
        // Total admitted: 6,095 T + 2,772 F = 8,867
        realTotalCandidates = 26807; // Candidates who actually took the exam
        realPassRate = 33.08; // (8867/26807)*100 = 33.08%
      } else if (examType === 'BAC-SS') {
        // BAC-SS 2025: Official statistics from DGECS
        // Total registered: 31,637 T + 13,649 F = 45,286
        // Total who took exam: 29,682 T + 12,883 F = 42,565
        // Total admitted: 9,753 T + 3,639 F = 13,392
        realTotalCandidates = 42565; // Candidates who actually took the exam
        realPassRate = 31.46; // (13392/42565)*100 = 31.46%
      }
    }

    return {
      totalCandidates: realTotalCandidates,
      passedCandidates: passedCandidates.count,
      passRate: Math.round(realPassRate * 100) / 100, // Round to 2 decimal places
      tbienCount: mentionStats.tbien_count || 0,
      bienCount: mentionStats.bien_count || 0,
      assezBienCount: mentionStats.assez_bien_count || 0,
      passableCount: mentionStats.passable_count || 0,
      totalRegions: regionCount.count,
      totalSchools: schoolCount.count,
      bestPerformingRegion: bestRegion?.region || 'N/A'
    };
  }

  async importExamData(results: ExamResult[]): Promise<void> {
    const stmt = await this.getDb().prepare(`
      INSERT OR REPLACE INTO exam_results 
      (year, exam_type, region, rank, ex_aequo, student_name, center, pv_number, school_origin, mention, passed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      await this.getDb().exec('BEGIN TRANSACTION');

      for (const result of results) {
        await stmt.run([
          result.year,
          result.exam_type,
          result.region,
          result.rank,
          result.ex_aequo,
          result.student_name,
          result.center,
          result.pv_number,
          result.school_origin,
          result.mention,
          result.passed
        ]);
      }

      await this.getDb().exec('COMMIT');
      console.log(`Successfully imported ${results.length} exam results`);
    } catch (error) {
      await this.getDb().exec('ROLLBACK');
      throw error;
    } finally {
      await stmt.finalize();
    }
  }

  async getAvailableYears(): Promise<number[]> {
    const result = await this.getDb().all(`
      SELECT DISTINCT year FROM exam_results ORDER BY year DESC
    `);
    return result.map((row: { year: number }) => row.year);
  }

  async getAvailableExamTypes(): Promise<string[]> {
    const result = await this.getDb().all(`
      SELECT DISTINCT exam_type FROM exam_results ORDER BY exam_type
    `);
    return result.map((row: { exam_type: string }) => row.exam_type);
  }

  async getAvailableRegions(year?: number, examType?: string): Promise<string[]> {
    let query = 'SELECT DISTINCT region FROM exam_results WHERE 1=1';
    const params: (number | string)[] = [];

    if (year) {
      query += ' AND year = ?';
      params.push(year);
    }

    if (examType) {
      query += ' AND exam_type = ?';
      params.push(examType);
    }

    query += ' ORDER BY region';

    const result = await this.getDb().all(query, params);
    return result.map((row: { region: string }) => row.region);
  }
}
