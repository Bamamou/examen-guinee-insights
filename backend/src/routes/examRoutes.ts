import express from 'express';
import { ExamService } from '../services/examService';
import { SearchFilters } from '../database/schema';

const router = express.Router();
const examService = new ExamService();

// Get exam results with filters
router.get('/results', async (req, res) => {
  try {
    const filters: SearchFilters = {
      year: req.query.year ? parseInt(req.query.year as string) : undefined,
      examType: req.query.examType as string,
      region: req.query.region as string,
      school: req.query.school as string,
      mention: req.query.mention as string,
      searchQuery: req.query.searchQuery as string,
      searchType: req.query.searchType as 'name' | 'pv' | 'school',
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const { results, total } = await examService.getExamResults(filters);
    
    res.json({
      success: true,
      data: {
        results,
        total,
        page: Math.floor((filters.offset || 0) / (filters.limit || 100)) + 1,
        totalPages: Math.ceil(total / (filters.limit || 100))
      }
    });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam results'
    });
  }
});

// Get region statistics
router.get('/stats/regions', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const examType = req.query.examType as string;

    if (!year || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Year and examType are required'
      });
    }

    const stats = await examService.getRegionStats(year, examType);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching region stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch region statistics'
    });
  }
});

// Get school statistics
router.get('/stats/schools', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const examType = req.query.examType as string;
    const region = req.query.region as string;

    if (!year || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Year and examType are required'
      });
    }

    const stats = await examService.getSchoolStats(year, examType, region);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching school stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school statistics'
    });
  }
});

// Get dashboard statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const examType = req.query.examType as string;

    if (!year || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Year and examType are required'
      });
    }

    const stats = await examService.getDashboardStats(year, examType);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get available years
router.get('/metadata/years', async (req, res) => {
  try {
    const years = await examService.getAvailableYears();
    
    res.json({
      success: true,
      data: years
    });
  } catch (error) {
    console.error('Error fetching available years:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available years'
    });
  }
});

// Get available exam types
router.get('/metadata/exam-types', async (req, res) => {
  try {
    const examTypes = await examService.getAvailableExamTypes();
    
    res.json({
      success: true,
      data: examTypes
    });
  } catch (error) {
    console.error('Error fetching exam types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam types'
    });
  }
});

// Get available regions
router.get('/metadata/regions', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const examType = req.query.examType as string;
    
    const regions = await examService.getAvailableRegions(year, examType);
    
    res.json({
      success: true,
      data: regions
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regions'
    });
  }
});

export default router;
