import React from 'react';
import { Target } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="france-card">
      <div className="flex items-center gap-3 mb-4">
        <Target className="text-france-red" size={24} />
        <h2 className="text-2xl font-bold france-text">Notre Mission</h2>
      </div>
      <p className="text-france-white/90">
        French Hackers Squad (FHS) est un collectif d'élite spécialisé dans la traque et la neutralisation des sites de pédopornographie. Notre mission est d'identifier, surveiller et contribuer à la fermeture de ces plateformes illégales, en collaboration étroite avec les forces de l'ordre et les autorités compétentes.
      </p>
    </section>
  );
};

export default MissionSection; 
