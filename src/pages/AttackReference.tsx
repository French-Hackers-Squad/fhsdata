import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, Info, Target, Users, Lock, Eye, FileWarning, ChevronRight } from "lucide-react";
import RetroLayout from "@/components/RetroLayout";
import MatrixBackground from "@/components/MatrixBackground";
import { motion } from "framer-motion";

const AttackReference: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(0, 85, 164, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <RetroLayout>
      <div className="relative min-h-screen bg-black/90 overflow-hidden">
        <MatrixBackground density={isMobile ? 100 : 200} />
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 france-text font-terminal tracking-tight relative">
                <span className="relative z-10">Référence des Attaques</span>
                <motion.div 
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-france-blue via-france-white to-france-red rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "6rem" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </h1>
              <p className="text-france-white/70 mt-4 max-w-2xl mx-auto">Guide complet des menaces en ligne et des bonnes pratiques de sécurité</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <Alert className="france-card border-none bg-black/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-france-blue via-france-white to-france-red"></div>
                <AlertTriangle className="h-5 w-5 text-france-red" />
                <AlertTitle className="text-lg font-terminal france-text">Attention</AlertTitle>
                <AlertDescription className="text-france-white/90 mt-2">
                  Cette page est destinée à informer sur les menaces en ligne et les bonnes pratiques de sécurité. Notre groupe se concentre sur la lutte contre la pédocriminalité et d'autres menaces en ligne, en collaboration avec des brigades spécialisées.
                </AlertDescription>
              </Alert>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} whileHover="hover">
                <Card className="france-card h-full transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-france-blue via-france-white to-france-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="border-b border-france-blue/20">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-6 w-6 text-france-red" />
                      Ciblage et Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="list-none space-y-3">
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Actions contre les comportements nuisibles en ligne</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Lutte contre la pédocriminalité</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Orientation vers les brigades spécialisées</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Identification et signalement des prédateurs</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Protection des victimes potentielles</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} whileHover="hover">
                <Card className="france-card h-full transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-france-blue via-france-white to-france-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="border-b border-france-blue/20">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Shield className="h-6 w-6 text-france-blue" />
                      Notre Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="list-none space-y-3">
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Collaboration avec des brigades anti-pédocriminalité</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Signalement systématique des cas identifiés</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Pas d'intervention directe avec les forces de l'ordre</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="group-hover/item:text-france-white transition-colors duration-300">Focus sur l'identification et le signalement</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 france-text font-terminal text-center relative">
                <span className="relative z-10">Sensibilisation aux Menaces d'Internet</span>
                <motion.div 
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-france-blue via-france-white to-france-red rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "6rem" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover="hover">
                  <Card className="france-card h-full transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-france-blue via-france-white to-france-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="border-b border-france-blue/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Eye className="h-6 w-6 text-france-white" />
                        Reconnaissance des Menaces
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="list-none space-y-3">
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Techniques de manipulation en ligne</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Signes avant-coureurs de prédateurs</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Méthodes de recrutement</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Fausses identités et usurpation</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover="hover">
                  <Card className="france-card h-full transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-france-blue via-france-white to-france-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="border-b border-france-blue/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Lock className="h-6 w-6 text-france-blue" />
                        Protection Personnelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="list-none space-y-3">
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Sécurisation des comptes en ligne</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Protection des données personnelles</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Paramètres de confidentialité</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Vérification des sources</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover="hover">
                  <Card className="france-card h-full transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-france-blue via-france-white to-france-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="border-b border-france-blue/20">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <FileWarning className="h-6 w-6 text-france-red" />
                        Signalement et Action
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="list-none space-y-3">
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Procédures de signalement</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Collecte de preuves</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Protection des victimes</span>
                        </li>
                        <li className="flex items-start gap-2 group/item">
                          <div className="h-1.5 w-1.5 rounded-full bg-france-blue mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                          <span className="group-hover/item:text-france-white transition-colors duration-300">Ressources d'aide</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 france-text font-terminal text-center relative">
                <span className="relative z-10">Améliorations en Cours</span>
                <motion.div 
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-france-blue via-france-white to-france-red rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "6rem" }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                />
              </h2>
              <div className="space-y-4">
                <Alert className="france-card border-none bg-black/50 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-france-blue via-france-white to-france-red"></div>
                  <AlertTriangle className="h-5 w-5 text-france-red" />
                  <AlertTitle className="text-lg font-terminal france-text">Problèmes à Résoudre</AlertTitle>
                  <AlertDescription className="mt-2">
                    <ul className="list-none space-y-3 mt-2">
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-red mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="text-france-white/90 group-hover/item:text-france-white transition-colors duration-300">Ciblage des sous-domaines et domaines principaux de Chatiw</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-red mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="text-france-white/90 group-hover/item:text-france-white transition-colors duration-300">Correction de l'onglet "Terminal" et des problèmes de redirection</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-red mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="text-france-white/90 group-hover/item:text-france-white transition-colors duration-300">Amélioration des outils de détection</span>
                      </li>
                      <li className="flex items-start gap-2 group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-france-red mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                        <span className="text-france-white/90 group-hover/item:text-france-white transition-colors duration-300">Optimisation des procédures de signalement</span>
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center gap-2 mt-16 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.div 
                className="h-px w-10 bg-france-blue/30"
                initial={{ width: 0 }}
                animate={{ width: "2.5rem" }}
                transition={{ delay: 1.3, duration: 0.8 }}
              ></motion.div>
              <p className="text-france-white/70 font-terminal tracking-wider">SÉCURITÉ • DISCRÉTION • EXCELLENCE</p>
              <motion.div 
                className="h-px w-10 bg-france-blue/30"
                initial={{ width: 0 }}
                animate={{ width: "2.5rem" }}
                transition={{ delay: 1.3, duration: 0.8 }}
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default AttackReference; 