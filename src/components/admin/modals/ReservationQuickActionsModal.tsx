import React, { useState } from 'react';
import {
    X,
    ClipboardCheck,
    FileText,
    Sparkles,
    Shirt,
    MessageCircle,
    Send,
    Link as LinkIcon,
    BookOpen,
    DollarSign,
    Edit,
    Copy,
    Trash2,
    Check,
    AlertTriangle,
    Receipt,
} from 'lucide-react';
import { Reservation, PropertyId } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { formatDateBR } from '../../../utils/helpers';

interface ReservationQuickActionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: Reservation | null;
    onOpenInspection?: (res: Reservation) => void;
    onOpenCleaning?: (res: Reservation) => void;
    onOpenLaundry?: (res: Reservation) => void;
    onShareWhatsApp?: (res: Reservation) => void;
    onSendReminder?: (res: Reservation, type: 'checkin' | 'checkout') => void;
    onCopyLink?: (res: Reservation) => void;
    onOpenPaymentModal?: (res: Reservation) => void;
    onEdit?: (res: Reservation) => void;
    onDuplicate?: (res: Reservation) => void;
    onDelete?: (id: string) => void;
    listCopiedId?: string | null;
}

export const ReservationQuickActionsModal: React.FC<ReservationQuickActionsModalProps> = ({
    isOpen,
    onClose,
    reservation,
    onOpenInspection,
    onOpenCleaning,
    onOpenLaundry,
    onShareWhatsApp,
    onSendReminder,
    onCopyLink,
    onOpenPaymentModal,
    onEdit,
    onDuplicate,
    onDelete,
    listCopiedId,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !reservation) return null;

    const property =
        PROPERTIES[(reservation.propertyId as PropertyId) || 'lili'] || PROPERTIES['integracao'];
    const flatLabel =
        (reservation.propertyId || 'lili') === 'lili'
            ? 'Flat de Lili'
            : reservation.flatNumber
              ? `Flat ${reservation.flatNumber}`
              : 'Flat';

    // Inspection Statuses
    const hasPreInspection = Boolean(reservation.preCheckInInspection);
    const hasPostInspection = Boolean(reservation.postCheckOutInspection);

    // Cleanings Count & Total
    const cleaningsCount = reservation.cleanings?.length || 0;
    const cleaningsTotal = (reservation.cleanings || []).reduce(
        (sum, item) => sum + (item.cost || 0),
        0
    );

    // Laundries Count, Cycles & Total
    const laundriesCount = reservation.laundries?.length || 0;
    const laundriesTotal = (reservation.laundries || []).reduce(
        (sum, item) => sum + (item.cost || 0),
        0
    );
    const laundriesCycles = (reservation.laundries || []).reduce(
        (sum, item) => sum + (item.cyclesCount || 1),
        0
    );

    // Financial Metrics
    const totalAmount = reservation.totalAmount || 0;
    const depositAmount = reservation.depositAmount || 0;
    const isPaid = reservation.paymentStatus === 'paid';
    const isExternal = reservation.paymentStatus === 'external';

    const percentPaid = isPaid
        ? 100
        : totalAmount > 0
          ? Math.min(100, Math.round((depositAmount / totalAmount) * 100))
          : 0;

    const isCopied = listCopiedId === reservation.id;

    const handleOpenGuestGuide = () => {
        const baseUrl = window.location.origin + '/';
        const link = reservation.shortId
            ? `${baseUrl}${reservation.shortId}`
            : reservation.id
              ? `${baseUrl}?rid=${reservation.id}`
              : baseUrl;
        window.open(link, '_blank');
    };

    const handleDelete = () => {
        if (!reservation.id || !onDelete) return;
        onDelete(reservation.id);
        setIsDeleting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 z-10 animate-slideUp my-auto">
                {/* MODAL HEADER */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-gray-900 to-stone-950 text-white flex items-center justify-between gap-4 border-b border-stone-800 shrink-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-extrabold text-xl font-heading shadow-md shrink-0">
                            {reservation.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base sm:text-lg font-extrabold text-white truncate font-heading">
                                    Ações rápidas — {reservation.guestName}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-heading">
                                    {flatLabel}
                                </span>
                            </div>
                            <p className="text-xs text-stone-400 font-medium truncate mt-0.5">
                                {property.name}{' '}
                                {reservation.shortId ? `• #${reservation.shortId}` : ''}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-2xl transition-all shrink-0 cursor-pointer"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* MODAL BODY (CATEGORIZED ACTION CARDS) */}
                <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                    {/* 1. VISTORIA */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white font-heading flex items-center gap-2">
                                    <ClipboardCheck size={16} className="text-purple-500" />
                                    Vistoria
                                </h3>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Controle de entrada, saída e pendências do imóvel
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-extrabold font-heading">
                                <span
                                    className={`px-2 py-0.5 rounded-full ${hasPreInspection ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'}`}
                                >
                                    Pré: {hasPreInspection ? 'Salva' : 'Pendente'}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-full ${hasPostInspection ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                >
                                    Pós: {hasPostInspection ? 'Salva' : 'Pendente'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenInspection?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm font-heading cursor-pointer"
                            >
                                <ClipboardCheck size={15} /> Iniciar Vistoria
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenInspection?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 font-heading cursor-pointer"
                            >
                                <FileText size={15} className="text-purple-500" /> Ver Histórico /
                                Laudo
                            </button>
                        </div>
                    </div>

                    {/* 2. LIMPEZA E MANUTENÇÃO */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white font-heading flex items-center gap-2">
                                    <Sparkles size={16} className="text-amber-500" />
                                    Limpeza e Manutenção
                                </h3>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Custos adicionais de limpeza e acompanhamento de serviços
                                </p>
                            </div>
                            {cleaningsCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-heading">
                                    {cleaningsCount} limpeza(s) · R${' '}
                                    {cleaningsTotal.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenCleaning?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-amber-900 bg-amber-200 hover:bg-amber-300 dark:bg-amber-500 dark:text-white dark:hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-sm font-heading cursor-pointer"
                            >
                                <Sparkles size={15} /> Adicionar Limpeza
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenCleaning?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 font-heading cursor-pointer"
                            >
                                <FileText size={15} className="text-amber-500" /> Ver Limpezas /
                                Relatório
                            </button>
                        </div>
                    </div>

                    {/* 3. LAVAGEM DE ROUPA (LAVANDERIA) */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white font-heading flex items-center gap-2">
                                    <Shirt size={16} className="text-blue-500" />
                                    Lavagem de Roupa
                                </h3>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Ciclos de lavagem e secagem (R$ 15/ciclo)
                                </p>
                            </div>
                            {laundriesCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-heading">
                                    {laundriesCycles} ciclo(s) · R${' '}
                                    {laundriesTotal.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenLaundry?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-blue-900 bg-blue-200 hover:bg-blue-300 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm font-heading cursor-pointer"
                            >
                                <Shirt size={15} /> Adicionar Lavagem
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenLaundry?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 font-heading cursor-pointer"
                            >
                                <FileText size={15} className="text-blue-500" /> Ver Lavanderia /
                                Relatório
                            </button>
                        </div>
                    </div>

                    {/* 4 & 5. COMUNICAÇÃO & LINKS ÚTEIS (2-COL GRID) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* COMUNICAÇÃO */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white font-heading flex items-center gap-2">
                                    <MessageCircle size={16} className="text-emerald-500" />
                                    Comunicação
                                </h3>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Fale com o hóspede ou envie lembrete
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => onShareWhatsApp?.(reservation)}
                                    className="px-3 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm font-heading cursor-pointer"
                                >
                                    <MessageCircle size={14} /> WhatsApp
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSendReminder?.(reservation, 'checkin')}
                                    className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-1.5 font-heading cursor-pointer"
                                >
                                    <Send size={14} className="text-emerald-500" /> Lembrete
                                </button>
                            </div>
                        </div>

                        {/* LINKS ÚTEIS */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white font-heading flex items-center gap-2">
                                    <LinkIcon size={16} className="text-blue-500" />
                                    Links Úteis
                                </h3>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Acesse ou compartilhe o guia
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => onCopyLink?.(reservation)}
                                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 font-heading cursor-pointer ${
                                        isCopied
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100'
                                    }`}
                                >
                                    {isCopied ? <Check size={14} /> : <LinkIcon size={14} />}
                                    {isCopied ? 'Copiado!' : 'Link Reserva'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOpenGuestGuide}
                                    className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-1.5 font-heading cursor-pointer"
                                >
                                    <BookOpen size={14} className="text-blue-500" /> Guia
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 5. FINANCEIRO */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white font-heading flex items-center gap-2">
                                    <DollarSign size={16} className="text-emerald-500" />
                                    Financeiro
                                </h3>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Visualize pagamentos e registre recebimentos
                                </p>
                            </div>
                            <span className="text-sm font-extrabold font-mono text-gray-900 dark:text-white">
                                Total: R${' '}
                                {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-extrabold text-emerald-900 dark:text-emerald-300 font-heading">
                                <span>
                                    {isPaid
                                        ? `Pago Integral${reservation.paidAt ? ` · ${formatDateBR(reservation.paidAt)}` : ''}`
                                        : isExternal
                                          ? 'Pagamento Externo'
                                          : depositAmount > 0
                                            ? `Sinal pago: R$ ${depositAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}${reservation.paidAt ? ` · ${formatDateBR(reservation.paidAt)}` : ''}`
                                            : 'Aguardando Pagamento'}
                                </span>
                                <span className="font-mono">{percentPaid}%</span>
                            </div>
                            <div className="w-full bg-emerald-200/60 dark:bg-emerald-950 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${percentPaid}%` }}
                                />
                            </div>
                        </div>

                        {/* Extrato / Histórico Detalhado de Recebimentos */}
                        {(() => {
                            const paymentHistory =
                                reservation.payments && reservation.payments.length > 0
                                    ? reservation.payments
                                    : depositAmount > 0
                                      ? [
                                            {
                                                id: 'legacy_initial',
                                                date:
                                                    reservation.paidAt ||
                                                    reservation.checkInDate ||
                                                    '',
                                                amount: depositAmount,
                                                method: reservation.paymentMethod || 'pix',
                                                type: isPaid ? 'full' : 'deposit',
                                                notes: isPaid ? 'Quitação' : 'Sinal',
                                                createdAt: reservation.createdAt,
                                            },
                                        ]
                                      : [];

                            if (paymentHistory.length === 0) return null;

                            return (
                                <div className="p-3 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200/80 dark:border-gray-700/80 space-y-2">
                                    <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-heading">
                                        <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                            <Receipt size={13} className="text-emerald-500" />
                                            Extrato de Recebimentos ({paymentHistory.length})
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold">
                                            Total: R${' '}
                                            {depositAmount.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
                                        {paymentHistory.map((p, idx) => (
                                            <div
                                                key={p.id || idx}
                                                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-gray-700 dark:text-gray-300 text-[11px] font-bold">
                                                        {p.date ? formatDateBR(p.date) : 'Data n/d'}
                                                    </span>
                                                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-heading">
                                                        {p.method?.toUpperCase() || 'PIX'}
                                                    </span>
                                                    {p.notes && (
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-400 truncate max-w-[110px]">
                                                            {p.notes}
                                                        </span>
                                                    )}
                                                </div>
                                                <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                                                    + R${' '}
                                                    {p.amount.toLocaleString('pt-BR', {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenPaymentModal?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm font-heading cursor-pointer"
                            >
                                <DollarSign size={15} /> Registrar Pagamento
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenPaymentModal?.(reservation);
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 font-heading cursor-pointer"
                            >
                                <DollarSign size={15} className="text-emerald-500" /> Ver Financeiro
                            </button>
                        </div>
                    </div>

                    {/* 6. OUTRAS AÇÕES */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3">
                        <div>
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white font-heading">
                                Outras Ações
                            </h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Edição, duplicação e exclusão da reserva
                            </p>
                        </div>

                        {isDeleting ? (
                            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between gap-3 animate-fadeIn flex-wrap">
                                <div className="flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-300">
                                    <AlertTriangle size={16} className="text-red-500 shrink-0" />
                                    <span>
                                        Excluir permanentemente a reserva de {reservation.guestName}
                                        ?
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleting(false)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 shadow-sm"
                                    >
                                        Sim, Excluir
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onEdit?.(reservation);
                                    }}
                                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-1.5 font-heading cursor-pointer"
                                >
                                    <Edit size={14} /> Editar Reserva
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onDuplicate?.(reservation);
                                    }}
                                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-1.5 font-heading cursor-pointer"
                                >
                                    <Copy size={14} /> Duplicar Reserva
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDeleting(true)}
                                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-950/60 transition-all flex items-center justify-center gap-1.5 font-heading cursor-pointer"
                                >
                                    <Trash2 size={14} /> Excluir Reserva
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationQuickActionsModal;
