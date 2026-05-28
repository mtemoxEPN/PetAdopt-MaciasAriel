export type AiRole = 'user' | 'model';

export interface AiMessage {
  id:        string;
  role:      AiRole;
  content:   string;
  createdAt: Date;
}