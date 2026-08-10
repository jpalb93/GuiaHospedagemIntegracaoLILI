import React, { useMemo } from 'react';
import { Reservation } from '../../../types';
import { Building2, User, Calendar, LogIn, LogOut, CheckCircle2, MinusCircle } from 'lucide-react';
import { getTodayDateStr } from '../../../utils/dateFormatting';

interface FlatOccupancyGridProps {
    reservations: Reservation[];
    onSelectReservation: (res: Reservation) => void;
}

interface FlatStatusItem {
    flatId: string;
    flatName: string;
    propertyId: string;
    status: 'occupied' | 'checkin_today' | 'checkout_today' | 'available';
    reservation?: Reservation;
}

const INTEGRACAO_UNITS = ['201', '202', '301', '302', '303', '304', '401', '402', '403', '404'];

export const FlatOccupancyGrid: React.FC<FlatOccupancyGridProps> = ({
    reservations,
    onSelectReservation,
}) => {
    const flatStatuses = useMemo<FlatStatusItem[]>(() => {
        const todayStr = getTodayDateStr();

        // Flat da Lili
        const liliRes = reservations.find((r) => {
            const prop = r.propertyId || 'lili';
            if (prop !== 'lili') return false;
            const checkIn = r.checkInDate || '';
            const checkOut = r.checkoutDate || '';
            return (
                (checkIn <= todayStr && checkOut >= todayStr) ||
                checkIn === todayStr ||
                checkOut === todayStr
            );
        });

        let liliStatus: FlatStatusItem['status'] = 'available';
        if (liliRes) {
            if (liliRes.checkInDate === todayStr) liliStatus = 'checkin_today';
            else if (liliRes.checkoutDate === todayStr) liliStatus = 'checkout_today';
            else liliStatus = 'occupied';
        }

        const items: FlatStatusItem[] = [
            {
                flatId: 'lili',
                flatName: 'Flat da Lili',
                propertyId: 'lili',
                status: liliStatus,
                reservation: liliRes,
            },
        ];

        // Flats Integração
        for (const unit of INTEGRACAO_UNITS) {
            const unitRes = reservations.find((r) => {
                const prop = r.propertyId || 'lili';
                if (prop !== 'integracao') return false;
                if ((r.flatNumber || '') !== unit) return false;
                const checkIn = r.checkInDate || '';
                const checkOut = r.checkoutDate || '';
                return (
                    (checkIn <= todayStr && checkOut >= todayStr) ||
                    checkIn === todayStr ||
                    checkOut === todayStr
                );
            });

            let unitStatus: FlatStatusItem['status'] = 'available';
            if (unitRes) {
                if (unitRes.checkInDate === todayStr) unitStatus = 'checkin_today';
                else if (unitRes.checkoutDate === todayStr) unitStatus = 'checkout_today';
                else unitStatus = 'occupied';
            }

            items.push({
                flatId: `integracao-${unit}`,
                flatName: `Flat ${unit}`,
                propertyId: 'integracao',
                status: unitStatus,
                reservation: unitRes,
            });
        }

        return items;
    }, [reservations]);

    return (
        <div
            id="mapa-ocupacao"
            className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm">
                        <Building2 size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                            Mapa de Ocupação dos Flats
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Status em tempo real de cada unidade
                        </p>
                    </div>
                </div>

                {/* LEGENDA DE STATUS COM CANAL DUPLO VISUAL (WCAG 1.4.1 - COR + ÍCONE) */}
                <div className="flex items-center gap-2.5 flex-wrap text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                        <CheckCircle2
                            size={13}
                            className="text-emerald-600 dark:text-emerald-400"
                        />
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ocupado
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-700 shadow-xs">
                        <LogIn size={13} className="text-blue-600 dark:text-blue-400" />
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>{' '}
                        Entrando Hoje
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs">
                        <LogOut size={13} className="text-amber-600 dark:text-amber-400" />
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                        </span>{' '}
                        Saindo Hoje
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                        <MinusCircle size={13} className="text-gray-400" />
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> Livre
                    </span>
                </div>
            </div>

            {/* GRID DE FLATS (COM SCROLL HORIZONTAL EM TABLET PORTRAIT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 tablet-portrait-scroll-x">
                {flatStatuses.map((flat) => {
                    const isClickable = !!flat.reservation;

                    return (
                        <div
                            key={flat.flatId}
                            onClick={() => {
                                if (flat.reservation) onSelectReservation(flat.reservation);
                            }}
                            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[110px] ${
                                isClickable
                                    ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 touch-manipulation'
                                    : 'opacity-90'
                            } ${
                                flat.status === 'occupied'
                                    ? 'bg-gradient-to-br from-emerald-50 to-green-100/70 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
                                    : flat.status === 'checkin_today'
                                      ? 'bg-gradient-to-br from-blue-50 via-blue-100/80 to-indigo-100 dark:from-blue-950/50 dark:to-blue-900/40 border-blue-400 dark:border-blue-500 text-blue-950 dark:text-blue-100 ring-2 ring-blue-400/40 shadow-lg shadow-blue-500/20 animate-pulse'
                                      : flat.status === 'checkout_today'
                                        ? 'bg-gradient-to-br from-amber-50 via-amber-100/80 to-yellow-100 dark:from-amber-950/50 dark:to-amber-900/40 border-amber-400 dark:border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 animate-pulse'
                                        : 'bg-gray-50/70 dark:bg-gray-800/30 border-gray-200/80 dark:border-gray-700/60 text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-1">
                                <span className="font-extrabold text-xs sm:text-sm font-heading tracking-wide">
                                    {flat.flatName}
                                </span>

                                {/* ÍCONE + DOT CANAL DUPLO VISUAL (WCAG 1.4.1) */}
                                <div className="flex items-center gap-1">
                                    {flat.status === 'occupied' && (
                                        <>
                                            <CheckCircle2
                                                size={14}
                                                className="text-emerald-600 dark:text-emerald-400 shrink-0"
                                            />
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                                        </>
                                    )}
                                    {flat.status === 'checkin_today' && (
                                        <>
                                            <LogIn
                                                size={14}
                                                className="text-blue-600 dark:text-blue-400 shrink-0"
                                            />
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                                            </span>
                                        </>
                                    )}
                                    {flat.status === 'checkout_today' && (
                                        <>
                                            <LogOut
                                                size={14}
                                                className="text-amber-600 dark:text-amber-400 shrink-0"
                                            />
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                                            </span>
                                        </>
                                    )}
                                    {flat.status === 'available' && (
                                        <>
                                            <MinusCircle
                                                size={14}
                                                className="text-gray-400 shrink-0"
                                            />
                                            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2">
                                {flat.reservation ? (
                                    <div>
                                        <p className="font-bold text-xs truncate flex items-center gap-1 font-heading">
                                            <User size={12} className="shrink-0 opacity-70" />
                                            <span className="truncate">
                                                {flat.reservation.guestName}
                                            </span>
                                        </p>
                                        <p className="text-[10px] opacity-80 mt-0.5 font-medium flex items-center gap-1">
                                            <Calendar size={10} className="shrink-0" />
                                            <span>
                                                Até{' '}
                                                {(flat.reservation.checkoutDate || '')
                                                    .split('-')
                                                    .reverse()
                                                    .slice(0, 2)
                                                    .join('/')}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Livre
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FlatOccupancyGrid;
