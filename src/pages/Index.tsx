import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import RetroLayout from "@/components/RetroLayout";
import MatrixBackground from "@/components/MatrixBackground";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/home/Header";
import StatsCards from "@/components/home/StatsCards";
import MonitoredSites from "@/components/home/MonitoredSites";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

interface Website {
  id: string;
  url: string;
  status: "A attaquer" | "En cours" | "Attaqué";
  date_added: string;
  added_by: string;
  notes?: string;
  priority: "Basse" | "Moyenne" | "Haute";
  user_name: string;
  avatar_url?: string;
  ecrie: boolean;
}

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const fetchWebsites = async () => {
    setIsLoading(true);
    try {
      console.log("Début de la récupération des sites...");
      
      const { data, error } = await supabase
        .from('websites')
        .select(`
          *,
          profiles:added_by (
            username,
            avatar_url
          )
        `)
        .order('date_added', { ascending: false });
      
      console.log("Réponse brute:", { data, error });
      
      if (error) {
        console.error("Erreur Supabase détaillée:", error);
        throw error;
      }
      
      if (!data) {
        console.log("Aucune donnée reçue");
        setWebsites([]);
        setFilteredWebsites([]);
        return;
      }

      const websitesWithUsernames = data.map((website: any) => ({
        ...website,
        user_name: website.profiles?.username || 'Anonyme',
        avatar_url: website.profiles?.avatar_url || null,
        date_added: website.date_added || new Date().toISOString(),
        status: website.status || 'A attaquer',
        priority: website.priority || 'Moyenne'
      }));
      
      console.log("Sites traités:", websitesWithUsernames);
      setWebsites(websitesWithUsernames);
      setFilteredWebsites(websitesWithUsernames);
    } catch (error) {
      console.error("Erreur complète:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sites. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      setWebsites([]);
      setFilteredWebsites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    fetchWebsites();
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let result = websites;
    
    if (searchTerm) {
      result = result.filter(website => 
        website.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      result = result.filter(website => website.status === statusFilter);
    }
    
    if (priorityFilter) {
      result = result.filter(website => website.priority === priorityFilter);
    }
    
    result.sort((a, b) => {
      const aValue = a.date_added ?? '';
      const bValue = b.date_added ?? '';
      
      if (sortDirection === "asc") {
        return String(aValue) > String(bValue) ? 1 : -1;
      } else {
        return String(aValue) < String(bValue) ? 1 : -1;
      }
    });
    
    setFilteredWebsites(result);
  }, [websites, searchTerm, statusFilter, priorityFilter, sortDirection]);

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

  return (
    <RetroLayout>
      <div className="relative min-h-screen bg-black/90 overflow-hidden">
        <MatrixBackground density={isMobile ? 100 : 200} />
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6">
            <Header />
            <StatsCards />
            <MonitoredSites 
              session={session}
              websites={websites}
              filteredWebsites={filteredWebsites}
              isLoading={isLoading}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              sortDirection={sortDirection}
              setSearchTerm={setSearchTerm}
              setStatusFilter={setStatusFilter}
              setPriorityFilter={setPriorityFilter}
              setSortDirection={setSortDirection}
            />
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="h-px w-10 bg-france-blue/30"></div>
              <p className="text-france-white/70">SÉCURITÉ • DISCRÉTION • EXCELLENCE</p>
              <div className="h-px w-10 bg-france-blue/30"></div>
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default Index; 
