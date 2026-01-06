import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck, KeyRound } from 'lucide-react';

interface ModernLoadingScreenProps {
    variant?: 'guest' | 'admin' | 'landing';
}

const ModernLoadingScreen: React.FC<ModernLoadingScreenProps> = ({ variant = 'guest' }) => {
    // Configuração por variante
    const config = {
        guest: {
            icon: BookOpen,
            color: 'orange', // Tailwind color name
            gradientLeft: 'from-transparent via-orange-500 to-orange-400',
            gradientRight: 'from-transparent via-orange-500 to-orange-400',
            glow: 'bg-orange-500/20',
            iconColor: 'text-orange-500',
            dropShadow: 'drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]',
            title: 'Flats Integração',
            subtitle: 'Preparando seu guia',
            titleGradient: 'from-white via-orange-100 to-white',
        },
        admin: {
            icon: ShieldCheck,
            color: 'blue',
            gradientLeft: 'from-transparent via-blue-500 to-blue-400',
            gradientRight: 'from-transparent via-blue-500 to-blue-400',
            glow: 'bg-blue-500/20',
            iconColor: 'text-blue-500',
            dropShadow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]',
            title: 'Painel Administrativo',
            subtitle: 'Acesso Restrito',
            titleGradient: 'from-white via-blue-100 to-white',
        },
        landing: {
            icon: KeyRound,
            color: 'purple',
            gradientLeft: 'from-transparent via-purple-500 to-purple-400',
            gradientRight: 'from-transparent via-purple-500 to-purple-400',
            glow: 'bg-purple-500/20',
            iconColor: 'text-purple-500',
            dropShadow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]',
            title: 'Flats Integração',
            subtitle: 'Bem-vindo',
            titleGradient: 'from-white via-purple-100 to-white',
        },
    };

    const current = config[variant];
    const Icon = current.icon;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden">
            <div className="relative flex items-center justify-center w-full max-w-md px-10 mb-8">
                {/* Left Line */}
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-[2px] flex-1 bg-gradient-to-r ${current.gradientLeft} rounded-full`}
                />

                {/* Icon Container */}
                <motion.div
                    className="mx-4 relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: 'easeOut',
                    }}
                >
                    <div className={`absolute inset-0 ${current.glow} blur-xl rounded-full`} />
                    <Icon
                        size={48}
                        className={`${current.iconColor} relative z-10 ${current.dropShadow}`}
                    />
                </motion.div>

                {/* Right Line */}
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-[2px] flex-1 bg-gradient-to-l ${current.gradientRight} rounded-full`}
                />
            </div>

            <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            >
                <h2
                    className={`text-2xl font-bold font-heading tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${current.titleGradient} animate-pulse`}
                >
                    {current.title}
                </h2>
                <p
                    className={`text-${current.color}-200/60 text-xs uppercase tracking-[0.2em] font-medium`}
                >
                    {current.subtitle}
                </p>
            </motion.div>
        </div>
    );
};

export default ModernLoadingScreen;
