import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck, KeyRound } from 'lucide-react';
import flatsLogo from '../assets/flats-integracao-logo.png';

interface ModernLoadingScreenProps {
    variant?: 'guest' | 'admin' | 'landing';
}

const ModernLoadingScreen: React.FC<ModernLoadingScreenProps> = ({ variant = 'guest' }) => {
    // Configuração por variante
    const config = {
        guest: {
            icon: BookOpen,
            color: 'orange',
            gradientLeft: 'from-transparent via-amber-500 to-orange-400',
            gradientRight: 'from-transparent via-amber-500 to-orange-400',
            glow: 'bg-amber-500/25',
            iconColor: 'text-amber-400',
            dropShadow: 'drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]',
            title: 'Flats Integração',
            subtitle: 'Preparando seu guia digital',
            titleGradient: 'from-white via-amber-100 to-white',
        },
        admin: {
            icon: ShieldCheck,
            color: 'amber',
            gradientLeft: 'from-transparent via-amber-500 to-orange-500',
            gradientRight: 'from-transparent via-amber-500 to-orange-500',
            glow: 'bg-amber-500/25',
            iconColor: 'text-amber-400',
            dropShadow: 'drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]',
            title: 'Painel Administrativo',
            subtitle: 'Autenticando Acesso Restrito',
            titleGradient: 'from-white via-amber-100 to-white',
        },
        landing: {
            icon: KeyRound,
            color: 'purple',
            gradientLeft: 'from-transparent via-purple-500 to-purple-400',
            gradientRight: 'from-transparent via-purple-500 to-purple-400',
            glow: 'bg-purple-500/25',
            iconColor: 'text-purple-400',
            dropShadow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]',
            title: 'Flats Integração',
            subtitle: 'Seja Bem-vindo',
            titleGradient: 'from-white via-purple-100 to-white',
        },
    };

    const current = config[variant];
    const Icon = current.icon;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-stone-950 via-gray-950 to-stone-950 text-white overflow-hidden select-none">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

            {/* LOGO DA EMPRESA COM AURA DE BRILHO */}
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center mb-6"
            >
                <div className="relative p-4 rounded-3xl bg-stone-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-xl flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-amber-500/10 blur-xl rounded-3xl opacity-80 animate-pulse" />
                    <img
                        src={flatsLogo}
                        alt="Flats Integração"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                    />
                </div>
            </motion.div>

            {/* ANIMATED LINE & ICON BAR */}
            <div className="relative flex items-center justify-center w-full max-w-md px-10 mb-6">
                {/* Left Line */}
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-[2px] flex-1 bg-gradient-to-r ${current.gradientLeft} rounded-full`}
                />

                {/* Icon Badge */}
                <motion.div
                    className="mx-4 relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: 'easeOut',
                    }}
                >
                    <div className={`absolute inset-0 ${current.glow} blur-xl rounded-full`} />
                    <div className="p-2.5 rounded-2xl bg-stone-900 border border-amber-500/30 shadow-lg relative z-10">
                        <Icon size={28} className={`${current.iconColor} ${current.dropShadow}`} />
                    </div>
                </motion.div>

                {/* Right Line */}
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-[2px] flex-1 bg-gradient-to-l ${current.gradientRight} rounded-full`}
                />
            </div>

            {/* TITLE & SUBTITLE */}
            <motion.div
                className="flex flex-col items-center gap-1.5 text-center px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            >
                <h2
                    className={`text-xl sm:text-2xl font-extrabold font-heading tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${current.titleGradient} animate-pulse`}
                >
                    {current.title}
                </h2>
                <p className="text-amber-200/70 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold font-heading">
                    {current.subtitle}
                </p>
            </motion.div>
        </div>
    );
};

export default ModernLoadingScreen;
