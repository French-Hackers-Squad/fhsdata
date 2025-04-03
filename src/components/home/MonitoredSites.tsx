import React from 'react';
import { 
  MonitorUp,
  Search,
  ArrowUpDown,
  User,
  Calendar,
  Info
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Website {
  id: string;
  url: string;
  status: "A attaquer" | "En cours" | "Attaqué";
  date_added: string;
  added_by: string;
  notes?: string;
  priority: "Basse" | "Moyenne" | "Haute";
  user_name: string;
  avatar_url?: string;
  ecrie: boolean;
}

interface MonitoredSitesProps {
  session: any;
  websites: Website[];
  filteredWebsites: Website[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  sortDirection: 'asc' | 'desc';
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const MonitoredSites: React.FC<MonitoredSitesProps> = ({
  session,
  websites,
  filteredWebsites,
  isLoading,
  searchTerm,
  statusFilter,
  priorityFilter,
  sortDirection,
  setSearchTerm,
  setStatusFilter,
  setPriorityFilter,
  setSortDirection
}) => {
  const getStatusColor = (status: Website['status']) => {
    switch (status) {
      case 'Attaqué':
        return 'bg-france-red/20 text-france-red border-france-red/30';
      case 'En cours':
        return 'bg-france-white/20 text-france-white border-france-white/30';
      case 'A attaquer':
        return 'bg-france-blue/20 text-france-blue border-france-blue/30';
      default:
        return 'bg-france-white/20 text-france-white border-france-white/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="france-card p-6 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MonitorUp className="text-france-blue" size={24} />
          <h2 className="text-2xl font-bold france-text">Sites Surveillés</h2>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-france-red"></div>
          <div className="w-3 h-3 rounded-full bg-france-white"></div>
          <div className="w-3 h-3 rounded-full bg-france-blue"></div>
        </div>
      </div>

      {!session && (
        <div className="mb-4 p-4 bg-france-blue/10 border border-france-blue/30 rounded-lg">
          <div className="flex items-center gap-2 text-france-blue">
            <Info size={20} />
            <p>Connectez-vous pour ajouter de nouveaux sites à surveiller</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-france-blue/50" size={16} />
            <Input
              type="text"
              placeholder="Rechercher un site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/50 border-france-blue/30 text-france-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/50 border border-france-blue/30 text-france-white rounded-md px-3 py-2"
            >
              <option value="">Tous les statuts</option>
              <option value="A attaquer">A attaquer</option>
              <option value="En cours">En cours</option>
              <option value="Attaqué">Attaqué</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-black/50 border border-france-blue/30 text-france-white rounded-md px-3 py-2"
            >
              <option value="">Toutes les priorités</option>
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
            <Button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="france-button"
            >
              <ArrowUpDown size={16} className="mr-2" />
              {sortDirection === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="loader-matrix"></div>
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="col-span-full text-center py-8 text-france-white/70">
              Aucun site trouvé
            </div>
          ) : (
            filteredWebsites.map((website) => (
              <Card key={website.id} className="bg-black/50 border-france-blue/30">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-france-white text-lg">
                      {website.url}
                    </CardTitle>
                    <Badge className={getStatusColor(website.status)}>
                      {website.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-france-white/70">
                    <div className="flex items-center gap-2">
                      {website.avatar_url ? (
                        <img 
                          src={website.avatar_url} 
                          alt={website.user_name}
                          className="w-6 h-6 rounded-full object-cover border border-france-blue/30"
                        />
                      ) : (
                        <User size={14} />
                      )}
                      <span>{website.user_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{formatDate(website.date_added)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoredSites; 
