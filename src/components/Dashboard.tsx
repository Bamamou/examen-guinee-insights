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
import { examAPI, DashboardStats, formatPassRate } from '../lib/api';

interface DashboardProps {
  selectedYear: string;
  selectedExam: string;
}

export const Dashboard = ({ selectedYear, selectedExam }: DashboardProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const year = parseInt(selectedYear);
        const response = await examAPI.getDashboardStats(year, selectedExam);
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        setError('Failed to connect to server. Please make sure the backend is running.');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear && selectedExam) {
      fetchDashboardStats();
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

  // Mock data for components that need it - will be replaced when those are updated too
  const topSchools = [
    { name: "École Primaire Centrale", region: "Conakry", passRate: 98.5, students: 245 },
    { name: "Collège Notre-Dame", region: "Kindia", passRate: 97.2, students: 189 },
    { name: "Lycée Technique", region: "Kankan", passRate: 95.8, students: 156 },
    { name: "Lycée Donka", students: 245, passRate: 89.2, region: "Conakry" },
    { name: "Collège Sainte-Marie", students: 198, passRate: 87.4, region: "Conakry" }
  ];

  const regionalData = [
    { region: "Conakry", candidates: 12450, passed: 9876, passRate: 79.3 },
    { region: "Kankan", candidates: 8234, passed: 5987, passRate: 72.7 },
    { region: "Labé", candidates: 6789, passed: 4932, passRate: 72.6 },
    { region: "Kindia", candidates: 7543, passed: 5234, passRate: 69.4 },
    { region: "Boké", candidates: 4532, passed: 3012, passRate: 66.5 },
    { region: "Faranah", candidates: 3845, passed: 2456, passRate: 63.9 },
    { region: "Mamou", candidates: 2339, passed: 1435, passRate: 61.4 },
    { region: "N'Zérékoré", candidates: 1876, passed: 1098, passRate: 58.5 }
  ];

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
                Régions Couvertes
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
              Couverture nationale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic border-0">
          <StatsChart data={regionalData} />
        </div>
        <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic border-0">
          <RegionalChart data={regionalData} />
        </div>
      </div>

      {/* Top Schools */}
      <Card className="shadow-neumorphic border-0 p-8">
        <CardHeader className="p-0 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold">Meilleurs Établissements</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-6">
            {topSchools.map((school, index) => (
              <div 
                key={school.name} 
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
        </CardContent>
      </Card>
    </div>
  );
};