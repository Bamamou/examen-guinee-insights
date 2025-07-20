export interface ExamResult {
  id?: number;
  year: number;
  exam_type: string;
  region: string;
  rank: number;
  ex_aequo: boolean;
  student_name: string;
  center: string;
  pv_number: string;
  school_origin: string;
  mention: string;
  passed: boolean;
  created_at?: string;
}

export interface RegionStats {
  region: string;
  total_candidates: number;
  passed: number;
  failed: number;
  pass_rate: number;
  tbien_count: number;
  bien_count: number;
  assez_bien_count: number;
  passable_count: number;
}

export interface SchoolStats {
  school: string;
  region: string;
  total_candidates: number;
  passed: number;
  pass_rate: number;
  best_rank: number;
  tbien_count: number;
  bien_count: number;
}

export interface DashboardStats {
  totalCandidates: number;
  passedCandidates: number;
  passRate: number;
  tbienCount: number;
  bienCount: number;
  assezBienCount: number;
  passableCount: number;
  totalRegions: number;
  totalSchools: number;
  bestPerformingRegion: string;
}

export interface SearchFilters {
  year?: number;
  examType?: string;
  region?: string;
  school?: string;
  mention?: string;
  searchQuery?: string;
  searchType?: string;
  limit?: number;
  offset?: number;
}
