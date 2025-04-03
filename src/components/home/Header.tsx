import React from 'react';
import { useAppUrl } from '@/hooks/useAppUrl';

const Header = () => {
  const { getAssetPath } = useAppUrl();
  const logo = getAssetPath("/img/logo.png");

  return (
    <div className="pt-6 md:pt-10 pb-4 md:pb-6 text-center flex flex-col items-center">
      <div className="h-20 w-20 md:h-32 md:w-32 mb-3 md:mb-4 rounded-full overflow-hidden border-2 border-france-blue glow-text bg-black/50 flex items-center justify-center">
        <img 
          src={logo} 
          alt="French Hackers Squad" 
          className="w-[150%] h-[150%] object-contain scale-150"
        />
      </div>
      <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 france-text font-terminal tracking-tight">
        French Hackers Squad
      </h1>
      <p className="text-base md:text-lg text-france-white/90 max-w-2xl mx-auto px-4">
        Collectif d'élite spécialisé dans la lutte contre la pédocriminalité en ligne. Notre mission est de protéger les enfants en identifiant et en neutralisant les sites diffusant du contenu pédopornographique.
      </p>
    </div>
  );
};

export default Header; 
