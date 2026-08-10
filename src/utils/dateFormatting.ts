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
