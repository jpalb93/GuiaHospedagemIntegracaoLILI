import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); // Auto-dismiss after 5s

        return () => clearTimeout(timer);
    }, []);

    const typeConfig = {
        success: {
            bgColor: 'bg-green-500 dark:bg-green-600',
            icon: <CheckCircle size={20} className="text-white" />,
        },
        error: {
            bgColor: 'bg-red-500 dark:bg-red-600',
            icon: <AlertCircle size={20} className="text-white" />,
        },
        info: {
            bgColor: 'bg-blue-500 dark:bg-blue-600',
            icon: <Info size={20} className="text-white" />,
        },
        warning: {
            bgColor: 'bg-orange-500 dark:bg-orange-600',
            icon: <AlertTriangle size={20} className="text-white" />,
        },
    };

    const config = typeConfig[type];

    return (
        <div
            className={`
                ${config.bgColor}
                text-white rounded-xl shadow-2xl p-4 mb-3 
                flex items-center gap-3 min-w-[300px] max-w-md
                transform transition-all duration-300 ease-out
                ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
            `}
            role="alert"
        >
            {/* Icon */}
            <div className="flex-shrink-0">{config.icon}</div>

            {/* Message */}
            <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Fechar"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
