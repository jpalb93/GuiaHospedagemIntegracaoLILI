// Agora a configuração é controlada pelo backend
export const isApiConfigured = true;

export const sendMessageToGemini = async (
    message: string,
    history: { role: 'user' | 'model'; text: string }[],
    guestName: string,
    customSystemInstruction?: string
): Promise<string> => {
    try {
        // Chama a API (Versão nativa sem SDK para evitar erros de build)
        const response = await fetch('/api/concierge-service', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                history,
                guestName,
                systemInstruction: customSystemInstruction || '',
            }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(
                    `API não encontrada (404) ao tentar acessar ${response.url}. Se estiver rodando localmente, use 'npx vercel dev'.`
                );
            }
            const errorData = await response.json().catch(() => ({}));
            console.error('Detalhes do erro da API:', errorData);
            throw new Error(
                `Erro na requisição: ${response.status} - ${JSON.stringify(errorData)}`
            );
        }

        const data = await response.json();
        return data.text || 'Desculpe, não consegui gerar uma resposta.';
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao falar com a API Vercel:', error);

        if (errorMessage.includes('404')) {
            return errorMessage;
        }

        // Tenta extrair a mensagem de erro do backend se estiver no formato JSON stringificado
        try {
            const match = errorMessage.match(/\{.*\}/);
            if (match) {
                const errorJson = JSON.parse(match[0]);
                if (errorJson.error) {
                    return `Erro do Sistema: ${errorJson.error} ${errorJson.details ? JSON.stringify(errorJson.details) : ''}`;
                }
            }
        } catch (_e) {
            // Ignora erro de parse
        }

        return `Desculpe, tive um problema técnico. (${errorMessage})`;
    }
};
