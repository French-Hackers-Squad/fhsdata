import React, { useState } from 'react';
import { LogIn, Shield, UserPlus, AlertCircle } from 'lucide-react';
import RetroLayout from '@/components/RetroLayout';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MatrixBackground from '@/components/MatrixBackground';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });

      navigate("/");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérifier si le code d'inscription est valide
      const { data: codeData, error: codeError } = await supabase
        .from('registration_codes')
        .select('*')
        .eq('code', registrationCode)
        .eq('is_used', false)
        .single();

      if (codeError) {
        console.error("Erreur de vérification du code:", codeError);
        throw new Error("Code d'inscription invalide ou déjà utilisé");
      }

      if (!codeData) {
        throw new Error("Code d'inscription invalide ou déjà utilisé");
      }

      // Créer le compte
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Erreur d'inscription:", authError);
        throw authError;
      }

      // Marquer le code comme utilisé
      const { error: updateError } = await supabase
        .from('registration_codes')
        .update({ 
          is_used: true,
          used_by: authData.user?.id,
          used_at: new Date().toISOString()
        })
        .eq('code', registrationCode);

      if (updateError) {
        console.error("Erreur de mise à jour du code:", updateError);
        throw new Error("Erreur lors de la validation du code d'inscription");
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });

      setIsRegistering(false);
      setRegistrationCode("");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RetroLayout>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <MatrixBackground density={85} />
        <div className="relative z-10 w-full max-w-md">
          <div className="france-card p-8 backdrop-blur-sm bg-black/50">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full border-2 border-france-blue overflow-hidden bg-black/50">
                  <Shield className="w-full h-full p-3 text-france-blue" />
                </div>
              </div>
              <h1 className="text-3xl font-bold france-text mb-2">Connexion</h1>
              <p className="text-france-white/90">Accédez au monitoring sécurisé</p>
            </div>
            
            <Card className="w-full max-w-md bg-black/50 border-france-blue/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-france-white text-center">
                  {isRegistering ? "Créer un compte" : "Connexion"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
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

            <div className="mt-6 text-center">
              <p className="text-xs text-france-white/50">
                Système de monitoring sécurisé • French Hackers Squad
              </p>
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default Login; 