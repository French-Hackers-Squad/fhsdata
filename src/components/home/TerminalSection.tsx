import React, { useRef } from 'react';
import { Terminal } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="france-card p-6 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-france-blue hover:bg-france-blue/80 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-white hover:bg-white/80 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-france-red hover:bg-france-red/80 cursor-pointer" />
          </div>
          <Terminal className="text-france-blue ml-3" size={24} />
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
        </div>
        <div className="relative mt-4">
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 bg-black/90 border border-france-blue/30 rounded-lg p-2 mb-1">
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
          <div className="flex gap-2">
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
    </div>
  );
};

export default TerminalSection; 
