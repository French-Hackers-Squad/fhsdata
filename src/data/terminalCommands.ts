import { Session } from "@supabase/supabase-js";
import { TerminalCommand } from '../types/terminal';

interface TerminalOutput {
  type: 'input' | 'output';
  content: string;
  timestamp?: number;
  id?: string;
}

interface Website {
  id: string;
  url: string;
  status: "secure" | "compromised" | "investigating" | "A attaquer" | "En cours" | "Attaqué";
  date_added: string;
  added_by: string;
}

let pfcGameActive = false;
let pfcPlayerHistory: string[] = [];
let pfcBotHistory: string[] = [];

let puissance4GameActive = false;
let puissance4GameState = Array(6).fill(null).map(() => Array(7).fill(0));
let puissance4CurrentPlayer = 1;
let puissance4GameOver = false;
let puissance4Winner = null;

let morpionGameActive = false;
let morpionGameState = Array(3).fill(null).map(() => Array(3).fill(0));
let morpionCurrentPlayer = 1;

export const NORMAL_COMMANDS = [
  'help', 'about', 'status', 'monitor', 'discord',
  'clear', 'login', 'sites', 'history', 'irisweb',
  'puissance4', 'pfc', 'morpion'
];

export const terminalCommands: TerminalCommand[] = [
  {
    command: 'help',
    description: 'Affiche la liste des commandes disponibles',
    execute: () => {
      return `
Commandes disponibles:
---------------------
help     - Affiche cette aide
about    - À propos de FHS
status   - État du système
clear    - Efface l'écran
date     - Affiche la date et l'heure
whoami   - Affiche l'utilisateur actuel
ls       - Liste les fichiers et dossiers
pwd      - Affiche le répertoire courant
echo     - Affiche un message
cat      - Affiche le contenu d'un fichier
contact  - Affiche les informations de contact
version  - Affiche la version du terminal
      `;
    }
  },
  {
    command: 'about',
    description: 'À propos de French Hackers Squad',
    execute: () => {
      return `
French Hackers Squad (FHS)
--------------------------
Version: 1.0.0
Développé avec ❤️ en France

FHS est une communauté de passionnés de cybersécurité
dédiée à la promotion de l'éthique et de l'excellence
dans le domaine de la sécurité informatique.

Notre mission est de former, informer et protéger
la communauté numérique française.
      `;
    }
  },
  {
    command: 'status',
    description: 'Affiche l\'état du système',
    execute: () => {
      return `
État du système FHS
-------------------
Système:    Online
Base de données:  Connectée
API:        Opérationnelle
Sécurité:   Active
Membres:    Actifs
Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}
      `;
    }
  },
  {
    command: 'clear',
    description: 'Efface l\'écran du terminal',
    execute: () => {
      return 'CLEAR_SCREEN';
    }
  },
  {
    command: 'date',
    description: 'Affiche la date et l\'heure actuelles',
    execute: () => {
      const now = new Date();
      return `
Date et heure actuelles:
-----------------------
Date: ${now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Heure: ${now.toLocaleTimeString('fr-FR')}
Fuseau horaire: Europe/Paris
      `;
    }
  },
  {
    command: 'whoami',
    description: 'Affiche l\'utilisateur actuel',
    execute: () => {
      return `
Informations utilisateur:
------------------------
Utilisateur: root
Groupe:      fhs-admin
UID:         0
GID:         0
Shell:       /bin/bash
      `;
    }
  },
  {
    command: 'ls',
    description: 'Liste les fichiers et dossiers',
    execute: () => {
      return `
Contenu du répertoire:
---------------------
drwxr-xr-x  .config/
drwxr-xr-x  .data/
-rw-r--r--  README.md
-rw-r--r--  LICENSE
drwxr-xr-x  src/
drwxr-xr-x  public/
-rw-r--r--  package.json
-rw-r--r--  tsconfig.json
      `;
    }
  },
  {
    command: 'pwd',
    description: 'Affiche le répertoire courant',
    execute: () => {
      return '/home/fhs/terminal';
    }
  },
  {
    command: 'echo',
    description: 'Affiche un message',
    execute: (args: string[]) => {
      return args.join(' ');
    }
  },
  {
    command: 'cat',
    description: 'Affiche le contenu d\'un fichier',
    execute: (args: string[]) => {
      if (!args.length) {
        return 'Usage: cat <fichier>';
      }
      const file = args[0];
      switch (file) {
        case 'README.md':
          return `
# French Hackers Squad

Bienvenue dans le terminal de FHS !

## À propos
French Hackers Squad est une communauté dédiée à la cybersécurité.

## Commandes
Utilisez la commande 'help' pour voir les commandes disponibles.
          `;
        case 'LICENSE':
          return `
MIT License

Copyright (c) 2024 French Hackers Squad

Permission is hereby granted, free of charge...
          `;
        default:
          return `cat: ${file}: No such file or directory`;
      }
    }
  },
  {
    command: 'contact',
    description: 'Affiche les informations de contact',
    execute: () => {
      return `
Informations de contact FHS
--------------------------
Email:    contact@frenchhackerssquad.fr
Discord:  discord.gg/fhs
GitHub:   github.com/french-hackers-squad
Twitter:  @FHSquad
      `;
    }
  },
  {
    command: 'version',
    description: 'Affiche la version du terminal',
    execute: () => {
      return `
Terminal FHS v1.0.0
------------------
Build: 2024.03.1
Node: v18.17.0
React: v18.2.0
TypeScript: v5.0.4
      `;
    }
  },
  {
    command: 'puissance4',
    description: 'Jouer au Puissance 4 contre le bot',
    execute: () => {
      puissance4GameActive = true;
      puissance4GameState = Array(6).fill(null).map(() => Array(7).fill(0));
      puissance4CurrentPlayer = 1;
      puissance4GameOver = false;
      puissance4Winner = null;

      const printBoard = () => {
        let output = '\n 1 2 3 4 5 6 7\n';
        for (let i = 0; i < 6; i++) {
          output += '|';
          for (let j = 0; j < 7; j++) {
            if (puissance4GameState[i][j] === 0) {
              output += ' ';
            } else if (puissance4GameState[i][j] === 1) {
              output += 'X';
            } else {
              output += 'O';
            }
            output += '|';
          }
          output += '\n';
        }
        output += '---------------\n';
        return output;
      };

      return `
Bienvenue au Puissance 4!
------------------------
Vous êtes les rouges (🔴), le bot est les bleus (🔵)
Pour jouer, tapez simplement un numéro de colonne (1-7)
Pour quitter le jeu, tapez: exit

${printBoard()}
      `;
    }
  },
  {
    command: 'pfc',
    description: 'Jouer au Pierre-Feuille-Ciseaux contre le bot',
    execute: () => {
      pfcGameActive = true;
      return `
Bienvenue au Pierre-Feuille-Ciseaux!
----------------------------------
Pour jouer, tapez simplement: pierre, feuille, ou ciseaux
Le bot fera son choix et le résultat s'affichera.

Vous pouvez jouer autant de parties que vous le souhaitez!
Pour quitter le jeu, tapez: exit
      `;
    }
  },
  {
    command: 'morpion',
    description: 'Jouer au Morpion (Tic-tac-toe) contre le bot',
    execute: () => {
      morpionGameActive = true;
      morpionGameState = Array(3).fill(null).map(() => Array(3).fill(0));
      morpionCurrentPlayer = 1;
      
      const printBoard = () => {
        let output = '\n 1 2 3\n';
        for (let i = 0; i < 3; i++) {
          output += `${i + 1}|`;
          for (let j = 0; j < 3; j++) {
            output += morpionGameState[i][j] === 0 ? ' ' : (morpionGameState[i][j] === 1 ? '❌' : '⭕');
            output += '|';
          }
          output += '\n';
        }
        output += '---------\n';
        return output;
      };

      return `
Bienvenue au Morpion!
--------------------
Vous êtes les ❌, le bot est les ⭕
Pour jouer, tapez: <ligne> <colonne>
Exemple: 2 3 pour placer en ligne 2, colonne 3
Pour quitter, tapez: exit

${printBoard()}
      `;
    }
  }
];

