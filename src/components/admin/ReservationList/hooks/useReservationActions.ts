import { useState, useCallback } from 'react';
import { Reservation } from '../../../../types';

interface MessageTemplates {
    checkin?: string;
    checkout?: string;
    invite?: string;
}

interface UseReservationActionsProps {
    showToast: (msg: string, type: 'success' | 'error') => void;
    messageTemplates?: MessageTemplates;
}

interface UseReservationActionsReturn {
    listCopiedId: string | null;
    getLinkForReservation: (res: Reservation) => string;
    formatMessage: (template: string, res: Reservation, link: string) => string;
    handleCopyListLink: (res: Reservation) => void;
    handleShareListWhatsApp: (res: Reservation) => void;
    sendReminder: (res: Reservation, type: 'checkin' | 'checkout') => void;
}

export function useReservationActions({
    showToast,
    messageTemplates,
}: UseReservationActionsProps): UseReservationActionsReturn {
    const [listCopiedId, setListCopiedId] = useState<string | null>(null);

    const getLinkForReservation = useCallback((res: Reservation): string => {
        const baseUrl = window.location.origin + '/';
        if (res.shortId) return `${baseUrl}${res.shortId}`;
        if (res.id) return `${baseUrl}?rid=${res.id}`;
        return '';
    }, []);

    const formatMessage = useCallback(
        (template: string, res: Reservation, link: string): string => {
            const firstName = res.guestName.split(' ')[0];
            const password = res.lockCode || res.safeCode || '----';
            return template
                .replace(/{guestName}/g, firstName)
                .replace(/{link}/g, link)
                .replace(/{password}/g, password);
        },
        []
    );

    const handleCopyListLink = useCallback(
        (res: Reservation) => {
            const link = getLinkForReservation(res);
            if (!link) return;
            navigator.clipboard.writeText(link);
            setListCopiedId(res.id || null);
            showToast('Link copiado!', 'success');
            setTimeout(() => setListCopiedId(null), 2000);
        },
        [getLinkForReservation, showToast]
    );

    const handleShareListWhatsApp = useCallback(
        (res: Reservation) => {
            if (!res.id) return;
            const link = getLinkForReservation(res);
            const defaultTemplate = `Olá, {guestName}! 👋\n\nPreparei um Guia Digital exclusivo para sua estadia no Flat. 📲\n\nAqui você encontra instruções e um passo a passo (com vídeos 🎥) de como entrar no flat sem dificuldade e ter uma estadia maravilhosa. ✨\n\nAlém disso, em caso de dúvidas, você pode clicar no ícone laranja 🟠 e conversar com uma Inteligência Artificial totalmente personalizada que sabe tudo (ou quase! 🤖) do nosso flat e Petrolina em geral.\n\n👇 Acesse aqui:\n{link}`;
            const template = messageTemplates?.invite || defaultTemplate;
            const message = formatMessage(template, res, link);
            const phone = res.guestPhone ? res.guestPhone : '';
            const whatsappUrl = phone
                ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
                : `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        },
        [getLinkForReservation, formatMessage, messageTemplates]
    );

    const sendReminder = useCallback(
        (res: Reservation, type: 'checkin' | 'checkout') => {
            if (!res.id) return;
            const link = getLinkForReservation(res);
            const phone = res.guestPhone || '';
            let message = '';
            if (type === 'checkin') {
                const defaultTemplate = `Olá, {guestName}! Tudo pronto para sua chegada amanhã? ✈️\n\nJá deixei tudo preparado no seu Guia Digital (Senha da porta, Wi-Fi e Localização).\n\nAcesse aqui: {link}\n\nQualquer dúvida, estou por aqui!`;
                const template = messageTemplates?.checkin || defaultTemplate;
                message = formatMessage(template, res, link);
            } else {
                const defaultTemplate = `Oi, {guestName}! Espero que a estadia esteja sendo ótima. 🌵\n\nComo seu check-out é amanhã, deixei as instruções de saída facilitadas aqui no guia: {link}\n\nBoa viagem de volta!`;
                const template = messageTemplates?.checkout || defaultTemplate;
                message = formatMessage(template, res, link);
            }
            const whatsappUrl = phone
                ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
                : `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        },
        [getLinkForReservation, formatMessage, messageTemplates]
    );

    return {
        listCopiedId,
        getLinkForReservation,
        formatMessage,
        handleCopyListLink,
        handleShareListWhatsApp,
        sendReminder,
    };
}
