// API configuration and service layer for Guinea Exam Insights

const API_BASE_URL = 'http://localhost:3001/api';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Data types matching backend
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

// API Service Class
export class ExamAPIService {
  private async request<T>(endpoint: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }

  // Exam results
  async getExamResults(filters: SearchFilters): Promise<ApiResponse<PaginatedResponse<ExamResult>>> {
    return this.request('/exam/results', filters as Record<string, string | number>);
  }

  // Statistics
  async getDashboardStats(year: number, examType: string): Promise<ApiResponse<DashboardStats>> {
    return this.request('/exam/stats/dashboard', { year, examType });
  }

  async getRegionStats(year: number, examType: string): Promise<ApiResponse<RegionStats[]>> {
    return this.request('/exam/stats/regions', { year, examType });
  }

  async getSchoolStats(year: number, examType: string, region?: string): Promise<ApiResponse<SchoolStats[]>> {
    return this.request('/exam/stats/schools', { year, examType, region });
  }

  // Metadata
  async getAvailableYears(): Promise<ApiResponse<number[]>> {
    return this.request('/exam/metadata/years');
  }

  async getAvailableExamTypes(): Promise<ApiResponse<string[]>> {
    return this.request('/exam/metadata/exam-types');
  }

  async getAvailableRegions(year?: number, examType?: string): Promise<ApiResponse<string[]>> {
    return this.request('/exam/metadata/regions', { year, examType });
  }
}

// Export singleton instance
export const examAPI = new ExamAPIService();

// Helper functions for frontend components
export const formatPassRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

export const formatMention = (mention: string): string => {
  const mentionMap: Record<string, string> = {
    'TBIEN': 'Très Bien',
    'BIEN': 'Bien',
    'ABIEN': 'Assez Bien',
    'PASSABLE': 'Passable'
  };
  return mentionMap[mention] || mention;
};

export const getMentionColor = (mention: string): string => {
  const colorMap: Record<string, string> = {
    'TBIEN': 'text-green-600',
    'BIEN': 'text-blue-600',
    'ABIEN': 'text-yellow-600',
    'PASSABLE': 'text-orange-600'
  };
  return colorMap[mention] || 'text-gray-600';
};

export const formatRank = (rank: number, exAequo: boolean): string => {
  const suffix = exAequo ? ' (ex-aequo)' : '';
  if (rank === 1) return `1er${suffix}`;
  return `${rank}e${suffix}`;
};
