import React, { useMemo } from 'react';
import { Reservation } from '../../../types';
import { LogIn, LogOut, CheckCircle2, Sparkles } from 'lucide-react';

interface ActivityFeedWidgetProps {
    reservations: Reservation[];
    onSelectReservation: (res: Reservation) => void;
}

interface ActivityEvent {
    id: string;
    type: 'checkin' | 'checkout' | 'inspection' | 'booking';
    title: string;
    subtitle: string;
    timeLabel: string;
    reservation: Reservation;
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({
    reservations,
    onSelectReservation,
}) => {
    const events = useMemo<ActivityEvent[]>(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const list: ActivityEvent[] = [];

        reservations.forEach((r) => {
            // Check-in de hoje
            if (r.checkInDate === todayStr) {
                list.push({
                    id: `checkin-${r.id}`,
                    type: 'checkin',
                    title: `Check-in Hoje: ${r.guestName}`,
                    subtitle: `${(r.propertyId || 'lili') === 'lili' ? 'Flat da Lili' : `Flat ${r.flatNumber}`} • Entrando às ${r.checkInTime || '15:00'}`,
                    timeLabel: r.checkInTime || '15:00',
                    reservation: r,
                });
            }

            // Check-out de hoje
            if (r.checkoutDate === todayStr) {
                list.push({
                    id: `checkout-${r.id}`,
                    type: 'checkout',
                    title: `Check-out Hoje: ${r.guestName}`,
                    subtitle: `${(r.propertyId || 'lili') === 'lili' ? 'Flat da Lili' : `Flat ${r.flatNumber}`} • Saída às ${r.checkOutTime || '11:00'}`,
                    timeLabel: r.checkOutTime || '11:00',
                    reservation: r,
                });
            }

            // Vistoria concluída
            if (r.preCheckInInspection) {
                list.push({
                    id: `inspection-${r.id}`,
                    type: 'inspection',
                    title: `Vistoria Concluída: ${r.guestName}`,
                    subtitle: `Vistoriado por ${r.preCheckInInspection.inspectorName || 'Anfitrião'}`,
                    timeLabel: 'Realizada',
                    reservation: r,
                });
            }
        });

        // Ordena para mostrar até 5 mais relevantes
        return list.slice(0, 5);
    }, [reservations]);

    return (
        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm">
                            <Sparkles size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                                Feed de Atividades
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Timeline de movimentações em tempo real
                            </p>
                        </div>
                    </div>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-xs font-medium">
                        Nenhuma atividade recente registrada hoje.
                    </div>
                ) : (
                    <div className="space-y-4 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700/60">
                        {events.map((evt) => (
                            <div
                                key={evt.id}
                                onClick={() => onSelectReservation(evt.reservation)}
                                className="flex items-start gap-4 p-3 rounded-2xl bg-gray-50/70 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-800/60 transition-all cursor-pointer relative z-10 group"
                            >
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                        evt.type === 'checkin'
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                                            : evt.type === 'checkout'
                                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300'
                                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    }`}
                                >
                                    {evt.type === 'checkin' && <LogIn size={16} />}
                                    {evt.type === 'checkout' && <LogOut size={16} />}
                                    {evt.type === 'inspection' && <CheckCircle2 size={16} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {evt.title}
                                        </h4>
                                        <span className="text-[10px] font-mono text-gray-400 shrink-0">
                                            {evt.timeLabel}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 font-medium">
                                        {evt.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeedWidget;
