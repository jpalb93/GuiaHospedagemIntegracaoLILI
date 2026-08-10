export const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
        const [year, month, day] = dateString.split('-');
        if (!year || !month || !day) return dateString;
        return `${day}/${month}/${year}`;
    } catch {
        return dateString;
    }
};

/**
 * Retorna a data atual no fuso horário LOCAL do usuário no formato YYYY-MM-DD.
 * Previne que fusos horários como UTC-3 mudem a data para o dia seguinte a partir das 21h (causado por toISOString).
 */
export const getTodayDateStr = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Normaliza qualquer formato de data (ex: '16/08/2026' ou '2026-08-16') para YYYY-MM-DD.
 */
export const normalizeToISODate = (dateString?: string): string => {
    if (!dateString) return '';
    const trimmed = dateString.trim();
    if (trimmed.includes('/')) {
        const parts = trimmed.split('/');
        if (parts.length === 3) {
            const [d, m, y] = parts;
            if (y && m && d) {
                return `${y.padStart(4, '20')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            }
        }
    }
    return trimmed;
};
