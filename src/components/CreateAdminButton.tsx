import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateAdminButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createAdminUser = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin');
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Succès",
        description: data.message || "Utilisateur administrateur créé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur administrateur:", error);
      toast({
        title: "Erreur",
        description: "Échec de la création de l'utilisateur administrateur. Consultez la console pour plus de détails.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={createAdminUser} 
      className="france-button text-france-white/90 hover:text-black"
      disabled={isLoading}
    >
      {isLoading ? "Création en cours..." : "Créer un Utilisateur Admin"}
    </Button>
  );
};

export default CreateAdminButton;
