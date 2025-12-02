import React, { useState, useEffect } from 'react';
import { Sparkles, Coffee, Utensils, Sunset, Moon, Save, Check, Trash2, Plus } from 'lucide-react';
import { SmartSuggestionsConfig, TimeOfDaySuggestion } from '../../types';
import { getSmartSuggestions, saveSmartSuggestions } from '../../services/firebase';

const SuggestionsManager: React.FC = () => {
    const [suggestions, setSuggestions] = useState<SmartSuggestionsConfig>({
        morning: [],
        lunch: [],
        sunset: [],
        night: [],
    });
    const [loading, setLoading] = useState(false);
    const [isSavingSuggestions, setIsSavingSuggestions] = useState(false);
    const [suggestionsSavedSuccess, setSuggestionsSavedSuccess] = useState(false);

    const [tempSuggestion, setTempSuggestion] = useState<{
        category: keyof SmartSuggestionsConfig;
        title: string;
        description: string;
    }>({ category: 'morning', title: '', description: '' });

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        setLoading(true);
        const suggs = await getSmartSuggestions();
        if (suggs) {
            setSuggestions({
                morning: Array.isArray(suggs.morning) ? suggs.morning : [],
                lunch: Array.isArray(suggs.lunch) ? suggs.lunch : [],
                sunset: Array.isArray(suggs.sunset) ? suggs.sunset : [],
                night: Array.isArray(suggs.night) ? suggs.night : [],
            });
        }
        setLoading(false);
    };

    const addSuggestion = (category: keyof SmartSuggestionsConfig) => {
        if (tempSuggestion.category === category && tempSuggestion.title && tempSuggestion.description) {
            const newItem: TimeOfDaySuggestion = {
                id: Date.now().toString(),
                title: tempSuggestion.title,
                description: tempSuggestion.description
            };

            setSuggestions(prev => ({
                ...prev,
                [category]: [...prev[category], newItem]
            }));

            setTempSuggestion({ category, title: '', description: '' });
        }
    };

    const removeSuggestion = (category: keyof SmartSuggestionsConfig, id: string) => {
        setSuggestions(prev => ({
            ...prev,
            [category]: prev[category].filter(item => item.id !== id)
        }));
    };

    const handleSaveSuggestions = async () => {
        setIsSavingSuggestions(true);
        setSuggestionsSavedSuccess(false);
        try {
            await saveSmartSuggestions(suggestions);
            setSuggestionsSavedSuccess(true);
            setTimeout(() => setSuggestionsSavedSuccess(false), 3000);
        } catch (_e) {
            alert("Erro ao salvar sugestões.");
        } finally {
            setIsSavingSuggestions(false);
        }
    };

    const renderSuggestionSection = (
        key: keyof SmartSuggestionsConfig,
        title: string,
        icon: React.ReactNode,
        colorClass: string
    ) => {
        const items = suggestions[key];
        return (
            <div className={`p-4 rounded-xl border ${colorClass} bg-opacity-10 bg-white dark:bg-opacity-5`}>
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
                    {icon} {title}
                </h3>

                <div className="space-y-2 mb-4">
                    {items.length === 0 && <p className="text-xs text-gray-400 italic">Nenhuma sugestão cadastrada. O site usará o padrão.</p>}
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-start bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div>
                                <p className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{item.description}</p>
                            </div>
                            <button
                                onClick={() => removeSuggestion(key, item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input
                        placeholder="Novo Título (ex: Show no Pátio)"
                        className="w-full p-2 text-xs rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 outline-none focus:ring-1 focus:ring-orange-500"
                        value={tempSuggestion.category === key ? tempSuggestion.title : ''}
                        onChange={(e) => setTempSuggestion({ category: key, title: e.target.value, description: tempSuggestion.category === key ? tempSuggestion.description : '' })}
                    />
                    <textarea
                        placeholder="Nova Descrição..."
                        className="w-full p-2 text-xs rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 outline-none focus:ring-1 focus:ring-orange-500 resize-none h-12"
                        value={tempSuggestion.category === key ? tempSuggestion.description : ''}
                        onChange={(e) => setTempSuggestion({ category: key, description: e.target.value, title: tempSuggestion.category === key ? tempSuggestion.title : '' })}
                    />
                    <button
                        onClick={() => addSuggestion(key)}
                        disabled={tempSuggestion.category !== key || !tempSuggestion.title || !tempSuggestion.description}
                        className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                        <Plus size={12} /> Adicionar à Lista
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="text-center py-10 opacity-50 flex items-center justify-center gap-2"><div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div> Carregando sugestões...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-orange-500" />
                    Sugestões do Dia (Pool de Ideias)
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Adicione várias sugestões para cada horário. O sistema escolherá <strong>uma aleatoriamente</strong> para mostrar ao hóspede a cada acesso.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSuggestionSection('morning', 'Manhã (05h-11h)', <Coffee size={16} />, 'border-orange-200 dark:border-orange-900')}
                    {renderSuggestionSection('lunch', 'Almoço (11h-15h)', <Utensils size={16} />, 'border-red-200 dark:border-red-900')}
                    {renderSuggestionSection('sunset', 'Fim de Tarde (15h-18h)', <Sunset size={16} />, 'border-indigo-200 dark:border-indigo-900')}
                    {renderSuggestionSection('night', 'Noite (18h-05h)', <Moon size={16} />, 'border-slate-200 dark:border-slate-700')}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleSaveSuggestions}
                        disabled={isSavingSuggestions}
                        className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${suggestionsSavedSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    >
                        {isSavingSuggestions ? (
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : suggestionsSavedSuccess ? (
                            <><Check size={18} /> Lista Salva com Sucesso!</>
                        ) : (
                            <><Save size={18} /> Salvar Todas as Sugestões</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestionsManager;
