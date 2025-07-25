import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, GraduationCap, School, User } from "lucide-react";

interface SearchFiltersProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedExam: string;
  setSelectedExam: (exam: string) => void;
  selectedBacOption?: string;
  setSelectedBacOption?: (option: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: string;
  setSearchType: (type: string) => void;
  onSearch: () => void;
}

export const SearchFilters = ({
  selectedYear,
  setSelectedYear,
  selectedExam,
  setSelectedExam,
  selectedBacOption,
  setSelectedBacOption,
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  onSearch
}: SearchFiltersProps) => {
  const years = ["2025", "2024", "2023", "2022", "2021"];
  const exams = [
    { value: "BAC", label: "Baccalauréat", icon: GraduationCap },
    { value: "BEPC", label: "BEPC", icon: School },
    { value: "CEE", label: "Certificat d'Études Élémentaires", icon: User }
  ];
  const bacOptions = [
    { value: "SM", label: "SM - Sciences Mathématiques", description: "Mathématiques et Sciences Physiques" },
    { value: "SE", label: "SE - Sciences Expérimentales", description: "Sciences Biologiques et Chimiques" },
    { value: "SS", label: "SS - Sciences Sociales", description: "Sciences Humaines et Sociales" }
  ];
  const searchTypes = [
    { value: "name", label: "Nom de l'élève", icon: User },
    { value: "pv", label: "Numéro PV", icon: Filter },
    { value: "school", label: "École", icon: School }
  ];

  return (
    <Card className="shadow-neumorphic bg-gradient-neumorphic border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-gradient-neumorphic rounded-xl sm:rounded-2xl shadow-neumorphic-sm">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <CardTitle className="text-lg sm:text-2xl font-bold text-foreground">Recherche et Filtres</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-8">
        {/* Primary Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <label className="text-sm sm:text-base font-semibold flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-neumorphic rounded-lg sm:rounded-xl shadow-neumorphic-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Année d'Examen
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-xl sm:rounded-2xl h-10 sm:h-12">
                <SelectValue placeholder="Sélectionner une année" />
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

          <div className="space-y-3 sm:space-y-4">
            <label className="text-sm sm:text-base font-semibold flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-neumorphic rounded-lg sm:rounded-xl shadow-neumorphic-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Type d'Examen
            </label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-xl sm:rounded-2xl h-10 sm:h-12">
                <SelectValue placeholder="Sélectionner un examen" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-neumorphic shadow-neumorphic border-0 rounded-xl">
                {exams.map((exam) => (
                  <SelectItem key={exam.value} value={exam.value} className="rounded-lg">
                    <div className="flex items-center gap-3">
                      <exam.icon className="h-5 w-5" />
                      {exam.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Baccalauréat Option Selector - Only show when BAC is selected */}
          {selectedExam === "BAC" && (
            <div className="space-y-3 sm:space-y-4 lg:col-span-2">
              <label className="text-sm sm:text-base font-semibold flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-neumorphic rounded-lg sm:rounded-xl shadow-neumorphic-sm">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                Option Baccalauréat
              </label>
              <Select value={selectedBacOption || ""} onValueChange={setSelectedBacOption}>
                <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-xl sm:rounded-2xl h-10 sm:h-12">
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-neumorphic shadow-neumorphic border-0 rounded-xl">
                  {bacOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold text-sm sm:text-base">{option.label}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBacOption && (
                <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-xl text-xs sm:text-sm">
                  Option sélectionnée: {bacOptions.find(opt => opt.value === selectedBacOption)?.label}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gradient-neumorphic-inset rounded-2xl sm:rounded-3xl shadow-neumorphic-inset border-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-1.5 sm:p-2 bg-gradient-neumorphic rounded-lg sm:rounded-xl shadow-neumorphic-sm">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <h4 className="font-bold text-base sm:text-lg">Recherche de Résultats</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <label className="text-sm sm:text-base font-semibold">Type de Recherche</label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-xl sm:rounded-2xl h-10 sm:h-12">
                  <SelectValue placeholder="Type de recherche" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-neumorphic shadow-neumorphic border-0 rounded-xl">
                  {searchTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <type.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 sm:space-y-4 lg:col-span-2">
              <label className="text-sm sm:text-base font-semibold">Rechercher</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Input
                  placeholder={
                    searchType === "name" ? "Entrez le nom de l'élève..." :
                    searchType === "pv" ? "Entrez le numéro PV..." :
                    "Entrez le nom de l'école..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-10 sm:h-12 text-sm sm:text-base bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                />
                <Button onClick={onSearch} variant="primary" className="px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-primary to-primary-glow rounded-xl">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-neumorphic shadow-neumorphic-sm border-0 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {selectedYear}
          </Badge>
          <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-neumorphic shadow-neumorphic-sm border-0 text-xs sm:text-sm">
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {selectedExam}
          </Badge>
          {searchQuery && (
            <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 text-xs sm:text-sm">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              "{searchQuery}"
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};