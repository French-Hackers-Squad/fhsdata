import React from 'react';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormProps {
  isRegistering: boolean;
  isLoading: boolean;
  email: string;
  password: string;
  registrationCode: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setRegistrationCode: (code: string) => void;
  setIsRegistering: (isRegistering: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isRegistering,
  isLoading,
  email,
  password,
  registrationCode,
  setEmail,
  setPassword,
  setRegistrationCode,
  setIsRegistering,
  onSubmit
}) => {
  return (
    <Card className="w-full max-w-md bg-black/50 border-france-blue/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-france-white text-center">
          {isRegistering ? "Créer un compte" : "Connexion"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-france-white/90">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black/30 border-france-blue/30 focus:border-france-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-france-white/90">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black/30 border-france-blue/30 focus:border-france-blue"
            />
          </div>
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium mb-1 text-france-white/90">Code d'inscription</label>
              <Input
                type="text"
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                required
                className="bg-black/30 border-france-blue/30 focus:border-france-blue"
              />
              <p className="text-xs text-france-white/70 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Un code d'inscription est requis pour créer un compte
              </p>
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-france-blue hover:bg-france-blue/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Chargement...
              </div>
            ) : isRegistering ? (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                S'inscrire
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Se connecter
              </div>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-france-white/70 hover:text-france-white"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm; 
