export type Message = {
  role: 'user' | 'assistant';
  content: string;
  tool?: string;
  toolArgs?: any;
  toolOutput?: string;
};