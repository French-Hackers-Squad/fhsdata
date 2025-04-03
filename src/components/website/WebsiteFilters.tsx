import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface WebsiteFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  onAddClick: () => void;
}

const WebsiteFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onAddClick
}: WebsiteFiltersProps) => {
  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full md:w-64 bg-black/10 border-zinc-800 text-zinc-300 placeholder-zinc-500 focus:border-zinc-700"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/10 border border-zinc-800 text-zinc-300 focus:border-zinc-700 focus:outline-none cursor-pointer hover:bg-black/20 transition-colors duration-200"
          >
            <option value="">Tous les statuts</option>
            <option value="A attaquer">À attaquer</option>
            <option value="En cours">En cours</option>
            <option value="Attaqué">Attaqué</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/10 border border-zinc-800 text-zinc-300 focus:border-zinc-700 focus:outline-none cursor-pointer hover:bg-black/20 transition-colors duration-200"
          >
            <option value="">Toutes les priorités</option>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
        </div>
        <Button
          onClick={onAddClick}
          className="w-full md:w-auto bg-black/10 hover:bg-black/20 text-zinc-100 gap-2 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Ajouter un site
        </Button>
      </div>
    </div>
  );
};

export default WebsiteFilters; 
