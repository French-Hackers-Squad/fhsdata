import React, { useState } from 'react';
import RetroLayout from '@/components/RetroLayout';
import LoginHeader from '@/components/auth/LoginHeader';
import AuthForm from '@/components/auth/AuthForm';

export default function Login() {
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
        // Logique d'inscription
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, registrationCode }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'inscription');
        }
      } else {
        // Logique de connexion
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la connexion');
        }
      }

      // Redirection après succès
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erreur:', error);
      // Gérer l'erreur (afficher un message, etc.)
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
