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
  const searchTypes = [
    { value: "name", label: "Nom de l'étudiant", icon: User },
    { value: "pv", label: "Numéro PV", icon: Filter },
    { value: "school", label: "École", icon: School }
  ];

  return (
    <Card className="shadow-card bg-gradient-to-r from-card to-muted/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <CardTitle>Recherche et Filtres</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Année d'Examen
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Type d'Examen
            </label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sélectionner un examen" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.value} value={exam.value}>
                    <div className="flex items-center gap-2">
                      <exam.icon className="h-4 w-4" />
                      {exam.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-accent" />
            <h4 className="font-medium">Recherche de Résultats</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de Recherche</label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Type de recherche" />
                </SelectTrigger>
                <SelectContent>
                  {searchTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Rechercher</label>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    searchType === "name" ? "Entrez le nom de l'étudiant..." :
                    searchType === "pv" ? "Entrez le numéro PV..." :
                    "Entrez le nom de l'école..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background"
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                />
                <Button onClick={onSearch} className="px-6 bg-gradient-primary">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Calendar className="h-3 w-3 mr-1" />
            {selectedYear}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <GraduationCap className="h-3 w-3 mr-1" />
            {selectedExam}
          </Badge>
          {searchQuery && (
            <Badge variant="outline" className="px-3 py-1">
              <Search className="h-3 w-3 mr-1" />
              "{searchQuery}"
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};