import React from 'react';
import {
    CalendarDays,
    StickyNote,
    Pencil,
    Trash2,
    BellRing,
    LogOut,
    Link as LinkIcon,
    Share2,
} from 'lucide-react';
import { Reservation, PropertyId } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { Badge, Button } from '../../ui';

interface ReservationTableRowProps {
    reservation: Reservation;
    statusLabel?: string;
    isCheckinTomorrow: boolean;
    isCheckoutTomorrow: boolean;
    isSelected: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onCopyLink: () => void;
    onShareWhatsApp: () => void;
    onSendReminder: (type: 'checkin' | 'checkout') => void;
    onToggleSelection: () => void;
}

const ReservationTableRow: React.FC<ReservationTableRowProps> = ({
    reservation: res,
    statusLabel,
    isCheckinTomorrow,
    isCheckoutTomorrow,
    isSelected,
    onEdit,
    onDelete,
    onCopyLink,
    onShareWhatsApp,
    onSendReminder,
    onToggleSelection,
}) => {
    const property = PROPERTIES[(res.propertyId || 'lili') as PropertyId];

    return (
        <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
            <td className="py-4 px-4 align-top w-10">
                <div className="flex items-center h-full pt-1">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleSelection();
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </td>
            <td className="py-4 px-4 align-top">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {res.guestName}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {res.flatNumber ? `Flat ${res.flatNumber}` : 'Sem nº'}
                    </span>
                    {res.adminNotes && (
                        <span className="text-[10px] text-yellow-600 mt-1 flex items-center gap-1">
                            <StickyNote size={8} /> {res.adminNotes}
                        </span>
                    )}
                </div>
            </td>
            <td className="py-4 px-4 align-top">
                <div className="flex flex-col items-start gap-1">
                    <Badge variant={property.id === 'lili' ? 'orange' : 'blue'}>
                        {property.name}
                    </Badge>
                    {statusLabel && (
                        <Badge
                            variant={
                                statusLabel === 'Checkout Hoje'
                                    ? 'orange'
                                    : statusLabel === 'Hospedado'
                                      ? 'green'
                                      : res.status === 'pending'
                                        ? 'yellow'
                                        : 'gray'
                            }
                        >
                            {statusLabel}
                        </Badge>
                    )}
                </div>
            </td>
            <td className="py-4 px-4 align-top">
                <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5 mb-1">
                        <CalendarDays size={12} className="text-gray-400" />{' '}
                        {res.checkInDate?.split('-').reverse().join('/')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <LogOut size={12} className="text-gray-400" />{' '}
                        {res.checkoutDate?.split('-').reverse().join('/')}
                    </span>
                </div>
            </td>
            <td className="py-4 px-4 align-middle text-right">
                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {isCheckinTomorrow && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSendReminder('checkin');
                            }}
                            variant="icon"
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                            title="Lembrete Chegada"
                        >
                            <BellRing size={16} />
                        </Button>
                    )}
                    {isCheckoutTomorrow && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSendReminder('checkout');
                            }}
                            variant="icon"
                            className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                            title="Instruções Saída"
                        >
                            <LogOut size={16} />
                        </Button>
                    )}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShareWhatsApp();
                        }}
                        variant="icon"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="WhatsApp"
                    >
                        <Share2 size={16} />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCopyLink();
                        }}
                        variant="icon"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Copiar Link"
                    >
                        <LinkIcon size={16} />
                    </Button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        variant="icon"
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
                        title="Editar"
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        variant="icon"
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                        title="Excluir"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default ReservationTableRow;
