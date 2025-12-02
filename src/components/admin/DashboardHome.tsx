import React, { useMemo, useState } from 'react';
import { Reservation, PropertyId } from '../../types';
import { ArrowRight, Calendar, Clock, LogIn, LogOut, User, Building2 } from 'lucide-react';
import { PROPERTIES } from '../../config/properties';
import { UserPermission } from '../../types';

interface DashboardHomeProps {
    reservations: Reservation[];
    onNavigate: (tab: string) => void;
    userPermission?: UserPermission | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ reservations, onNavigate, userPermission }) => {
    const [propertyFilter, setPropertyFilter] = useState<PropertyId | 'all'>('all');

    const filteredReservations = useMemo(() => {
        if (propertyFilter === 'all') return reservations;
        return reservations.filter(r => (r.propertyId || 'lili') === propertyFilter);
    }, [reservations, propertyFilter]);

    const stats = useMemo(() => {
        // CORREÇÃO DE FUSO HORÁRIO: Usar data local para definir "Hoje"
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const localDate = new Date(today.getTime() - offset);
        const todayStr = localDate.toISOString().split('T')[0];

        const checkins = filteredReservations.filter(r => r.checkInDate === todayStr);
        const checkouts = filteredReservations.filter(r => r.checkoutDate === todayStr);

        // Active: Check-in já passou (ou é hoje) E Checkout é hoje ou futuro
        const active = filteredReservations.filter(r => {
            const checkIn = r.checkInDate || '';
            const checkOut = r.checkoutDate || '';
            return checkIn <= todayStr && checkOut >= todayStr;
        });

        return { checkins, checkouts, active };
    }, [filteredReservations]);

    const showPropertyFilter = !userPermission || userPermission.role === 'super_admin' || userPermission.allowedProperties.length > 1;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* WELCOME HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Visão Geral</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Resumo das atividades de hoje.</p>
                </div>
                <button onClick={() => onNavigate('create')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                    <Clock size={16} /> Nova Reserva
                </button>
            </div>

            {/* FILTRO DE PROPRIEDADE */}
            {showPropertyFilter && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setPropertyFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${propertyFilter === 'all' ? 'bg-gray-800 text-white border-gray-800 dark:bg-white dark:text-gray-900' : 'bg-white text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
                    >
                        Todos
                    </button>
                    {Object.values(PROPERTIES).map(prop => (
                        <button
                            key={prop.id}
                            onClick={() => setPropertyFilter(prop.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1 ${propertyFilter === prop.id
                                ? (prop.id === 'lili' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200')
                                : 'bg-white text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                }`}
                        >
                            <Building2 size={12} /> {prop.name}
                        </button>
                    ))}
                </div>
            )}

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <LogIn size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase">Check-ins</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.checkins.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            <LogOut size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase">Check-outs</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.checkouts.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <User size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase">Hóspedes</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active.length}</p>
                </div>
                <div
                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:border-orange-500/50 transition-colors"
                    onClick={() => onNavigate('list')}
                    role="button"
                    tabIndex={0}
                    aria-label="Ver todas as reservas"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('list'); }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                            <Calendar size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{reservations.length}</p>
                </div>
            </div>

            {/* CURRENTLY HOSTED (NOVO CARD) */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User size={20} className="text-green-500" /> Hospedados Agora
                </h3>
                {stats.active.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">Nenhum hóspede no momento.</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.active.map(res => (
                            <div key={res.id} className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/30">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg shrink-0">
                                    {res.guestName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{res.guestName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        <Calendar size={12} /> {(res.checkInDate || '').split('-').reverse().slice(0, 2).join('/')} - {(res.checkoutDate || '').split('-').reverse().slice(0, 2).join('/')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* TODAY'S ACTIVITY */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* CHECK-INS */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <LogIn size={20} className="text-blue-500" /> Chegando Hoje
                    </h3>
                    {stats.checkins.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">Nenhum check-in previsto para hoje.</div>
                    ) : (
                        <div className="space-y-3">
                            {stats.checkins.map(res => (
                                <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                            {res.guestName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{res.guestName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Clock size={10} /> {res.checkInTime}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('list')}
                                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                        aria-label={`Ver detalhes da reserva de ${res.guestName}`}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CHECK-OUTS */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <LogOut size={20} className="text-red-500" /> Saindo Hoje
                    </h3>
                    {stats.checkouts.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">Nenhum check-out previsto para hoje.</div>
                    ) : (
                        <div className="space-y-3">
                            {stats.checkouts.map(res => (
                                <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm">
                                            {res.guestName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{res.guestName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Clock size={10} /> {res.checkOutTime}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('list')}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label={`Ver detalhes da reserva de ${res.guestName}`}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