export const getSuggestions = (input: string): string[] => {
  if (!input) return [];
  
  if (pfcGameActive) {
    const pfcChoices = ['pierre', 'feuille', 'ciseaux', 'exit'];
    return pfcChoices.filter(cmd => cmd.toLowerCase().startsWith(input.toLowerCase()));
  }
  
  if (puissance4GameActive) {
    const puissance4Choices = ['1', '2', '3', '4', '5', '6', '7', 'exit'];
    return puissance4Choices.filter(cmd => cmd.toLowerCase().startsWith(input.toLowerCase()));
  }
  
  return NORMAL_COMMANDS
    .filter(cmd => cmd.toLowerCase().startsWith(input.toLowerCase()));
};

export const executeCommand = (command: string, args: string[] = []): string => {
  if (pfcGameActive) {
    if (command === 'exit') {
      pfcGameActive = false;
      return 'Jeu terminé. Merci d\'avoir joué!';
    }
    
    if (['pierre', 'feuille', 'ciseaux'].includes(command)) {
      const botChoice = ['pierre', 'feuille', 'ciseaux'][Math.floor(Math.random() * 3)];
      let result = '';
      
      if (command === botChoice) {
        result = 'Égalité!';
      } else if (
        (command === 'pierre' && botChoice === 'ciseaux') ||
        (command === 'feuille' && botChoice === 'pierre') ||
        (command === 'ciseaux' && botChoice === 'feuille')
      ) {
        result = 'Vous avez gagné!';
      } else {
        result = 'Le bot a gagné!';
      }
      
      return `
Votre choix: ${command}
Choix du bot: ${botChoice}
${result}

Pour rejouer, tapez simplement: pierre, feuille, ou ciseaux
Pour quitter le jeu, tapez: exit
      `;
    }
  }
  
  const cmd = terminalCommands.find(c => c.command === command);
  if (!cmd) {
    return `Command not found: ${command}. Type 'help' for available commands.`;
  }
  return cmd.execute(args);
};

