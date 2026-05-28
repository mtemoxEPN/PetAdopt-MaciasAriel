import { AiMessage } from '../../domain/entities/AiMessage';
import { IAiRepository } from '../../domain/repositories/IAiRepository';

export class SendAiMessageUseCase {
  constructor(private readonly repo: IAiRepository) {}

  async execute(userMessage: string, history: AiMessage[]): Promise<string> {
    if (!userMessage.trim()) throw new Error('El mensaje no puede estar vacío');
    return this.repo.sendMessage(userMessage.trim(), history);
  }
}