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
                <button onClick={() => onNavigate('create')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
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

            {/* STATS CARDS - PREMIUM GLASS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/40 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.05] dark:opacity-[0.1] group-hover:opacity-10 transition-opacity rotate-12">
                        <LogIn size={80} />
                    </div>
                    <div className="flex flex-col relative z-10 h-full justify-between">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-heading">Chegando</span>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{stats.checkins.length}</span>
                            {stats.checkins.length > 0 && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full self-center">HOJE</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/40 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.05] dark:opacity-[0.1] group-hover:opacity-10 transition-opacity rotate-12">
                        <LogOut size={80} />
                    </div>
                    <div className="flex flex-col relative z-10 h-full justify-between">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-heading">Saindo</span>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{stats.checkouts.length}</span>
                            {stats.checkouts.length > 0 && <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full self-center">HOJE</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/10 dark:from-green-500/10 dark:to-transparent backdrop-blur-xl p-5 rounded-[2rem] border border-green-100/50 dark:border-green-500/20 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute -right-6 -top-6 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity text-green-600 rotate-12">
                        <User size={100} />
                    </div>
                    <div className="flex flex-col relative z-10 h-full justify-between">
                        <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2 font-heading">Hóspedes Ativos</span>
                        <span className="text-3xl font-heading font-bold text-green-800 dark:text-green-100">{stats.active.length}</span>
                    </div>
                </div>

                <div
                    onClick={() => onNavigate('list')}
                    className="cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white p-5 rounded-[2rem] shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all group overflow-hidden relative text-left"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('list'); }}
                >
                    <div className="absolute -right-6 -top-6 p-4 opacity-20 group-hover:opacity-30 transition-opacity rotate-12">
                        <Calendar size={100} />
                    </div>
                    <div className="flex flex-col relative z-10 h-full justify-between">
                        <span className="text-xs font-bold text-orange-100 uppercase tracking-wider mb-2 font-heading">Total Reservas</span>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-heading font-bold">{reservations.length}</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CURRENTLY HOSTED (NOVO CARD - PREMIUM) */}
            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/50 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 font-heading">
                    <div className="p-2.5 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm">
                        <User size={20} />
                    </div>
                    Hospedados Agora
                </h3>
                {stats.active.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-700/50">
                        <User size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-gray-400 text-sm font-medium">Nenhum hóspede na casa.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.active.map(res => (
                            <div key={res.id} className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900/40 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 hover:border-green-200 dark:hover:border-green-900/50 hover:shadow-md hover:shadow-green-500/5 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-lg shrink-0 shadow-sm font-heading">
                                    {res.guestName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors font-heading">{res.guestName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
                                        <Calendar size={12} />
                                        {((res.checkoutDate || '') >= new Date().toLocaleDateString('en-CA')) ? (
                                            <span className="text-green-600 dark:text-green-400">Até {(res.checkoutDate || '').split('-').reverse().slice(0, 2).join('/')}</span>
                                        ) : (
                                            <span>{(res.checkInDate || '').split('-').reverse().slice(0, 2).join('/')} - {(res.checkoutDate || '').split('-').reverse().slice(0, 2).join('/')}</span>
                                        )}
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
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 font-heading">
                        <LogIn size={20} className="text-blue-500" /> Chegando Hoje
                    </h3>
                    {stats.checkins.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">Nenhum check-in previsto para hoje.</div>
                    ) : (
                        <div className="space-y-3">
                            {stats.checkins.map(res => (
                                <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm font-heading">
                                            {res.guestName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white font-heading">{res.guestName}</p>
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
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 font-heading">
                        <LogOut size={20} className="text-red-500" /> Saindo Hoje
                    </h3>
                    {stats.checkouts.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">Nenhum check-out previsto para hoje.</div>
                    ) : (
                        <div className="space-y-3">
                            {stats.checkouts.map(res => (
                                <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm font-heading">
                                            {res.guestName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white font-heading">{res.guestName}</p>
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
