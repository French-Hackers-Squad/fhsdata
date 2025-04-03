import React from 'react';
import { Link } from "react-router-dom";
import { 
  Target, 
  Shield, 
  Globe, 
  MonitorUp, 
  ShieldAlert,
  Lock,
  ChevronRight 
} from "lucide-react";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
      <div className="france-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-france-red" size={24} />
          <h2 className="text-2xl font-bold france-text">Notre Mission</h2>
        </div>
        <p className="text-france-white/90">
          Traquer et neutraliser les sites de pédopornographie en collaboration avec les autorités compétentes.
        </p>
      </div>
      <div className="france-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-france-blue" size={24} />
          <h2 className="text-2xl font-bold france-text">Notre Engagement</h2>
        </div>
        <p className="text-france-white/90">
          Protection des enfants et lutte contre l'exploitation en ligne avec des méthodes éthiques et légales.
        </p>
      </div>
      <div className="france-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-france-white" size={24} />
          <h2 className="text-2xl font-bold france-text">Notre Impact</h2>
        </div>
        <p className="text-france-white/90">
          Action internationale coordonnée avec les forces de l'ordre et les organisations spécialisées.
        </p>
      </div>
      <div className="france-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <MonitorUp className="text-france-blue" size={24} />
          <h3 className="text-xl font-bold text-france-white">Monitoring</h3>
        </div>
        <p className="text-france-white/90 mb-4">
          Surveillance en temps réel des sites suspects et analyse des menaces.
        </p>
        <Link to="/monitor" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2">
          Accéder au monitoring
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="france-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="text-france-white" size={24} />
          <h3 className="text-xl font-bold text-france-white">Protection</h3>
        </div>
        <p className="text-france-white/90 mb-4">
          Système de protection avancé contre les menaces pédocriminelles.
        </p>
        <Link to="/about" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2">
          En savoir plus
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="france-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-france-red" size={24} />
          <h3 className="text-xl font-bold text-france-white">Sécurité</h3>
        </div>
        <p className="text-france-white/90 mb-4">
          Protection maximale des données sensibles et des victimes.
        </p>
        <Link to="/contact" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2">
          Nous contacter
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default StatsCards; 
