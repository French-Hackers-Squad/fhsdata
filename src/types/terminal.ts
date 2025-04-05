export interface TerminalOutput {
  type: 'input' | 'output';
  content: string;
  timestamp?: Date;
  id?: string;
}

export interface TerminalCommand {
  command: string;
  description: string;
  execute: (args?: string[]) => string;
} 