import React, { useState, useEffect } from 'react';
import { PlaceRecommendation } from '../../../types';
import { Plus, Loader2, Download } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import ToastContainer, { ToastMessage } from '../../Toast';
import PlaceFormModal from './PlaceFormModal';
import PlaceItemCard from './PlaceItemCard';
import { CATEGORIES } from './constants';

interface PlacesManagerProps {
    places: {
        data: PlaceRecommendation[];
        loading: boolean;
        add: (place: Omit<PlaceRecommendation, 'id'>) => Promise<boolean>;
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
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Modal de confirmação de exclusão
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        isDestructive: false,
    });

    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };

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
            showToast('Nome e Categoria são obrigatórios!', 'warning');
            return;
        }

        setIsSaving(true);
        let success = false;

        if (isEdit && editingPlace?.id) {
            success = await places.update(editingPlace.id, formData);
        } else {
            success = await places.add(formData as Omit<PlaceRecommendation, 'id'>);
        }

        setIsSaving(false);
        if (success) {
            handleCloseModal();
            showToast(isEdit ? 'Local atualizado!' : 'Local adicionado!', 'success');
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
                showToast('Local excluído com sucesso!', 'success');
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
        showToast('Backup de lugares exportado!', 'success');
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
                        <button
                            onClick={handleExportBackup}
                            className="flex items-center gap-1 px-3 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                            title="Exportar backup de lugares"
                        >
                            <Download size={16} /> Backup
                        </button>
                    )}
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
                    >
                        <Plus size={20} /> Novo Local
                    </button>
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

            {/* Toasts */}
            <ToastContainer
                toasts={toasts}
                removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
            />
        </div>
    );
};

export default PlacesManager;
