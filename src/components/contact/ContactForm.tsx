import React from 'react';
import { MessageSquare } from "lucide-react";

const ContactForm = () => {
  return (
    <div className="france-card p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <MessageSquare className="text-france-blue" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold france-text">Formulaire de Contact</h2>
      </div>
      <form className="space-y-3 sm:space-y-4 interactive-element">
        <div>
          <label htmlFor="name" className="block text-france-white/90 text-sm mb-1.5 sm:mb-2">Nom</label>
          <input
            type="text"
            id="name"
            className="w-full bg-black/50 border border-france-blue/30 rounded px-3 sm:px-4 py-2 text-sm sm:text-base text-france-white/90 focus:outline-none focus:border-france-blue transition-colors duration-300 interactive-element"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-france-white/90 text-sm mb-1.5 sm:mb-2">Email</label>
          <input
            type="email"
            id="email"
            className="w-full bg-black/50 border border-france-blue/30 rounded px-3 sm:px-4 py-2 text-sm sm:text-base text-france-white/90 focus:outline-none focus:border-france-blue transition-colors duration-300 interactive-element"
            placeholder="votre@email.com"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-france-white/90 text-sm mb-1.5 sm:mb-2">Sujet</label>
          <select
            id="subject"
            className="w-full bg-black/50 border border-france-blue/30 rounded px-3 sm:px-4 py-2 text-sm sm:text-base text-france-white/90 focus:outline-none focus:border-france-blue transition-colors duration-300 interactive-element"
          >
            <option value="">Sélectionnez un sujet</option>
            <option value="report">Signalement de site</option>
            <option value="collaboration">Proposition de collaboration</option>
            <option value="support">Support technique</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-france-white/90 text-sm mb-1.5 sm:mb-2">Message</label>
          <textarea
            id="message"
            rows={4}
            className="w-full bg-black/50 border border-france-blue/30 rounded px-3 sm:px-4 py-2 text-sm sm:text-base text-france-white/90 focus:outline-none focus:border-france-blue transition-colors duration-300 interactive-element"
            placeholder="Votre message..."
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="france-button w-full text-sm sm:text-base text-france-white/90 hover:text-black transition-colors duration-300 interactive-element"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 
