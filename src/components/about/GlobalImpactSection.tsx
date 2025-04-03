import React from 'react';
import { Globe } from "lucide-react";

const GlobalImpactSection = () => {
  return (
    <section className="france-card">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="text-france-blue" size={24} />
        <h2 className="text-2xl font-bold france-text">Impact Mondial</h2>
      </div>
      <p className="text-france-white/90 mb-4">
        Notre action s'étend au-delà des frontières, contribuant à la lutte contre la pédopornographie à l'échelle mondiale. Nous collaborons avec Interpol, Europol et d'autres organisations internationales pour coordonner nos efforts et maximiser notre impact.
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="h-px w-10 bg-france-blue/30"></div>
        <p className="text-france-white/70">SÉCURITÉ • DISCRÉTION • EXCELLENCE</p>
        <div className="h-px w-10 bg-france-blue/30"></div>
      </div>
    </section>
  );
};

export default GlobalImpactSection; 
