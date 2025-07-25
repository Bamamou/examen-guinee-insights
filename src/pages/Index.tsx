import { useState } from "react";
import { Link } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
import { SearchFilters } from "@/components/SearchFilters";
import { ResultsTable } from "@/components/ResultsTable";
import { GraduationCap, Globe, Award, School, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Examens en Guinée
                  </h1>
                </div>
              </div>
              <Link to="/saint-jean-top">
                <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-neumorphic-sm border-0 rounded-xl px-3 py-2">
                  <School className="h-4 w-4 mr-1" />
                  <span className="text-xs">SAINT JEAN</span>
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm text-center">
              Plateforme d'analyse des résultats d'examens nationaux
            </p>
            
            {/* Mobile badges */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-neumorphic rounded-xl shadow-neumorphic-sm">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-foreground font-medium text-sm">République de Guinée</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-neumorphic rounded-xl shadow-neumorphic-sm">
                <Award className="h-4 w-4 text-accent" />
                <span className="text-foreground font-medium text-sm">Ministère de l'Éducation</span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
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
            <div className="flex items-center gap-4">
              {/* Saint Jean Top Students Button */}
              <Link to="/saint-jean-top">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-neumorphic-sm border-0 rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:scale-105">
                  <School className="h-5 w-5 mr-2" />
                  Top 10 SAINT JEAN
                  <Star className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
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
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12">
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
      <footer className="bg-gradient-neumorphic shadow-neumorphic-sm border-0 mt-12 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
            <div className="p-4 sm:p-6 bg-gradient-neumorphic rounded-2xl sm:rounded-3xl shadow-neumorphic-sm">
              <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-neumorphic rounded-xl shadow-neumorphic-sm">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                Examens en Guinée
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Plateforme officielle d'analyse et de consultation des résultats 
                d'examens nationaux en République de Guinée.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-gradient-neumorphic rounded-2xl sm:rounded-3xl shadow-neumorphic-sm">
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Examens Disponibles</h4>
              <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  Baccalauréat (BAC)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                  Brevet d'Études du Premier Cycle (BEPC)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
                  Certificat d'Études Élémentaires (CEE)
                </li>
              </ul>
            </div>
            <div className="p-4 sm:p-6 bg-gradient-neumorphic rounded-2xl sm:rounded-3xl shadow-neumorphic-sm sm:col-span-2 lg:col-span-1">
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Contact</h4>
              <div className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                <p className="font-medium">Ministère de l'Éducation Nationale</p>
                <p>République de Guinée</p>
                <p>Conakry, Guinée</p>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/20 text-center">
            <div className="p-3 sm:p-4 bg-gradient-neumorphic-inset rounded-xl sm:rounded-2xl shadow-neumorphic-inset inline-block">
              <p className="text-muted-foreground font-medium text-xs sm:text-sm">
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
