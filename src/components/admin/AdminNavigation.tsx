import React from 'react';
import {
    Home,
    Calendar,
    PlusCircle,
    Menu,
    MapPin,
    Lightbulb,
    Star,
    Sparkles,
    Settings,
    CalendarOff,
    LogOut,
    Moon,
    Sun
} from 'lucide-react';

import { UserPermission } from '../../types';

interface AdminNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onLogout: () => void;
    userEmail?: string;
    userPermission?: UserPermission | null;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    theme,
    toggleTheme,
    onLogout,
    userEmail,
    userPermission
}) => {

    // --- BRANDING LOGIC ---
    const getBrandTitle = () => {
        if (!userPermission) return 'Painel Admin';
        if (userPermission.role === 'super_admin') return 'Admin Geral';

        // Se tiver acesso a apenas uma propriedade, mostra o nome dela
        if (userPermission.allowedProperties.length === 1) {
            const prop = userPermission.allowedProperties[0];
            if (prop === 'lili') return 'Flat da Lili';
            if (prop === 'integracao') return 'Flats Integração';
        }

        return 'Painel de Gestão';
    };

    const brandTitle = getBrandTitle();

    const navItems = [
        { id: 'home', label: 'Início', icon: Home, mobile: true },
        { id: 'list', label: 'Reservas', icon: Calendar, mobile: true },
        { id: 'calendar', label: 'Calendário', icon: Calendar, mobile: false },
        { id: 'create', label: 'Nova', icon: PlusCircle, mobile: true, highlight: true },
        { id: 'blocks', label: 'Bloqueios', icon: CalendarOff, mobile: false },
        { id: 'places', label: 'Lugares', icon: MapPin, mobile: false },
        { id: 'tips', label: 'Dicas', icon: Lightbulb, mobile: false },
        { id: 'reviews', label: 'Avaliações', icon: Star, mobile: false },
        { id: 'suggestions', label: 'Sugestões', icon: Sparkles, mobile: false },
        { id: 'settings', label: 'Config', icon: Settings, mobile: false },
    ];

    const mobileItems = navItems.filter(item => item.mobile);

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 z-40 transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white font-heading tracking-tight">{brandTitle}</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{userEmail}</p>
                    {userPermission?.role === 'super_admin' && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-bold uppercase rounded-full">
                            Super Admin
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-orange-500' : 'text-gray-400'} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </div>

            {/* MOBILE BOTTOM BAR */}
            <div className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-10 px-4 py-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {mobileItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeTab === item.id ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                    >
                        <div className={`${item.highlight ? 'bg-orange-500 text-white p-3 rounded-full -mt-8 shadow-lg shadow-orange-500/30 border-4 border-gray-50 dark:border-gray-900' : ''}`}>
                            <item.icon size={item.highlight ? 24 : 24} strokeWidth={item.highlight ? 2.5 : 2} />
                        </div>
                        {!item.highlight && <span className="text-[10px] font-medium mt-1">{item.label}</span>}
                    </button>
                ))}

                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isMobileMenuOpen ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                >
                    <Menu size={24} />
                    <span className="text-[10px] font-medium mt-1">Menu</span>
                </button>
            </div>

            {/* MOBILE MENU DRAWER */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        role="button"
                        tabIndex={0}
                        aria-label="Fechar menu"
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsMobileMenuOpen(false); }}
                    />
                    <div className="relative bg-white dark:bg-gray-900 rounded-t-[32px] p-6 pb-safe animate-slideUp shadow-2xl border-t border-white/10">
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {navItems.filter(i => !i.mobile).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${activeTab === item.id
                                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/20'
                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <item.icon size={24} />
                                    <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm"
                            >
                                <span className="flex items-center gap-3">
                                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                                    {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                                </span>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-5' : 'left-1'}`} />
                                </div>
                            </button>

                            <button
                                onClick={onLogout}
                                className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm"
                            >
                                <LogOut size={20} />
                                Sair do Painel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminNavigation;
