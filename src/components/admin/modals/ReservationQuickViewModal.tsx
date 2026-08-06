import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Phone, Edit, Copy, Check, DollarSign } from 'lucide-react';
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
    onOpenPaymentModal
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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[88vh] flex flex-col overflow-hidden transform transition-all animate-slideUp">
                
                {/* Header (Property Themed) */}
                <div className={`p-5 sm:p-6 border-b border-white/10 ${property.id === 'lili' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-blue-800'} text-white relative shrink-0`}>
                    <button 
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md active:scale-95 touch-manipulation"
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                    
                    <div className="flex items-center gap-3 pr-8">
                         <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shadow-inner font-heading shrink-0">
                             {reservation.guestName.charAt(0)}
                         </div>
                         <div className="min-w-0">
                             <h2 className="text-lg sm:text-xl font-bold font-heading truncate">{reservation.guestName}</h2>
                             <div className="flex items-center gap-1.5 text-white/80 text-xs sm:text-sm font-medium truncate">
                                 <MapPin size={14} className="shrink-0" />
                                 {property.name} {reservation.flatNumber ? `- ${reservation.flatNumber}` : ''}
                             </div>
                         </div>
                    </div>
                </div>

                {/* Body Details (Scrollable) */}
                <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 no-scrollbar">
                    {/* Dates GRID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-600">
                             <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12}/> Check-in</p>
                             <p className="font-bold text-gray-900 dark:text-white leading-tight">
                                 {formatDateDisplay(reservation.checkInDate)}
                             </p>
                             <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1">
                                 <Clock size={10} /> {reservation.checkInTime}
                             </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-600">
                             <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12}/> Check-out</p>
                             <p className="font-bold text-gray-900 dark:text-white leading-tight">
                                 {formatDateDisplay(reservation.checkoutDate || reservation.checkInDate)}
                             </p>
                             <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 mt-1">
                                 <Clock size={10} /> {reservation.checkOutTime}
                             </p>
                        </div>
                    </div>

                    {/* Guests & Contact */}
                    <div className="space-y-3">
                         <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                                     <Users size={16} />
                                 </div>
                                 <div>
                                     <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Hóspedes</p>
                                     <p className="font-bold text-gray-900 dark:text-white text-sm">{reservation.guestCount || 1} pessoa{(reservation.guestCount || 1) > 1 ? 's' : ''}</p>
                                 </div>
                             </div>
                         </div>

                         {/* Status de Pagamento & Valores */}
                         <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 space-y-2">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Status do Pagamento</p>
                                     {reservation.paymentStatus === 'paid' && (
                                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/40 dark:text-green-300">
                                             🟢 Pago (100%)
                                         </span>
                                     )}
                                     {reservation.paymentStatus === 'partial' && (
                                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-300">
                                             🟡 Sinal Dado
                                         </span>
                                     )}
                                     {reservation.paymentStatus === 'external' && (
                                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800/60 dark:text-slate-300">
                                             Pagamento externo
                                         </span>
                                     )}
                                     {(reservation.paymentStatus === 'pending' || !reservation.paymentStatus) && (
                                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/40 dark:text-red-300">
                                             🔴 Falta Pagar
                                         </span>
                                     )}
                                 </div>
                                 {reservation.paymentMethod && reservation.paymentStatus !== 'external' && (
                                     <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase bg-gray-200 dark:bg-gray-600 px-2.5 py-1 rounded-lg">
                                         {reservation.paymentMethod}
                                     </span>
                                 )}
                             </div>

                             {/* DETALHAMENTO DE VALORES (TOTAL, SINAL E RESTANTE) */}
                             {reservation.paymentStatus !== 'external' && reservation.totalAmount !== undefined && (
                                 <div className="pt-2 border-t border-gray-200 dark:border-gray-600/60 text-xs space-y-1">
                                     <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300">
                                         <span>Valor Total:</span>
                                         <span>R$ {reservation.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                     </div>
                                     {reservation.paymentStatus === 'partial' && (
                                         <>
                                             <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                                                 <span>Sinal Pago:</span>
                                                 <span>R$ {(reservation.depositAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                             </div>
                                             <div className="flex justify-between text-amber-600 dark:text-amber-400 font-extrabold">
                                                 <span>Falta Pagar:</span>
                                                 <span>R$ {Math.max(0, reservation.totalAmount - (reservation.depositAmount || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                             </div>
                                         </>
                                     )}
                                 </div>
                             )}
                             {reservation.paymentStatus === 'external' && (
                                 <p className="pt-2 border-t border-gray-200 dark:border-gray-600/60 text-xs text-slate-500 dark:text-slate-400">
                                     Valor oculto — fora do relatório financeiro.
                                 </p>
                             )}
                         </div>

                         {reservation.guestPhone && (
                             <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl group">
                                 <div className="flex items-center gap-3">
                                     <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                         <Phone size={16} />
                                     </div>
                                     <div>
                                         <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Telefone</p>
                                         <p className="font-bold text-gray-900 dark:text-white text-sm">{reservation.guestPhone}</p>
                                     </div>
                                 </div>
                                 <button 
                                     onClick={handleCopyPhone}
                                     className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                     title="Copiar Número"
                                 >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                 </button>
                             </div>
                         )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 shrink-0">
                    {onOpenPaymentModal && reservation.paymentStatus !== 'paid' && reservation.paymentStatus !== 'external' ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onOpenPaymentModal(reservation);
                            }}
                            className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer font-heading"
                        >
                            <DollarSign size={16} /> Dar Baixa no Pagamento
                        </button>
                    ) : (
                        <div></div>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onEdit(reservation);
                        }}
                        className="flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md active:scale-95 touch-manipulation"
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
