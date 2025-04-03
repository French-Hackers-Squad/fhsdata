import React from 'react';
import { Link } from "react-router-dom";
import { 
  Target, 
  Shield, 
  Globe, 
  Terminal,
  ChevronRight 
} from "lucide-react";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
      {/* Carte Engagement - Style bleu */}
      <div className="relative rounded-lg p-6 hover:bg-black/50 transition-all duration-300 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-france-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-france-blue/5 rounded-full blur-2xl group-hover:bg-france-blue/10 transition-all duration-500 z-0"></div>
        <div className="absolute inset-0 border-2 border-france-blue/50 rounded-lg z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-france-blue/10 rounded-lg">
              <Shield className="text-france-blue" size={24} />
            </div>
            <h2 className="text-2xl font-bold france-text">Notre Engagement</h2>
          </div>
          <p className="text-france-white/90 mb-4">
            Protection des enfants et lutte contre l'exploitation en ligne avec des méthodes éthiques et légales.
          </p>
          <div className="flex flex-col gap-2 relative z-20">
            <Link to="/monitor" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2 bg-gradient-to-r from-france-blue/80 to-france-blue hover:from-france-blue hover:to-france-blue/80">
              Accéder au monitoring
              <ChevronRight size={16} />
            </Link>
            <Link to="/terminal" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2 bg-gradient-to-r from-france-white/20 to-france-blue/20 hover:from-france-blue/20 hover:to-france-white/20">
              <Terminal size={16} />
              Accéder au terminal
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Carte Impact - Style blanc */}
      <div className="relative rounded-lg p-6 hover:bg-black/50 transition-all duration-300 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-france-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-france-white/5 rounded-full blur-2xl group-hover:bg-france-white/10 transition-all duration-500 z-0"></div>
        <div className="absolute inset-0 border-2 border-france-white/50 rounded-lg z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-france-white/10 rounded-lg">
              <Globe className="text-france-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold france-text">Notre Impact</h2>
          </div>
          <p className="text-france-white/90 mb-4">
            Action internationale coordonnée avec les forces de l'ordre et les organisations spécialisées.
          </p>
          <Link to="/attacks" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2 bg-gradient-to-r from-france-white/30 to-france-white/10 hover:from-france-white/40 hover:to-france-white/20 relative z-20">
            Notre Impact
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Carte Mission - Style rouge */}
      <div className="relative rounded-lg p-6 hover:bg-black/50 transition-all duration-300 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-france-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-france-red/5 rounded-full blur-2xl group-hover:bg-france-red/10 transition-all duration-500 z-0"></div>
        <div className="absolute inset-0 border-2 border-france-red/50 rounded-lg z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-france-red/10 rounded-lg">
              <Target className="text-france-red" size={24} />
            </div>
            <h2 className="text-2xl font-bold france-text">Notre Mission</h2>
          </div>
          <p className="text-france-white/90 mb-4">
            Traquer et neutraliser les sites de pédopornographie en collaboration avec les autorités compétentes.
          </p>
          <Link to="/about" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2 bg-gradient-to-r from-france-red/80 to-france-red hover:from-france-red hover:to-france-red/80 relative z-20">
            En savoir plus
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatsCards; 
