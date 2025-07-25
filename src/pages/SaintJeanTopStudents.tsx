import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, 
  Medal, 
  Award, 
  User, 
  School, 
  MapPin, 
  FileText,
  Calendar,
  Star,
  Crown,
  GraduationCap,
  ArrowLeft,
  Home
} from "lucide-react";
import { examAPI } from '../lib/api';

interface StudentResult {
  rank: number;
  student_name: string;
  pv_number: string;
  center: string;
  school_origin: string;
  mention: string;
  region: string;
  exam_type: string;
  year: number;
}

const SaintJeanTopStudents = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedExam, setSelectedExam] = useState("CEE");
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const years = ["2025", "2024", "2023", "2022", "2021"];
  const examTypes = [
    { value: "CEE", label: "Certificat d'Études Élémentaires" },
    { value: "BEPC", label: "BEPC" },
    { value: "BAC-SM", label: "BAC - Sciences Mathématiques" },
    { value: "BAC-SE", label: "BAC - Sciences Expérimentales" },
    { value: "BAC-SS", label: "BAC - Sciences Sociales" }
  ];

  const fetchTopStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await examAPI.getExamResults({
        year: parseInt(selectedYear),
        examType: selectedExam,
        school: "SAINT JEAN",
        limit: 10,
        offset: 0
      });

      if (response.success) {
        // Sort by rank to ensure we get the top 10
        const sortedStudents = response.data.results
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 10);
        setStudents(sortedStudents);
      } else {
        setError(response.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching top students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await examAPI.getExamResults({
          year: parseInt(selectedYear),
          examType: selectedExam,
          school: "SAINT JEAN",
          limit: 10,
          offset: 0
        });

        if (response.success) {
          // Sort by rank to ensure we get the top 10
          const sortedStudents = response.data.results
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 10);
          setStudents(sortedStudents);
        } else {
          setError(response.message || 'Failed to fetch students');
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching top students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedExam]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />;
    return <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg transform scale-105";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md";
    return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
  };

  const getMentionColor = (mention: string) => {
    switch (mention) {
      case 'TBIEN': return 'bg-green-100 text-green-800 border-green-200';
      case 'BIEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ABIEN': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-neumorphic">
      {/* Header */}
      <header className="bg-gradient-neumorphic shadow-neumorphic-sm border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <Link to="/">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-neumorphic-sm border-0 rounded-xl px-3 py-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span className="text-xs">Retour</span>
                </Button>
              </Link>
              <Link to="/">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-neumorphic-sm border-0 rounded-xl">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic">
                  <School className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Top 10 - SAINT JEAN
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">
                Les 10 meilleurs élèves de l'École SAINT JEAN
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-4 bg-gradient-neumorphic rounded-3xl shadow-neumorphic">
                  <School className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Top 10 - École SAINT JEAN
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Les 10 meilleurs élèves de l'École SAINT JEAN par classement
              </p>
            </div>
            
            {/* Back to Dashboard Button */}
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-neumorphic-sm border-0 rounded-xl px-4 py-2 font-medium transition-all duration-300 hover:scale-105">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="shadow-neumorphic bg-gradient-neumorphic border-0 mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 bg-gradient-neumorphic rounded-lg sm:rounded-xl shadow-neumorphic-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Sélectionner l'année et l'examen
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-foreground">Année</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-lg sm:rounded-xl h-10 sm:h-12 text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-neumorphic shadow-neumorphic border-0 rounded-xl">
                    {years.map((year) => (
                      <SelectItem key={year} value={year} className="rounded-lg">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-foreground">Type d'examen</label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-lg sm:rounded-xl h-10 sm:h-12 text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-neumorphic shadow-neumorphic border-0 rounded-xl">
                    {examTypes.map((exam) => (
                      <SelectItem key={exam.value} value={exam.value} className="rounded-lg text-sm sm:text-base">
                        {exam.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={fetchTopStudents}
                disabled={loading}
                className="bg-gradient-to-r from-primary to-primary-glow text-white shadow-neumorphic-sm border-0 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base h-10 sm:h-12"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Chargement...
                  </div>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Actualiser
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="shadow-neumorphic bg-gradient-neumorphic border-0 mb-6 sm:mb-8">
            <CardContent className="py-6 sm:py-8 text-center">
              <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="shadow-neumorphic bg-gradient-neumorphic border-0 mb-6 sm:mb-8">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Chargement des meilleurs élèves...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && students.length === 0 && (
          <Card className="shadow-neumorphic bg-gradient-neumorphic border-0 mb-6 sm:mb-8">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <School className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground font-medium text-sm sm:text-base">
                  Aucun élève trouvé pour SAINT JEAN dans {selectedExam} {selectedYear}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && students.length > 0 && (
          <>
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Top {students.length} - École SAINT JEAN
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {selectedExam} {selectedYear} - Classés par rang
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {students.map((student, index) => (
                <Card
                  key={`${student.pv_number}-${student.rank}`}
                  className={`shadow-neumorphic border-0 overflow-hidden transform hover:scale-105 transition-transform duration-300 ${
                    student.rank <= 3 ? 'ring-2 ring-opacity-50' : ''
                  } ${
                    student.rank === 1 ? 'ring-yellow-400' : 
                    student.rank === 2 ? 'ring-gray-400' : 
                    student.rank === 3 ? 'ring-amber-400' : ''
                  }`}
                >
                  <CardHeader className={`text-center py-4 sm:py-6 ${getRankStyle(student.rank)}`}>
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      {getRankIcon(student.rank)}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold">Rang #{student.rank}</h3>
                        <p className="text-xs sm:text-sm opacity-90">École SAINT JEAN</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 bg-gradient-neumorphic">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Student Name */}
                      <div className="text-center">
                        <div className="p-2 sm:p-3 bg-gradient-neumorphic-inset rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center shadow-neumorphic-inset">
                          <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <h4 className="font-bold text-foreground text-sm sm:text-lg leading-tight">
                          {student.student_name}
                        </h4>
                      </div>

                      {/* Student Details */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-gradient-neumorphic-inset rounded-lg shadow-neumorphic-inset">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            <span className="font-medium">PV:</span> {student.pv_number}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-gradient-neumorphic-inset rounded-lg shadow-neumorphic-inset">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            <span className="font-medium">Centre:</span> {student.center}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-gradient-neumorphic-inset rounded-lg shadow-neumorphic-inset">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            <span className="font-medium">Région:</span> {student.region}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-gradient-neumorphic-inset rounded-lg shadow-neumorphic-inset">
                          <School className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            <span className="font-medium">École:</span> {student.school_origin}
                          </span>
                        </div>
                      </div>

                      {/* Mention Badge */}
                      <div className="text-center pt-2">
                        <Badge 
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getMentionColor(student.mention)}`}
                        >
                          {student.mention === 'TBIEN' ? 'Très Bien' :
                           student.mention === 'BIEN' ? 'Bien' :
                           student.mention === 'ABIEN' ? 'Assez Bien' :
                           student.mention}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaintJeanTopStudents;
