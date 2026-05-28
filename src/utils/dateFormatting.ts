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
