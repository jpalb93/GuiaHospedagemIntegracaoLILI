import { useState } from 'react';
import { logger } from '../utils/logger';
import { fetchGuestConfig } from '../services/guest';
import { AppMode, GuestConfig } from '../types';

export const useManualAuth = (
    setAppState: (state: {
        mode: AppMode | 'LOADING' | 'BLOCKED' | 'EXPIRED' | 'REVOKED';
        config: GuestConfig | { guestName: string; lockCode: string };
    }) => void
) => {
    const [showManualLogin, setShowManualLogin] = useState(false);
    const [manualInput, setManualInput] = useState('');

    const handleResetApp = () => {
        localStorage.removeItem('flat_lili_last_rid');
        window.location.href = '/';
    };

    const handleManualSubmit = async () => {
        if (!manualInput.trim()) return;
        let rid = manualInput.trim();

        try {
            // 1. Tenta extrair de URLs completas
            if (rid.includes('http') || rid.includes('.com') || rid.includes('.app')) {
                const urlString = rid.startsWith('http') ? rid : `https://${rid}`;
                const urlObj = new URL(urlString);
                const idParam = urlObj.searchParams.get('rid');
                if (idParam) {
                    rid = idParam;
                } else {
                    const textSegments = urlObj.pathname
                        .split('/')
                        .filter((s) => s && s.length > 0);
                    if (textSegments.length > 0) {
                        const potentialCode = textSegments[textSegments.length - 1];
                        if (/^[a-zA-Z0-9]{3,20}$/.test(potentialCode)) rid = potentialCode;
                    }
                }
            }
        } catch (e) {
            logger.warn('Erro ao parsear input manual', { error: e });
        }

        setAppState({ mode: 'LOADING', config: { guestName: '', lockCode: '' } });

        try {
            const config = await fetchGuestConfig(rid);
            if (config) {
                localStorage.setItem('flat_lili_last_rid', rid);
                setAppState({ mode: AppMode.GUEST, config });
                setShowManualLogin(false);
            } else {
                setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' } });
            }
        } catch (error) {
            console.error('Erro manual:', error);
            setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' } });
        }
    };

    return {
        showManualLogin,
        setShowManualLogin,
        manualInput,
        setManualInput,
        handleManualSubmit,
        handleResetApp,
    };
};
