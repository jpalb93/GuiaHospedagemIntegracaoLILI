import React, { useState } from 'react';
import { GuestReview } from '../../types';
import { Star, Trash2, Plus, Loader2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import ToastContainer, { ToastMessage } from '../Toast';

interface ReviewsManagerProps {
    reviews: {
        data: GuestReview[];
        add: (review: { name: string; text: string }) => Promise<string>;
        delete: (id: string) => Promise<void>;
    };
}

const ReviewsManager: React.FC<ReviewsManagerProps> = ({ reviews }) => {
    const [newReview, setNewReview] = useState({ name: '', text: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Modal State
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

    const handleAdd = async () => {
        if (!newReview.name || !newReview.text) {
            showToast('Preencha nome e comentário.', 'warning');
            return;
        }
        setIsAdding(true);
        try {
            await reviews.add(newReview);
            setNewReview({ name: '', text: '' });
            showToast('Avaliação adicionada!', 'success');
        } catch (_error) {
            showToast('Erro ao adicionar avaliação.', 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Excluir Avaliação',
            message: 'Tem certeza que deseja excluir esta avaliação?',
            isDestructive: true,
            onConfirm: async () => {
                await reviews.delete(id);
                showToast('Avaliação excluída.', 'success');
            },
        });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Star size={20} className="text-orange-500" />
                    Gestão de Avaliações
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Adicione comentários reais de hóspedes (ex: Airbnb) para exibir no site.
                </p>

                {/* Form */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6 space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase">Adicionar Nova</h3>
                    <input
                        placeholder="Nome do Hóspede (ex: Maria Silva)"
                        className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                    <textarea
                        placeholder="Cole o comentário aqui..."
                        className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-orange-500 text-sm resize-none h-24"
                        value={newReview.text}
                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isAdding ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Plus size={16} />
                        )}
                        Adicionar Avaliação
                    </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {reviews.data.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-4">
                            Nenhuma avaliação cadastrada.
                        </p>
                    )}
                    {reviews.data.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-start gap-4"
                        >
                            <div>
                                <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                    {review.name}
                                    <span className="text-amber-500 flex">
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                        <Star size={10} fill="currentColor" />
                                    </span>
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
                                    "{review.text}"
                                </p>
                            </div>
                            <button
                                onClick={() => review.id && handleDelete(review.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={confirmModal.isDestructive}
            />

            <ToastContainer
                toasts={toasts}
                removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
            />
        </div>
    );
};

export default ReviewsManager;
