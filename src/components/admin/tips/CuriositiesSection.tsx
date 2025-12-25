import React from 'react';
import { CityCuriosity } from '../../../types';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Loader2,
    Image as ImageIcon,
    Download,
    Sparkles,
} from 'lucide-react';
import ImageUpload from '../ImageUpload';

interface CuriositiesSectionProps {
    curiosities: {
        data: CityCuriosity[];
        loading: boolean;
        save: (items: CityCuriosity[]) => Promise<boolean>;
    };
    curiosityForm: { text: string; image: string };
    setCuriosityForm: React.Dispatch<React.SetStateAction<{ text: string; image: string }>>;
    editingIndex: number | null;
    setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
    isSaving: boolean;
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
    onDelete: (index: number) => void;
    showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
    onTranslate: (items?: CityCuriosity[], silent?: boolean) => Promise<void>;
}

const CuriositiesSection: React.FC<CuriositiesSectionProps> = ({
    curiosities,
    curiosityForm,
    setCuriosityForm,
    editingIndex,
    setEditingIndex,
    isSaving,
    setIsSaving,
    onDelete,
    showToast,
    onTranslate,
}) => {
    const handleAdd = async () => {
        if (!curiosityForm.text.trim()) return;

        const newItem: CityCuriosity = {
            id: crypto.randomUUID(), // Ensure stable ID immediately
            text: curiosityForm.text.trim(),
            image: curiosityForm.image.trim() || undefined,
            visible: true,
        };

        const newItems = [...curiosities.data, newItem];
        // Note: editing logic also needs to be careful, but mainly append here.
        if (editingIndex !== null) {
            // Keep original ID if editing
            const originalId = curiosities.data[editingIndex].id;
            newItems[editingIndex] = { ...newItem, id: originalId || newItem.id };
        }

        setIsSaving(true);
        const success = await curiosities.save(newItems);

        if (success) {
            setCuriosityForm({ text: '', image: '' });
            setEditingIndex(null);
            showToast('Curiosidade salva!', 'success');

            // AUTO-TRANSLATE (Option 1)
            // Pass the EXACT new array we just attempted to save
            onTranslate(newItems, true);
        } else {
            showToast('Erro ao salvar curiosidade. Tente novamente.', 'error');
        }

        setIsSaving(false);
    };

    const handleEdit = (index: number) => {
        const item = curiosities.data[index];
        setCuriosityForm({ text: item.text, image: item.image || '' });
        setEditingIndex(index);
    };

    const handleCancelEdit = () => {
        setCuriosityForm({ text: '', image: '' });
        setEditingIndex(null);
    };

    // Exportar curiosidades (download JSON)
    const handleExport = () => {
        const dataStr = JSON.stringify(curiosities.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `curiosidades_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Backup exportado!', 'success');
    };

    // Importar curiosidades (upload JSON)
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importedData = JSON.parse(text);

            if (Array.isArray(importedData)) {
                if (
                    window.confirm(
                        `Deseja importar ${importedData.length} curiosidades? Isso substituirá a lista atual.`
                    )
                ) {
                    setIsSaving(true);

                    // Validate/Sanitize basic structure
                    // Define types for import structure
                    interface ImportedCuriosity {
                        id?: string;
                        text?: string;
                        image?: string;
                        visible?: boolean;
                        text_en?: string;
                        text_es?: string;
                        [key: string]: unknown;
                    }

                    const validItems: CityCuriosity[] = importedData
                        .map((item: ImportedCuriosity) => ({
                            id: item.id || crypto.randomUUID(),
                            text: item.text || '',
                            image: item.image,
                            visible: item.visible !== false,
                            text_en: item.text_en,
                            text_es: item.text_es,
                        }))
                        .filter((item: CityCuriosity) => item.text); // Remove empty items

                    const success = await curiosities.save(validItems);
                    if (success) {
                        showToast('Curiosidades importadas com sucesso!', 'success');

                        // AUTO-TRANSLATE: Trigger translation for imported items that might miss translations
                        onTranslate(validItems, true);
                    } else {
                        showToast('Erro ao salvar importação.', 'error');
                    }
                    setIsSaving(false);
                }
            } else {
                showToast('Arquivo inválido. O formato deve ser uma lista JSON.', 'error');
            }
        } catch (error) {
            console.error('Import error:', error);
            showToast('Erro ao ler arquivo. Verifique se é um JSON válido.', 'error');
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    💡 Curiosidades da Cidade
                </h2>
                <div className="flex gap-2">
                    {/* Hidden Input for Import */}
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleImportFile}
                        className="hidden"
                    />

                    <button
                        onClick={handleImportClick}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        title="Importar backup JSON"
                    >
                        <Download size={14} className="rotate-180" /> Importar
                    </button>

                    {curiosities.data.length > 0 && (
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                            title="Exportar backup JSON"
                        >
                            <Download size={14} /> Backup
                        </button>
                    )}
                    {curiosities.data.length > 0 && (
                        <button
                            onClick={() => onTranslate()}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                            title="Traduzir Curiosidades"
                        >
                            <Sparkles size={14} /> Traduzir
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                {/* Formulário */}
                <div className="flex flex-col gap-3 mb-6">
                    <input
                        type="text"
                        value={curiosityForm.text}
                        onChange={(e) =>
                            setCuriosityForm({ ...curiosityForm, text: e.target.value })
                        }
                        placeholder="Digite uma curiosidade..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <ImageIcon
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={curiosityForm.image}
                                onChange={(e) =>
                                    setCuriosityForm({ ...curiosityForm, image: e.target.value })
                                }
                                placeholder="URL da Imagem (Opcional)"
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <ImageUpload
                            onUpload={(url) =>
                                setCuriosityForm((prev) => ({ ...prev, image: url }))
                            }
                            initialUrl={curiosityForm.image}
                            folder="curiosities"
                            placeholder="Ou envie uma imagem"
                            maxDimension={800}
                        />

                        <div className="flex gap-2 mt-3">
                            {editingIndex !== null && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-xl font-bold transition-colors"
                                    title="Cancelar Edição"
                                >
                                    <X size={20} />
                                </button>
                            )}

                            <button
                                onClick={handleAdd}
                                disabled={isSaving || !curiosityForm.text.trim()}
                                className={`${editingIndex !== null ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50 transition-colors flex items-center justify-center min-w-[50px]`}
                            >
                                {isSaving ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : editingIndex !== null ? (
                                    <Save size={20} />
                                ) : (
                                    <Plus size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista */}
                {curiosities.loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {curiosities.data.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-3 p-3 rounded-xl group transition-colors ${editingIndex === idx ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                            >
                                <span className="text-blue-500 font-bold text-xs mt-1">
                                    #{idx + 1}
                                </span>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt=""
                                        className="w-10 h-10 rounded-lg object-cover bg-gray-200"
                                    />
                                )}
                                <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                    {item.text}
                                </p>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(idx)}
                                        className="text-gray-400 hover:text-blue-500 p-1"
                                        title="Editar"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(idx)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {curiosities.data.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                Nenhuma curiosidade cadastrada. Use o formulário acima para
                                adicionar.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(CuriositiesSection);
