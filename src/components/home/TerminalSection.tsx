import React, { useRef, useEffect, useState } from 'react';
import { Terminal, X, AlertTriangle } from "lucide-react";
import { Input } from '@/components/ui/input';

interface TerminalOutput {
  type: 'input' | 'output';
  content: string;
}

interface TerminalSectionProps {
  terminalInput: string;
  terminalOutput: TerminalOutput[];
  suggestions: string[];
  showSuggestions: boolean;
  setTerminalInput: (input: string) => void;
  handleCommand: (command: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleTab: (e: React.KeyboardEvent) => void;
  setShowSuggestions: (show: boolean) => void;
}

const TerminalSection: React.FC<TerminalSectionProps> = ({
  terminalInput,
  terminalOutput,
  suggestions,
  showSuggestions,
  setTerminalInput,
  handleCommand,
  handleInputChange,
  handleKeyDown,
  handleTab,
  setShowSuggestions
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Focus l'input quand on clique sur le terminal
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Effet pour faire défiler automatiquement vers le bas
  useEffect(() => {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalOutput, autoScroll]);

  // Effet pour l'animation de glitch aléatoire
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Détecter le défilement manuel
  const handleScroll = () => {
    if (outputRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  return (
    <div className="france-card p-6 mb-12 h-[700px]">
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-france-red hover:bg-france-red/80 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-white hover:bg-white/80 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-france-blue hover:bg-france-blue/80 cursor-pointer" />
          </div>
          <Terminal className="text-france-blue ml-3" size={24} />
          <h2 className="text-2xl font-bold france-text">Terminal FHS</h2>
        </div>
      </div>

      <div 
        className="flex-1 flex flex-col h-[calc(100%-3rem)]"
        onClick={focusInput}
      >
        <div 
          ref={terminalRef}
          className="flex-1 bg-black/95 border-0 border border-france-blue/30 rounded-lg p-4 overflow-hidden font-terminal text-base transition-all duration-300 relative glitch-effect"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Terminal output content */}
          <div 
            ref={outputRef}
            className="flex-1 overflow-y-auto"
            onScroll={handleScroll}
            style={{ height: 'calc(100% - 40px)' }}
          >
            {terminalOutput.length === 0 && (
              <div className="text-france-white/50 italic">
                <p className="typing-effect">Bienvenue dans le terminal FHS.</p>
                <p className="typing-effect delay-1">Tapez <span className="text-france-blue">help</span> pour voir les commandes disponibles.</p>
              </div>
            )}
            {terminalOutput.map((output, index) => (
              <div key={index} className="mb-0.5">
                {output.type === 'input' ? (
                  <div className="text-france-blue">
                    <span className="mr-2">root@fhs:~#</span>
                    {output.content}
                  </div>
                ) : (
                  <div className="text-france-white/90 whitespace-pre-wrap">
                    {output.content}
                  </div>
                )}
              </div>
            ))}
            
            {/* Espace vide pour permettre de voir les dernières commandes */}
            <div className="h-32"></div>
          </div>

          {/* Input area - always visible at the bottom */}
          <div className="mt-1 pt-1 border-t border-france-blue/20 relative">
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-black/95 border border-france-blue/30 rounded-lg p-2 z-20 max-h-48 overflow-y-auto shadow-lg shadow-france-blue/20">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="text-france-white/90 hover:text-france-blue cursor-pointer py-1.5 px-3 hover:bg-france-blue/10 rounded transition-colors duration-200 flex items-center"
                    onClick={() => {
                      setTerminalInput(suggestion);
                      setShowSuggestions(false);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <span className="text-france-blue mr-2">$</span>
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center text-france-blue relative">
              <span className="mr-2">root@fhs:~#</span>
              <div className="flex-1 flex items-center">
                <div className="relative flex-1 bg-black/50 rounded px-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={terminalInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                      handleTab(e);
                    }}
                    className="w-full bg-transparent border-0 text-france-white font-terminal focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    style={{ caretColor: 'rgb(0, 255, 255)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalSection; 
