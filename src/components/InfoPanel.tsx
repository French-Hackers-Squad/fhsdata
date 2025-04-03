import React from 'react';
import { Shield, ExternalLink, Users, Terminal, Lock, Globe } from 'lucide-react';

interface InfoPanelProps {
  logo?: string;
  description?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ 
  logo = "/lovable-uploads/2fa56283-0525-4e07-ab42-7818a5e1782c.png", 
  description = "French Hackers Squad est une élite de spécialistes en cybersécurité basée en France. Notre mission est de protéger les infrastructures numériques contre les menaces émergentes." 
}) => {
  return (
    <div className="mt-8 p-4 border border-terminal-green rounded-md bg-terminal-black/80 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-terminal-green glow-text bg-black">
            <img 
              src={logo} 
              alt="French Hackers Squad" 
              className="absolute inset-0 w-[150%] h-[150%] object-contain scale-150"
            />
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
            <span className="france-blue-shadow">F</span>
            <span className="france-white-shadow">H</span>
            <span className="france-red-shadow">S</span>
            <span className="ml-2">French Hackers Squad</span>
          </h2>
          
          <p className="text-sm md:text-base opacity-90 text-center md:text-left">
            {description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <InfoCard 
              icon={<Shield className="text-france-blue" />} 
              title="Protection"
              description="Sécurisation d'infrastructures critiques"
            />
            <InfoCard 
              icon={<Terminal className="text-france-white" />} 
              title="Expertise"
              description="Pentesting & analyses avancées"
            />
            <InfoCard 
              icon={<Lock className="text-france-red" />} 
              title="Confidentialité"
              description="Protocoles sécurisés & conformité RGPD"
            />
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <button className="france-button flex items-center gap-2 text-france-white/90 hover:text-black">
              <Users size={16} />
              Notre équipe
            </button>
            <button className="france-button flex items-center gap-2 text-france-white/90 hover:text-black">
              <Globe size={16} />
              Services
            </button>
            <button className="france-button flex items-center gap-2 text-france-white/90 hover:text-black">
              <ExternalLink size={16} />
              Nous contacter
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-center text-terminal-green/70">
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-10 bg-terminal-green/30"></div>
          <p>SÉCURITÉ • DISCRÉTION • EXCELLENCE</p>
          <div className="h-px w-10 bg-terminal-green/30"></div>
        </div>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="p-3 border border-terminal-green/50 rounded bg-terminal-black/50 hover:bg-terminal-darkGreen/20 transition-all duration-300">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="font-bold text-sm">{title}</h3>
          <p className="text-xs opacity-70">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
