import React from "react";
import RetroLayout from "@/components/RetroLayout";
import { Code, Globe, Shield, Terminal, Palette, Server, Smartphone, Zap, GitBranch, Gitlab } from "lucide-react";

const IrisWeb = () => {
  return (
    <RetroLayout>
      <div className="min-h-screen bg-black/90 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-32 w-32 mx-auto mb-6 rounded-full overflow-hidden france-border">
              <img 
                src="/img/iris.jpg" 
                alt="Logo IrisWeb" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 france-text">
              IrisWeb
            </h1>
            <p className="text-lg text-france-white/90 mb-2">
              Développeuse Web Full Stack
            </p>
            <p className="text-france-white/70 mb-4">
              Création de sites web professionnels et sécurisés
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://gitlab.com/ihrz/ihrz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="france-button text-france-white/90 hover:text-black flex items-center gap-2"
              >
                <Gitlab size={20} />
                iHorizon
              </a>
              <a 
                href="https://github.com/irisihrz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="france-button text-france-white/90 hover:text-black flex items-center gap-2"
              >
                <GitBranch size={20} />
                GitHub
              </a>
            </div>
          </div>

          <div className="france-card p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="text-france-blue" size={24} />
              <h2 className="text-2xl font-bold france-text">À Propos</h2>
            </div>
            <p className="text-france-white/90 mb-4">
              Développeuse web passionnée avec une expertise en création de sites web modernes et sécurisés. 
              Spécialisée dans le développement front-end et back-end, je m'engage à fournir des solutions 
              sur mesure qui allient performance, sécurité et design. Développeuse principale du projet 
              iHorizon, une plateforme open-source de gestion et de surveillance.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="france-card p-4 text-center">
                <div className="text-2xl font-bold text-france-blue">5+</div>
                <div className="text-sm text-france-white/90">Années d'expérience</div>
              </div>
              <div className="france-card p-4 text-center">
                <div className="text-2xl font-bold text-france-white">50+</div>
                <div className="text-sm text-france-white/90">Projets réalisés</div>
              </div>
              <div className="france-card p-4 text-center">
                <div className="text-2xl font-bold text-france-red">100%</div>
                <div className="text-sm text-france-white/90">Satisfaction client</div>
              </div>
              <div className="france-card p-4 text-center">
                <div className="text-2xl font-bold text-france-blue">24/7</div>
                <div className="text-sm text-france-white/90">Support technique</div>
              </div>
            </div>
          </div>

          <div className="france-card p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Code className="text-france-blue" size={24} />
              <h2 className="text-2xl font-bold france-text">Compétences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="text-france-blue" size={20} />
                  <h3 className="font-bold text-france-white">Front-end</h3>
                </div>
                <p className="text-sm text-france-white/90">
                  React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3
                </p>
              </div>
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="text-france-white" size={20} />
                  <h3 className="font-bold text-france-white">Back-end</h3>
                </div>
                <p className="text-sm text-france-white/90">
                  Node.js, Express, MongoDB, PostgreSQL, API REST
                </p>
              </div>
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-france-red" size={20} />
                  <h3 className="font-bold text-france-white">Sécurité</h3>
                </div>
                <p className="text-sm text-france-white/90">
                  OWASP, JWT, HTTPS, Protection contre les attaques
                </p>
              </div>
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="text-france-blue" size={20} />
                  <h3 className="font-bold text-france-white">Mobile</h3>
                </div>
                <p className="text-sm text-france-white/90">
                  React Native, PWA, Design Responsive
                </p>
              </div>
            </div>
          </div>

          <div className="france-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-france-blue" size={24} />
              <h2 className="text-2xl font-bold france-text">Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="text-france-blue" size={20} />
                  <h3 className="font-bold text-france-white">Développement Web</h3>
                </div>
                <p className="text-france-white/90">
                  Création de sites web modernes et responsifs avec les dernières technologies.
                </p>
              </div>
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-france-white" size={20} />
                  <h3 className="font-bold text-france-white">Sécurité</h3>
                </div>
                <p className="text-france-white/90">
                  Protection et sécurisation de vos applications web contre les menaces.
                </p>
              </div>
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-france-red" size={20} />
                  <h3 className="font-bold text-france-white">Optimisation</h3>
                </div>
                <p className="text-france-white/90">
                  Amélioration des performances et de l'expérience utilisateur.
                </p>
              </div>
              <div className="france-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="text-france-blue" size={20} />
                  <h3 className="font-bold text-france-white">Design</h3>
                </div>
                <p className="text-france-white/90">
                  Création d'interfaces utilisateur modernes et intuitives.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="h-px w-10 bg-france-blue/30"></div>
            <p className="text-france-white/70">CRÉATIVITÉ • INNOVATION • EXCELLENCE</p>
            <div className="h-px w-10 bg-france-blue/30"></div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default IrisWeb; 