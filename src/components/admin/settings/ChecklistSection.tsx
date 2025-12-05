import React, { useState } from 'react';
import { Check, Trash2, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { AppConfig } from '../../../types';

interface ChecklistSectionProps {
    localSettings: AppConfig;
    setLocalSettings: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const DEFAULT_CHECKLIST_ITEMS = [
    { category: "Quarto", items: ["Lençóis", "Cobertor", "Travesseiros", "Controle Ar", "Ferro", "Ventilador"] },
    { category: "Banheiro", items: ["Toalhas", "Kit Banheiro"] },
    { category: "Sala", items: ["Tv + Controle", "Sofa + almofadas"] },
    { category: "Cozinha", items: ["Cadeiras", "Microondas", "Frigobar", "Porta Condimentos", "Porta Detergente", "Lixeira", "Pano Prato", "Talheres", "Xícaras", "Copos", "Pratos", "Jogo Americano", "Panelas", "Bandeja", "Fruteira", "Liquidificador", "Sanduicheira", "Cafeteira", "Escorredor", "Tábua Corte", "Vasilhas", "Peneira", "Garrafa Agua"] },
    { category: "Área Serviço", items: ["Balde", "Rodo", "Varal", "Vassoura", "Pregadores", "Pano de Chão"] },
    { category: "Chaves", items: ["Chave Porta Flat", "Chave Portão Entrada"] },
    { category: "Pet", items: ["Manta Pet", "Comedouro Pet", "Bebedouro Pet", "Quadrinhos Pet"] }
];

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ localSettings, setLocalSettings }) => {
    const [checklistForm, setChecklistForm] = useState('');
    const [checklistCategory, setChecklistCategory] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleAddItem = () => {
        if (!checklistForm.trim()) return;
        const newItem = {
            id: Date.now().toString(),
            label: checklistForm.trim(),
            category: checklistCategory.trim() || 'Geral',
            active: true
        };
        setLocalSettings({
            ...localSettings,
            checklist: [...(localSettings.checklist || []), newItem]
        });
        setChecklistForm('');
    };

    const handleRemoveItem = (id: string) => {
        setLocalSettings({
            ...localSettings,
            checklist: (localSettings.checklist || []).filter(item => item.id !== id)
        });
    };

    const handleImportDefault = () => {
        if (!confirm("Isso irá adicionar vários itens à sua lista atual. Deseja continuar?")) return;

        const newItems = DEFAULT_CHECKLIST_ITEMS.flatMap(group =>
            group.items.map(label => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                label,
                category: group.category,
                active: true
            }))
        );

        setLocalSettings({
            ...localSettings,
            checklist: [...(localSettings.checklist || []), ...newItems]
        });
    };

    const grouped = (localSettings.checklist || []).reduce((acc, item) => {
        const cat = item.category || 'Geral';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, typeof localSettings.checklist>);

    return (
        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30">
            <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2 mb-3">
                <Check size={16} /> Itens de Vistoria (Checkout)
            </h3>

            {/* Lista agrupada */}
            <div className="space-y-2 mb-4">
                {Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0])).map(([category, items]) => (
                    <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {expandedCategories.includes(category) ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">{category}</span>
                                <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded-full">{items?.length}</span>
                            </div>
                        </button>

                        {expandedCategories.includes(category) && (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {items?.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 pl-9 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <span>{item.label}</span>
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Formulário de adição */}
            <div className="flex gap-2">
                <input
                    list="categories"
                    value={checklistCategory}
                    onChange={(e) => setChecklistCategory(e.target.value)}
                    placeholder="Categoria (ex: Quarto)"
                    className="w-1/3 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
                />
                <datalist id="categories">
                    {Array.from(new Set(localSettings.checklist?.map(i => i.category || 'Geral') || [])).sort().map(cat => (
                        <option key={cat} value={cat} />
                    ))}
                </datalist>

                <input
                    value={checklistForm}
                    onChange={(e) => setChecklistForm(e.target.value)}
                    placeholder="Novo item (ex: Controle TV...)"
                    className="flex-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <button
                    onClick={handleAddItem}
                    disabled={!checklistForm.trim()}
                    className="bg-orange-500 text-white px-3 rounded-lg font-bold text-xs hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                    Adicionar
                </button>
            </div>

            {/* Importar padrão */}
            <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800/30 flex justify-end">
                <button onClick={handleImportDefault} className="text-orange-600 dark:text-orange-400 text-xs font-bold hover:underline flex items-center gap-1">
                    <Sparkles size={14} /> Importar Lista da Foto (Padrão)
                </button>
            </div>
        </div>
    );
};

export default React.memo(ChecklistSection);
