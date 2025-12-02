import React, { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { GuestReview } from '../../types';
import { getGuestReviews, addGuestReview, deleteGuestReview } from '../../services/firebase';

const ReviewsManager: React.FC = () => {
    const [reviews, setReviews] = useState<GuestReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [newReview, setNewReview] = useState<{ name: string, text: string }>({ name: '', text: '' });

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        setLoading(true);
        const data = await getGuestReviews(50);
        setReviews(data);
        setLoading(false);
    };

    const handleAddReview = async () => {
        if (!newReview.name || !newReview.text) {
            alert("Preencha nome e comentário.");
            return;
        }
        setLoading(true);
        try {
            const newId = await addGuestReview(newReview);
            setReviews(prev => [...prev, { id: newId, ...newReview }]);
            setNewReview({ name: '', text: '' });
        } catch (_e) {
            alert("Erro ao adicionar avaliação.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id?: string) => {
        if (!id || !confirm("Excluir esta avaliação?")) return;
        setLoading(true);
        try {
            await deleteGuestReview(id);
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (_e) {
            alert("Erro ao excluir.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                    <Star size={20} className="text-orange-500" />
                    Gestão de Avaliações (Landing Page)
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Copie os melhores comentários do Airbnb e cole aqui para exibir no site. Isso ajuda a passar confiança!
                </p>

                {/* Formulário de Adição */}
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
                        onClick={handleAddReview}
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Adicionar Avaliação'}
                    </button>
                </div>

                {/* Lista de Avaliações */}
                <div className="space-y-3">
                    {loading && reviews.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Carregando...</p>}
                    {!loading && reviews.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Nenhuma avaliação cadastrada.</p>}

                    {reviews.map(review => (
                        <div key={review.id} className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-start gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                    {review.name}
                                    <span className="text-amber-500 flex"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></span>
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">"{review.text}"</p>
                            </div>
                            <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewsManager;
