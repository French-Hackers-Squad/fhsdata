import React from 'react';
import { Mail, MessageSquare, Globe } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="france-card p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Mail className="text-france-blue" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold france-text">Informations de Contact</h2>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Mail className="text-france-blue" size={18} />
          <span className="text-france-white/90 text-sm sm:text-base">contact@fhs.fr</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <MessageSquare className="text-france-white" size={18} />
          <span className="text-france-white/90 text-sm sm:text-base">Discord: discord.gg/fhs</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Globe className="text-france-red" size={18} />
          <span className="text-france-white/90 text-sm sm:text-base">www.fhs.fr</span>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo; 
