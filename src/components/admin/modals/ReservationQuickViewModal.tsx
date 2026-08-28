import React from 'react';
import {
    X,
    Calendar,
    Clock,
    MapPin,
    Users,
    Phone,
    Edit,
    Copy,
    Check,
    DollarSign,
} from 'lucide-react';
import { Reservation } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { formatDateDisplay } from '../../../utils/dateFormatting';

interface ReservationQuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: Reservation | null;
    onEdit: (reservation: Reservation) => void;
    onOpenPaymentModal?: (reservation: Reservation) => void;
}

const ReservationQuickViewModal: React.FC<ReservationQuickViewModalProps> = ({
    isOpen,
    onClose,
    reservation,
    onEdit,
    onOpenPaymentModal,
}) => {
    const [copied, setCopied] = React.useState(false);

    if (!isOpen || !reservation) return null;

    const property = PROPERTIES[reservation.propertyId || 'lili'];

    const handleCopyPhone = () => {
        if (reservation.guestPhone) {
            navigator.clipboard.writeText(reservation.guestPhone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-black/40 w-full max-w-md max-h-[88vh] flex flex-col overflow-hidden transform transition-all animate-slideUp border border-white/40 dark:border-gray-700">
                {/* Header (Executive Dark Backdrop) */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-gray-900 to-slate-900 text-white relative shrink-0 border-b border-white/10 overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-44 h-44 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-5 right-5 z-30 w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all backdrop-blur-md active:scale-95 border border-white/10 cursor-pointer touch-manipulation"
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-3.5 pr-8 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-orange-500/20 font-heading shrink-0 border border-amber-300/40">
                            {reservation.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-white truncate leading-snug tracking-tight">
                                {reservation.guestName}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30 font-heading">
                                    <MapPin size={12} className="shrink-0 text-orange-400" />
                                    {property.name}{' '}
                                    {reservation.flatNumber
                                        ? `• Flat ${reservation.flatNumber}`
                                        : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Details (Scrollable) */}
                <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar">
                    {/* Dates GRID */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/20 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50 shadow-2xs">
                            <p className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1 font-heading">
                                <Calendar
                                    size={13}
                                    className="text-emerald-600 dark:text-emerald-400"
                                />{' '}
                                Check-in
                            </p>
                            <p className="font-extrabold text-stone-900 dark:text-white text-base leading-tight font-heading">
                                {formatDateDisplay(reservation.checkInDate)}
                            </p>
                            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-extrabold bg-emerald-100/90 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-2">
                                <Clock size={11} /> {reservation.checkInTime}
                            </span>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50/90 to-amber-50/70 dark:from-orange-950/30 dark:to-amber-950/20 p-4 rounded-2xl border border-orange-200/80 dark:border-orange-800/50 shadow-2xs">
                            <p className="text-[11px] font-extrabold text-orange-800 dark:text-orange-300 uppercase tracking-wider mb-1 flex items-center gap-1 font-heading">
                                <Calendar
                                    size={13}
                                    className="text-orange-600 dark:text-orange-400"
                                />{' '}
                                Check-out
                            </p>
                            <p className="font-extrabold text-stone-900 dark:text-white text-base leading-tight font-heading">
                                {formatDateDisplay(
                                    reservation.checkoutDate || reservation.checkInDate
                                )}
                            </p>
                            <span className="text-xs text-orange-800 dark:text-orange-300 font-extrabold bg-orange-100/90 dark:bg-orange-900/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-2">
                                <Clock size={11} /> {reservation.checkOutTime}
                            </span>
                        </div>
                    </div>

                    {/* Guests Count */}
                    <div className="flex items-center justify-between p-3.5 bg-stone-50/90 dark:bg-gray-700/50 border border-stone-200/70 dark:border-gray-600 rounded-2xl shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shadow-xs shrink-0">
                                <Users size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-stone-500 dark:text-gray-400 font-extrabold uppercase tracking-wider font-heading">
                                    Hóspedes
                                </p>
                                <p className="font-extrabold text-stone-900 dark:text-white text-sm font-heading">
                                    {reservation.guestCount || 1} pessoa
                                    {(reservation.guestCount || 1) > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial & Payment Card */}
                    <div className="p-4 bg-stone-50/90 dark:bg-gray-700/50 rounded-2xl border border-stone-200/70 dark:border-gray-600 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] text-stone-500 dark:text-gray-400 font-extrabold uppercase tracking-wider mb-1.5 font-heading">
                                    Status do Pagamento
                                </p>
                                {reservation.paymentStatus === 'paid' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-2xs">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{' '}
                                        Pago (100%)
                                    </span>
                                )}
                                {reservation.paymentStatus === 'partial' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 shadow-2xs">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />{' '}
                                        Sinal Pago
                                    </span>
                                )}
                                {reservation.paymentStatus === 'external' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 shadow-2xs">
                                        Pagamento Externo
                                    </span>
                                )}
                                {(reservation.billingMode === 'corporate' ||
                                    reservation.paymentStatus === 'billed') && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 shadow-2xs">
                                        Corporativo / Faturado
                                    </span>
                                )}
                                {(reservation.paymentStatus === 'pending' ||
                                    !reservation.paymentStatus) &&
                                    reservation.billingMode !== 'corporate' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 shadow-2xs">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />{' '}
                                            Falta Pagar
                                        </span>
                                    )}
                            </div>
                            {reservation.paymentMethod &&
                                reservation.paymentStatus !== 'external' &&
                                reservation.paymentStatus !== 'billed' &&
                                reservation.billingMode !== 'corporate' && (
                                    <span className="text-[11px] font-extrabold text-stone-700 dark:text-stone-300 uppercase bg-stone-200 dark:bg-gray-600 px-3 py-1 rounded-lg font-heading shadow-2xs">
                                        {reservation.paymentMethod}
                                    </span>
                                )}
                        </div>

                        {/* DETALHAMENTO DE VALORES */}
                        {reservation.billingMode === 'corporate' ||
                        reservation.paymentStatus === 'billed' ? (
                            <p className="text-xs text-orange-700 dark:text-orange-300 font-medium pt-2 border-t border-stone-200/80 dark:border-gray-600/60">
                                Cobrança na fatura mensal da empresa (Empresas → Faturas).
                            </p>
                        ) : reservation.paymentStatus !== 'external' &&
                          reservation.totalAmount !== undefined ? (
                            <div className="pt-2.5 border-t border-stone-200/80 dark:border-gray-600/60 text-xs space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-stone-600 dark:text-stone-400 font-heading">
                                        Valor Total:
                                    </span>
                                    <span className="text-base font-extrabold font-heading text-stone-900 dark:text-white">
                                        R${' '}
                                        {reservation.totalAmount.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                {reservation.paymentStatus === 'partial' && (
                                    <>
                                        <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                                            <span>Sinal Pago:</span>
                                            <span>
                                                R${' '}
                                                {(reservation.depositAmount || 0).toLocaleString(
                                                    'pt-BR',
                                                    { minimumFractionDigits: 2 }
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-rose-700 dark:text-rose-400 font-extrabold">
                                            <span>Falta Pagar:</span>
                                            <span>
                                                R${' '}
                                                {Math.max(
                                                    0,
                                                    reservation.totalAmount -
                                                        (reservation.depositAmount || 0)
                                                ).toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </>
                                )}
                                {reservation.paidAt &&
                                    (reservation.paymentStatus === 'paid' ||
                                        reservation.paymentStatus === 'partial') &&
                                    (!reservation.payments || reservation.payments.length <= 1) && (
                                        <div className="flex justify-between items-center text-[11px] text-stone-500 dark:text-stone-400 font-medium pt-1 border-t border-stone-100 dark:border-gray-700/60">
                                            <span>
                                                {reservation.paymentStatus === 'paid'
                                                    ? 'Data do Pagamento:'
                                                    : 'Data do Sinal:'}
                                            </span>
                                            <span className="font-bold text-stone-700 dark:text-stone-300 font-mono">
                                                {formatDateDisplay(reservation.paidAt)}
                                            </span>
                                        </div>
                                    )}

                                {reservation.payments && reservation.payments.length > 0 && (
                                    <div className="pt-2 border-t border-stone-200/80 dark:border-gray-700/80 space-y-1.5">
                                        <span className="text-[11px] font-extrabold uppercase text-stone-500 dark:text-stone-400 font-heading">
                                            Histórico de Recebimentos ({reservation.payments.length}
                                            )
                                        </span>
                                        <div className="space-y-1">
                                            {reservation.payments.map((p, idx) => (
                                                <div
                                                    key={p.id || idx}
                                                    className="flex justify-between items-center text-[11px] p-1.5 bg-stone-100 dark:bg-gray-700/60 rounded-lg"
                                                >
                                                    <span className="font-mono text-stone-600 dark:text-stone-300">
                                                        {p.date ? formatDateDisplay(p.date) : ''} ·{' '}
                                                        <strong className="uppercase font-heading">
                                                            {p.method}
                                                        </strong>
                                                        {p.notes ? ` (${p.notes})` : ''}
                                                    </span>
                                                    <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                                                        + R${' '}
                                                        {p.amount.toLocaleString('pt-BR', {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </strong>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                        {reservation.paymentStatus === 'external' && (
                            <p className="pt-2 border-t border-stone-200/80 dark:border-gray-600/60 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Valor oculto — gerido fora do relatório financeiro.
                            </p>
                        )}
                    </div>

                    {/* Contact Info Card */}
                    {reservation.guestPhone && (
                        <div className="flex items-center justify-between p-3.5 bg-stone-50/90 dark:bg-gray-700/50 border border-stone-200/70 dark:border-gray-600 rounded-2xl shadow-2xs group">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold shadow-xs shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-stone-500 dark:text-gray-400 font-extrabold uppercase tracking-wider font-heading">
                                        Telefone de Contato
                                    </p>
                                    <p className="font-extrabold text-stone-900 dark:text-white text-sm font-heading truncate">
                                        {reservation.guestPhone}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCopyPhone}
                                    className="p-2 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all active:scale-95"
                                    title="Copiar Número"
                                >
                                    {copied ? (
                                        <Check size={18} className="text-emerald-500" />
                                    ) : (
                                        <Copy size={18} />
                                    )}
                                </button>
                                <a
                                    href={`https://wa.me/${reservation.guestPhone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-xl transition-all active:scale-95"
                                    title="Abrir WhatsApp"
                                >
                                    <Phone size={18} className="rotate-90" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-stone-100/80 dark:bg-gray-900/80 border-t border-stone-200/80 dark:border-gray-700 flex items-center justify-between gap-3 shrink-0">
                    {onOpenPaymentModal &&
                    reservation.paymentStatus !== 'paid' &&
                    reservation.paymentStatus !== 'external' &&
                    reservation.paymentStatus !== 'billed' &&
                    reservation.billingMode !== 'corporate' ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onOpenPaymentModal(reservation);
                            }}
                            className="flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer font-heading"
                        >
                            <DollarSign size={16} /> Dar Baixa
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onEdit(reservation);
                        }}
                        className="flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 touch-manipulation font-heading ml-auto"
                    >
                        <Edit size={16} />
                        Editar Reserva
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationQuickViewModal;
