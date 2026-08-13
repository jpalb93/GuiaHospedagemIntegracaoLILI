import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CloudOff, Loader2, Lock, LogIn, RefreshCw, ShieldAlert } from 'lucide-react';
import { canUserAccessProperty, restoreAdminUser } from '../../services/userManagement';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAdminContent } from '../../hooks/useAdminContent';
import { useAdminSettings } from '../../hooks/useAdminSettings';
// LAZY LOADED COMPONENTS FOR BUNDLE OPTIMIZATION
const ReservationForm = React.lazy(() => import('./ReservationForm'));
const ReservationList = React.lazy(() => import('./ReservationList'));
const BlockedDatesManager = React.lazy(() => import('./BlockedDatesManager'));
const PlacesManager = React.lazy(() => import('./PlacesManager'));
const TipsManager = React.lazy(() => import('./TipsManager'));
const ReviewsManager = React.lazy(() => import('./ReviewsManager'));
const SuggestionsManager = React.lazy(() => import('./SuggestionsManager'));
const SettingsManager = React.lazy(() => import('./SettingsManager'));
const DashboardHome = React.lazy(() => import('./DashboardHome'));
const ReservationCalendar = React.lazy(() => import('./ReservationCalendar'));
const AnalyticsDashboard = React.lazy(() => import('./AnalyticsDashboard'));
const ActivityLogs = React.lazy(() => import('./ActivityLogs'));
const CompaniesManager = React.lazy(() => import('./CompaniesManager'));

import AdminNavigation from './AdminNavigation';
import ConfirmModal from './ConfirmModal';
import ModernLoadingScreen from '../ModernLoadingScreen';
import flatsLogo from '../../assets/flats-integracao-logo.png';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AdminDashboardProps {}

