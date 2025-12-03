import React from 'react';
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
      titleGradient: 'from-white via-orange-100 to-white'
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
      titleGradient: 'from-white via-blue-100 to-white'
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
      subtitle: 'Carregando...',
      titleGradient: 'from-white via-purple-100 to-white'
    }
  };

  const current = config[variant];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden">
      <style>{`
        @keyframes slideInLeft {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes iconAppear {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes textFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .line-left {
          animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .line-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .main-icon {
          animation: iconAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards;
          opacity: 0; /* Start hidden */
        }
        .loading-text {
          animation: textFadeIn 0.8s ease-out 0.8s forwards;
          opacity: 0; /* Start hidden */
        }
      `}</style>

      <div className="relative flex items-center justify-center w-full max-w-md px-10 mb-8">
        {/* Left Line */}
        <div className={`h-[2px] flex-1 bg-gradient-to-r ${current.gradientLeft} line-left rounded-full`} />

        {/* Icon Container */}
        <div className="mx-4 relative main-icon">
          <div className={`absolute inset-0 ${current.glow} blur-xl rounded-full`} />
          <Icon size={48} className={`${current.iconColor} relative z-10 ${current.dropShadow}`} />
        </div>

        {/* Right Line */}
        <div className={`h-[2px] flex-1 bg-gradient-to-l ${current.gradientRight} line-right rounded-full`} />
      </div>

      <div className="loading-text flex flex-col items-center gap-2">
        <h2 className={`text-2xl font-bold font-heading tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${current.titleGradient} animate-pulse`}>
          {current.title}
        </h2>
        <p className={`text-${current.color}-200/60 text-xs uppercase tracking-[0.2em] font-medium`}>
          {current.subtitle}
        </p>
      </div>
    </div>
  );
};

export default ModernLoadingScreen;
