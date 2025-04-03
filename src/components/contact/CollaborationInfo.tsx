import React from 'react';
import { Users, Terminal } from "lucide-react";

const CollaborationInfo = () => {
  return (
    <div className="france-card p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Users className="text-france-blue" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold france-text">Collaboration</h2>
      </div>
      <p className="text-france-white/90 text-sm sm:text-base mb-3 sm:mb-4">
        Nous sommes ouverts à la collaboration avec d'autres organisations et professionnels engagés dans la lutte contre la pédopornographie.
      </p>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Terminal className="text-france-white" size={18} />
        <span className="text-france-white/90 text-sm sm:text-base">Recrutement: careers@fhs.fr</span>
      </div>
    </div>
  );
};

export default CollaborationInfo; 
