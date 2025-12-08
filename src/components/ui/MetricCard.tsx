import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;

    variant?: 'default' | 'highlight';
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    variant = 'default',
}) => {
    const isHighlight = variant === 'highlight';

    return (
        <div
            className={`p-4 rounded-2xl border transition-all ${isHighlight
                ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-800/50 hover:shadow-md hover:shadow-amber-500/10'
                : 'bg-white/80 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:shadow-md'
                }`}
        >
            <div className="flex items-center gap-2 mb-2">
                <div
                    className={`p-1.5 rounded-lg ${isHighlight
                        ? 'bg-amber-200 dark:bg-amber-800/50'
                        : 'bg-gray-100 dark:bg-gray-700/50'
                        }`}
                >
                    <Icon
                        size={14}
                        className={
                            isHighlight
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-gray-600 dark:text-gray-400'
                        }
                    />
                </div>
                <span
                    className={`text-xs font-bold uppercase ${isHighlight
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    {title}
                </span>
            </div>
            <p
                className={`text-2xl font-bold font-heading ${isHighlight
                    ? 'text-amber-900 dark:text-amber-100'
                    : 'text-gray-900 dark:text-white'
                    }`}
            >
                {value}
            </p>
            {subtitle && (
                <p
                    className={`text-xs mt-1 ${isHighlight
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};
