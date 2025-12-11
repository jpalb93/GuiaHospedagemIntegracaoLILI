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
    Sun,
    Monitor,
} from 'lucide-react';

import { UserPermission } from '../../types';

import { useTheme } from '../../contexts/ThemeContext';

interface AdminNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    userEmail?: string;
    userPermission?: UserPermission | null;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    onLogout,
    userEmail,
    userPermission,
}) => {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };
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

    const mobileItems = navItems.filter((item) => item.mobile);

    return (
        <>
            {/* DESKTOP SIDEBAR - GLASSMOPHISM & PREMIUM UI */}
            <div
                className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-40 transition-all duration-300
                bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-r border-gray-200/50 dark:border-white/5 supports-[backdrop-filter]:bg-opacity-60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
            >
                {/* BRANDING HEADER */}
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                            <Sparkles size={24} fill="currentColor" className="opacity-90" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white font-heading leading-none tracking-tight mb-1">
                                {brandTitle}
                            </h1>
                            {userPermission?.role === 'super_admin' ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full w-fit">
                                    Super Admin
                                </span>
                            ) : (
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Gestão
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* NAV ITEMS SCROLLABLE */}
                <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1.5 no-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`group w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeTab === item.id
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-white/20 translate-x-1'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:shadow-sm dark:hover:shadow-none hover:translate-x-1'
                                }`}
                        >
                            <item.icon
                                size={22}
                                strokeWidth={activeTab === item.id ? 2.5 : 2}
                                className={`transition-transform duration-300 ${activeTab === item.id ? 'text-white scale-110' : 'group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:scale-110'}`}
                            />
                            <span
                                className={`relative z-10 tracking-wide ${activeTab === item.id ? 'font-bold' : ''}`}
                            >
                                {item.label}
                            </span>

                            {/* Active Glow Effect */}
                            {activeTab === item.id && (
                                <div className="absolute inset-0 bg-white/20 blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </button>
                    ))}
                </div>

                {/* BOTTOM ACTIONS (USER & THEME) */}
                <div className="p-4 mx-4 mb-6 bg-white/60 dark:bg-white/5 rounded-3xl border border-gray-100/50 dark:border-white/5 backdrop-blur-md shadow-sm dark:shadow-none">
                    <button
                        onClick={cycleTheme}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all mb-3 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors">
                                {theme === 'light' ? <Sun size={16} /> : theme === 'dark' ? <Moon size={16} /> : <Monitor size={16} />}
                            </div>
                            <span className="font-semibold">
                                {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
                            </span>
                        </div>
                        <div
                            className={`w-9 h-5 rounded-full relative transition-colors duration-300 border-2 ${theme === 'dark' ? 'bg-orange-500 border-orange-500' : 'bg-gray-200 border-gray-200'}`}
                        >
                            <div
                                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'}`}
                            />
                        </div>
                    </button>

                    <div className="h-px w-full bg-gray-200/50 dark:bg-white/10 mb-3"></div>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all group"
                    >
                        <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/10 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                            <LogOut size={16} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold">Sair</span>
                    </button>

                    <div className="mt-3 text-[10px] text-center text-gray-400 font-mono tracking-tighter opacity-70">
                        {userEmail}
                    </div>
                </div>
            </div>

            {/* MOBILE FLOATING DOCK (NEW PREMIUM DESIGN) */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 animate-slideUp mobile-bottom-nav">
                <div className="bg-gray-900/95 dark:bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 rounded-[2.5rem] p-2 pr-6 pl-6 flex justify-between items-center ring-1 ring-white/5">
                    {mobileItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex flex-col items-center justify-center p-2 transition-all duration-500 ${activeTab === item.id
                                ? 'text-white -translate-y-4'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div
                                className={`transition-all duration-500 relative z-10 ${activeTab === item.id ? 'bg-orange-500 p-3.5 rounded-full shadow-lg shadow-orange-500/50 ring-4 ring-gray-50 dark:ring-gray-900 scale-110' : ''}`}
                            >
                                <item.icon
                                    size={activeTab === item.id ? 24 : 24}
                                    strokeWidth={activeTab === item.id ? 2.5 : 2}
                                />
                            </div>

                            {activeTab === item.id && (
                                <span className="absolute -bottom-8 whitespace-nowrap text-[10px] font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 animate-fadeIn tracking-wide">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    ))}

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`relative flex flex-col items-center justify-center p-2 text-gray-500 hover:text-gray-300 transition-colors group ${isMobileMenuOpen ? 'text-orange-500' : ''}`}
                    >
                        <div className="group-active:scale-90 transition-transform p-1">
                            <Menu size={26} strokeWidth={2} />
                        </div>
                    </button>
                </div>
            </div>

            {/* MOBILE MENU DRAWER (PREMIUM GLASS) */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl rounded-t-[2.5rem] p-6 pb-24 animate-slideUp shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/20 ring-1 ring-black/5">
                        <div
                            className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8 cursor-pointer active:scale-95 transition-transform opacity-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        <div className="flex items-center justify-between mb-8 px-2">
                            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Sparkles size={20} className="text-orange-500" />
                                Menu Completo
                            </h3>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-3 py-1 rounded-full">
                                {userEmail?.split('@')[0]}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-y-8 gap-x-2 mb-8">
                            {navItems
                                .filter((i) => !i.mobile)
                                .map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`flex flex-col items-center gap-3 p-1 rounded-2xl transition-all active:scale-95 group ${activeTab === item.id
                                            ? 'text-orange-600 dark:text-orange-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <div
                                            className={`p-4 rounded-[1.2rem] shadow-sm transition-all duration-300 group-hover:scale-110 ${activeTab === item.id
                                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-500/30'
                                                : 'bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700'
                                                }`}
                                        >
                                            <item.icon
                                                size={24}
                                                strokeWidth={activeTab === item.id ? 2.5 : 1.5}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-center leading-tight tracking-wide group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex items-center gap-3 p-1">
                            <button
                                onClick={cycleTheme}
                                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 active:scale-95 transition-all text-gray-700 dark:text-gray-300"
                            >
                                {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
                                </span>
                            </button>

                            <button
                                onClick={onLogout}
                                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 active:scale-95 transition-all text-red-600 dark:text-red-400"
                            >
                                <LogOut size={20} />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    Sair
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminNavigation;
