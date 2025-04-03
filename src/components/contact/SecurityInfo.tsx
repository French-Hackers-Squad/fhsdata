import React from 'react';
import { Shield, Lock, AlertTriangle } from "lucide-react";

const SecurityInfo = () => {
  return (
    <div className="france-card p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Shield className="text-france-blue" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold france-text">Sécurité</h2>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Lock className="text-france-white" size={18} />
          <span className="text-france-white/90 text-sm sm:text-base">Communication chiffrée</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <AlertTriangle className="text-france-red" size={18} />
          <span className="text-france-white/90 text-sm sm:text-base">Protection des données</span>
        </div>
        <p className="text-france-white/90 text-xs sm:text-sm mt-2">
          Toutes nos communications sont protégées et chiffrées pour garantir votre confidentialité et votre sécurité.
        </p>
      </div>
    </div>
  );
};

export default SecurityInfo; 
