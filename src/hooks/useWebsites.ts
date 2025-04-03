import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Website, WebsiteStatus, WebsitePriority } from '@/types/website';

interface UseWebsitesReturn {
  websites: Website[];
  filteredWebsites: Website[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  sortField: keyof Website;
  setSortField: (field: keyof Website) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  addWebsite: (websiteData: {
    url: string;
    status: WebsiteStatus;
    priority: WebsitePriority;
    notes: string;
  }) => Promise<void>;
  updateWebsite: (website: Website) => Promise<void>;
  deleteWebsite: (id: string) => Promise<void>;
  refreshWebsites: () => Promise<void>;
}

const convertToWebsite = (data: any): Website => ({
  id: data.id,
  url: data.url,
  status: data.status as WebsiteStatus || 'A attaquer',
  date_added: data.date_added || new Date().toISOString(),
  added_by: data.added_by,
  notes: data.notes || '',
  priority: (data.priority as WebsitePriority) || 'Moyenne',
  ecrie: data.ecrie || false,
  user_name: data.profiles?.username || 'Anonyme',
  avatar_url: data.profiles?.avatar_url || null,
  profiles: {
    username: data.profiles?.username || 'Anonyme',
    avatar_url: data.profiles?.avatar_url || null
  },
  dateAjout: data.date_added || new Date().toISOString()
});

export const useWebsites = (): UseWebsitesReturn => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Website>("date_added");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchWebsites = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('websites')
        .select(`
          id,
          url,
          status,
          date_added,
          added_by,
          notes,
          priority,
          ecrie,
          profiles:added_by (
            username,
            avatar_url
          )
        `)
        .order('date_added', { ascending: false });

      if (error) throw error;

      if (!data) {
        setWebsites([]);
        setFilteredWebsites([]);
        return;
      }

      const formattedWebsites = data.map(convertToWebsite);
      setWebsites(formattedWebsites);
      setFilteredWebsites(formattedWebsites);
    } catch (error) {
      console.error("Erreur:", error);
      setWebsites([]);
      setFilteredWebsites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addWebsite = async (websiteData: {
    url: string;
    status: WebsiteStatus;
    priority: WebsitePriority;
    notes: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const newWebsiteData = {
        ...websiteData,
        added_by: user.id,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('websites')
        .insert([newWebsiteData])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const newSite = convertToWebsite(data[0]);
        setWebsites(prev => [newSite, ...prev]);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      throw error;
    }
  };

  const updateWebsite = async (website: Website) => {
    try {
      const { error } = await supabase
        .from('websites')
        .update(website)
        .eq('id', website.id);

      if (error) throw error;

      setWebsites(prev =>
        prev.map(w => w.id === website.id ? website : w)
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      throw error;
    }
  };

  const deleteWebsite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWebsites(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    let result = websites;
    
    if (searchTerm) {
      result = result.filter(website => 
        website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      result = result.filter(website => website.status === statusFilter);
    }
    
    if (priorityFilter) {
      result = result.filter(website => website.priority === priorityFilter);
    }
    
    result.sort((a, b) => {
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';
      
      if (sortDirection === "asc") {
        return String(aValue) > String(bValue) ? 1 : -1;
      } else {
        return String(aValue) < String(bValue) ? 1 : -1;
      }
    });
    
    setFilteredWebsites(result);
  }, [websites, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  return {
    websites,
    filteredWebsites,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    refreshWebsites: fetchWebsites
  };
}; 