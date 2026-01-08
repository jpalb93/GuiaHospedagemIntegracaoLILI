import React from 'react';
import { StickyNote, Flag, Star } from 'lucide-react';

interface NotesSectionProps {
    propertyId: string;
    welcomeMessage: string;
    setWelcomeMessage: (v: string | ((prev: string) => string)) => void;
    adminNotes: string;
    setAdminNotes: (v: string | ((prev: string) => string)) => void;
    guestRating: number;
    setGuestRating: (v: number) => void;
    guestFeedback: string;
    setGuestFeedback: (v: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
    propertyId,
    welcomeMessage,
    setWelcomeMessage,
    adminNotes,
    setAdminNotes,
    guestRating,
    setGuestRating,
    guestFeedback,
    setGuestFeedback,
}) => {
    return (
        <>
            {propertyId === 'lili' && (
                <>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                            Boas-vindas (Hóspede vê)
                        </label>
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            onBlur={() => setWelcomeMessage((prev: string) => prev.trim())}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500 text-sm h-20 resize-none text-gray-900 dark:text-gray-100"
                            placeholder="Mensagem personalizada..."
                        />
                    </div>

                    {/* --- QUALITY CONTROL / RATING --- */}
                    <div className="col-span-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                            <Flag size={14} /> Controle de Qualidade (Interno)
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Avaliação do Hóspede
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setGuestRating(star)}
                                        className={`p-1 transition-transform hover:scale-110 ${guestRating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                    >
                                        <Star
                                            size={24}
                                            fill={guestRating >= star ? 'currentColor' : 'none'}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Feedback Interno
                            </label>
                            <textarea
                                value={guestFeedback}
                                onChange={(e) => setGuestFeedback(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm min-h-[60px] text-gray-900 dark:text-gray-100"
                                placeholder="Ex: Deixou o quarto muito sujo, quebrou algo..."
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                Esta nota e comentário são visíveis apenas para o admin.
                            </p>
                        </div>
                    </div>
                </>
            )}

            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <StickyNote size={12} /> Observações Internas
                </label>
                <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    onBlur={() => setAdminNotes((prev: string) => prev.trim())}
                    className="w-full bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500 text-sm h-20 resize-none text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Falta pagar 50%, pediu berço extra..."
                />
            </div>
        </>
    );
};

export default NotesSection;
