import React, { useMemo, useState } from 'react';
import { Reservation, PropertyId } from '../../types';
import { ArrowRight, Calendar, Clock, LogIn, LogOut, User, Building2, Plus, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PROPERTIES } from '../../config/properties';
import { UserPermission } from '../../types';
import ReservationQuickViewModal from './modals/ReservationQuickViewModal';
import PaymentRegistrationModal from './modals/PaymentRegistrationModal';
import { updateReservation } from '../../services/firebase/reservations';
import CRMQuickStats from './dashboard/CRMQuickStats';
import FlatOccupancyGrid from './dashboard/FlatOccupancyGrid';
import CRMActionsAlerts from './dashboard/CRMActionsAlerts';
import RevenueTrendWidget from './dashboard/RevenueTrendWidget';
import ActivityFeedWidget from './dashboard/ActivityFeedWidget';
import CRMSearchWidget from './dashboard/CRMSearchWidget';

interface DashboardHomeProps {
    reservations: Reservation[];
    onNavigate: (tab: string) => void;
    userPermission?: UserPermission | null;
    onEditReservation: (res: Reservation) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({
    reservations,
    onNavigate,
    userPermission,
    onEditReservation,
}) => {
    const [propertyFilter, setPropertyFilter] = useState<PropertyId | 'all'>('all');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [paymentModalReservation, setPaymentModalReservation] = useState<Reservation | null>(null);

    const handleConfirmPayment = async (
        reservationId: string,
        paymentStatus: any,
        depositAmount: number,
        paymentMethod?: 'pix' | 'money' | 'card'
    ) => {
        await updateReservation(reservationId, {
            paymentStatus,
            depositAmount,
            paymentMethod,
        });
    };

    const filteredReservations = useMemo(() => {
        if (propertyFilter === 'all') return reservations;
        return reservations.filter((r) => (r.propertyId || 'lili') === propertyFilter);
    }, [reservations, propertyFilter]);

    const stats = useMemo(() => {
        // CORREÇÃO DE FUSO HORÁRIO: Usar data local para definir "Hoje"
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const localDate = new Date(today.getTime() - offset);
        const todayStr = localDate.toISOString().split('T')[0];

        const checkins = filteredReservations.filter((r) => r.checkInDate === todayStr);
        const checkouts = filteredReservations.filter((r) => r.checkoutDate === todayStr);

        // Active: Check-in já passou (ou é hoje) E Checkout é hoje ou futuro
        const active = filteredReservations.filter((r) => {
            const checkIn = r.checkInDate || '';
            const checkOut = r.checkoutDate || '';
            return checkIn <= todayStr && checkOut >= todayStr;
        });

        const sortByFlatNumber = (a: Reservation, b: Reservation) => {
            const getFlatNum = (res: Reservation) => {
                if ((res.propertyId || 'lili') === 'lili') return 0;
                const num = parseInt(res.flatNumber || '0', 10);
                return isNaN(num) ? 9999 : num;
            };
            return getFlatNum(a) - getFlatNum(b);
        };

        checkins.sort(sortByFlatNumber);
        checkouts.sort(sortByFlatNumber);
        active.sort(sortByFlatNumber);

        return { checkins, checkouts, active };
    }, [filteredReservations]);

    const showPropertyFilter =
        !userPermission ||
        userPermission.role === 'super_admin' ||
        userPermission.allowedProperties.length > 1;

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            {/* LUXURY WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 text-white p-6 sm:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-orange-400 font-heading mb-1">
                        <ShieldCheck size={16} /> Central de Controle Executiva
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
                        Visão Geral do Imóvel
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 font-medium max-w-xl">
                        Monitoramento em tempo real de ocupação, faturamento mensal e recebimentos.
                    </p>
                </div>

                {/* AÇÕES RÁPIDAS DE LUXO */}
                <div className="flex items-center gap-2.5 flex-wrap relative z-10 shrink-0">
                    <button
                        type="button"
                        onClick={() => onNavigate('create')}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 active:scale-95 touch-manipulation font-heading"
                    >
                        <Plus size={18} /> Nova Reserva
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('calendar')}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 active:scale-95 touch-manipulation"
                    >
                        <Calendar size={16} /> Calendário
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('blocks')}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 active:scale-95 touch-manipulation"
                    >
                        <Lock size={16} /> Bloqueios
                    </button>
                </div>
            </div>

            {/* BUSCA RÁPIDA GLOBAL DE HÓSPEDES */}
            <CRMSearchWidget
                reservations={reservations}
                onSelectReservation={(res) => setSelectedReservation(res)}
            />

            {/* FILTRO DE PROPRIEDADE */}
            {showPropertyFilter && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory touch-pan-x">
                    <button
                        type="button"
                        onClick={() => setPropertyFilter('all')}
                        className={`snap-start min-h-[44px] px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all active:scale-95 touch-manipulation ${propertyFilter === 'all' ? 'bg-gray-900 text-white shadow-lg dark:bg-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
                    >
                        Todos os Flats
                    </button>
                    {Object.values(PROPERTIES).map((prop) => (
                        <button
                            type="button"
                            key={prop.id}
                            onClick={() => setPropertyFilter(prop.id)}
                            className={`snap-start min-h-[44px] px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 active:scale-95 touch-manipulation border ${propertyFilter === prop.id
                                ? prop.id === 'lili'
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30'
                                    : 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Building2 size={14} /> {prop.name}
                        </button>
                    ))}
                </div>
            )}

            {/* CRM QUICK STATS KPI CARDS */}
            <CRMQuickStats
                reservations={filteredReservations}
                totalUnitsCount={11}
                checkinsCount={stats.checkins.length}
                checkoutsCount={stats.checkouts.length}
                activeCount={stats.active.length}
                onNavigate={onNavigate}
            />

            {/* MAPA DE OCUPAÇÃO DOS FLATS EM TEMPO REAL */}
            <FlatOccupancyGrid
                reservations={reservations}
                onSelectReservation={(res) => setSelectedReservation(res)}
            />

            {/* ANALYTICS & TIMELINE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueTrendWidget reservations={filteredReservations} />
                <ActivityFeedWidget reservations={filteredReservations} onSelectReservation={(res) => setSelectedReservation(res)} />
            </div>

            {/* CENTRAL DE PENDÊNCIAS E ALERTAS DO CRM */}
            <CRMActionsAlerts
                reservations={filteredReservations}
                onSelectReservation={(res) => setSelectedReservation(res)}
                onEditReservation={onEditReservation}
                onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
            />

            {/* HOSPEDADOS AGORA (REDESENHADO DE LUXO) */}
            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-3 font-heading">
                        <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <User size={22} />
                        </div>
                        Hospedados Agora
                    </h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {stats.active.length} na casa
                    </span>
                </div>

                {stats.active.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-700/50">
                        <User size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-gray-400 text-sm font-bold">Nenhum hóspede na casa neste momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.active.map((res) => (
                            <div
                                key={res.id}
                                onClick={() => setSelectedReservation(res)}
                                className="group p-5 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900/60 dark:to-emerald-950/20 rounded-[2rem] border border-gray-100 dark:border-gray-700/70 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-10 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 font-heading">
                                        {res.guestName.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <p className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-heading truncate">
                                                {res.guestName}
                                            </p>
                                            <span
                                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                                    (res.propertyId || 'lili') === 'lili'
                                                        ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300'
                                                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}
                                            >
                                                {(res.propertyId || 'lili') === 'lili'
                                                    ? 'Lili'
                                                    : `Flat ${res.flatNumber || 'N/A'}`}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                                            <Calendar size={12} className="text-emerald-500 shrink-0" />
                                            <span>
                                                Até{' '}
                                                {(res.checkoutDate || '')
                                                    .split('-')
                                                    .reverse()
                                                    .slice(0, 2)
                                                    .join('/')}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-100/50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ATIVIDADE DE HOJE: CHEGANDO & SAINDO (REDESENHADOS DE LUXO) */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* CHEGANDO HOJE */}
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-3 font-heading">
                            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm">
                                <LogIn size={22} />
                            </div>
                            Chegando Hoje
                        </h3>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                            {stats.checkins.length} check-ins
                        </span>
                    </div>

                    {stats.checkins.length === 0 ? (
                        <div className="text-center py-10 bg-blue-50/30 dark:bg-blue-950/10 rounded-2xl border border-dashed border-blue-200/60 dark:border-blue-900/30">
                            <CheckCircle2 size={30} className="mx-auto text-blue-400 mb-2" />
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                Nenhum check-in previsto para hoje.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.checkins.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => setSelectedReservation(res)}
                                    className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-blue-50/40 dark:from-gray-900/60 dark:to-blue-950/20 rounded-2xl border border-gray-100 dark:border-gray-700/70 hover:border-blue-300 dark:hover:border-blue-800/60 hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center font-heading shrink-0 shadow-md shadow-blue-500/20">
                                            {res.guestName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                <p className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {res.guestName}
                                                </p>
                                                <span
                                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                                        (res.propertyId || 'lili') === 'lili'
                                                            ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300'
                                                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                                    }`}
                                                >
                                                    {(res.propertyId || 'lili') === 'lili'
                                                        ? 'Lili'
                                                        : `Flat ${res.flatNumber || 'N/A'}`}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 font-semibold">
                                                <Clock size={12} className="text-blue-500" /> {res.checkInTime || '15:00'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditReservation(res);
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors shrink-0"
                                        aria-label={`Editar reserva de ${res.guestName}`}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SAINDO HOJE */}
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-3 font-heading">
                            <div className="p-3 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 shadow-sm">
                                <LogOut size={22} />
                            </div>
                            Saindo Hoje
                        </h3>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
                            {stats.checkouts.length} check-outs
                        </span>
                    </div>

                    {stats.checkouts.length === 0 ? (
                        <div className="text-center py-10 bg-orange-50/30 dark:bg-orange-950/10 rounded-2xl border border-dashed border-orange-200/60 dark:border-orange-900/30">
                            <CheckCircle2 size={30} className="mx-auto text-orange-400 mb-2" />
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                Nenhum check-out previsto para hoje.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.checkouts.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => setSelectedReservation(res)}
                                    className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-orange-50/40 dark:from-gray-900/60 dark:to-orange-950/20 rounded-2xl border border-gray-100 dark:border-gray-700/70 hover:border-orange-300 dark:hover:border-orange-800/60 hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold text-sm flex items-center justify-center font-heading shrink-0 shadow-md shadow-orange-500/20">
                                            {res.guestName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                <p className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white font-heading group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                                                    {res.guestName}
                                                </p>
                                                <span
                                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                                        (res.propertyId || 'lili') === 'lili'
                                                            ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300'
                                                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                                    }`}
                                                >
                                                    {(res.propertyId || 'lili') === 'lili'
                                                        ? 'Lili'
                                                        : `Flat ${res.flatNumber || 'N/A'}`}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 font-semibold">
                                                <Clock size={12} className="text-orange-500" /> {res.checkOutTime || '11:00'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditReservation(res);
                                        }}
                                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors shrink-0"
                                        aria-label={`Editar reserva de ${res.guestName}`}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick View Modal */}
            <ReservationQuickViewModal
                isOpen={!!selectedReservation}
                onClose={() => setSelectedReservation(null)}
                reservation={selectedReservation}
                onEdit={(res) => {
                    setSelectedReservation(null);
                    onEditReservation(res);
                }}
                onOpenPaymentModal={(res) => {
                    setSelectedReservation(null);
                    setPaymentModalReservation(res);
                }}
            />

            {/* Modal de Quitação de Pagamento */}
            <PaymentRegistrationModal
                isOpen={!!paymentModalReservation}
                onClose={() => setPaymentModalReservation(null)}
                reservation={paymentModalReservation}
                onConfirmPayment={handleConfirmPayment}
            />
        </div>
    );
};

export default DashboardHome;