export const handleTerminalCommand = (
  command: string,
  session: Session | null,
  websites: Website[],
  terminalHistory: string[],
  setTerminalOutput: React.Dispatch<React.SetStateAction<TerminalOutput[]>>,
  setTerminalHistory: React.Dispatch<React.SetStateAction<string[]>>,
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const [cmd, ...args] = command.split(' ');
  let response = '';

  if (cmd === 'exit') {
    if (pfcGameActive) {
      pfcGameActive = false;
      pfcPlayerHistory = [];
      pfcBotHistory = [];
      response = 'Jeu terminé. Merci d\'avoir joué!';
      setTerminalOutput(prev => [...prev, { type: 'input', content: `root@fhs:~# ${command}` }]);
      setTerminalOutput(prev => [...prev, { type: 'output', content: response }]);
      setTerminalHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      return;
    }
    
    if (puissance4GameActive) {
      puissance4GameActive = false;
      puissance4GameState = Array(6).fill(null).map(() => Array(7).fill(0));
      puissance4CurrentPlayer = 1;
      puissance4GameOver = false;
      puissance4Winner = null;
      response = 'Jeu terminé. Merci d\'avoir joué!';
      setTerminalOutput(prev => [...prev, { type: 'input', content: `root@fhs:~# ${command}` }]);
      setTerminalOutput(prev => [...prev, { type: 'output', content: response }]);
      setTerminalHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      return;
    }

    if (morpionGameActive) {
      morpionGameActive = false;
      morpionGameState = Array(3).fill(null).map(() => Array(3).fill(0));
      morpionCurrentPlayer = 1;
      response = 'Jeu terminé. Merci d\'avoir joué!';
      setTerminalOutput(prev => [...prev, { type: 'input', content: `root@fhs:~# ${command}` }]);
      setTerminalOutput(prev => [...prev, { type: 'output', content: response }]);
      setTerminalHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      return;
    }
  }

  if (pfcGameActive) {
    if (['pierre', 'feuille', 'ciseaux'].includes(cmd)) {
      pfcPlayerHistory.push(cmd);
      
      let botChoice = '';
      
      if (pfcPlayerHistory.length === 1) {
        botChoice = ['pierre', 'feuille', 'ciseaux'][Math.floor(Math.random() * 3)];
      } else {
        const lastChoice = pfcPlayerHistory[pfcPlayerHistory.length - 2];
        const choiceCounts = {
          'pierre': pfcPlayerHistory.filter(c => c === 'pierre').length,
          'feuille': pfcPlayerHistory.filter(c => c === 'feuille').length,
          'ciseaux': pfcPlayerHistory.filter(c => c === 'ciseaux').length
        };
        
        if (pfcPlayerHistory.length >= 4) {
          const lastFour = pfcPlayerHistory.slice(-4);
          const isCyclic = lastFour[0] === lastFour[2] && lastFour[1] === lastFour[3];
          
          if (isCyclic) {
            const nextChoice = lastFour[0];
            if (nextChoice === 'pierre') botChoice = 'feuille';
            else if (nextChoice === 'feuille') botChoice = 'ciseaux';
            else if (nextChoice === 'ciseaux') botChoice = 'pierre';
          }
          
          const lastThree = pfcPlayerHistory.slice(-3);
          const isAlternating = lastThree[0] === lastThree[2] && lastThree[0] !== lastThree[1];
          
          if (isAlternating) {
            const nextChoice = lastThree[1];
            if (nextChoice === 'pierre') botChoice = 'feuille';
            else if (nextChoice === 'feuille') botChoice = 'ciseaux';
            else if (nextChoice === 'ciseaux') botChoice = 'pierre';
          }
          
          const isRepeating = lastFour.every(choice => choice === lastFour[0]);
          
          if (isRepeating) {
            if (lastFour[0] === 'pierre') botChoice = 'feuille';
            else if (lastFour[0] === 'feuille') botChoice = 'ciseaux';
            else if (lastFour[0] === 'ciseaux') botChoice = 'pierre';
          }
        }
        
        if (!botChoice) {
          const totalChoices = pfcPlayerHistory.length;
          const probabilities = {
            'pierre': choiceCounts['pierre'] / totalChoices,
            'feuille': choiceCounts['feuille'] / totalChoices,
            'ciseaux': choiceCounts['ciseaux'] / totalChoices
          };
          
          const mostProbable = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0][0];
          
          if (mostProbable === 'pierre') botChoice = 'feuille';
          else if (mostProbable === 'feuille') botChoice = 'ciseaux';
          else if (mostProbable === 'ciseaux') botChoice = 'pierre';
        }
        
        if (!botChoice) {
          const lastResult = pfcBotHistory[pfcBotHistory.length - 1];
          const lastPlayerChoice = pfcPlayerHistory[pfcPlayerHistory.length - 1];
          
          if (lastResult === lastPlayerChoice) {
            if (lastPlayerChoice === 'pierre') botChoice = 'feuille';
            else if (lastPlayerChoice === 'feuille') botChoice = 'ciseaux';
            else if (lastPlayerChoice === 'ciseaux') botChoice = 'pierre';
          } else {
            botChoice = lastResult;
          }
        }
        
        if (!botChoice) {
          botChoice = ['pierre', 'feuille', 'ciseaux'][Math.floor(Math.random() * 3)];
        }
      }
      
      pfcBotHistory.push(botChoice);
      
      let result = '';
      
      if (cmd === botChoice) {
        result = 'Égalité!';
      } else if (
        (cmd === 'pierre' && botChoice === 'ciseaux') ||
        (cmd === 'feuille' && botChoice === 'pierre') ||
        (cmd === 'ciseaux' && botChoice === 'feuille')
      ) {
        result = 'Vous avez gagné!';
      } else {
        result = 'Le bot a gagné!';
      }
      
      setTerminalOutput(prev => {
        const newOutput = [...prev];
        if (newOutput.length > 0) {
          newOutput[newOutput.length - 1] = { 
            type: 'output', 
            content: `
Votre choix: ${cmd}
Choix du bot: ${botChoice}
${result}

Pour rejouer, tapez simplement: pierre, feuille, ou ciseaux
Pour quitter le jeu, tapez: exit
            `
          };
        }
        return newOutput;
      });
    } else {
      setTerminalOutput(prev => {
        const newOutput = [...prev];
        if (newOutput.length > 0) {
          newOutput[newOutput.length - 1] = { 
            type: 'output', 
            content: `Choix invalide. Utilisez: pierre, feuille, ciseaux, ou exit pour quitter.`
          };
        }
        return newOutput;
      });
    }
    
    setTerminalHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    return;
  }
  
  if (puissance4GameActive) {
    if (['1', '2', '3', '4', '5', '6', '7'].includes(cmd)) {
      const col = parseInt(cmd) - 1;
      
      let row = -1;
      for (let i = 5; i >= 0; i--) {
        if (puissance4GameState[i][col] === 0) {
          row = i;
          break;
        }
      }
      
      if (row === -1) {
        setTerminalOutput(prev => {
          const newOutput = [...prev];
          if (newOutput.length > 0) {
            newOutput[newOutput.length - 1] = { 
              type: 'output', 
              content: `Colonne pleine! Choisissez une autre colonne (1-7) ou tapez 'exit' pour quitter.`
            };
          }
          return newOutput;
        });
        return;
      }
      
      puissance4GameState[row][col] = puissance4CurrentPlayer;
      
      if (checkWinner(row, col, puissance4CurrentPlayer)) {
        puissance4GameOver = true;
        puissance4Winner = puissance4CurrentPlayer;
        const printBoard = () => {
          let output = '\n 1 2 3 4 5 6 7\n';
          for (let i = 0; i < 6; i++) {
            output += '|';
            for (let j = 0; j < 7; j++) {
              output += puissance4GameState[i][j] === 0 ? ' ' : (puissance4GameState[i][j] === 1 ? 'X' : 'O');
              output += '|';
            }
            output += '\n';
          }
          output += '---------------\n';
          return output;
        };
        
        setTerminalOutput(prev => {
          const newOutput = [...prev];
          if (newOutput.length > 0) {
            newOutput[newOutput.length - 1] = { 
              type: 'output', 
              content: `${printBoard()}\nFélicitations! Vous avez gagné!\nPour rejouer, tapez 'puissance4'\nPour quitter, tapez 'exit'`
            };
          }
          return newOutput;
        });
        return;
      }
      
      const botCol = botMove();
      const botRow = -1;
      for (let i = 5; i >= 0; i--) {
        if (puissance4GameState[i][botCol] === 0) {
          puissance4GameState[i][botCol] = 2;
          if (checkWinner(i, botCol, 2)) {
            puissance4GameOver = true;
            puissance4Winner = 2;
            const printBoard = () => {
              let output = '\n 1 2 3 4 5 6 7\n';
              for (let i = 0; i < 6; i++) {
                output += '|';
                for (let j = 0; j < 7; j++) {
                  output += puissance4GameState[i][j] === 0 ? ' ' : (puissance4GameState[i][j] === 1 ? 'X' : 'O');
                  output += '|';
                }
                output += '\n';
              }
              output += '---------------\n';
              return output;
            };
            
            setTerminalOutput(prev => {
              const newOutput = [...prev];
              if (newOutput.length > 0) {
                newOutput[newOutput.length - 1] = { 
                  type: 'output', 
                  content: `${printBoard()}\nLe bot a gagné!\nPour rejouer, tapez 'puissance4'\nPour quitter, tapez 'exit'`
                };
              }
              return newOutput;
            });
            return;
          }
          break;
        }
      }
      
      const printBoard = () => {
        let output = '\n 1 2 3 4 5 6 7\n';
        for (let i = 0; i < 6; i++) {
          output += '|';
          for (let j = 0; j < 7; j++) {
            output += puissance4GameState[i][j] === 0 ? ' ' : (puissance4GameState[i][j] === 1 ? 'X' : 'O');
            output += '|';
          }
          output += '\n';
        }
        output += '---------------\n';
        return output;
      };
      
      setTerminalOutput(prev => {
        const newOutput = [...prev];
        if (newOutput.length > 0) {
          newOutput[newOutput.length - 1] = { 
            type: 'output', 
            content: `${printBoard()}\nVotre tour! Choisissez une colonne (1-7) ou tapez 'exit' pour quitter.`
          };
        }
        return newOutput;
      });
    } else {
      setTerminalOutput(prev => {
        const newOutput = [...prev];
        if (newOutput.length > 0) {
          newOutput[newOutput.length - 1] = { 
            type: 'output', 
            content: `Choix invalide. Utilisez un numéro de colonne (1-7) ou 'exit' pour quitter.`
          };
        }
        return newOutput;
      });
    }
    
    setTerminalHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    return;
  }
  
  if (morpionGameActive) {
    if (args.length === 2) {
      const row = parseInt(args[0]) - 1;
      const col = parseInt(args[1]) - 1;

      if (row >= 0 && row < 3 && col >= 0 && col < 3 && morpionGameState[row][col] === 0) {
        morpionGameState[row][col] = morpionCurrentPlayer;

        const winner = checkMorpionWinner();
        if (winner === 1) {
          const printBoard = () => {
            let output = '\n 1 2 3\n';
            for (let i = 0; i < 3; i++) {
              output += `${i + 1}|`;
              for (let j = 0; j < 3; j++) {
                output += morpionGameState[i][j] === 0 ? ' ' : (morpionGameState[i][j] === 1 ? '❌' : '⭕');
                output += '|';
              }
              output += '\n';
            }
            output += '---------\n';
            return output;
          };

          setTerminalOutput(prev => {
            const newOutput = [...prev];
            if (newOutput.length > 0) {
              newOutput[newOutput.length - 1] = { 
                type: 'output', 
                content: `${printBoard()}\nFélicitations! Vous avez gagné!\nPour rejouer, tapez 'morpion'\nPour quitter, tapez 'exit'`
              };
            }
            return newOutput;
          });
          return;
        }

        const [botRow, botCol] = morpionBotMove();
        morpionGameState[botRow][botCol] = 2;

        const botWinner = checkMorpionWinner();
        if (botWinner === 2) {
          const printBoard = () => {
            let output = '\n 1 2 3\n';
            for (let i = 0; i < 3; i++) {
              output += `${i + 1}|`;
              for (let j = 0; j < 3; j++) {
                output += morpionGameState[i][j] === 0 ? ' ' : (morpionGameState[i][j] === 1 ? '❌' : '⭕');
                output += '|';
              }
              output += '\n';
            }
            output += '---------\n';
            return output;
          };

          setTerminalOutput(prev => {
            const newOutput = [...prev];
            if (newOutput.length > 0) {
              newOutput[newOutput.length - 1] = { 
                type: 'output', 
                content: `${printBoard()}\nLe bot a gagné!\nPour rejouer, tapez 'morpion'\nPour quitter, tapez 'exit'`
              };
            }
            return newOutput;
          });
          return;
        }

        if (botWinner === 0) {
          const printBoard = () => {
            let output = '\n 1 2 3\n';
            for (let i = 0; i < 3; i++) {
              output += `${i + 1}|`;
              for (let j = 0; j < 3; j++) {
                output += morpionGameState[i][j] === 0 ? ' ' : (morpionGameState[i][j] === 1 ? '❌' : '⭕');
                output += '|';
              }
              output += '\n';
            }
            output += '---------\n';
            return output;
          };

          setTerminalOutput(prev => {
            const newOutput = [...prev];
            if (newOutput.length > 0) {
              newOutput[newOutput.length - 1] = { 
                type: 'output', 
                content: `${printBoard()}\nMatch nul!\nPour rejouer, tapez 'morpion'\nPour quitter, tapez 'exit'`
              };
            }
            return newOutput;
          });
          return;
        }

        const printBoard = () => {
          let output = '\n 1 2 3\n';
          for (let i = 0; i < 3; i++) {
            output += `${i + 1}|`;
            for (let j = 0; j < 3; j++) {
              output += morpionGameState[i][j] === 0 ? ' ' : (morpionGameState[i][j] === 1 ? '❌' : '⭕');
              output += '|';
            }
            output += '\n';
          }
          output += '---------\n';
          return output;
        };

        setTerminalOutput(prev => {
          const newOutput = [...prev];
          if (newOutput.length > 0) {
            newOutput[newOutput.length - 1] = { 
              type: 'output', 
              content: `${printBoard()}\nVotre tour! Tapez: <ligne> <colonne> ou 'exit' pour quitter.`
            };
          }
          return newOutput;
        });
      } else {
        setTerminalOutput(prev => {
          const newOutput = [...prev];
          if (newOutput.length > 0) {
            newOutput[newOutput.length - 1] = { 
              type: 'output', 
              content: `Position invalide ou déjà occupée. Utilisez: <ligne> <colonne> ou 'exit' pour quitter.`
            };
          }
          return newOutput;
        });
      }
    } else {
      setTerminalOutput(prev => {
        const newOutput = [...prev];
        if (newOutput.length > 0) {
          newOutput[newOutput.length - 1] = { 
            type: 'output', 
            content: `Format invalide. Utilisez: <ligne> <colonne> ou 'exit' pour quitter.`
          };
        }
        return newOutput;
      });
    }
    
    setTerminalHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    return;
  }
  
  setTerminalHistory(prev => [...prev, command]);
  setHistoryIndex(-1);
  setTerminalOutput(prev => [...prev, { type: 'input', content: `root@fhs:~# ${command}` }]);

  switch (cmd) {
    case 'help':
      response = `

Commandes principales:
- help: Afficher ce message d'aide
- about: Afficher les informations sur French Hackers Squad
- status: Vérifier l'état du système
- sites: Afficher la liste des sites neutralisés

Commandes de navigation:
- monitor: Accéder au système de monitoring
- discord: Rejoindre notre serveur Discord
- login: Accéder aux fonctionnalités admin (admin uniquement)
- irisweb: Accéder au portfolio d'IrisWeb

Commandes utilitaires:
- clear: Effacer le terminal
- history: Afficher l'historique des commandes`;
      break;
    case 'about':
      response = `French Hackers Squad (FHS) est un collectif d'élite spécialisé dans la lutte contre la pédocriminalité en ligne. Notre mission est de protéger les enfants en identifiant et en neutralisant les sites diffusant du contenu pédopornographique. Nous travaillons en étroite collaboration avec les autorités compétentes pour assurer que les criminels soient traduits en justice.`;
      break;
    case 'status':
      response = `Statut du système:
- Système: Opérationnel
- Protection: Active
- Monitoring: En cours
- Dernière mise à jour: ${new Date().toLocaleString()}`;
      break;
    case 'monitor':
      window.location.href = '/monitor';
      response = 'Redirection vers le système de monitoring...';
      break;
    case 'discord':
      response = 'Ouverture du serveur Discord...';
      break;
    case 'clear':
      setTerminalOutput([]);
      return;
    case 'login':
      if (session) {
        response = 'Vous êtes déjà authentifié en tant qu\'administrateur.';
      } else {
        window.location.href = '/monitor';
        response = 'Redirection vers la connexion admin...';
      }
      break;
    case 'sites':
      if (websites.length > 0) {
        response = 'Sites Neutralisés :\n' + websites.map(site => 
          `- ${site.url} (${formatDate(site.date_added)})`
        ).join('\n');
      } else {
        response = 'Aucun site neutralisé pour le moment.';
      }
      break;
    case 'history':
      response = terminalHistory.length > 0 
        ? 'Historique des commandes:\n' + terminalHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n')
        : 'Aucune commande dans l\'historique.';
      break;
    case 'irisweb':
      window.location.href = '/irisweb';
      response = 'Redirection vers le portfolio d\'IrisWeb...';
      break;
    case 'puissance4':
      puissance4GameActive = true;
      puissance4GameState = Array(6).fill(null).map(() => Array(7).fill(0));
      puissance4CurrentPlayer = 1;
      puissance4GameOver = false;
      puissance4Winner = null;
      const printBoard = () => {
        let output = '\n 1 2 3 4 5 6 7\n';
        for (let i = 0; i < 6; i++) {
          output += '|';
          for (let j = 0; j < 7; j++) {
            output += puissance4GameState[i][j] === 0 ? ' ' : (puissance4GameState[i][j] === 1 ? 'X' : 'O');
            output += '|';
          }
          output += '\n';
        }
        output += '---------------\n';
        return output;
      };
      response = `
Bienvenue au Puissance 4!
------------------------
Vous êtes les rouges (🔴), le bot est les bleus (🔵)
Pour jouer, tapez simplement un numéro de colonne (1-7)
Pour quitter le jeu, tapez: exit

${printBoard()}
      `;
      break;
    case 'pfc':
      pfcGameActive = true;
      pfcPlayerHistory = [];
      pfcBotHistory = [];
      response = terminalCommands.find(c => c.command === 'pfc')?.execute() || '';
      break;
    case 'morpion':
      morpionGameActive = true;
      morpionGameState = Array(3).fill(null).map(() => Array(3).fill(0));
      morpionCurrentPlayer = 1;
      response = terminalCommands.find(c => c.command === 'morpion')?.execute() || '';
      break;
    default:
      response = `Commande non reconnue: ${command}. Tapez "help" pour voir les commandes disponibles.`;
  }

  setTerminalOutput(prev => [...prev, { type: 'output', content: response }]);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const checkWinner = (row: number, col: number, player: number): boolean => {
  const directions = [
  ];

  for (const direction of directions) {
    let count = 1;
    
    for (const [dx, dy] of direction) {
      let x = row + dx;
      let y = col + dy;
      
      while (
        x >= 0 && x < 6 && 
        y >= 0 && y < 7 && 
        puissance4GameState[x][y] === player
      ) {
        count++;
        x += dx;
        y += dy;
      }
    }
    
    if (count >= 4) return true;
  }

  return false;
};

