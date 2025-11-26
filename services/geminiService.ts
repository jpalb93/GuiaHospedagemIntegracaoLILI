// Agora a configuração é controlada pelo backend
export const isApiConfigured = true;

export const sendMessageToGemini = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[],
  guestName: string,
  customSystemInstruction?: string
): Promise<string> => {
  try {
    // Chama a API que você criou na pasta /api
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        guestName,
        systemInstruction: customSystemInstruction || ""
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Desculpe, não consegui gerar uma resposta.";

  } catch (error) {
    console.error("Erro ao falar com a API Vercel:", error);
    return "Desculpe, tive um problema técnico momentâneo.";
  }
};