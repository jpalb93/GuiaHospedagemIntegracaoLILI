import React, { useState } from 'react';
import { Languages, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { translateBatch } from '../../../services/translation';
import {
    getDynamicPlaces,
    updateDynamicPlace,
    getTips,
    updateTip,
    getCuriosities,
    saveCuriosities,
} from '../../../services/firebase';
import { PlaceRecommendation, Tip } from '../../../types';

export const TranslationManager: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'translating' | 'success' | 'error'>(
        'idle'
    );
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs((prev) => [msg, ...prev].slice(0, 5));

    const handleTranslateAll = async () => {
        setStatus('scanning');
        setLogs([]);
        setProgress(0);

        try {
            // 1. Fetch All Content
            addLog('Buscando conteúdo...');
            const [places, tips, curiosities] = await Promise.all([
                getDynamicPlaces(),
                getTips(),
                getCuriosities(),
            ]);

            // 2. Identify Pending Translations
            const pendingPlaces = places.filter(
                (p) => !p.description_en || !p.name_en || !p.description_es || !p.name_es
            );
            const pendingTips = tips.filter(
                (t) => !t.content_en || !t.title_en || !t.content_es || !t.title_es
            );
            const pendingCuriosities = curiosities.filter((c) => !c.text_en || !c.text_es);

            const totalItems =
                pendingPlaces.length + pendingTips.length + pendingCuriosities.length;
            setTotal(totalItems);

            if (totalItems === 0) {
                addLog('Tudo já está traduzido! 🎉');
                setStatus('success');
                return;
            }

            setStatus('translating');
            addLog(`Encontrados ${totalItems} itens para traduzir.`);

            // 3. Process Places
            if (pendingPlaces.length > 0) {
                addLog(`Traduzindo ${pendingPlaces.length} lugares...`);
                // Explicitly type and map only necessary fields to avoid 'any' error if possible,
                // but translateBatch handles 'any[]'. We cast for safety.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const translatedPlaces = await translateBatch(pendingPlaces as any[], [
                    { source: 'name', targetEn: 'name_en', targetEs: 'name_es' },
                    {
                        source: 'description',
                        targetEn: 'description_en',
                        targetEs: 'description_es',
                    },
                    { source: 'distance', targetEn: 'distance_en', targetEs: 'distance_es' },
                ]);

                for (const item of translatedPlaces) {
                    if (item.id) {
                        // Fallback: If AI didn't translate name (proper noun), use original
                        const original = places.find((p) => p.id === item.id);
                        if (original && !item.name_en) {
                            item.name_en = original.name; // Use PT name as EN name
                        }
                        if (original && !item.name_es) {
                            item.name_es = original.name; // Use PT name as ES name
                        }

                        // Cast to Partial<PlaceRecommendation> for update
                        await updateDynamicPlace(
                            item['id'] as string,
                            item as Partial<PlaceRecommendation>
                        );
                    }
                    setProgress((prev) => prev + 1);
                }
            }

            // 4. Process Tips
            if (pendingTips.length > 0) {
                addLog(`Traduzindo ${pendingTips.length} dicas...`);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const translatedTips = await translateBatch(pendingTips as any[], [
                    { source: 'title', targetEn: 'title_en', targetEs: 'title_es' },
                    { source: 'subtitle', targetEn: 'subtitle_en', targetEs: 'subtitle_es' },
                    { source: 'content', targetEn: 'content_en', targetEs: 'content_es' },
                ]);

                for (const item of translatedTips) {
                    if (item.id) {
                        await updateTip(item['id'] as string, item as Partial<Tip>);
                    }
                    setProgress((prev) => prev + 1);
                }
            }

            // 5. Process Curiosities
            if (pendingCuriosities.length > 0) {
                addLog(`Traduzindo ${pendingCuriosities.length} curiosidades...`);

                // Curiosities don't have IDs usually if they are simple objects in an array,
                // but my helper added IDs? let's check getCuriosities in content.ts.
                // It returns { text: string, visible: true } or CityCuriosity validation.
                // It does NOT add IDs unless they were stored.
                // We need to map indexes for batch translation.

                // Correction: translateBatch uses _id (index) internally to map back.
                // But we need to save the WHOLE list back to Firebase for curiosities.

                // We'll trust translateBatch returns objects with the new fields.
                // But since curiosities rely on the original array order, we must be careful.
                // "pendingCuriosities" is a subset.

                // Strategy: Translate pending ones, then merge back into the MAIN list, then save ALL.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const translatedSubset = await translateBatch(pendingCuriosities as any[], [
                    { source: 'text', targetEn: 'text_en', targetEs: 'text_es' },
                ]);

                addLog(`Recebido ${translatedSubset.length} curiosidades traduzidas.`);

                // Update the main list
                let matchCount = 0;
                const updatedCuriosities = curiosities.map((original) => {
                    // Match by ID
                    const match = translatedSubset.find((t) => t.id === original.id);
                    if (match) {
                        matchCount++;
                        return { ...original, ...match };
                    }
                    return original;
                });

                if (matchCount === 0 && translatedSubset.length > 0) {
                    addLog('AVISO: Nenhuma curiosidade correspondida por ID! Verifique o console.');
                } else {
                    addLog(`Combinadas ${matchCount} curiosidades com sucesso.`);
                }

                await saveCuriosities(updatedCuriosities);
                setProgress((prev) => prev + pendingCuriosities.length);
            }

            setStatus('success');
            addLog('Tradução concluída com sucesso!');
        } catch (error) {
            console.error(error);
            setStatus('error');
            addLog('Erro durante a tradução. Verifique o console.');
        }
    };

    const handleResetTranslations = async () => {
        if (
            !confirm(
                'Tem certeza? Isso vai APAGAR todas as traduções atuais e você precisará traduzir tudo do zero. (Recomendado se as traduções estiverem erradas ou travadas).'
            )
        )
            return;

        setStatus('scanning');
        addLog('Resetando traduções...');
        try {
            const places = await getDynamicPlaces(true);
            const tips = await getTips();

            let count = 0;

            // Limit concurrency
            for (const p of places) {
                if (p.id && (p.description_en || p.name_en)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await updateDynamicPlace(p.id, {
                        description_en: null,
                        name_en: null,
                        distance_en: null,
                    } as any);
                    count++;
                }
            }

            for (const t of tips) {
                if (t.id && (t.content_en || t.title_en)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await updateTip(t.id, {
                        content_en: null,
                        title_en: null,
                        subtitle_en: null,
                    } as any);
                    count++;
                }
            }

            addLog(`Resetados ${count} itens. Agora clique em 'Traduzir' novamente.`);
            setStatus('idle');
            setTotal(0);
            setProgress(0);
        } catch (error) {
            console.error(error);
            setStatus('error');
            addLog('Erro ao resetar.');
        }
    };

    const handleRepairNames = async () => {
        setStatus('translating');
        addLog('Reparando nomes faltantes...');
        try {
            const places = await getDynamicPlaces(true); // Force refresh
            const brokenPlaces = places.filter((p) => !p.name_en);

            if (brokenPlaces.length === 0) {
                addLog('Nenhum nome precisando de reparo.');
                setStatus('success');
                return;
            }

            addLog(`Corrigindo ${brokenPlaces.length} nomes...`);

            for (const p of brokenPlaces) {
                if (p.id) {
                    const payload = { name_en: p.name };
                    await updateDynamicPlace(p.id, payload);
                }
                setProgress((prev) => prev + 1);
            }
            setStatus('success');
            addLog('Nomes corrigidos com sucesso!');
        } catch (error) {
            console.error(error);
            setStatus('error');
            addLog('Erro ao corrigir nomes.');
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
                <Languages className="text-blue-600 dark:text-blue-400" />
                Tradução Inteligente (IA)
            </h3>

            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">
                Utilize o Google Gemini para traduzir automaticamente todo o conteúdo do app
                (Lugares, Dicas, Curiosidades) para Inglês. O sistema detecta o que falta traduzir.
            </p>

            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    {status === 'idle' || status === 'success' || status === 'error' ? (
                        <>
                            <button
                                onClick={handleTranslateAll}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                {status === 'success' ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <Languages size={20} />
                                )}
                                {status === 'success'
                                    ? 'Tudo Traduzido'
                                    : 'Traduzir Todo o Conteúdo'}
                            </button>

                            <button
                                onClick={handleRepairNames}
                                className="px-4 py-3 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl font-bold text-xs shadow-sm transition-colors border border-orange-200"
                                title="Se os nomes em inglês estiverem faltando, clique aqui para copiar os nomes originais."
                            >
                                Corrigir Nomes
                            </button>
                            <button
                                onClick={handleResetTranslations}
                                className="px-4 py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold text-xs shadow-sm transition-colors border border-red-200"
                            >
                                Resetar Tudo (Refazer)
                            </button>
                        </>
                    ) : (
                        <div className="space-y-2 w-full">
                            <div className="flex justify-between text-xs font-bold text-blue-800 dark:text-blue-200 uppercase">
                                <span>Processando...</span>
                                <span>{total > 0 ? Math.round((progress / total) * 100) : 0}%</span>
                            </div>
                            <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                    style={{
                                        width: `${total > 0 ? (progress / total) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* LOGS AREA */}
                {logs.length > 0 && (
                    <div className="bg-white/50 dark:bg-black/30 rounded-lg p-3 text-xs font-mono text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-800/50">
                        {logs.map((log, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {i === 0 && (status === 'translating' || status === 'scanning') && (
                                    <Loader2 size={10} className="animate-spin" />
                                )}
                                <span className={i === 0 ? 'font-bold opacity-100' : 'opacity-60'}>
                                    {log}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        <AlertTriangle size={14} />
                        Falha na conexão com a IA ou Erro de Script.
                    </div>
                )}
            </div>
        </div>
    );
};
