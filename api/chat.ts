import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as dotenv from 'dotenv';
import path from 'path';

// --- FORÇA A LEITURA DO ARQUIVO .env.local ---
// Isso garante que a chave seja lida mesmo se o Vercel falhar
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// --- DEBUG ---
const apiKey = process.env.GEMINI_API_KEY;

console.log(">>> [DEBUG FORÇADO] Tentando ler chave...");
console.log(`>>> Caminho do projeto: ${process.cwd()}`);

if (!apiKey) {
  console.error(">>> ERRO: Chave continua vazia mesmo forçando a leitura!");
  console.error(">>> Verifique se o arquivo .env.local tem conteúdo.");
} else {
  console.log(`>>> SUCESSO: Chave carregada! (Começa com: ${apiKey.substring(0, 5)}...)`);
}
// --------------

// Inicializa a IA (use uma string vazia como fallback para não quebrar na inicialização, mas vai dar erro se tentar usar)
const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Se a chave não foi carregada, para aqui e avisa
  if (!apiKey) {
    return res.status(500).json({ error: "Erro de Configuração: API Key não encontrada no servidor." });
  }

  const { message, history, guestName, systemInstruction } = req.body;

  try {
    const model = "gemini-2.5-flash";
    
    const chatHistory = Array.isArray(history) ? history.map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }],
    })) : [];

    const chat = genAI.chats.create({
      model: model,
      config: {
        systemInstruction: `${systemInstruction}\nO nome do hóspede atual é ${guestName}.`,
        temperature: 0.7,
      },
      history: chatHistory,
    });

    const result = await chat.sendMessage({ message: message });
    const responseText = result.text || "Desculpe, não consegui gerar uma resposta.";

    return res.status(200).json({ text: responseText });

  } catch (error) {
    console.error("Erro na Vercel Function:", error);
    return res.status(500).json({ error: "Erro interno na IA" });
  }
}