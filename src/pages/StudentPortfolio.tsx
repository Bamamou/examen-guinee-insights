import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  GraduationCap, 
  School, 
  MapPin, 
  Award, 
  Star,
  Crown,
  BookOpen,
  Calendar,
  Trophy,
  ArrowLeft,
  FileText,
  Target,
  ChevronRight
} from "lucide-react";
import { examAPI, ExamResult } from '../lib/api';

interface StudentPortfolioData extends ExamResult {
  academic_achievements?: string[];
  extracurricular_activities?: string[];
  bibliography?: string[];
  future_goals?: string;
  academic_strengths?: string[];
}

const StudentPortfolio = () => {
  const { studentId, examType, year } = useParams<{
    studentId: string;
    examType: string;
    year: string;
  }>();
  
  const [student, setStudent] = useState<StudentPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId || !examType || !year) {
        setError('Paramètres manquants');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Search for the specific student
        const response = await examAPI.getExamResults({
          year: parseInt(year),
          examType: examType,
          searchQuery: studentId,
          searchType: 'pv',
          limit: 1
        });

        if (response.success && response.data.results.length > 0) {
          const studentData = response.data.results[0];
          
          // Add mock academic portfolio data (in a real app, this would come from a separate API)
          const portfolioData: StudentPortfolioData = {
            ...studentData,
            academic_achievements: [
              "Diplôme de Fin d'Études Fondamentales avec mention Très Bien",
              "Lauréat national du Baccalauréat " + examType.replace('BAC-', ''),
              "Prix d'excellence en Mathématiques",
              "Mention honorable en Sciences Physiques"
            ],
            extracurricular_activities: [
              "Président du Club de Mathématiques",
              "Membre de l'équipe de débat inter-écoles",
              "Tuteur volontaire pour les élèves en difficulté",
              "Organisateur d'événements scientifiques"
            ],
            bibliography: [
              "\"Excellence en Mathématiques\" - Guide méthodologique, 2024",
              "\"Les Défis de l'Éducation en Guinée\" - Article scientifique, 2025",
              "\"Innovations Pédagogiques\" - Contribution à la revue éducative, 2025"
            ],
            future_goals: "Poursuivre des études supérieures en ingénierie et contribuer au développement technologique de la Guinée",
            academic_strengths: [
              "Mathématiques Avancées",
              "Sciences Physiques",
              "Leadership Académique",
              "Recherche Scientifique"
            ]
          };
          
          setStudent(portfolioData);
        } else {
          setError('Étudiant non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Portfolio error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, examType, year]);

  const isLaureat = (examType: string, rank: number) => {
    if (examType === 'BAC-SM' && rank >= 1 && rank <= 70) return true;
    if (examType === 'BAC-SE' && rank >= 1 && rank <= 60) return true;
    if (examType === 'BAC-SS' && rank >= 1 && rank <= 40) return true;
    return false;
  };

  const isStar = (examType: string, rank: number) => {
    if ((examType === 'BEPC' || examType === 'CEE') && rank >= 1 && rank <= 5) return true;
    return false;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-amber-400 to-amber-600";
    if (rank >= 4 && rank <= 10) return "from-green-400 to-green-600";
    return "from-blue-400 to-blue-600";
  };

  const getMentionColor = (mention: string) => {
    switch (mention) {
      case 'TBIEN': return 'bg-green-100 text-green-800 border-green-200';
      case 'BIEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ABIEN': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-neumorphic p-4 sm:p-6">
        <div className="container mx-auto space-y-6">
          {/* Loading skeletons */}
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse shadow-neumorphic">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-neumorphic p-4 sm:p-6">
        <div className="container mx-auto">
          <Card className="shadow-neumorphic border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <div className="text-red-600">
                <h3 className="font-semibold mb-2">Erreur</h3>
                <p>{error}</p>
                <Link to="/">
                  <Button className="mt-4" variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-neumorphic">
      {/* Header */}
      <header className="bg-gradient-neumorphic shadow-neumorphic-sm border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="outline" size="lg" className="rounded-2xl">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </Button>
            </Link>
            <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Portfolio Académique
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                {isLaureat(student.exam_type, student.rank) 
                  ? `Lauréat National du ${student.exam_type.replace('BAC-', 'Baccalauréat ')} ${student.year}`
                  : isStar(student.exam_type, student.rank)
                  ? `Lauréat Régional du ${student.exam_type} ${student.year}`
                  : `${student.exam_type} ${student.year}`
                }
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Student Identity Card */}
        <Card className="shadow-neumorphic border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className={`p-6 bg-gradient-to-r ${getRankColor(student.rank)} rounded-3xl shadow-neumorphic-sm text-white`}>
                <Trophy className="h-12 w-12 mx-auto" />
                <div className="text-center mt-2">
                  <div className="font-bold text-2xl">#{student.rank}</div>
                  <div className="text-sm opacity-90">Rang National</div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{student.student_name}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {isLaureat(student.exam_type, student.rank) && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 shadow-neumorphic-sm rounded-xl font-bold px-4 py-2">
                        <Crown className="h-4 w-4 mr-2" />
                        Lauréat National
                      </Badge>
                    )}
                    {isStar(student.exam_type, student.rank) && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 shadow-neumorphic-sm rounded-xl font-bold px-4 py-2">
                        <Star className="h-4 w-4 mr-2" />
                        Lauréat Régional
                      </Badge>
                    )}
                    <Badge className={`px-4 py-2 rounded-xl font-medium border ${getMentionColor(student.mention)}`}>
                      {student.mention === 'TBIEN' ? 'Très Bien' :
                       student.mention === 'BIEN' ? 'Bien' :
                       student.mention === 'ABIEN' ? 'Assez Bien' :
                       student.mention}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">PV:</span>
                    <span className="font-mono">{student.pv_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Année:</span>
                    <span>{student.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">École:</span>
                    <span>{student.school_origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Centre:</span>
                    <span>{student.center}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academic Achievements */}
          <Card className="shadow-neumorphic border-0">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-xl font-bold">Réalisations Académiques</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {student.academic_achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-neumorphic-inset rounded-2xl shadow-neumorphic-inset">
                    <Star className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Academic Strengths */}
          <Card className="shadow-neumorphic border-0">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Domaines d'Excellence</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.academic_strengths?.map((strength, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="rounded-xl p-3 text-center justify-center font-medium"
                  >
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Extracurricular Activities */}
        <Card className="shadow-neumorphic border-0">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <User className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl font-bold">Activités Extracurriculaires</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {student.extracurricular_activities?.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gradient-neumorphic-inset rounded-2xl shadow-neumorphic-inset">
                  <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bibliography */}
        <Card className="shadow-neumorphic border-0">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <BookOpen className="h-6 w-6 text-warning" />
              </div>
              <CardTitle className="text-xl font-bold">Publications & Contributions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {student.bibliography?.map((publication, index) => (
                <div key={index} className="p-4 bg-gradient-neumorphic-inset rounded-2xl shadow-neumorphic-inset">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-neumorphic rounded-lg shadow-neumorphic-sm">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium italic">{publication}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Future Goals */}
        <Card className="shadow-neumorphic border-0">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <Target className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-xl font-bold">Objectifs d'Avenir</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="p-6 bg-gradient-neumorphic-inset rounded-3xl shadow-neumorphic-inset">
              <p className="text-lg font-medium text-center italic leading-relaxed">
                "{student.future_goals}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Results */}
        <div className="text-center py-8">
          <Link to="/">
            <Button size="lg" className="rounded-2xl px-8 py-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux Résultats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentPortfolio;
