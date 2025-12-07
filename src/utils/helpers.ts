/**
 * Helper utilities compartilhados no projeto
 */

/**
 * Gera um ID curto alfanumérico para links de reservas
 * @param length - Tamanho do ID (default: 6)
 * @returns String alfanumérica maiúscula (ex: "ABC123")
 */
export const generateShortId = (length = 6): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
};

/**
 * Formata data YYYY-MM-DD para DD/MM/YYYY
 */
export const formatDateBR = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

/**
 * Remove caracteres não numéricos de uma string
 */
export const onlyNumbers = (str: string): string => {
    return str.replace(/\D/g, '');
};
