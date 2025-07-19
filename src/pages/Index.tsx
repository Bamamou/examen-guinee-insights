import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { SearchFilters } from "@/components/SearchFilters";
import { ResultsTable } from "@/components/ResultsTable";
import { GraduationCap, Globe, Award } from "lucide-react";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedExam, setSelectedExam] = useState("BAC");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

  const handleSearch = () => {
    // This would trigger the search - for now it's just visual
    console.log("Searching:", { searchQuery, searchType, selectedYear, selectedExam });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-elegant">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Examens en Guinée</h1>
                <p className="text-white/80 mt-1">
                  Plateforme d'analyse des résultats d'examens nationaux
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                République de Guinée
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Ministère de l'Éducation
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search and Filters */}
        <SearchFilters
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedExam={selectedExam}
          setSelectedExam={setSelectedExam}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          onSearch={handleSearch}
        />

        {/* Results Table */}
        <ResultsTable
          searchQuery={searchQuery}
          searchType={searchType}
          selectedExam={selectedExam}
          selectedYear={selectedYear}
        />

        {/* Dashboard */}
        <Dashboard
          selectedYear={selectedYear}
          selectedExam={selectedExam}
        />
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Examens en Guinée
              </h3>
              <p className="text-muted-foreground text-sm">
                Plateforme officielle d'analyse et de consultation des résultats 
                d'examens nationaux en République de Guinée.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Examens Disponibles</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Baccalauréat (BAC)</li>
                <li>• Brevet d'Études du Premier Cycle (BEPC)</li>
                <li>• Certificat d'Études Élémentaires (CEE)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Ministère de l'Éducation Nationale</p>
                <p>République de Guinée</p>
                <p>Conakry, Guinée</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Examens en Guinée. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
