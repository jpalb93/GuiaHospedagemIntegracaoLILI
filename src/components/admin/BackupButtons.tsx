import React, { useRef } from 'react';
import { Download, Upload, Loader2 } from 'lucide-react';

interface BackupButtonsProps<T> {
    data: T[];
    entityName: string; // Ex: "dicas", "lugares", "curiosidades"
    onImport: (items: T[]) => Promise<boolean>;
    isLoading?: boolean;
    validateItem?: (item: unknown) => item is T;
}

function BackupButtons<T>({
    data,
    entityName,
    onImport,
    isLoading = false,
    validateItem,
}: BackupButtonsProps<T>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = React.useState(false);

    // Exportar dados como JSON
    const handleExport = () => {
        if (data.length === 0) {
            alert(`Não há ${entityName} para exportar.`);
            return;
        }

        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${entityName}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Importar dados de arquivo JSON
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setImporting(true);
            const text = await file.text();
            const importedData = JSON.parse(text);

            if (!Array.isArray(importedData)) {
                throw new Error('O arquivo deve conter um array de itens.');
            }

            // Validar cada item se uma função de validação foi fornecida
            if (validateItem) {
                const invalidItems = importedData.filter((item) => !validateItem(item));
                if (invalidItems.length > 0) {
                    throw new Error(
                        `${invalidItems.length} itens inválidos encontrados no arquivo.`
                    );
                }
            }

            // Confirmar antes de importar
            const confirmed = window.confirm(
                `Deseja importar ${importedData.length} ${entityName}?\n\n` +
                    `Isso irá ADICIONAR aos ${data.length} existentes.\n\n` +
                    `Total após importação: ${data.length + importedData.length}`
            );

            if (!confirmed) {
                setImporting(false);
                return;
            }

            // Merge: adicionar aos existentes
            const merged = [...data, ...importedData];
            const success = await onImport(merged);

            if (success) {
                alert(`${importedData.length} ${entityName} importados com sucesso!`);
            } else {
                alert('Erro ao salvar os dados importados.');
            }
        } catch (error) {
            alert(
                `Erro ao importar: ${error instanceof Error ? error.message : 'Arquivo inválido'}`
            );
        } finally {
            setImporting(false);
            // Reset input para permitir reimportar o mesmo arquivo
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex gap-2">
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || importing}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
                title={`Importar ${entityName} de arquivo JSON`}
            >
                {importing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Importar
            </button>

            {data.length > 0 && (
                <button
                    onClick={handleExport}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                    title={`Exportar backup de ${entityName}`}
                >
                    <Download size={14} /> Backup
                </button>
            )}
        </div>
    );
}

export default BackupButtons;