const botMove = (): number => {
  for (let col = 0; col < 7; col++) {
    const row = findNextEmptyRow(col);
    if (row !== -1) {
      puissance4GameState[row][col] = 2;
      if (checkWinner(row, col, 2)) {
        puissance4GameState[row][col] = 0;
        return col;
      }
      puissance4GameState[row][col] = 0;
    }
  }

  for (let col = 0; col < 7; col++) {
    const row = findNextEmptyRow(col);
    if (row !== -1) {
      puissance4GameState[row][col] = 1;
      if (checkWinner(row, col, 1)) {
        puissance4GameState[row][col] = 0;
        return col;
      }
      puissance4GameState[row][col] = 0;
    }
  }

  for (let col = 0; col < 7; col++) {
    const row = findNextEmptyRow(col);
    if (row !== -1) {
      puissance4GameState[row][col] = 2;
      if (hasWinningPotential(row, col, 2)) {
        puissance4GameState[row][col] = 0;
        return col;
      }
      puissance4GameState[row][col] = 0;
    }
  }

  for (let col = 0; col < 7; col++) {
    const row = findNextEmptyRow(col);
    if (row !== -1) {
      puissance4GameState[row][col] = 1;
      if (hasWinningPotential(row, col, 1)) {
        puissance4GameState[row][col] = 0;
        return col;
      }
      puissance4GameState[row][col] = 0;
    }
  }

  const centerCol = 3;
  if (findNextEmptyRow(centerCol) !== -1) {
    return centerCol;
  }

  const availableMoves = [];
  for (let col = 0; col < 7; col++) {
    if (findNextEmptyRow(col) !== -1) {
      availableMoves.push(col);
    }
  }
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const findNextEmptyRow = (col: number): number => {
  for (let row = 5; row >= 0; row--) {
    if (puissance4GameState[row][col] === 0) {
      return row;
    }
  }
  return -1;
};

const hasWinningPotential = (row: number, col: number, player: number): boolean => {
  let count = 1;
  for (let j = col - 1; j >= 0 && puissance4GameState[row][j] === player; j--) count++;
  for (let j = col + 1; j < 7 && puissance4GameState[row][j] === player; j++) count++;
  if (count >= 3) return true;

  count = 1;
  for (let i = row - 1; i >= 0 && puissance4GameState[i][col] === player; i--) count++;
  for (let i = row + 1; i < 6 && puissance4GameState[i][col] === player; i++) count++;
  if (count >= 3) return true;

  count = 1;
  for (let i = 1; row - i >= 0 && col - i >= 0 && puissance4GameState[row - i][col - i] === player; i++) count++;
  for (let i = 1; row + i < 6 && col + i < 7 && puissance4GameState[row + i][col + i] === player; i++) count++;
  if (count >= 3) return true;

  count = 1;
  for (let i = 1; row + i < 6 && col - i >= 0 && puissance4GameState[row + i][col - i] === player; i++) count++;
  for (let i = 1; row - i >= 0 && col + i < 7 && puissance4GameState[row - i][col + i] === player; i++) count++;
  if (count >= 3) return true;

  return false;
};

const checkMorpionWinner = (): number | null => {
  for (let i = 0; i < 3; i++) {
    if (morpionGameState[i][0] !== 0 &&
        morpionGameState[i][0] === morpionGameState[i][1] &&
        morpionGameState[i][1] === morpionGameState[i][2]) {
      return morpionGameState[i][0];
    }
  }

  for (let j = 0; j < 3; j++) {
    if (morpionGameState[0][j] !== 0 &&
        morpionGameState[0][j] === morpionGameState[1][j] &&
        morpionGameState[1][j] === morpionGameState[2][j]) {
      return morpionGameState[0][j];
    }
  }

  if (morpionGameState[0][0] !== 0 &&
      morpionGameState[0][0] === morpionGameState[1][1] &&
      morpionGameState[1][1] === morpionGameState[2][2]) {
    return morpionGameState[0][0];
  }

  if (morpionGameState[0][2] !== 0 &&
      morpionGameState[0][2] === morpionGameState[1][1] &&
      morpionGameState[1][1] === morpionGameState[2][0]) {
    return morpionGameState[0][2];
  }

  let isFull = true;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (morpionGameState[i][j] === 0) {
        isFull = false;
        break;
      }
    }
    if (!isFull) break;
  }
  if (isFull) return 0;

  return null;
};

const morpionBotMove = (): [number, number] => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (morpionGameState[i][j] === 0) {
        morpionGameState[i][j] = 2;
        if (checkMorpionWinner() === 2) {
          morpionGameState[i][j] = 0;
          return [i, j];
        }
        morpionGameState[i][j] = 0;
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (morpionGameState[i][j] === 0) {
        morpionGameState[i][j] = 1;
        if (checkMorpionWinner() === 1) {
          morpionGameState[i][j] = 0;
          return [i, j];
        }
        morpionGameState[i][j] = 0;
      }
    }
  }

  if (morpionGameState[1][1] === 0) {
    return [1, 1];
  }

  const corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
  for (const [i, j] of corners) {
    if (morpionGameState[i][j] === 0) {
      return [i, j];
    }
  }

  const availableMoves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (morpionGameState[i][j] === 0) {
        availableMoves.push([i, j]);
      }
    }
  }
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}; 