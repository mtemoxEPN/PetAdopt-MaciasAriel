import { AiMessage } from '../entities/AiMessage';

export interface IAiRepository {
  sendMessage(
    userMessage: string,
    history:     AiMessage[],
  ): Promise<string>;
}