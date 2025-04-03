import { Website } from "@/types/website";
import { AlertTriangle, CheckCircle, Clock, Globe } from "lucide-react";

interface WebsiteStatsProps {
  websites: Website[];
}

const WebsiteStats = ({ websites }: WebsiteStatsProps) => {
  const stats = {
    total: websites.length,
    aAttaquer: websites.filter((w) => w.status === "A attaquer").length,
    enCours: websites.filter((w) => w.status === "En cours").length,
    attaque: websites.filter((w) => w.status === "Attaqué").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-black/5 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Total des sites</p>
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-black/10 flex items-center justify-center">
            <Globe className="h-6 w-6 text-zinc-400" />
          </div>
        </div>
      </div>

      <div className="bg-black/5 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">À attaquer</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.aAttaquer}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-yellow-400/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="bg-black/5 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">En cours</p>
            <p className="text-2xl font-bold text-blue-400">{stats.enCours}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-400/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-black/5 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Attaqués</p>
            <p className="text-2xl font-bold text-green-400">{stats.attaque}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-400/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteStats; 
