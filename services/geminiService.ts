import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// =============================================================================================
// ÁREA DE CONFIGURAÇÃO DA CHAVE (API KEY)
// =============================================================================================
// Cole sua chave API do Google Gemini (começa com AIza...) dentro das aspas abaixo:
// Adicionei ": string" para evitar o erro de comparação do TypeScript
const CHAVE_DIRETA: string = "AIzaSyBp73XuslBeV4ixWwaTE0mHKGaEzFJDOYA"; 
// =============================================================================================

// Tenta pegar a chave da variável direta (prioridade) ou das variáveis de ambiente (modo avançado)
// @ts-ignore
const envKey = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_API_KEY : process.env.API_KEY;
const apiKey = CHAVE_DIRETA || envKey;

export const isApiConfigured = !!apiKey && apiKey.length > 0;

// Inicializa a IA com a chave configurada
const ai = new GoogleGenAI({ apiKey: apiKey || "CHAVE_PENDENTE" });

export const sendMessageToGemini = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[],
  guestName: string
): Promise<string> => {
  try {
    // Conversão forçada para string para evitar erro de tipos literais no TypeScript
    const currentKey = apiKey as string;

    // Verifica se a chave existe antes de tentar chamar
    if (!currentKey || currentKey.length === 0 || currentKey === "CHAVE_PENDENTE") {
      return "⚠️ A chave de API (IA) não foi configurada. Por favor, avise a anfitriã para verificar o arquivo geminiService.ts.";
    }

    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\nO nome do hóspede atual é ${guestName}.`,
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