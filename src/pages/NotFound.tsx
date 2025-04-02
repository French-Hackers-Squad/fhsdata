import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import RetroLayout from "@/components/RetroLayout";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erreur 404 : L'utilisateur a tenté d'accéder à une route inexistante :",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <RetroLayout>
      <div className="min-h-screen bg-black/90 flex items-center justify-center p-8">
        <div className="france-card p-6 max-w-2xl w-full">
          <h1 className="text-4xl font-bold france-text mb-4">ERREUR 404</h1>
          <div className="space-y-4">
            <p className="text-france-white/90 font-mono">
              Erreur 404 : L'utilisateur a tenté d'accéder à une route inexistante : {location.pathname}
            </p>
            <div className="france-card p-4 font-mono">
              <p className="text-france-white/90">
                root@fhs:~# cd {location.pathname}<br />
                bash: cd: {location.pathname}: Accès Refusé : Chemin non trouvé dans le système de fichiers
              </p>
            </div>
            <Link to="/" className="france-button inline-block">
              Retour au Terminal
            </Link>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default NotFound;
