import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MatrixBackground from "@/components/MatrixBackground";
import { 
  Terminal, 
  Shield, 
  MonitorUp, 
  Lock, 
  ChevronRight, 
  Globe, 
  Target, 
  ShieldAlert,
  Search,
  ArrowUpDown,
  User,
  Calendar,
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RetroLayout from "@/components/RetroLayout";
import { handleTerminalCommand, getSuggestions } from "@/data/terminalCommands";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";

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

interface TerminalOutput {
  type: 'input' | 'output';
  content: string;
}

const Index = () => {
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [session, setSession] = useState<any>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const logo = "/img/logo.png";
  const terminalRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  // Effet pour faire défiler vers le bas à chaque nouvelle sortie
  useEffect(() => {
    scrollToBottom();
  }, [terminalOutput]);

  const fetchWebsites = async () => {
    setIsLoading(true);
    try {
      console.log("Début de la récupération des sites...");
      
      // Requête avec jointure sur les profils pour obtenir le nom et l'avatar
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

      // Traitement des données avec les informations de profil
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
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(website => 
        website.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter) {
      result = result.filter(website => website.status === statusFilter);
    }
    
    // Filtre par priorité
    if (priorityFilter) {
      result = result.filter(website => website.priority === priorityFilter);
    }
    
    // Tri
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

  // Fonction pour obtenir les suggestions d'autocomplétion
  const getLocalSuggestions = (input: string) => {
    return getSuggestions(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTerminalInput(input);
    
    if (input.trim() === '') {
      setShowSuggestions(false);
      return;
    }

    const suggestions = getLocalSuggestions(input);
    setSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  // Gestionnaire de tabulation pour l'autocomplétion
  const handleTab = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setTerminalInput(suggestions[0]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && terminalHistory.length > 0) {
      e.preventDefault();
      const newIndex = historyIndex < terminalHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
    } else if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setTerminalInput(newIndex >= 0 ? terminalHistory[terminalHistory.length - 1 - newIndex] : '');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleCommand = (command: string) => {
    setShowSuggestions(false);
    handleTerminalCommand(
      command,
      session,
      websites,
      terminalHistory,
      setTerminalOutput,
      setTerminalHistory,
      setHistoryIndex
    );
  };

  const getStatusColor = (status: Website['status']) => {
    switch (status) {
      case 'Attaqué':
        return 'bg-france-red/20 text-france-red border-france-red/30';
      case 'En cours':
        return 'bg-france-white/20 text-france-white border-france-white/30';
      case 'A attaquer':
        return 'bg-france-blue/20 text-france-blue border-france-blue/30';
      default:
        return 'bg-france-white/20 text-france-white border-france-white/30';
    }
  };


  return (
    <RetroLayout>
      <div className="relative min-h-screen bg-black/90 overflow-hidden">
        <MatrixBackground density={200} />
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-6">
            <div className="pt-10 pb-6 text-center flex flex-col items-center">
              <div className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full overflow-hidden border-2 border-france-blue glow-text">
                <img 
                  src={logo} 
                  alt="French Hackers Squad" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 france-text font-terminal tracking-tight">
                French Hackers Squad
              </h1>
              <p className="text-lg text-france-white/90 max-w-2xl mx-auto">
                Collectif d'élite spécialisé dans la lutte contre la pédocriminalité en ligne. Notre mission est de protéger les enfants en identifiant et en neutralisant les sites diffusant du contenu pédopornographique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-france-red" size={24} />
                  <h2 className="text-2xl font-bold france-text">Notre Mission</h2>
                </div>
                <p className="text-france-white/90">
                  Traquer et neutraliser les sites de pédopornographie en collaboration avec les autorités compétentes.
                </p>
              </div>
              <div className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-france-blue" size={24} />
                  <h2 className="text-2xl font-bold france-text">Notre Engagement</h2>
                </div>
                <p className="text-france-white/90">
                  Protection des enfants et lutte contre l'exploitation en ligne avec des méthodes éthiques et légales.
                </p>
              </div>
              <div className="france-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="text-france-white" size={24} />
                  <h2 className="text-2xl font-bold france-text">Notre Impact</h2>
                </div>
                <p className="text-france-white/90">
                  Action internationale coordonnée avec les forces de l'ordre et les organisations spécialisées.
                </p>
              </div>
              <div className="france-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MonitorUp className="text-france-blue" size={24} />
                  <h3 className="text-xl font-bold text-france-white">Monitoring</h3>
                </div>
                <p className="text-france-white/90 mb-4">
                  Surveillance en temps réel des sites suspects et analyse des menaces.
                </p>
                <Link to="/monitor" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2">
                  Accéder au monitoring
                  <ChevronRight size={16} />
                </Link>
              </div>
              <div className="france-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="text-france-white" size={24} />
                  <h3 className="text-xl font-bold text-france-white">Protection</h3>
                </div>
                <p className="text-france-white/90 mb-4">
                  Système de protection avancé contre les menaces pédocriminelles.
                </p>
                <Link to="/about" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2">
                  En savoir plus
                  <ChevronRight size={16} />
                </Link>
              </div>
              <div className="france-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="text-france-red" size={24} />
                  <h3 className="text-xl font-bold text-france-white">Sécurité</h3>
                </div>
                <p className="text-france-white/90 mb-4">
                  Protection maximale des données sensibles et des victimes.
                </p>
                <Link to="/contact" className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2">
                  Nous contacter
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="france-card p-6 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MonitorUp className="text-france-blue" size={24} />
                  <h2 className="text-2xl font-bold france-text">Sites Surveillés</h2>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-france-red"></div>
                  <div className="w-3 h-3 rounded-full bg-france-white"></div>
                  <div className="w-3 h-3 rounded-full bg-france-blue"></div>
                </div>
              </div>

              {!session && (
                <div className="mb-4 p-4 bg-france-blue/10 border border-france-blue/30 rounded-lg">
                  <div className="flex items-center gap-2 text-france-blue">
                    <Info size={20} />
                    <p>Connectez-vous pour ajouter de nouveaux sites à surveiller</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-france-blue/50" size={16} />
                    <Input
                      type="text"
                      placeholder="Rechercher un site..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/50 border-france-blue/30 text-france-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-black/50 border border-france-blue/30 text-france-white rounded-md px-3 py-2"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="A attaquer">A attaquer</option>
                      <option value="En cours">En cours</option>
                      <option value="Attaqué">Attaqué</option>
                    </select>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="bg-black/50 border border-france-blue/30 text-france-white rounded-md px-3 py-2"
                    >
                      <option value="">Toutes les priorités</option>
                      <option value="Haute">Haute</option>
                      <option value="Moyenne">Moyenne</option>
                      <option value="Basse">Basse</option>
                    </select>
                    <Button
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                      className="france-button"
                    >
                      <ArrowUpDown size={16} className="mr-2" />
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">
                      <div className="loader-matrix"></div>
                    </div>
                  ) : filteredWebsites.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-france-white/70">
                      Aucun site trouvé
                    </div>
                  ) : (
                    filteredWebsites.map((website) => (
                      <Card key={website.id} className="bg-black/50 border-france-blue/30">
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-france-white text-lg">
                              {website.url}
                            </CardTitle>
                            <Badge className={getStatusColor(website.status)}>
                              {website.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between text-sm text-france-white/70">
                            <div className="flex items-center gap-2">
                              {website.avatar_url ? (
                                <img 
                                  src={website.avatar_url} 
                                  alt={website.user_name}
                                  className="w-6 h-6 rounded-full object-cover border border-france-blue/30"
                                />
                              ) : (
                                <User size={14} />
                              )}
                              <span>{website.user_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>{formatDate(website.date_added)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="france-card p-6 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Terminal className="text-france-blue" size={24} />
                  <h2 className="text-2xl font-bold france-text">Terminal</h2>
                </div>
              </div>

              <div className="relative">
                <div 
                  ref={terminalRef}
                  className="bg-black/80 border border-france-blue/30 rounded-lg p-4 h-[300px] overflow-y-auto font-terminal text-sm"
                >
                  {terminalOutput.map((output, index) => (
                    <div key={index} className="mb-2">
                      {output.type === 'input' ? (
                        <div className="text-france-blue">
                          <span className="mr-2">$</span>
                          {output.content}
                        </div>
                      ) : (
                        <div className="text-france-white/90 whitespace-pre-wrap">
                          {output.content}
                        </div>
                      )}
                    </div>
                  ))}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute bottom-full left-0 right-0 bg-black/90 border border-france-blue/30 rounded-lg p-2 mb-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="text-france-white/90 hover:text-france-blue cursor-pointer py-1 px-2"
                          onClick={() => {
                            setTerminalInput(suggestion);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    type="text"
                    value={terminalInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                      handleTab(e);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCommand(terminalInput);
                        setTerminalInput('');
                      }
                    }}
                    placeholder="Entrez une commande..."
                    className="flex-1 bg-black/50 border-france-blue/30 text-france-white font-terminal"
                  />
                  <Button
                    onClick={() => {
                      handleCommand(terminalInput);
                      setTerminalInput('');
                    }}
                    className="france-button"
                  >
                    Exécuter
                  </Button>
                </div>
              </div>
            </div>

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