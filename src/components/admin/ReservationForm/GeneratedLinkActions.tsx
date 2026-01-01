import React from 'react';
import { Copy, Send } from 'lucide-react';
import Button from '../../ui/Button';

interface GeneratedLinkActionsProps {
    generatedLink: string | null;
    editingId: string | null;
    guestName: string;
    guestPhone: string;
    showToast: (msg: string, type: 'success' | 'error') => void;
}

const GeneratedLinkActions: React.FC<GeneratedLinkActionsProps> = ({
    generatedLink,
    editingId,
    guestName,
    guestPhone,
    showToast,
}) => {
    if (!generatedLink || editingId) return null;

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            showToast('Link copiado!', 'success');
        }
    };

    const shareOnWhatsApp = () => {
        if (!generatedLink) return;
        const formattedName = guestName.trim();
        const message = `Olá, ${formattedName}!\n\nPreparei um Guia Digital exclusivo para sua estadia no Flat.\n\nAqui você encontra a senha da porta, wi-fi e dicas de Petrolina:\n${generatedLink}`;
        const whatsappUrl = guestPhone
            ? `https://wa.me/${guestPhone}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="animate-fadeIn mt-4 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/30">
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase text-center mb-2">
                Reserva Criada!
            </p>
            <div
                onClick={copyToClipboard}
                className="bg-white dark:bg-gray-800 p-3 rounded-xl text-xs font-mono text-center break-all cursor-pointer border border-gray-200 dark:border-gray-600 mb-3"
            >
                {generatedLink}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={copyToClipboard}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Copy size={14} />}
                    className="bg-white text-gray-700 border-gray-200 border"
                >
                    Copiar
                </Button>
                <Button
                    onClick={shareOnWhatsApp}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Send size={14} />}
                    className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-600"
                >
                    WhatsApp
                </Button>
            </div>
        </div>
    );
};

export default GeneratedLinkActions;
