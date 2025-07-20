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
            {filteredResults.length} résultat{filteredResults.length !== 1 ? 's' : ''} trouvé{filteredResults.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {filteredResults.length === 0 ? (
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
                    <TableHead className="font-bold text-base">Moyenne</TableHead>
                    <TableHead className="font-bold text-base">Résultat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gradient-neumorphic-inset hover:shadow-neumorphic-inset border-border/20 transition-all duration-300">
                      <TableCell className="font-semibold text-base py-4">{student.name}</TableCell>
                      <TableCell className="font-mono text-sm py-4">{student.pv}</TableCell>
                      <TableCell className="py-4">{student.school}</TableCell>
                      <TableCell className="py-4">{student.region}</TableCell>
                      <TableCell className="py-4">
                        <span className={`font-bold text-lg ${
                          student.average >= 15 ? 'text-success' :
                          student.average >= 12 ? 'text-accent' :
                          student.average >= 10 ? 'text-warning' :
                          'text-destructive'
                        }`}>
                          {student.average.toFixed(1)}/20
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getGradeBadge(student.grade, student.passed)}
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
                  Affichage de {startIndex + 1} à {Math.min(startIndex + resultsPerPage, filteredResults.length)} sur {filteredResults.length} résultats
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