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

interface DashboardProps {
  selectedYear: string;
  selectedExam: string;
}

export const Dashboard = ({ selectedYear, selectedExam }: DashboardProps) => {
  // Mock data - replace with real data from your Excel files
  const stats = {
    totalCandidates: 45732,
    passRate: 72.8,
    topSchools: 12,
    regions: 8
  };

  const topSchools = [
    { name: "Lycée Donka", students: 245, passRate: 89.2, region: "Conakry" },
    { name: "Collège Sainte-Marie", students: 198, passRate: 87.4, region: "Conakry" },
    { name: "Lycée de Labé", students: 156, passRate: 84.6, region: "Labé" },
    { name: "Institut Technique", students: 134, passRate: 82.1, region: "Kankan" },
    { name: "Lycée de Kindia", students: 189, passRate: 79.8, region: "Kindia" }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-academic bg-clip-text text-transparent">
            Tableau de Bord - {selectedExam} {selectedYear}
          </h2>
          <p className="text-muted-foreground mt-1">
            Analyse des résultats d'examens en Guinée
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          <BarChart3 className="w-4 h-4 mr-2" />
          Données Nationales
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card border-l-4 border-l-primary hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Candidats
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalCandidates.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% par rapport à {parseInt(selectedYear) - 1}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-success hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taux de Réussite
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.passRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.4% par rapport à {parseInt(selectedYear) - 1}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-accent hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Écoles Participantes
              </CardTitle>
              <School className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {stats.topSchools}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Établissements d'excellence
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-warning hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Régions Couvertes
              </CardTitle>
              <MapPin className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.regions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Couverture nationale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart data={regionalData} />
        <RegionalChart data={regionalData} />
      </div>

      {/* Top Schools */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <CardTitle>Meilleurs Établissements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSchools.map((school, index) => (
              <div 
                key={school.name} 
                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-muted/50 to-background hover:shadow-card transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{school.name}</h4>
                    <p className="text-sm text-muted-foreground">{school.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">{school.passRate}%</div>
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