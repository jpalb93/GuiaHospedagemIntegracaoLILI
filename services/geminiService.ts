import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DEFAULT_SYSTEM_INSTRUCTION } from "../constants";

// =============================================================================================
// CONFIGURAÇÃO SEGURA (VARIÁVEIS DE AMBIENTE - VITE)
// =============================================================================================
// A chave deve ser configurada no arquivo .env.local ou no painel da Vercel
// Nome da variável: VITE_GEMINI_API_KEY
// =============================================================================================

const apiKey = import.meta.env?.VITE_GEMINI_API_KEY;

export const isApiConfigured = !!apiKey;

// Inicializa a IA apenas se a chave existir
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

export const sendMessageToGemini = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[],
  guestName: string,
  customSystemInstruction?: string
): Promise<string> => {
  try {
    if (!ai || !apiKey) {
      console.error("API Key do Gemini não encontrada. Configure VITE_GEMINI_API_KEY no .env.local");
      return "⚠️ O sistema de IA está temporariamente indisponível (Configuração pendente).";
    }

    const model = 'gemini-2.5-flash';
    
    // Usa a instrução customizada do CMS se existir, senão usa o padrão (fallback)
    const instructionToUse = customSystemInstruction && customSystemInstruction.trim().length > 0
      ? customSystemInstruction
      : DEFAULT_SYSTEM_INSTRUCTION;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `${instructionToUse}\nO nome do hóspede atual é ${guestName}.`,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text ?? "Desculpe, não consegui gerar uma resposta. Por favor, tente novamente.";
  } catch (error) {
    console.error("Erro ao falar com o Gemini:", error);
    return "Desculpe, tive um problema técnico momentâneo. Tente novamente em alguns instantes.";
  }
};