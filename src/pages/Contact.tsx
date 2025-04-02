import React from "react";
import RetroLayout from "@/components/RetroLayout";
import { Mail, MessageSquare, Globe, Shield, Lock, AlertTriangle, Users, Terminal } from "lucide-react";

const Contact = () => {
  return (
    <RetroLayout>
      <div className="min-h-screen bg-black/90 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="france-card">
            <div className="text-center mb-8">
              <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-france-blue glow-text">
                <img 
                  src="/img/logo.png" 
                  alt="Logo FHS" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold france-text mb-2">Contactez-nous</h1>
              <p className="text-france-white/90 text-lg">Pour signaler un site ou collaborer avec nous</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="france-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="text-france-blue" size={24} />
                    <h2 className="text-2xl font-bold france-text">Informations de Contact</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-france-blue" size={20} />
                      <span className="text-france-white/90">contact@fhs.fr</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="text-france-white" size={20} />
                      <span className="text-france-white/90">Discord: discord.gg/fhs</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="text-france-red" size={20} />
                      <span className="text-france-white/90">www.fhs.fr</span>
                    </div>
                  </div>
                </div>

                <div className="france-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-france-blue" size={24} />
                    <h2 className="text-2xl font-bold france-text">Sécurité</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Lock className="text-france-white" size={20} />
                      <span className="text-france-white/90">Communication chiffrée</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="text-france-red" size={20} />
                      <span className="text-france-white/90">Protection des données</span>
                    </div>
                    <p className="text-france-white/90 text-sm mt-2">
                      Toutes nos communications sont protégées et chiffrées pour garantir votre confidentialité et votre sécurité.
                    </p>
                  </div>
                </div>

                <div className="france-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="text-france-blue" size={24} />
                    <h2 className="text-2xl font-bold france-text">Collaboration</h2>
                  </div>
                  <p className="text-france-white/90 mb-4">
                    Nous sommes ouverts à la collaboration avec d'autres organisations et professionnels engagés dans la lutte contre la pédopornographie.
                  </p>
                  <div className="flex items-center space-x-3">
                    <Terminal className="text-france-white" size={20} />
                    <span className="text-france-white/90">Recrutement: careers@fhs.fr</span>
                  </div>
                </div>
              </div>

              <div className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="text-france-blue" size={24} />
                  <h2 className="text-2xl font-bold france-text">Formulaire de Contact</h2>
                </div>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-france-white/90 mb-2">Nom</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-black/50 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:outline-none focus:border-france-blue"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-france-white/90 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-black/50 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:outline-none focus:border-france-blue"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-france-white/90 mb-2">Sujet</label>
                    <select
                      id="subject"
                      className="w-full bg-black/50 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:outline-none focus:border-france-blue"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="report">Signalement de site</option>
                      <option value="collaboration">Proposition de collaboration</option>
                      <option value="support">Support technique</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-france-white/90 mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full bg-black/50 border border-france-blue/30 rounded px-4 py-2 text-france-white/90 focus:outline-none focus:border-france-blue"
                      placeholder="Votre message..."
                    ></textarea>
                  </div>
                  <button type="submit" className="france-button w-full text-france-white/90 hover:text-black">
                    Envoyer
                  </button>
                </form>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="h-px w-10 bg-france-blue/30"></div>
              <p className="text-france-white/70">SÉCURITÉ • DISCRÉTION • EXCELLENCE</p>
              <div className="h-px w-10 bg-france-blue/30"></div>
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default Contact;
