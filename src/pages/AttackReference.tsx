import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, Info } from "lucide-react";

const AttackReference: React.FC = () => {
  return (
    <div className="content-wrapper container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Référence des Attaques</h1>
      
      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          Cette page est destinée à informer sur les menaces en ligne et les bonnes pratiques de sécurité.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Ciblage et Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Actions contre les comportements nuisibles en ligne</li>
              <li>Lutte contre la pédocriminalité</li>
              <li>Orientation vers les brigades spécialisées</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sensibilisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information sur les risques en ligne</li>
              <li>Bonnes pratiques de sécurité</li>
              <li>Protection de la vie privée</li>
              <li>Identification des menaces subtiles</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Améliorations en Cours</h2>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Problèmes à Résoudre</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ciblage des sous-domaines et domaines principaux de Chatiw</li>
                <li>Correction de l'onglet "Terminal" et des problèmes de redirection</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default AttackReference; 