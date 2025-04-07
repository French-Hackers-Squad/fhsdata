import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import RetroLayout from '@/components/RetroLayout';
import LoginHeader from '@/components/auth/LoginHeader';
import AuthForm from '@/components/auth/AuthForm';
import { toast } from '@/components/ui/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Vérification du code d'inscription
        const { data: codeData, error: codeError } = await supabase
          .from('registration_codes')
          .select('*')
          .eq('code', registrationCode)
          .single();

        if (codeError || !codeData) {
          throw new Error('Code d\'inscription invalide');
        }

        if (codeData.is_used) {
          throw new Error('Ce code d\'inscription a déjà été utilisé');
        }

        // Inscription avec Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        // Mettre à jour le statut du code d'inscription
        const { error: updateError } = await supabase
          .from('registration_codes')
          .update({ 
            is_used: true,
            used_by: authData.user?.id,
            used_at: new Date().toISOString()
          })
          .eq('code', registrationCode);

        if (updateError) {
          console.error('Erreur lors de la mise à jour du code:', updateError);
          // On continue quand même car l'utilisateur est déjà créé
        }

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        // Connexion avec Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });

        navigate('/');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RetroLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoginHeader />
        <div className="mt-8">
          <AuthForm
            isRegistering={isRegistering}
            isLoading={isLoading}
            email={email}
            password={password}
            registrationCode={registrationCode}
            setEmail={setEmail}
            setPassword={setPassword}
            setRegistrationCode={setRegistrationCode}
            setIsRegistering={setIsRegistering}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </RetroLayout>
  );
} 
