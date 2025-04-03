import React from 'react';

const AboutHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-france-blue glow-text flex items-center justify-center">
        <img 
          src="/img/logo.png" 
          alt="Logo FHS" 
          className="w-[150%] h-[150%] object-contain scale-150"
        />
      </div>
      <h1 className="text-4xl font-bold france-text mb-2">À Propos de French Hackers Squad</h1>
      <p className="text-france-white/90 text-lg">Collectif d'élite en lutte contre la pédopornographie</p>
    </div>
  );
};

export default AboutHeader; 
