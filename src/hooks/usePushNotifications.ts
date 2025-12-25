import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../services/firebase/config';
import { useToast } from '../contexts/ToastContext';
import { logger } from '../utils/logger';

export const usePushNotifications = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const { showSuccess, showError, showInfo } = useToast();

    // VAPID Key from environment variables (User needs to add this)
    const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);

            if (permission === 'granted') {
                showSuccess('Permissão para notificações concedida!');
                await generateToken();
            } else {
                showInfo('Você precisa permitir as notificações para receber alertas.');
            }
        } catch (error) {
            logger.error('Erro ao pedir permissão de notificação', { error });
            showError('Erro ao solicitar permissão.');
        }
    };

    const generateToken = async () => {
        try {
            if (!VAPID_KEY) {
                logger.warn('VAPID Key not found in .env');
                showError('VAPID Key ausente. Configure VITE_FIREBASE_VAPID_KEY.');
                return;
            }

            const currentToken = await getToken(messaging, {
                vapidKey: VAPID_KEY,
            });

            if (currentToken) {
                setToken(currentToken);
                logger.info('FCM Token Generated:', { token: currentToken });
                // Here you would typically send this token to your server/database
                // along with the userId to target specific users.
            } else {
                logger.warn('No registration token available. Request permission to generate one.');
            }
        } catch (err) {
            logger.error('An error occurred while retrieving token.', { error: err });
            showError('Erro ao gerar token de notificação.');
        }
    };

    // Listen for foreground messages
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            logger.info('Message received in foreground: ', { payload });
            showInfo(`${payload.notification?.title}: ${payload.notification?.body}`);
        });

        return () => unsubscribe();
    }, [showInfo]);

    return {
        token,
        notificationPermission,
        requestPermission,
        generateToken,
    };
};
