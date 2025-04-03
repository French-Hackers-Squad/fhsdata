import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import RetroLayout from "@/components/RetroLayout";
import MatrixBackground from "@/components/MatrixBackground";
import { handleTerminalCommand, getSuggestions } from "@/data/terminalCommands";
import TerminalSection from "@/components/home/TerminalSection";

interface TerminalOutput {
  type: 'input' | 'output';
  content: string;
}

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

const Terminal = () => {
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [session, setSession] = useState<any>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTerminalInput(input);
    
    if (input.trim() === '') {
      setShowSuggestions(false);
      return;
    }

    const suggestions = getSuggestions(input);
    setSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

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

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
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

  return (
    <RetroLayout>
      <div className="relative min-h-screen bg-black/90 overflow-hidden">
        <MatrixBackground density={isMobile ? 100 : 200} />
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-8">
            <TerminalSection 
              terminalInput={terminalInput}
              terminalOutput={terminalOutput}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              setTerminalInput={setTerminalInput}
              handleCommand={handleCommand}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              handleTab={handleTab}
              setShowSuggestions={setShowSuggestions}
            />
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default Terminal; 