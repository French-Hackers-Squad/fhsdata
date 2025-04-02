import React from "react";
import RetroLayout from "@/components/RetroLayout";
import { Shield, Award, Users, Lock, Globe, Terminal, Target, Heart, Code, AlertTriangle } from "lucide-react";

const About = () => {
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
              <h1 className="text-4xl font-bold france-text mb-2">À Propos de French Hackers Squad</h1>
              <p className="text-france-white/90 text-lg">Collectif d'élite en lutte contre la pédopornographie</p>
            </div>
            
            <div className="space-y-8">
              <section className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-france-red" size={24} />
                  <h2 className="text-2xl font-bold france-text">Notre Mission</h2>
                </div>
                <p className="text-france-white/90">
                  French Hackers Squad (FHS) est un collectif d'élite spécialisé dans la traque et la neutralisation des sites de pédopornographie. Notre mission est d'identifier, surveiller et contribuer à la fermeture de ces plateformes illégales, en collaboration étroite avec les forces de l'ordre et les autorités compétentes.
                </p>
              </section>

              <section className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-france-blue" size={24} />
                  <h2 className="text-2xl font-bold france-text">Notre Équipe</h2>
                </div>
                <p className="text-france-white/90 mb-4">
                  Notre collectif réunit des experts en cybersécurité, des analystes spécialisés dans la détection de contenu illégal et des coordinateurs juridiques. Chaque membre est formé pour identifier et traquer les réseaux de pédopornographie avec précision et efficacité.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="france-card p-4">
                    <Code className="text-france-blue mb-2" size={20} />
                    <h3 className="font-bold text-france-white mb-2">Experts en Traque</h3>
                    <p className="text-sm text-france-white/90">Spécialistes en analyse de réseaux et traçage de contenus illégaux</p>
                  </div>
                  <div className="france-card p-4">
                    <Terminal className="text-france-white mb-2" size={20} />
                    <h3 className="font-bold text-france-white mb-2">Analystes</h3>
                    <p className="text-sm text-france-white/90">Experts en détection et analyse de contenus pédopornographiques</p>
                  </div>
                  <div className="france-card p-4">
                    <Shield className="text-france-red mb-2" size={20} />
                    <h3 className="font-bold text-france-white mb-2">Juristes</h3>
                    <p className="text-sm text-france-white/90">Spécialistes en droit pénal et protection des mineurs</p>
                  </div>
                </div>
              </section>

              <section className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-france-white" size={24} />
                  <h2 className="text-2xl font-bold france-text">Notre Approche</h2>
                </div>
                <p className="text-france-white/90 mb-4">
                  Nous opérons dans le strict respect du cadre légal, utilisant des méthodes professionnelles et éthiques. Notre approche combine expertise technique, coordination internationale et engagement communautaire pour lutter efficacement contre la pédopornographie.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="france-card p-4">
                    <AlertTriangle className="text-france-blue mb-2" size={20} />
                    <h3 className="font-bold text-france-white mb-2">Détection</h3>
                    <p className="text-sm text-france-white/90">Surveillance active des réseaux et identification des sites pédopornographiques</p>
                  </div>
                  <div className="france-card p-4">
                    <Heart className="text-france-red mb-2" size={20} />
                    <h3 className="font-bold text-france-white mb-2">Protection</h3>
                    <p className="text-sm text-france-white/90">Neutralisation des sites et protection des victimes potentielles</p>
                  </div>
                </div>
              </section>

              <section className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="text-france-blue" size={24} />
                  <h2 className="text-2xl font-bold france-text">Impact Mondial</h2>
                </div>
                <p className="text-france-white/90 mb-4">
                  Notre action s'étend au-delà des frontières, contribuant à la lutte contre la pédopornographie à l'échelle mondiale. Nous collaborons avec Interpol, Europol et d'autres organisations internationales pour coordonner nos efforts et maximiser notre impact.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="h-px w-10 bg-france-blue/30"></div>
                  <p className="text-france-white/70">SÉCURITÉ • DISCRÉTION • EXCELLENCE</p>
                  <div className="h-px w-10 bg-france-blue/30"></div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default About;
