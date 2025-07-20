import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  School, 
  MapPin, 
  TrendingUp, 
  Users, 
  Award,
  BarChart3,
  Trophy
} from "lucide-react";
import { StatsChart } from "@/components/StatsChart";
import { RegionalChart } from "@/components/RegionalChart";
import { examAPI, DashboardStats, SchoolStats, RegionStats, formatPassRate } from '../lib/api';

interface DashboardProps {
  selectedYear: string;
  selectedExam: string;
}

interface TopSchool {
  name: string;
  region: string;
  passRate: number;
  students: number;
}

interface RegionalData {
  region: string;
  candidates: number;
  passed: number;
  passRate: number;
}

export const Dashboard = ({ selectedYear, selectedExam }: DashboardProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [schoolStats, setSchoolStats] = useState<TopSchool[]>([]);
  const [regionStats, setRegionStats] = useState<RegionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const year = parseInt(selectedYear);
        
        // Validate Baccalauréat selection
        if (selectedExam === 'BAC') {
          setError('Veuillez sélectionner une option pour le Baccalauréat (SM, SE, ou SS)');
          setLoading(false);
          return;
        }
        
        // Fetch all data in parallel
        const [dashboardResponse, schoolResponse, regionResponse] = await Promise.all([
          examAPI.getDashboardStats(year, selectedExam),
          examAPI.getSchoolStats(year, selectedExam),
          examAPI.getRegionStats(year, selectedExam)
        ]);

        if (dashboardResponse.success) {
          setStats(dashboardResponse.data);
        } else {
          setError(dashboardResponse.message || 'Failed to fetch dashboard stats');
        }

        if (schoolResponse.success) {
          // Format school data for display
          const formattedSchools = schoolResponse.data.slice(0, 5).map((school: SchoolStats) => ({
            name: school.school,
            region: school.region,
            passRate: school.pass_rate,
            students: school.total_candidates
          }));
          setSchoolStats(formattedSchools);
        }

        if (regionResponse.success) {
          // Format region data for charts
          const formattedRegions = regionResponse.data.map((region: RegionStats) => ({
            region: region.region,
            candidates: region.total_candidates,
            passed: region.passed,
            passRate: region.pass_rate
          }));
          setRegionStats(formattedRegions);
        }

      } catch (err) {
        setError('Failed to connect to server. Please make sure the backend is running.');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear && selectedExam) {
      fetchDashboardData();
    }
  }, [selectedYear, selectedExam]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse rounded-3xl shadow-neumorphic">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="rounded-3xl shadow-neumorphic border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-red-600 text-center">
            <h3 className="font-semibold mb-2">Unable to load dashboard</h3>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2">Make sure the backend server is running on port 3001</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="rounded-3xl shadow-neumorphic">
        <CardContent className="pt-6">
          <div className="text-gray-500 text-center">No data available for {selectedExam} {selectedYear}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic border-0">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tableau de Bord - {selectedExam} {selectedYear}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Analyse des résultats d'examens en Guinée
          </p>
        </div>
        <div className="p-4 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
          <Badge variant="secondary" className="px-6 py-3 bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-xl">
            <BarChart3 className="w-5 h-5 mr-3" />
            Données Nationales
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-neumorphic border-0 hover:shadow-neumorphic-sm transition-all duration-300 p-6">
          <CardHeader className="pb-4 p-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total Candidats
              </CardTitle>
              <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-primary">
              {stats.totalCandidates.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              +12% par rapport à {parseInt(selectedYear) - 1}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-neumorphic border-0 hover:shadow-neumorphic-sm transition-all duration-300 p-6">
          <CardHeader className="pb-4 p-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Taux de Réussite
              </CardTitle>
              <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-success">
              {stats.passRate}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              +2.4% par rapport à {parseInt(selectedYear) - 1}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-neumorphic border-0 hover:shadow-neumorphic-sm transition-all duration-300 p-6">
          <CardHeader className="pb-4 p-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Écoles Participantes
              </CardTitle>
              <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <School className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-accent">
              {stats.totalSchools}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Établissements d'excellence
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-neumorphic border-0 hover:shadow-neumorphic-sm transition-all duration-300 p-6">
          <CardHeader className="pb-4 p-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {selectedExam.startsWith('BAC-') ? 'Centres d\'Examen' : 'Régions Couvertes'}
              </CardTitle>
              <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <MapPin className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-warning">
              {stats.totalRegions}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedExam.startsWith('BAC-') ? 'Centres disponibles' : 'Couverture nationale'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic border-0">
          <StatsChart data={regionStats} examType={selectedExam} />
        </div>
        <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic border-0">
          <RegionalChart data={regionStats} examType={selectedExam} />
        </div>
      </div>

      {/* Top Schools */}
      <Card className="shadow-neumorphic border-0 p-8">
        <CardHeader className="p-0 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Meilleurs Établissements - {selectedExam} {selectedYear}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {schoolStats.length > 0 ? (
            <div className="space-y-6">
              {schoolStats.map((school, index) => (
                <div 
                  key={`${school.name}-${school.region}`} 
                  className="flex items-center justify-between p-6 rounded-3xl bg-gradient-neumorphic-inset shadow-neumorphic-inset hover:shadow-neumorphic-pressed transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-primary text-white font-bold text-lg shadow-neumorphic-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground">{school.name}</h4>
                      <p className="text-base text-muted-foreground">{school.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-success">{school.passRate}%</div>
                    <div className="text-sm text-muted-foreground">{school.students} candidats</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Aucune donnée d'école disponible pour {selectedExam} {selectedYear}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};