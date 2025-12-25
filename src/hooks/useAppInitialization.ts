import { useState, useEffect } from 'react';
import { AppMode, GuestConfig } from '../types';
import { logger } from '../utils/logger';
import { fetchGuestConfig } from '../services/guest';
import { USE_OFFICIAL_TIME, fetchOfficialTime } from '../constants';

export type AppState = {
    mode:
        | AppMode
        | 'LANDING'
        | 'LILI_LANDING'
        | 'EXPIRED'
        | 'BLOCKED'
        | 'REVOKED'
        | 'LOADING'
        | 'RECONNECTING';
    config: GuestConfig;
};

export const useAppInitialization = () => {
    // Detect Native Platform
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform();

    const [appState, setAppState] = useState<AppState>(() => {
        if (isNative) {
            return { mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } };
        }

        // Optimization: Initialize directly to LANDING for public pages to avoid flush/reload
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const params = new URLSearchParams(window.location.search);
            if (!params.get('rid')) {
                if (path === '/') {
                    return { mode: 'LANDING', config: { guestName: '', lockCode: '' } };
                }
                if (path === '/lili' || path === '/flat-lili') {
                    return { mode: 'LILI_LANDING', config: { guestName: '', lockCode: '' } };
                }
            }
        }

        return { mode: 'LOADING', config: { guestName: '', lockCode: '' } };
    });

    useEffect(() => {
        const initApp = async () => {
            // Delay mínimo para animação de loading aprimorada
            const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

            const path = window.location.pathname;
            const params = new URLSearchParams(window.location.search);
            let reservationId = params.get('rid');

            const isCMS = path === '/cms' || params.get('mode') === 'cms';
            const isLiliPage = path === '/lili' || path === '/flat-lili';

            if (isCMS) {
                await minLoadingTime;
                setAppState({ mode: AppMode.CMS, config: { guestName: '', lockCode: '' } });
                return;
            }

            if (isNative) {
                setAppState({ mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } });
                return;
            }

            if (path === '/admin') {
                await minLoadingTime;
                setAppState({ mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } });
                return;
            }

            if (isLiliPage) {
                setAppState((prev) =>
                    prev.mode === 'LILI_LANDING'
                        ? prev
                        : { mode: 'LILI_LANDING', config: { guestName: '', lockCode: '' } }
                );
                return;
            }

            if (!reservationId) {
                if (path.length > 1 && !['/admin', '/cms', '/lili', '/flat-lili'].includes(path)) {
                    const potentialCode = path.substring(1);
                    if (/^[A-Z0-9]{6}$/i.test(potentialCode)) {
                        reservationId = potentialCode;
                    }
                }
            }

            if (!reservationId) {
                if (path !== '/') {
                    reservationId = localStorage.getItem('flat_lili_last_rid');
                }
            } else {
                localStorage.setItem('flat_lili_last_rid', reservationId);
            }

            if (reservationId) {
                const fetchWithRetry = async () => {
                    try {
                        const [safeConfig] = await Promise.all([
                            fetchGuestConfig(reservationId!),
                            minLoadingTime,
                        ]);

                        if (!safeConfig) {
                            localStorage.removeItem('flat_lili_last_rid');
                            setAppState({
                                mode: 'BLOCKED',
                                config: { guestName: '', lockCode: '' },
                            });
                            return;
                        }

                        if (safeConfig.manualDeactivation) {
                            localStorage.removeItem('flat_lili_last_rid');
                            setAppState({
                                mode: 'REVOKED',
                                config: { guestName: '', lockCode: '' },
                            });
                            return;
                        }

                        if (safeConfig.checkoutDate) {
                            let now = new Date();
                            if (USE_OFFICIAL_TIME) {
                                try {
                                    now = await fetchOfficialTime();
                                } catch (_e) {}
                            }
                            const [year, month, day] = safeConfig.checkoutDate
                                .split('-')
                                .map(Number);
                            const expirationDate = new Date(year, month - 1, day);
                            expirationDate.setDate(expirationDate.getDate() + 1);
                            expirationDate.setHours(23, 59, 59, 999);

                            if (now > expirationDate) {
                                localStorage.removeItem('flat_lili_last_rid');
                                setAppState({
                                    mode: 'EXPIRED',
                                    config: { guestName: '', lockCode: '' },
                                });
                                return;
                            }
                        }

                        setAppState({ mode: AppMode.GUEST, config: safeConfig });

                        if (reservationId && window.history.replaceState) {
                            const newUrl = window.location.pathname;
                            window.history.replaceState({}, '', newUrl);
                        }
                    } catch (error) {
                        logger.warn('Erro de conexão. Entrando em modo de reconexão...', { error });
                        setAppState({
                            mode: 'RECONNECTING',
                            config: { guestName: '', lockCode: '' },
                        });
                        setTimeout(fetchWithRetry, 2000);
                    }
                };
                fetchWithRetry();
                return;
            }

            if (path === '/') {
                setAppState((prev) =>
                    prev.mode === 'LANDING'
                        ? prev
                        : { mode: 'LANDING', config: { guestName: '', lockCode: '' } }
                );
                return;
            }

            await minLoadingTime;
            setAppState({ mode: 'LANDING', config: { guestName: '', lockCode: '' } });
        };

        initApp();
    }, [isNative]);

    return { appState, setAppState };
};
