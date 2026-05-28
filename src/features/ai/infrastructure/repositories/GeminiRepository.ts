import { AiMessage } from '@features/ai/domain/entities/AiMessage';
import { IAiRepository } from '@features/ai/domain/repositories/IAiRepository';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Eres un asistente virtual especializado en salud y cuidado de mascotas para la app PetAdopt.
Tu rol es ayudar a adoptantes y refugios con:
- Consejos de salud y nutrición para perros, gatos y otras mascotas
- Guías de cuidado, higiene y bienestar animal
- Información sobre vacunas, desparasitación y visitas al veterinario
- Tips de comportamiento y entrenamiento
- Orientación sobre el proceso de adopción y adaptación

Responde siempre en español, de forma amigable, empática y clara.
Si la pregunta no está relacionada con mascotas, redirige amablemente la conversación.
Nunca reemplaces la consulta con un veterinario real para casos de emergencia.`;

export class GeminiRepository implements IAiRepository {

  async sendMessage(userMessage: string, history: AiMessage[]): Promise<string> {
    const contents = [
      // Historial previo
      ...history.map(msg => ({
        role:  msg.role,
        parts: [{ text: msg.content }],
      })),
      // Mensaje actual
      {
        role:  'user',
        parts: [{ text: userMessage }],
      },
    ];

    const response = await fetch(GEMINI_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature:     0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message ?? 'Error al conectar con Gemini');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No pude generar una respuesta.';
  }
}