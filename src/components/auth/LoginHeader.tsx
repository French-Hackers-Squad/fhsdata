import React from 'react';
import { Shield } from 'lucide-react';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 rounded-full border-2 border-france-blue overflow-hidden bg-black/50">
          <Shield className="w-full h-full p-3 text-france-blue" />
        </div>
      </div>
      <h1 className="text-3xl font-bold france-text mb-2">Connexion</h1>
      <p className="text-france-white/90">Accédez au monitoring sécurisé</p>
    </div>
  );
};

export default LoginHeader; 
