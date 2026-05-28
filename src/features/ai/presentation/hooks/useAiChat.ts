import { SendAiMessageUseCase } from '@features/ai/application/use-cases/SendAiMessageUseCase';
import { AiMessage } from '@features/ai/domain/entities/AiMessage';
import { GeminiRepository } from '@features/ai/infrastructure/repositories/GeminiRepository';
import { useState } from 'react';

const repo        = new GeminiRepository();
const sendUseCase = new SendAiMessageUseCase(repo);

export function useAiChat() {
  const [messages, setMessages]   = useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setError(null);

    // Agrega mensaje del usuario inmediatamente
    const userMsg: AiMessage = {
      id:        `user-${Date.now()}`,
      role:      'user',
      content:   content.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Solo pasamos últimos 10 mensajes como historial para no sobrepasar tokens
      const history = [...messages, userMsg].slice(-10);
      const response = await sendUseCase.execute(content, history);

      const modelMsg: AiMessage = {
        id:        `model-${Date.now()}`,
        role:      'model',
        content:   response,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return { messages, sendMessage, isLoading, error, clearChat };
}