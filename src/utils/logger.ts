/**
 * Logger utilitário para evitar logs em produção.
 * Só exibe mensagens se estiver em ambiente de desenvolvimento.
 */
const isDev = import.meta.env.DEV;

export const logger = {
    log: (...args: unknown[]) => {
        if (isDev) {
            console.log(...args);
        }
    },
    warn: (...args: unknown[]) => {
        if (isDev) {
            console.warn(...args);
        }
    },
    error: (...args: unknown[]) => {
        // Erros podem ser importantes mesmo em produção para debugging via console do navegador se não houver Sentry
        // Mas para seguir a auditoria estrita, vamos limitar ou permitir configurar
        // Por enquanto, vamos manter error visível, mas encapsulado, para facilitar a integração com Sentry depois.
        console.error(...args);
    },
    info: (...args: unknown[]) => {
        if (isDev) {
            console.info(...args);
        }
    }
};
