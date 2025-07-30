import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, School, MapPin, Award, ChevronLeft, ChevronRight, Crown, FileText, ExternalLink, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { examAPI, ExamResult } from '../lib/api';

interface ResultsTableProps {
  searchQuery: string;
  searchType: string;
  selectedExam: string;
  selectedYear: string;
}

export const ResultsTable = ({ searchQuery, searchType, selectedExam, selectedYear }: ResultsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsPerPage = 10;

  // Fetch results when search parameters change
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      // Validate Baccalauréat selection
      if (selectedExam === 'BAC') {
        setError('Veuillez sélectionner une option pour le Baccalauréat (SM, SE, ou SS)');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const filters = {
          year: parseInt(selectedYear),
          examType: selectedExam,
          searchQuery,
          searchType,
          limit: resultsPerPage,
          offset: (currentPage - 1) * resultsPerPage
        };

        const response = await examAPI.getExamResults(filters);
        
        if (response.success) {
          setResults(response.data.results);
          setTotalResults(response.data.total);
        } else {
          setError(response.message || 'Failed to fetch results');
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, searchType, selectedExam, selectedYear, currentPage]);

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const getGradeBadge = (grade: string, passed: boolean) => {
    if (!passed) {
      return <Badge variant="destructive" className="rounded-xl">{grade}</Badge>;
    }
    
    switch (grade) {
      case "Très Bien":
        return <Badge className="bg-gradient-success shadow-neumorphic-sm rounded-xl">{grade}</Badge>;
      case "Bien":
        return <Badge className="bg-accent text-accent-foreground shadow-neumorphic-sm rounded-xl">{grade}</Badge>;
      case "Assez Bien":
        return <Badge variant="secondary" className="rounded-xl">{grade}</Badge>;
      case "Passable":
        return <Badge variant="outline" className="rounded-xl">{grade}</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-xl">{grade}</Badge>;
    }
  };

  // Check if student qualifies for "Lauréat" badge for BAC exams
  const isLaureat = (examType: string, rank: number) => {
    if (examType === 'BAC-SM' && rank >= 1 && rank <= 70) return true;
    if (examType === 'BAC-SE' && rank >= 1 && rank <= 60) return true;
    if (examType === 'BAC-SS' && rank >= 1 && rank <= 40) return true;
    return false;
  };

  // Check if student qualifies for "Star" badge for BEPC/CEE exams (top 5 performers)
  const isStar = (examType: string, rank: number) => {
    if ((examType === 'BEPC' || examType === 'CEE') && rank >= 1 && rank <= 5) return true;
    return false;
  };

  if (!searchQuery) {
    return (
      <Card className="shadow-neumorphic border-0 p-8">
        <CardContent className="py-16 p-0">
          <div className="text-center text-muted-foreground">
            <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic-sm inline-block mb-6">
              <User className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Rechercher des Résultats</h3>
            <p className="text-lg">Utilisez les filtres ci-dessus pour rechercher des résultats d'examens spécifiques.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-neumorphic border-0">
      <CardHeader className="p-8 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Résultats de Recherche - {selectedExam} {selectedYear}
            </CardTitle>
          </div>
          <Badge variant="outline" className="px-6 py-3 text-base rounded-2xl">
            {totalResults} résultat{totalResults !== 1 ? 's' : ''} trouvé{totalResults !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic-sm inline-block mb-6">
              <User className="h-16 w-16 mx-auto animate-pulse opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Recherche en cours...</h3>
            <p className="text-lg text-muted-foreground">Veuillez patienter pendant la recherche.</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">
            <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic-sm inline-block mb-6">
              <User className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Erreur de recherche</h3>
            <p className="text-lg">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic-sm inline-block mb-6">
              <User className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Aucun résultat trouvé</h3>
            <p className="text-lg">Aucun résultat ne correspond à votre recherche. Veuillez vérifier vos critères.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-gradient-neumorphic-inset rounded-3xl shadow-neumorphic-inset p-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/20">
                    <TableHead className="font-bold text-base">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        Nom
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-base">PV</TableHead>
                    <TableHead className="font-bold text-base">
                      <div className="flex items-center gap-3">
                        <School className="h-5 w-5" />
                        École
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-base">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5" />
                        Région
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-base">Rang</TableHead>
                    <TableHead className="font-bold text-base">Résultat</TableHead>
                    <TableHead className="font-bold text-base">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id} className="hover:bg-gradient-neumorphic-inset hover:shadow-neumorphic-inset border-border/20 transition-all duration-300">
                      <TableCell className="font-semibold text-base py-4">{result.student_name}</TableCell>
                      <TableCell className="font-mono text-sm py-4">{result.pv_number}</TableCell>
                      <TableCell className="py-4">{result.school_origin}</TableCell>
                      <TableCell className="py-4">{result.region}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-bold text-lg text-muted-foreground">
                            Rang #{result.rank}
                          </span>
                          {/* Lauréat Badge for BAC students */}
                          {isLaureat(result.exam_type, result.rank) && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 shadow-neumorphic-sm rounded-xl font-bold text-xs w-fit">
                              <Crown className="h-3 w-3 mr-1" />
                              Lauréat
                            </Badge>
                          )}
                          {/* Star Badge for BEPC/CEE top students */}
                          {isStar(result.exam_type, result.rank) && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 shadow-neumorphic-sm rounded-xl font-bold text-xs w-fit">
                              <Star className="h-3 w-3 mr-1 fill-yellow-600" />
                              Top {result.rank}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getGradeBadge(result.mention, Boolean(result.passed))}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-2">
                          {/* Portfolio Button for BAC Lauréats */}
                          {isLaureat(result.exam_type, result.rank) && (
                            <Link to={`/portfolio/${result.exam_type}/${result.year}/${result.pv_number}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-800 hover:text-amber-900 shadow-neumorphic-sm hover:shadow-neumorphic transition-all duration-300 text-xs font-medium"
                              >
                                <FileText className="h-3 w-3 mr-1.5" />
                                Portfolio
                                <ExternalLink className="h-3 w-3 ml-1.5" />
                              </Button>
                            </Link>
                          )}
                          {/* Portfolio Button for BEPC/CEE Star students */}
                          {isStar(result.exam_type, result.rank) && (
                            <Link to={`/portfolio/${result.exam_type}/${result.year}/${result.pv_number}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 text-yellow-800 hover:text-yellow-900 shadow-neumorphic-sm hover:shadow-neumorphic transition-all duration-300 text-xs font-medium"
                              >
                                <FileText className="h-3 w-3 mr-1.5" />
                                Portfolio
                                <ExternalLink className="h-3 w-3 ml-1.5" />
                              </Button>
                            </Link>
                          )}
                          {/* Placeholder for non-eligible students */}
                          {!isLaureat(result.exam_type, result.rank) && !isStar(result.exam_type, result.rank) && (
                            <span className="text-xs text-muted-foreground italic">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 p-6 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <p className="text-base text-muted-foreground font-medium">
                  Affichage de {((currentPage - 1) * resultsPerPage) + 1} à {Math.min(currentPage * resultsPerPage, totalResults)} sur {totalResults} résultats
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-2xl"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Précédent
                  </Button>
                  <span className="text-base px-6 py-3 bg-gradient-neumorphic-inset shadow-neumorphic-inset rounded-2xl font-bold">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-2xl"
                  >
                    Suivant
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};