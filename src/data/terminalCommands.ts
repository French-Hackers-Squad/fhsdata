import { Session } from "@supabase/supabase-js";

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

export const NORMAL_COMMANDS = [
  'help', 'about', 'status', 'monitor', 'discord',
  'clear', 'login', 'sites', 'history', 'irisweb'
];

export const getSuggestions = (input: string): string[] => {
  if (!input.trim()) return [];

  const [cmd] = input.split(' ');
  return NORMAL_COMMANDS
    .filter(name => name.startsWith(cmd.toLowerCase()));
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
  const [cmd] = command.split(' ');
  let response = '';

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
      window.open('https://discord.gg/fhs', '_blank');
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
    default:
      response = `Commande non reconnue: ${command}. Tapez "help" pour voir les commandes disponibles.`;
  }

  setTerminalOutput(prev => [...prev, { type: 'output', content: response }]);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}; 