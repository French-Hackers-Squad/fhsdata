import React from 'react';
import { Shield, Code, Terminal } from "lucide-react";

const TeamSection = () => {
  return (
    <section className="france-card">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <Shield className="text-france-blue" size={20} />
        <h2 className="text-xl md:text-2xl font-bold france-text">Notre Équipe</h2>
      </div>
      <p className="text-sm md:text-base text-france-white/90 mb-4">
        Une équipe d'experts dédiés à la protection des enfants et à la lutte contre la pédocriminalité en ligne.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="france-card">
          <Code className="text-france-blue mb-2" size={18} />
          <h3 className="font-bold text-france-white mb-2">Experts en Traque</h3>
          <p className="text-xs md:text-sm text-france-white/90">Spécialistes en analyse de réseaux et traçage de contenus illégaux</p>
        </div>
        <div className="france-card">
          <Terminal className="text-france-white mb-2" size={18} />
          <h3 className="font-bold text-france-white mb-2">Analystes</h3>
          <p className="text-xs md:text-sm text-france-white/90">Experts en détection et analyse de contenus pédopornographiques</p>
        </div>
        <div className="france-card">
          <Shield className="text-france-red mb-2" size={18} />
          <h3 className="font-bold text-france-white mb-2">Juristes</h3>
          <p className="text-xs md:text-sm text-france-white/90">Spécialistes en droit pénal et protection des mineurs</p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 
