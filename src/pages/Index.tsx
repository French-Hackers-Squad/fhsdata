import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MatrixBackground from "@/components/MatrixBackground";
import { Terminal, ShieldAlert, MonitorUp, Lock, ChevronRight, AlertTriangle, Check, X, CheckCircle2, Shield, Award, Users, Globe, Target, Heart, Code, ExternalLink, Home, Mail, Info, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RetroLayout from "@/components/RetroLayout";
import { handleTerminalCommand, getSuggestions } from "@/data/terminalCommands";

interface Website {
  id: string;
  url: string;
  status: "secure" | "compromised" | "investigating" | "A attaquer" | "En cours" | "Attaqué";
  date_added: string;
  added_by: string;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
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

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    const fetchWebsites = async () => {
      try {
        const { data, error } = await supabase
          .from('websites')
          .select('*')
          .order('date_added', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error("Error fetching websites:", error);
        } else {
          const typedWebsites: Website[] = (data || []).map(site => ({
            ...site,
            status: (site.status as "A attaquer" | "En cours" | "Attaqué") || "Attaqué"
          }));
          setWebsites(typedWebsites);
        }
      } catch (err) {
        console.error("Exception fetching websites:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    fetchWebsites();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  return (
    <RetroLayout>
      <div className="relative min-h-screen bg-black/90 overflow-hidden">
        <MatrixBackground density={85} />
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
            </div>

            <div className="france-card p-6 mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Terminal className="text-france-blue" size={24} />
                  <h2 className="text-2xl font-bold france-text">Terminal FHS</h2>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-france-red"></div>
                  <div className="w-3 h-3 rounded-full bg-france-white"></div>
                  <div className="w-3 h-3 rounded-full bg-france-blue"></div>
                </div>
              </div>
              <div className="bg-black/50 border border-france-blue/30 rounded-lg p-4">
                <div 
                  ref={terminalRef}
                  className="h-64 overflow-y-auto mb-4 font-mono text-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-france-blue [&::-webkit-scrollbar-thumb]:via-france-white [&::-webkit-scrollbar-thumb]:to-france-red [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:opacity-100 [&::-webkit-scrollbar-thumb]:opacity-70"
                >
                  {terminalOutput.map((output, index) => (
                    <div key={index} className={`mb-1 ${output.type === 'input' ? 'text-france-blue' : 'text-france-white/90'}`}>
                      {output.content.split('\n').map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap">{line}</div>
                      ))}
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCommand(terminalInput);
                  setTerminalInput('');
                  setShowSuggestions(false);
                }} className="flex gap-2 relative">
                  <span className="text-france-blue">root@fhs:~#</span>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        handleKeyDown(e);
                        handleTab(e);
                      }}
                      className="w-full bg-transparent border-none outline-none text-france-white/90"
                      placeholder="Tapez une commande..."
                      autoFocus
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute bottom-full left-0 w-full bg-black/90 border border-france-blue/30 rounded-lg p-2 mb-1">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-2 py-1 hover:bg-france-blue/20 cursor-pointer"
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
                </form>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

const ServiceCard = ({ icon, title, description, linkUrl, linkText }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  linkUrl?: string,
  linkText?: string
}) => (
  <div className="france-card p-4">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="font-bold text-france-white">{title}</h3>
    </div>
    <p className="text-sm text-france-white/90 mb-4">{description}</p>
    {linkUrl && linkText && (
      <Link 
        to={linkUrl} 
        className="france-button text-france-white/90 hover:text-black inline-flex items-center gap-2"
      >
        {linkText}
        <ChevronRight size={16} />
      </Link>
    )}
  </div>
);

export default Index;
