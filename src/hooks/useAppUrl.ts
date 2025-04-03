import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAppUrl = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const navigate = useNavigate();
  const isGitHubPages = window.location.hostname.includes('github.io');

  return useMemo(() => ({
    getPath: (path: string) => {
      // Si c'est une URL externe, la retourner telle quelle
      if (path.startsWith('http')) return path;
      // Sinon, construire le chemin relatif
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return isGitHubPages ? `${baseUrl}${cleanPath}` : `/${cleanPath}`;
    },
    getAssetPath: (path: string) => {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return `${baseUrl}${cleanPath}`;
    },
    navigateTo: (path: string) => {
      // Si c'est une URL externe, l'ouvrir dans un nouvel onglet
      if (path.startsWith('http')) {
        window.open(path, '_blank');
        return;
      }
      
      // Pour les chemins internes, s'assurer qu'ils commencent par /
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      
      // Si nous sommes déjà sur la page d'accueil et qu'on clique sur accueil,
      // forcer un rechargement pour éviter les problèmes de routing
      if (normalizedPath === '/' && window.location.pathname === (isGitHubPages ? baseUrl : '/')) {
        window.location.href = isGitHubPages ? baseUrl : '/';
        return;
      }
      
      navigate(normalizedPath);
    }
  }), [baseUrl, navigate, isGitHubPages]);
}; 