const FallbackLoader = () => (
    <div className="h-full w-full flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Loader2 className="animate-spin text-orange-500 relative z-10" size={48} />
        </div>
        <p className="mt-4 text-gray-400 font-medium text-sm animate-pulse">Carregando módulo...</p>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
    const { auth, data, form, blocks, ui } = useAdminDashboard();
    const content = useAdminContent();
    const settings = useAdminSettings();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Counter para forçar re-render quando necessário
    const [refreshKey, setRefreshKey] = useState(0);

    const { activeTab, setActiveTab } = ui;
    const canAccessCorporate = auth.userPermission
        ? canUserAccessProperty(auth.userPermission, 'integracao')
        : false;

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
        return <ModernLoadingScreen variant="admin" />;
    }

    if (!auth.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100/80 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-stone-200/80 dark:border-gray-700 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-200 dark:border-orange-800/40">
                            <Lock className="text-orange-600 dark:text-orange-400" size={30} />
                        </div>
                        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white font-heading">
                            Acesso Administrativo
                        </h1>
                        <p className="text-sm text-stone-500 dark:text-gray-400 mt-1 font-medium">
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
                        className="space-y-5"
                    >
                        <div>
                            <label className="block text-xs font-extrabold text-stone-700 dark:text-gray-300 uppercase mb-1.5 font-heading tracking-wider">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full p-3.5 rounded-2xl border border-stone-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-2xs font-medium text-sm"
                                placeholder="admin@exemplo.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-extrabold text-stone-700 dark:text-gray-300 uppercase mb-1.5 font-heading tracking-wider">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full p-3.5 rounded-2xl border border-stone-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-2xs font-medium text-sm"
                                placeholder="••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer font-heading text-sm mt-2"
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
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
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
                            | 'companies'
                            | 'places'
                            | 'tips'
                            | 'reviews'
                            | 'suggestions'
                            | 'settings'
                            | 'analytics'
                            | 'logs'
                    )
                }
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                onLogout={auth.logout}
                userEmail={auth.user.email || ''}
                userPermission={auth.userPermission}
            />

            {/* MAIN CONTENT AREA */}
            <div className="xl:pl-72 pb-[calc(11rem+env(safe-area-inset-bottom,0px))] xl:pb-12 min-h-screen transition-all duration-300 max-w-[100vw] overflow-x-hidden">
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
                    {/* HEADER MOBILE & TABLET (< 1280px) — ULTRA CHIC COM LOGOMARCA */}
                    <div className="xl:hidden mb-6 p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-850 to-gray-900 text-white rounded-[2.2rem] border border-white/10 shadow-2xl shadow-stone-900/30 flex items-center justify-between gap-4 relative overflow-hidden backdrop-blur-xl">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 shadow-md shrink-0 flex items-center justify-center">
                                <img
                                    src={flatsLogo}
                                    alt="Flats Integração"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <h1 className="text-lg sm:text-xl font-extrabold font-heading text-white tracking-tight leading-snug truncate">
                                    {auth.userPermission?.role === 'super_admin'
                                        ? 'Admin Geral'
                                        : auth.userPermission?.allowedProperties.length === 1 &&
                                            auth.userPermission.allowedProperties[0] === 'lili'
                                          ? 'Flat da Lili'
                                          : auth.userPermission?.allowedProperties.length === 1 &&
                                              auth.userPermission.allowedProperties[0] ===
                                                  'integracao'
                                            ? 'Flats Integração'
                                            : 'Flats Integração'}
                                </h1>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[11px] font-medium text-stone-300 truncate">
                                        Bem-vindo,{' '}
                                        <strong className="text-white font-extrabold">
                                            {auth.user.email?.split('@')[0]}
                                        </strong>
                                    </span>
                                    {auth.userPermission && (
                                        <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 tracking-widest font-heading">
                                            {auth.userPermission.role === 'super_admin'
                                                ? 'Super Admin'
                                                : 'Gestor'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PERMISSION WARNING BANNER */}
                    {auth.user && !auth.userPermission && !auth.authLoading && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 animate-fadeIn">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-900 dark:text-red-100">
                                        Acesso Limitado detectado
                                    </h3>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        Seus dados de permissão não foram encontrados no banco de
                                        dados. Isso pode ocorrer após uma limpeza de dados.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!auth.user?.email) return;
                                    const success = await restoreAdminUser(auth.user.email);
                                    if (success) {
                                        alert(
                                            'Permissões restauradas com sucesso! A página será recarregada.'
                                        );
                                        window.location.reload();
                                    } else {
                                        alert('Falha ao restaurar permissões. Tente novamente.');
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                            >
                                <ShieldAlert size={16} />
                                Restaurar Acesso Admin
                            </button>
                        </div>
                    )}

                    {/* RESERVATION SERVER SYNC STATUS */}
                    {auth.userPermission && data.activeSyncStatus !== 'synced' && (
                        <div
                            className={`mb-6 rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-fadeIn ${
                                data.activeSyncStatus === 'error'
                                    ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                            }`}
                            role="status"
                        >
                            <div
                                className={`p-2 rounded-full shrink-0 ${
                                    data.activeSyncStatus === 'error'
                                        ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300'
                                        : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300'
                                }`}
                            >
                                {data.activeSyncStatus === 'connecting' ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <CloudOff size={20} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3
                                    className={`font-bold ${
                                        data.activeSyncStatus === 'error'
                                            ? 'text-red-900 dark:text-red-100'
                                            : 'text-amber-900 dark:text-amber-100'
                                    }`}
                                >
                                    {data.activeSyncStatus === 'connecting'
                                        ? 'Confirmando reservas com o servidor…'
                                        : data.activeSyncStatus === 'pending'
                                          ? 'Alterações aguardando confirmação do servidor'
                                          : data.activeSyncStatus === 'cached'
                                            ? 'Cópia local detectada — aguardando o servidor'
                                            : 'Reservas não sincronizadas'}
                                </h3>
                                <p
                                    className={`text-sm ${
                                        data.activeSyncStatus === 'error'
                                            ? 'text-red-700 dark:text-red-300'
                                            : 'text-amber-700 dark:text-amber-300'
                                    }`}
                                >
                                    Os números do painel não devem ser considerados atuais até a
                                    confirmação. Nenhum dado local antigo será exibido como oficial.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={data.refreshActive}
                                disabled={data.activeSyncStatus === 'connecting'}
                                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-wait"
                            >
                                <RefreshCw size={16} />
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {/* CONTENT RENDERER */}
                    <div className="animate-fadeIn">
                        <React.Suspense fallback={<FallbackLoader />}>
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
                                                | 'companies'
                                                | 'places'
                                                | 'tips'
                                                | 'reviews'
                                                | 'suggestions'
                                                | 'settings'
                                                | 'analytics'
                                                | 'logs'
                                        )
                                    }
                                    userPermission={auth.userPermission}
                                    onEditReservation={(res) => {
                                        form.handleStartEdit(res);
                                        setActiveTab('create');
                                    }}
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
                                        templates={settings.settings.data.reservationTemplates}
                                        onSaveTemplate={async (template) => {
                                            const current =
                                                settings.settings.data.reservationTemplates || [];
                                            await settings.settings.save({
                                                ...settings.settings.data,
                                                reservationTemplates: [...current, template],
                                            });
                                            ui.showToast('Modelo salvo com sucesso!', 'success');
                                        }}
                                        onDeleteTemplate={async (id) => {
                                            const current =
                                                settings.settings.data.reservationTemplates || [];
                                            const updated = current.filter((t) => t.id !== id);
                                            await settings.settings.save({
                                                ...settings.settings.data,
                                                reservationTemplates: updated,
                                            });
                                            ui.showToast('Modelo removido.', 'success');
                                        }}
                                    />
                                </div>
                            )}

                            {activeTab === 'list' && (
                                <ReservationList
                                    data={data}
                                    ui={ui}
                                    form={form}
                                    userPermission={auth.userPermission}
                                    onNewReservation={() => setActiveTab('create')}
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

                            {activeTab === 'companies' && canAccessCorporate && (
                                <CompaniesManager />
                            )}

                            {activeTab === 'places' && <PlacesManager places={content.places} />}
                            {activeTab === 'tips' && (
                                <TipsManager
                                    tips={content.tips}
                                    curiosities={content.curiosities}
                                />
                            )}
                            {activeTab === 'reviews' && (
                                <ReviewsManager reviews={settings.reviews} />
                            )}
                            {activeTab === 'suggestions' && (
                                <SuggestionsManager suggestions={settings.suggestions} />
                            )}
                            {activeTab === 'settings' && (
                                <SettingsManager
                                    heroImages={settings.heroImages}
                                    settings={settings.settings}
                                    isLoading={settings.loading}
                                    error={settings.error}
                                    onRetry={settings.refresh}
                                />
                            )}
                            {activeTab === 'analytics' && (
                                <AnalyticsDashboard
                                    reservations={[
                                        ...data.activeReservations,
                                        ...data.historyReservations,
                                    ]}
                                />
                            )}
                            {activeTab === 'logs' && <ActivityLogs />}
                        </React.Suspense>
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
