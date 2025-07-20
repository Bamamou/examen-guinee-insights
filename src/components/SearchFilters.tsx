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
    <Card className="shadow-neumorphic bg-gradient-neumorphic border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-neumorphic rounded-2xl shadow-neumorphic-sm">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Recherche et Filtres</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        {/* Primary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-base font-semibold flex items-center gap-3">
              <div className="p-2 bg-gradient-neumorphic rounded-xl shadow-neumorphic-sm">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Année d'Examen
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-2xl h-12">
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

          <div className="space-y-4">
            <label className="text-base font-semibold flex items-center gap-3">
              <div className="p-2 bg-gradient-neumorphic rounded-xl shadow-neumorphic-sm">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              Type d'Examen
            </label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-2xl h-12">
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
        </div>

        {/* Search Section */}
        <div className="space-y-6 p-6 bg-gradient-neumorphic-inset rounded-3xl shadow-neumorphic-inset border-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-neumorphic rounded-xl shadow-neumorphic-sm">
              <Search className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-bold text-lg">Recherche de Résultats</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <label className="text-base font-semibold">Type de Recherche</label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0 rounded-2xl h-12">
                  <SelectValue placeholder="Type de recherche" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-neumorphic shadow-neumorphic border-0 rounded-xl">
                  {searchTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <type.icon className="h-5 w-5" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="text-base font-semibold">Rechercher</label>
              <div className="flex gap-4">
                <Input
                  placeholder={
                    searchType === "name" ? "Entrez le nom de l'étudiant..." :
                    searchType === "pv" ? "Entrez le numéro PV..." :
                    "Entrez le nom de l'école..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                />
                <Button onClick={onSearch} variant="primary" size="lg" className="px-8">
                  <Search className="h-5 w-5 mr-3" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-4">
          <Badge variant="secondary" className="px-4 py-2 rounded-xl bg-gradient-neumorphic shadow-neumorphic-sm border-0">
            <Calendar className="h-4 w-4 mr-2" />
            {selectedYear}
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 rounded-xl bg-gradient-neumorphic shadow-neumorphic-sm border-0">
            <GraduationCap className="h-4 w-4 mr-2" />
            {selectedExam}
          </Badge>
          {searchQuery && (
            <Badge variant="outline" className="px-4 py-2 rounded-xl bg-gradient-neumorphic-inset shadow-neumorphic-inset border-0">
              <Search className="h-4 w-4 mr-2" />
              "{searchQuery}"
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};