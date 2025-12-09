import React, { useState, useEffect } from 'react';
import { PlaceRecommendation } from '../../../types';
import { Plus, Loader2, Download } from 'lucide-react';
import Button from '../../ui/Button';
import ConfirmModal from '../ConfirmModal';
import { useToast } from '../../../contexts/ToastContext';
import PlaceFormModal from './PlaceFormModal';
import PlaceItemCard from './PlaceItemCard';

import { CATEGORIES } from './constants';
import { translateBatch } from '../../../services/translation';
import { Sparkles } from 'lucide-react';

interface PlacesManagerProps {
    places: {
        data: PlaceRecommendation[];
        loading: boolean;
        add: (place: Omit<PlaceRecommendation, 'id'>) => Promise<string | null>;
        update: (id: string, place: Partial<PlaceRecommendation>) => Promise<boolean>;
        delete: (id: string) => Promise<boolean>;
        refresh: () => void;
    };
}

/**
 * Componente principal de gerenciamento de locais/estabelecimentos
 * Refatorado para usar subcomponentes: PlaceFormModal e PlaceItemCard
 */
const PlacesManager: React.FC<PlacesManagerProps> = ({ places }) => {
    // Estado do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlace, setEditingPlace] = useState<PlaceRecommendation | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Filtro de categoria
    const [filterCategory, setFilterCategory] = useState<string>('burgers');

    // Toast notifications
    const { showSuccess, showWarning, showError } = useToast();

    // Modal de confirmação de exclusão
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false,
    });

    // Carrega dados iniciais
    useEffect(() => {
        if (places.data.length === 0) {
            places.refresh();
        }
    }, [places.data.length, places.refresh]);

    // Handlers
    const handleOpenModal = (place?: PlaceRecommendation) => {
        setEditingPlace(place || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlace(null);
    };

    const handleSave = async (formData: Partial<PlaceRecommendation>, isEdit: boolean) => {
        if (!formData.name || !formData.category) {
            showWarning('Nome e Categoria são obrigatórios!');
            return;
        }

        setIsSaving(true);
        let resultId: string | null | boolean = null;

        if (isEdit && editingPlace?.id) {
            resultId = await places.update(editingPlace.id, formData);
        } else {
            resultId = await places.add(formData as Omit<PlaceRecommendation, 'id'>);
        }

        setIsSaving(false);

        if (resultId) {
            handleCloseModal();
            showSuccess(isEdit ? 'Local atualizado!' : 'Local adicionado!');

            // AUTO-TRANSLATE (Option 1)
            const placeId = (isEdit && editingPlace?.id) ? editingPlace.id : (typeof resultId === 'string' ? resultId : null);

            if (placeId) {
                const placeToTranslate: PlaceRecommendation = {
                    ...(formData as PlaceRecommendation),
                    id: placeId
                };
                // Trigger silent translation
                handleTranslatePlaces([placeToTranslate], true);
            }

        } else {
            showError('Erro ao salvar local.');
        }
    };

    const handleDelete = (place: PlaceRecommendation) => {
        if (!place.id) return;
        setConfirmModal({
            isOpen: true,
            title: 'Excluir Local',
            message: `Tem certeza que deseja excluir "${place.name}"?`,
            isDestructive: true,
            onConfirm: async () => {
                await places.delete(place.id!);
                showSuccess('Local excluído com sucesso!');
            },
        });
    };

    // Backup: Exportar lugares como JSON
    const handleExportBackup = () => {
        const dataStr = JSON.stringify(places.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_lugares_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess('Backup de lugares exportado!');
        // Duplicate line removed
    };

    // --- TRANSLATION LOGIC ---
    const handleTranslatePlaces = async (itemsToTranslate?: PlaceRecommendation[], silent = false) => {
        const placesToCheck = itemsToTranslate || places.data;

        const untranslated = placesToCheck.filter(
            (p) => !p.name_en || !p.description_en || !p.name_es
        );

        if (untranslated.length === 0) {
            if (!silent) showSuccess('Todos os locais já estão traduzidos!');
            return;
        }

        if (
            !silent &&
            !confirm(
                `Deseja traduzir ${untranslated.length} locais pendentes? Isso pode levar alguns segundos.`
            )
        ) {
            return;
        }

        setIsSaving(true);
        try {
            const results = await translateBatch(
                untranslated.map((p) => ({
                    ...p, // Pass full object so generic keys logic works
                    id: p.id!,
                    // No need to manually construct text JSON anymore if prompt is generic
                })),
                [
                    { source: 'name', targetEn: 'name_en', targetEs: 'name_es' },
                    { source: 'description', targetEn: 'description_en', targetEs: 'description_es' },
                    { source: 'distance', targetEn: 'distance_en', targetEs: 'distance_es' },
                ],
                'gemini-2.5-flash-lite'
            );

            // Apply updates
            for (const res of results) {
                if (res.id) {
                    // translateBatch returns the patch object directly now
                    await places.update(res.id, res);
                }
            }

            if (!silent) showSuccess('Tradução concluída!');
            places.refresh();
        } catch (error) {
            console.error(error);
            // Always show error toast even in silent mode
            showError('Erro na tradução automática. Verifique sua conexão.');
        } finally {
            setIsSaving(false);
        }
    };

    // Filtra lugares pela categoria selecionada
    const filteredPlaces =
        filterCategory === 'all'
            ? places.data
            : places.data.filter((p) => p.category === filterCategory);

    return (
        <div className="space-y-6">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">Todas as Categorias</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    {places.data.length > 0 && (
                        <>
                            <Button
                                onClick={handleExportBackup}
                                variant="ghost"
                                size="sm"
                                leftIcon={<Download size={16} />}
                                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40"
                            >
                                Backup
                            </Button>
                            <Button
                                onClick={() => handleTranslatePlaces()}
                                variant="ghost"
                                size="sm"
                                leftIcon={<Sparkles size={16} />}
                                className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Traduzindo...' : 'Traduzir'}
                            </Button>
                        </>
                    )}
                    <Button
                        onClick={() => handleOpenModal()}
                        leftIcon={<Plus size={20} />}
                        className="flex-1 sm:flex-none shadow-lg shadow-orange-500/20"
                    >
                        Novo Local
                    </Button>
                </div>
            </div>

            {/* Lista de Locais */}
            {places.loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlaces.map((place) => (
                        <PlaceItemCard
                            key={place.id}
                            place={place}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                        />
                    ))}
                    {filteredPlaces.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            Nenhum local encontrado nesta categoria.
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Formulário */}
            <PlaceFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingPlace={editingPlace}
                isSaving={isSaving}
            />

            {/* Modal de Confirmação */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={confirmModal.isDestructive}
            />
        </div>
    );
};

export default PlacesManager;
