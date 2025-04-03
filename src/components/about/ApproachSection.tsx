import React from 'react';
import { Lock, AlertTriangle, Heart } from "lucide-react";

const ApproachSection = () => {
  return (
    <section className="france-card">
      <div className="flex items-center gap-3 mb-4">
        <Lock className="text-france-white" size={24} />
        <h2 className="text-2xl font-bold france-text">Notre Approche</h2>
      </div>
      <p className="text-france-white/90 mb-4">
        Nous opérons dans le strict respect du cadre légal, utilisant des méthodes professionnelles et éthiques. Notre approche combine expertise technique, coordination internationale et engagement communautaire pour lutter efficacement contre la pédopornographie.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="france-card">
          <AlertTriangle className="text-france-blue mb-2" size={20} />
          <h3 className="font-bold text-france-white mb-2">Détection</h3>
          <p className="text-sm text-france-white/90">Surveillance active des réseaux et identification des sites pédopornographiques</p>
        </div>
        <div className="france-card">
          <Heart className="text-france-red mb-2" size={20} />
          <h3 className="font-bold text-france-white mb-2">Protection</h3>
          <p className="text-sm text-france-white/90">Neutralisation des sites et protection des victimes potentielles</p>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection; 
