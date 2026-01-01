import React from 'react';
import {
    CalendarDays,
    History,
    KeyRound,
    StickyNote,
    MessageSquare,
    Pencil,
    Trash2,
    BellRing,
    LogOut,
    ClipboardCheck,
    Check,
    Link as LinkIcon,
    Share2,
} from 'lucide-react';
import { Reservation, PropertyId } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { Badge, Button } from '../../ui';

interface ReservationCardProps {
    reservation: Reservation;
    statusColor: string;
    statusLabel?: string;
    isCheckinTomorrow: boolean;
    isCheckoutTomorrow: boolean;
    isIntegracao: boolean;
    isSelected: boolean;
    isCopied: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onCopyLink: () => void;
    onShareWhatsApp: () => void;
    onSendReminder: (type: 'checkin' | 'checkout') => void;
    onOpenInspection: () => void;
    onToggleSelection: () => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation: res,
    statusColor,
    statusLabel,
    isCheckinTomorrow,
    isCheckoutTomorrow,
    isIntegracao,
    isSelected,
    isCopied,
    onEdit,
    onDelete,
    onCopyLink,
    onShareWhatsApp,
    onSendReminder,
    onOpenInspection,
    onToggleSelection,
}) => {
    const property = PROPERTIES[(res.propertyId || 'lili') as PropertyId];

    return (
        <div
            className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-l-4 ${statusColor} flex flex-col gap-4 mb-4`}
        >
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="pt-1">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={isSelected}
                            onChange={(e) => {
                                e.stopPropagation();
                                onToggleSelection();
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                            {res.guestName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {res.status === 'pending' && (
                                <Badge variant="yellow">Pré-Reserva</Badge>
                            )}
                            {statusLabel && (
                                <Badge
                                    variant={
                                        statusLabel === 'Checkout Hoje'
                                            ? 'orange'
                                            : statusLabel === 'Hospedado'
                                              ? 'green'
                                              : 'gray'
                                    }
                                >
                                    {statusLabel}
                                </Badge>
                            )}
                            <Badge variant={property.id === 'lili' ? 'orange' : 'blue'}>
                                {property.name}
                            </Badge>
                        </div>
                        <div className="flex flex-col mt-3 gap-1.5">
                            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                <CalendarDays size={14} className="text-gray-400" /> In:{' '}
                                {res.checkInDate?.split('-').reverse().join('/')}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                <History size={14} className="text-gray-400" /> Out:{' '}
                                {res.checkoutDate?.split('-').reverse().join('/')}
                            </span>
                            {res.flatNumber && (
                                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                    <KeyRound size={14} className="text-gray-400" /> Flat:{' '}
                                    {res.flatNumber}
                                </span>
                            )}
                        </div>
                        {res.adminNotes && (
                            <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium border border-yellow-100 dark:border-yellow-900/30">
                                <StickyNote size={12} /> Nota: {res.adminNotes}
                            </div>
                        )}
                        {res.guestAlertActive && (
                            <div className="mt-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs px-2 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium border border-blue-100 dark:border-blue-900/30">
                                <MessageSquare size={12} /> Recado Ativo
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        variant="icon"
                        className="p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-blue-500 rounded-xl transition-colors shadow-sm"
                        title="Editar"
                    >
                        <Pencil size={18} />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        variant="icon"
                        className="p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-xl transition-colors shadow-sm"
                        title="Excluir"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                {isCheckinTomorrow && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSendReminder('checkin');
                        }}
                        fullWidth
                        leftIcon={<BellRing size={16} />}
                        className="col-span-2 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-pulse"
                    >
                        Lembrete Chegada
                    </Button>
                )}
                {isCheckoutTomorrow && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSendReminder('checkout');
                        }}
                        fullWidth
                        leftIcon={<LogOut size={16} />}
                        className="col-span-2 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                    >
                        Instr. Saída
                    </Button>
                )}
                {isIntegracao && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenInspection();
                        }}
                        fullWidth
                        leftIcon={<ClipboardCheck size={16} />}
                        className="col-span-2 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                    >
                        Vistoria
                    </Button>
                )}

                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCopyLink();
                    }}
                    leftIcon={isCopied ? <Check size={14} /> : <LinkIcon size={14} />}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border ${isCopied ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'}`}
                >
                    {isCopied ? 'Copiado' : 'Link'}
                </Button>
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onShareWhatsApp();
                    }}
                    leftIcon={<Share2 size={14} />}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                >
                    WhatsApp
                </Button>
            </div>
        </div>
    );
};

export default ReservationCard;
