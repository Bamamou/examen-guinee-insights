import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, School, MapPin, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  pv: string;
  school: string;
  region: string;
  grade: string;
  passed: boolean;
  average: number;
}

interface ResultsTableProps {
  searchQuery: string;
  searchType: string;
  selectedExam: string;
  selectedYear: string;
}

// Mock data - replace with real data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Diallo Mamadou",
    pv: "PV001-2025",
    school: "Lycée Donka",
    region: "Conakry",
    grade: "Très Bien",
    passed: true,
    average: 16.5
  },
  {
    id: "2",
    name: "Camara Aissatou",
    pv: "PV002-2025",
    school: "Collège Sainte-Marie",
    region: "Conakry",
    grade: "Bien",
    passed: true,
    average: 14.2
  },
  {
    id: "3",
    name: "Barry Alpha",
    pv: "PV003-2025",
    school: "Lycée de Labé",
    region: "Labé",
    grade: "Assez Bien",
    passed: true,
    average: 12.8
  },
  {
    id: "4",
    name: "Condé Fatoumata",
    pv: "PV004-2025",
    school: "Institut Technique",
    region: "Kankan",
    grade: "Passable",
    passed: true,
    average: 10.5
  },
  {
    id: "5",
    name: "Touré Ibrahima",
    pv: "PV005-2025",
    school: "Lycée de Kindia",
    region: "Kindia",
    grade: "Échec",
    passed: false,
    average: 8.2
  },
  {
    id: "6",
    name: "Bah Mariame",
    pv: "PV006-2025",
    school: "Lycée Donka",
    region: "Conakry",
    grade: "Bien",
    passed: true,
    average: 13.9
  }
];

export const ResultsTable = ({ searchQuery, searchType, selectedExam, selectedYear }: ResultsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Filter results based on search
  const filteredResults = mockStudents.filter(student => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case "name":
        return student.name.toLowerCase().includes(query);
      case "pv":
        return student.pv.toLowerCase().includes(query);
      case "school":
        return student.school.toLowerCase().includes(query);
      default:
        return true;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

  const getGradeBadge = (grade: string, passed: boolean) => {
    if (!passed) {
      return <Badge variant="destructive">{grade}</Badge>;
    }
    
    switch (grade) {
      case "Très Bien":
        return <Badge className="bg-gradient-success">{grade}</Badge>;
      case "Bien":
        return <Badge className="bg-accent text-accent-foreground">{grade}</Badge>;
      case "Assez Bien":
        return <Badge variant="secondary">{grade}</Badge>;
      case "Passable":
        return <Badge variant="outline">{grade}</Badge>;
      default:
        return <Badge variant="secondary">{grade}</Badge>;
    }
  };

  if (!searchQuery) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Rechercher des Résultats</h3>
            <p>Utilisez les filtres ci-dessus pour rechercher des résultats d'examens spécifiques.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle>
              Résultats de Recherche - {selectedExam} {selectedYear}
            </CardTitle>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {filteredResults.length} résultat{filteredResults.length !== 1 ? 's' : ''} trouvé{filteredResults.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {filteredResults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
            <p>Aucun résultat ne correspond à votre recherche. Veuillez vérifier vos critères.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nom
                      </div>
                    </TableHead>
                    <TableHead>PV</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        École
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Région
                      </div>
                    </TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Résultat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="font-mono text-sm">{student.pv}</TableCell>
                      <TableCell>{student.school}</TableCell>
                      <TableCell>{student.region}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          student.average >= 15 ? 'text-success' :
                          student.average >= 12 ? 'text-accent' :
                          student.average >= 10 ? 'text-warning' :
                          'text-destructive'
                        }`}>
                          {student.average.toFixed(1)}/20
                        </span>
                      </TableCell>
                      <TableCell>
                        {getGradeBadge(student.grade, student.passed)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Affichage de {startIndex + 1} à {Math.min(startIndex + resultsPerPage, filteredResults.length)} sur {filteredResults.length} résultats
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <span className="text-sm px-3 py-1 bg-muted rounded">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
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