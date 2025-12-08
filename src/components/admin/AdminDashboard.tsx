import React, { useState, useEffect } from 'react';
import { Loader2, Lock, LogIn } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAdminContent } from '../../hooks/useAdminContent';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import ReservationForm from './ReservationForm';
import ReservationList from './ReservationList';
import BlockedDatesManager from './BlockedDatesManager';
import PlacesManager from './PlacesManager';
import TipsManager from './TipsManager';
import ReviewsManager from './ReviewsManager';
import SuggestionsManager from './SuggestionsManager';
import SettingsManager from './SettingsManager';
import AdminNavigation from './AdminNavigation';
import DashboardHome from './DashboardHome';
import ConfirmModal from './ConfirmModal';
import ReservationCalendar from './ReservationCalendar';

interface AdminDashboardProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ theme, toggleTheme }) => {
    const { auth, data, form, blocks, ui } = useAdminDashboard();
    const content = useAdminContent();
    const settings = useAdminSettings();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Counter para forçar re-render quando necessário
    const [refreshKey, setRefreshKey] = useState(0);

    const { activeTab, setActiveTab } = ui;

    // AUTO-REFRESH: Quando aba volta após longo período, força reload da página
    useEffect(() => {
        let lastVisibleTime = Date.now();
        const STALE_THRESHOLD = 120000; // 2 minutos em background = página pode estar morta

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const timeAway = Date.now() - lastVisibleTime;

                // Se ficou muito tempo fora, força reload completo
                if (timeAway > STALE_THRESHOLD) {
                    window.location.reload();
                    return;
                }

                // Se ficou menos tempo, apenas força re-render dos componentes
                if (timeAway > 30000) {
                    // 30 segundos
                    setRefreshKey((prev) => prev + 1);
                }
            } else {
                lastVisibleTime = Date.now();
            }
        };

        // Também trata página restaurada do cache do browser
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                window.location.reload();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, []);

    if (auth.authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    if (!auth.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-orange-600 dark:text-orange-400" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Acesso Administrativo
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Faça login para gerenciar reservas.
                        </p>
                    </div>
                    <form
                        onSubmit={(e) =>
                            auth.handleLogin(
                                e,
                                (document.getElementById('email') as HTMLInputElement).value,
                                (document.getElementById('password') as HTMLInputElement).value
                            )
                        }
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="admin@exemplo.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gray-900 dark:bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <LogIn size={18} /> Entrar no Painel
                        </button>
                    </form>
                </div>

            </div>
        );
    }

    return (
        <div
            key={refreshKey}
            className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-black font-sans transition-colors duration-300"
        >
            <AdminNavigation
                activeTab={activeTab}
                setActiveTab={(tab) =>
                    setActiveTab(
                        tab as
                        | 'home'
                        | 'create'
                        | 'list'
                        | 'calendar'
                        | 'blocks'
                        | 'places'
                        | 'tips'
                        | 'reviews'
                        | 'suggestions'
                        | 'settings'
                    )
                }
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                theme={theme}
                toggleTheme={toggleTheme}
                onLogout={auth.logout}
                userEmail={auth.user.email || ''}
                userPermission={auth.userPermission}
            />

            {/* MAIN CONTENT AREA */}
            <div className="md:pl-72 pb-32 md:pb-12 min-h-screen transition-all duration-300">
                <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                    {/* HEADER MOBILE (Title only) */}
                    <div className="md:hidden mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                                {auth.userPermission?.role === 'super_admin'
                                    ? 'Admin Geral'
                                    : auth.userPermission?.allowedProperties.length === 1 &&
                                        auth.userPermission.allowedProperties[0] === 'lili'
                                        ? 'Flat da Lili'
                                        : auth.userPermission?.allowedProperties.length === 1 &&
                                            auth.userPermission.allowedProperties[0] === 'integracao'
                                            ? 'Flats Integração'
                                            : 'Painel de Gestão'}
                            </h1>
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Bem-vindo, {auth.user.email?.split('@')[0]}
                                </p>
                                {auth.userPermission && (
                                    <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">
                                        {auth.userPermission.role === 'super_admin'
                                            ? 'Super Admin'
                                            : 'Gestor de Propriedade'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PERMISSION WARNING BANNER */}
                    {auth.user && !auth.userPermission && !auth.authLoading && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
                            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-900 dark:text-red-100">
                                    Acesso Limitado
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Seu usuário não possui permissões configuradas. Entre em contato
                                    com o administrador.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* CONTENT RENDERER */}
                    <div className="animate-fadeIn">
                        {activeTab === 'home' && (
                            <DashboardHome
                                reservations={data.activeReservations}
                                onNavigate={(tab) =>
                                    setActiveTab(
                                        tab as
                                        | 'home'
                                        | 'create'
                                        | 'list'
                                        | 'calendar'
                                        | 'blocks'
                                        | 'places'
                                        | 'tips'
                                        | 'reviews'
                                        | 'suggestions'
                                        | 'settings'
                                    )
                                }
                                userPermission={auth.userPermission}
                            />
                        )}

                        {activeTab === 'create' && (
                            <div className="max-w-2xl mx-auto">
                                <ReservationForm
                                    form={{
                                        ...form,
                                        setPaymentMethod: form.setPaymentMethod,
                                    }}
                                    ui={ui}
                                    userPermission={auth.userPermission}
                                    previousGuests={[
                                        ...data.activeReservations,
                                        ...data.historyReservations,
                                    ]}
                                />
                            </div>
                        )}

                        {activeTab === 'list' && (
                            <ReservationList
                                data={data}
                                ui={ui}
                                form={form}
                                userPermission={auth.userPermission}
                            />
                        )}

                        {activeTab === 'calendar' && (
                            <ReservationCalendar
                                reservations={[
                                    ...data.activeReservations,
                                    ...data.historyReservations,
                                ]}
                                onEditReservation={(res) => {
                                    form.handleStartEdit(res);
                                    setActiveTab('create');
                                }}
                            />
                        )}

                        {activeTab === 'blocks' && (
                            <div className="max-w-2xl mx-auto">
                                <BlockedDatesManager
                                    blocks={blocks}
                                    blockedDates={data.blockedDates}
                                />
                            </div>
                        )}

                        {activeTab === 'places' && <PlacesManager places={content.places} />}
                        {activeTab === 'tips' && (
                            <TipsManager tips={content.tips} curiosities={content.curiosities} />
                        )}
                        {activeTab === 'reviews' && <ReviewsManager reviews={settings.reviews} />}
                        {activeTab === 'suggestions' && (
                            <SuggestionsManager suggestions={settings.suggestions} />
                        )}
                        {activeTab === 'settings' && (
                            <SettingsManager
                                heroImages={settings.heroImages}
                                settings={settings.settings}
                            />
                        )}
                    </div>

                    {/* MIGRATION TOOL REMOVED */}
                </div>
            </div>



            <ConfirmModal
                isOpen={ui.confirmModal.isOpen}
                onClose={() => ui.setConfirmModal({ ...ui.confirmModal, isOpen: false })}
                onConfirm={ui.confirmModal.onConfirm}
                title={ui.confirmModal.title}
                message={ui.confirmModal.message}
                isDestructive={ui.confirmModal.isDestructive}
            />
        </div>
    );
};

export default AdminDashboard;
