import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toasts: ToastMessage[];
    removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-xs pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({
    toast,
    onRemove,
}) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Inicia a animação de saída um pouco antes de remover do estado pai
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 3700); // 3.7s (o pai remove em 4s)

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onRemove, 300); // Espera a animação terminar
    };

    const styles = {
        success: {
            bg: 'bg-white dark:bg-gray-800',
            border: 'border-l-4 border-green-500',
            icon: <CheckCircle className="text-green-500" size={20} />,
            text: 'text-gray-800 dark:text-gray-100',
        },
        error: {
            bg: 'bg-white dark:bg-gray-800',
            border: 'border-l-4 border-red-500',
            icon: <AlertCircle className="text-red-500" size={20} />,
            text: 'text-gray-800 dark:text-gray-100',
        },
        warning: {
            bg: 'bg-white dark:bg-gray-800',
            border: 'border-l-4 border-orange-500',
            icon: <AlertTriangle className="text-orange-500" size={20} />,
            text: 'text-gray-800 dark:text-gray-100',
        },
        info: {
            bg: 'bg-white dark:bg-gray-800',
            border: 'border-l-4 border-blue-500',
            icon: <Info className="text-blue-500" size={20} />,
            text: 'text-gray-800 dark:text-gray-100',
        },
    };

    const currentStyle = styles[toast.type];

    return (
        <div
            className={`
        pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700
        ${currentStyle.bg} ${currentStyle.border}
        transition-all duration-300 ease-in-out transform
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
            role="alert"
        >
            <div className="shrink-0 mt-0.5">{currentStyle.icon}</div>
            <div className={`flex-1 text-sm font-medium ${currentStyle.text}`}>{toast.message}</div>
            <button
                onClick={handleClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Fechar notificação"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default ToastContainer;
