import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Phone, Edit, Copy, Check } from 'lucide-react';
import { Reservation } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { formatDateDisplay } from '../../../utils/dateFormatting';

interface ReservationQuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: Reservation | null;
    onEdit: (reservation: Reservation) => void;
}

const ReservationQuickViewModal: React.FC<ReservationQuickViewModalProps> = ({
    isOpen,
    onClose,
    reservation,
    onEdit
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
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideUp">
                
                {/* Header (Property Themed) */}
                <div className={`p-6 border-b border-white/10 ${property.id === 'lili' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-blue-800'} text-white relative`}>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md"
                        aria-label="Fechar"
                    >
                        <X size={16} />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shadow-inner font-heading">
                             {reservation.guestName.charAt(0)}
                         </div>
                         <div>
                             <h2 className="text-xl font-bold font-heading">{reservation.guestName}</h2>
                             <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium">
                                 <MapPin size={14} />
                                 {property.name} {reservation.flatNumber ? `- ${reservation.flatNumber}` : ''}
                             </div>
                         </div>
                    </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-6">
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
                <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(reservation);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md"
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
