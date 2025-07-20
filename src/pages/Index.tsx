import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { SearchFilters } from "@/components/SearchFilters";
import { ResultsTable } from "@/components/ResultsTable";
import { GraduationCap, Globe, Award } from "lucide-react";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedExam, setSelectedExam] = useState("CEE");
  const [selectedBacOption, setSelectedBacOption] = useState<string>(""); // No default BAC option
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

  const handleSearch = () => {
    // This would trigger the search - for now it's just visual
    console.log("Searching:", { searchQuery, searchType, selectedYear, selectedExam, selectedBacOption });
  };

  // Get the full exam type for API calls (includes BAC option)
  const getFullExamType = () => {
    if (selectedExam === "BAC" && selectedBacOption) {
      return `BAC-${selectedBacOption}`; // Use BAC-SE, BAC-SM, BAC-SS format
    }
    return selectedExam;
  };

  // Reset BAC option when exam type changes
  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    if (exam !== "BAC") {
      setSelectedBacOption("");
    } else {
      // Set SM as default when BAC is selected
      setSelectedBacOption("SM");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-neumorphic">
      {/* Header */}
      <header className="bg-gradient-neumorphic shadow-neumorphic-sm border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-neumorphic rounded-3xl shadow-neumorphic">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Examens en Guinée
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Plateforme d'analyse des résultats d'examens nationaux
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-3 p-4 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-foreground font-medium">République de Guinée</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
                <Award className="h-6 w-6 text-accent" />
                <span className="text-foreground font-medium">Ministère de l'Éducation</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Search and Filters */}
        <SearchFilters
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedExam={selectedExam}
          setSelectedExam={handleExamChange}
          selectedBacOption={selectedBacOption}
          setSelectedBacOption={setSelectedBacOption}
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
          selectedExam={getFullExamType()}
          selectedYear={selectedYear}
        />

        {/* Dashboard */}
        <Dashboard
          selectedYear={selectedYear}
          selectedExam={getFullExamType()}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-neumorphic shadow-neumorphic-sm border-0 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic-sm">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-neumorphic rounded-xl shadow-neumorphic-sm">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                Examens en Guinée
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Plateforme officielle d'analyse et de consultation des résultats 
                d'examens nationaux en République de Guinée.
              </p>
            </div>
            <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic-sm">
              <h4 className="font-bold text-lg mb-6">Examens Disponibles</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Baccalauréat (BAC)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Brevet d'Études du Premier Cycle (BEPC)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Certificat d'Études Élémentaires (CEE)
                </li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-neumorphic rounded-3xl shadow-neumorphic-sm">
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-medium">Ministère de l'Éducation Nationale</p>
                <p>République de Guinée</p>
                <p>Conakry, Guinée</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/20 text-center">
            <div className="p-4 bg-gradient-neumorphic-inset rounded-2xl shadow-neumorphic-inset inline-block">
              <p className="text-muted-foreground font-medium">
                &copy; Examens en Guinée. Sponsorisé par le GS Saint Jean de N'ZEREKORE, Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
