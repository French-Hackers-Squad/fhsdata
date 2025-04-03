import React from 'react';
import { getPublicPath } from "@/utils/path";

const ContactHeader = () => {
  return (
    <div className="text-center mb-6 md:mb-8">
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-2 border-france-blue glow-text bg-black/50 flex items-center justify-center">
        <img 
          src={getPublicPath("/img/logo.png")} 
          alt="Logo FHS" 
          className="w-[150%] h-[150%] object-contain scale-150"
        />
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold france-text mb-2">Contactez-nous</h1>
      <p className="text-france-white/90 text-base sm:text-lg">Pour signaler un site ou collaborer avec nous</p>
    </div>
  );
};

export default ContactHeader; 
