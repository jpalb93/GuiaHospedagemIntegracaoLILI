import React from 'react';
import {
    User,
    Phone,
    Lock,
    CalendarDays,
    Clock,
    MessageSquare,
    StickyNote,
    Save,
    Sparkles,
    Loader2,
    X,
    Eraser,
    CheckCircle2,
    AlertCircle,
    Copy,
    Send,
    Building2,
    KeyRound,
    CreditCard,
    Banknote,
    Star,
    AlertTriangle,
    Flag,
    FolderOpen,
    PlusSquare,
    Trash2,
} from 'lucide-react';
import Button from '../ui/Button';
import { PROPERTIES } from '../../config/properties';
import { PropertyId, UserPermission, PaymentMethod, Reservation, ReservationTemplate } from '../../types';

interface ReservationFormProps {
    form: {
        guestName: string;
        setGuestName: (v: string | ((prev: string) => string)) => void;
        guestPhone: string;
        setGuestPhone: (v: string) => void;
        lockCode: string;
        setLockCode: (v: string) => void;
        propertyId: PropertyId;
        setPropertyId: (v: PropertyId) => void;
        flatNumber: string;
        setFlatNumber: (v: string) => void;
        welcomeMessage: string;
        setWelcomeMessage: (v: string | ((prev: string) => string)) => void;
        adminNotes: string;
        setAdminNotes: (v: string | ((prev: string) => string)) => void;
        guestAlertActive: boolean;
        setGuestAlertActive: (v: boolean) => void;
        guestAlertText: string;
        setGuestAlertText: (v: string) => void;
        checkInDate: string;
        setCheckInDate: (v: string) => void;
        checkoutDate: string;
        setCheckoutDate: (v: string) => void;
        checkInTime: string;
        setCheckInTime: (v: string) => void;
        checkOutTime: string;
        setCheckOutTime: (v: string) => void;
        guestCount: number;
        setGuestCount: (v: number) => void;
        paymentMethod: PaymentMethod | '';
        setPaymentMethod: (v: PaymentMethod | '') => void;
        guestRating: number;
        setGuestRating: (v: number) => void;
        guestFeedback: string;
        setGuestFeedback: (v: string) => void;
        editingId: string | null;
        handleSaveReservation: () => void;
        resetForm: () => void;
        isSaving: boolean;
    };
    ui: {
        generatedLink: string | null;
        apiKeyStatus: string;
        showToast: (msg: string, type: 'success' | 'error') => void;
    };
    userPermission?: UserPermission | null;
    previousGuests?: Reservation[];
    templates?: ReservationTemplate[];
    onSaveTemplate?: (template: ReservationTemplate) => void;
    onDeleteTemplate?: (id: string) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
    form,
    ui,
    userPermission,
    previousGuests = [],
    templates = [],
    onSaveTemplate,
    onDeleteTemplate,
}) => {
    const {
        guestName,
        setGuestName,
        guestPhone,
        setGuestPhone,
        lockCode,
        setLockCode,
        propertyId,
        setPropertyId,
        flatNumber,
        setFlatNumber,
        welcomeMessage,
        setWelcomeMessage,
        adminNotes,
        setAdminNotes,
        guestAlertActive,
        setGuestAlertActive,
        guestAlertText,
        setGuestAlertText,
        checkInDate,
        setCheckInDate,
        checkoutDate,
        setCheckoutDate,
        checkInTime,
        setCheckInTime,
        checkOutTime,
        setCheckOutTime,
        guestCount,
        setGuestCount,
        paymentMethod,
        setPaymentMethod,
        guestRating,
        setGuestRating,
        guestFeedback,
        setGuestFeedback,
        editingId,
        handleSaveReservation,
        resetForm,
        isSaving,
    } = form;

    const { generatedLink, apiKeyStatus, showToast } = ui;

    const showPropertySelector =
        !userPermission ||
        userPermission.role === 'super_admin' ||
        userPermission.allowedProperties.length > 1;

    const [showSuggestions, setShowSuggestions] = React.useState(false);

    // --- TEMPLATE LOGIC ---
    const handleApplyTemplate = (template: ReservationTemplate) => {
        if (template.guestName) setGuestName(template.guestName);
        if (template.guestPhone) setGuestPhone(template.guestPhone);
        if (template.propertyId) setPropertyId(template.propertyId);
        if (template.flatNumber) setFlatNumber(template.flatNumber);
        if (template.welcomeMessage) setWelcomeMessage(template.welcomeMessage);
        if (template.adminNotes) setAdminNotes(template.adminNotes);
        showToast(`Modelo '${template.name}' aplicado!`, 'success');
    };

    const handleCreateTemplate = () => {
        const name = window.prompt('Nome do novo modelo (Ex: Empresa X):');
        if (!name) return;

        const newTemplate: ReservationTemplate = {
            id: Date.now().toString(),
            name,
            guestName: guestName || undefined,
            guestPhone: guestPhone || undefined,
            propertyId: propertyId || undefined,
            flatNumber: flatNumber || undefined,
            welcomeMessage: welcomeMessage || undefined,
            adminNotes: adminNotes || undefined,
        };

        if (onSaveTemplate) onSaveTemplate(newTemplate);
    };

    // CRM Enhanced functionality
    interface GuestHistoryItem {
        reservation: Reservation;
        visitCount: number;
        lastVisit: string;
        averageRating: number;
    }
    const [filteredGuests, setFilteredGuests] = React.useState<GuestHistoryItem[]>([]);

    const handleGuestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGuestName(value);

        if (value.length > 2) {
            // NORMALIZAÇÃO PARA BUSCA
            const term = value.toLowerCase();

            // 1. Agrupar visitas por Nome + Telefone (chave única aproximada)
            const guestMap = new Map<string, { item: GuestHistoryItem; totalRating: number; ratingCount: number }>();

            previousGuests.forEach((g) => {
                // Remove espaços extras e normaliza
                const name = g.guestName.trim();
                const phone = g.guestPhone ? g.guestPhone.replace(/\D/g, '') : 'nophone';

                // Chave composta para identificar unicamente (ou tentar)
                const uniqueKey = `${name.toLowerCase()}_${phone}`;

                if (name.toLowerCase().includes(term)) {
                    let entry = guestMap.get(uniqueKey);

                    if (!entry) {
                        entry = {
                            item: {
                                reservation: g,
                                visitCount: 0,
                                lastVisit: '',
                                averageRating: 0 // Will calculate at the end
                            },
                            totalRating: 0,
                            ratingCount: 0
                        };
                        guestMap.set(uniqueKey, entry);
                    }

                    // Increment stats
                    entry.item.visitCount += 1;

                    // Update Last Visit
                    if (g.checkoutDate && (!entry.item.lastVisit || g.checkoutDate > entry.item.lastVisit)) {
                        entry.item.lastVisit = g.checkoutDate;
                    }

                    // Accumulate Rating (if present)
                    if (g.guestRating) {
                        entry.totalRating += g.guestRating;
                        entry.ratingCount += 1;
                    }
                }
            });

            // 2. Converter para array e calcular médias finais
            const results: GuestHistoryItem[] = Array.from(guestMap.values())
                .map(entry => {
                    // Calculate Average Rating (Default to 5 if no ratings yet)
                    const avg = entry.ratingCount > 0
                        ? entry.totalRating / entry.ratingCount
                        : 5;

                    return {
                        ...entry.item,
                        averageRating: avg
                    };
                })
                .sort((a, b) => b.visitCount - a.visitCount)
                .slice(0, 5);

            setFilteredGuests(results);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectGuest = (item: GuestHistoryItem) => {
        const { reservation } = item;
        setGuestName(reservation.guestName);
        if (reservation.guestPhone) setGuestPhone(reservation.guestPhone);

        // Opcional: Auto-copiar notas administrativas anteriores se útil
        // if (reservation.adminNotes && !adminNotes) setAdminNotes(reservation.adminNotes);

        setShowSuggestions(false);
    };

    const handleNumericInput =
        (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value.replace(/\D/g, ''));
        };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,2})/, '($1');
        }

        setGuestPhone(value);
    };

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            showToast('Link copiado!', 'success');
        }
    };

    const shareOnWhatsApp = () => {
        if (!generatedLink) return;
        const formattedName = guestName.trim();
        const message = `Olá, ${formattedName}!\n\nPreparei um Guia Digital exclusivo para sua estadia no Flat.\n\nAqui você encontra a senha da porta, wi-fi e dicas de Petrolina:\n${generatedLink}`;
        const whatsappUrl = guestPhone
            ? `https://wa.me/${guestPhone}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="p-8 space-y-6 relative">
            <button
                onClick={resetForm}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
                title="Limpar/Cancelar"
            >
                {editingId ? <X size={18} className="text-red-500" /> : <Eraser size={18} />}
            </button>

            {editingId ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                    <Sparkles size={14} /> Você está editando a reserva de{' '}
                    <strong>{guestName}</strong>.
                </div>
            ) : (
                <div className="flex gap-2">
                    <div
                        className={`p-3 flex-1 rounded-2xl border flex items-center gap-3 text-xs ${apiKeyStatus === 'ok' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700'}`}
                    >
                        {apiKeyStatus === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span className="font-bold">
                            {apiKeyStatus === 'ok' ? 'IA Concierge Ativa' : 'IA Inativa'}
                        </span>
                    </div>

                    {/* TEMPLATE DROPDOWN */}
                    {templates.length > 0 && (
                        <div className="relative group/templates">
                            <button className="h-full px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <FolderOpen size={16} className="text-orange-500" />
                                Modelos
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-1 hidden group-hover/templates:block z-30">
                                {templates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleApplyTemplate(t)}
                                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between group/titem"
                                    >
                                        <span>{t.name}</span>
                                        {onDeleteTemplate && (
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Excluir modelo?')) onDeleteTemplate(t.id);
                                                }}
                                                className="text-gray-300 hover:text-red-500 p-1"
                                            >
                                                <Trash2 size={12} />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SAVE AS TEMPLATE BUTTON */}
            {!editingId && guestName.length > 2 && (
                <div className="flex justify-end -mt-4 mb-2">
                    <button
                        onClick={handleCreateTemplate}
                        className="text-[10px] text-gray-400 hover:text-orange-500 flex items-center gap-1 transition-colors"
                    >
                        <PlusSquare size={12} /> Salvar como Modelo
                    </button>
                </div>
            )}

            {/* SELETOR DE PROPRIEDADE */}
            {!editingId && showPropertySelector && (
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                    {Object.values(PROPERTIES).map((prop) => (
                        <button
                            key={prop.id}
                            onClick={() => setPropertyId(prop.id)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${propertyId === prop.id
                                ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <Building2 size={14} /> {prop.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                        Hóspede
                    </label>
                    <div className="relative group">
                        <User
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500"
                            size={20}
                        />
                        <input
                            type="text"
                            value={guestName}
                            onChange={handleGuestNameChange}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Nome Completo"
                        />
                        {showSuggestions && filteredGuests.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                                {filteredGuests.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectGuest(item)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center transition-colors group/item border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors">
                                                    {item.reservation.guestName}
                                                </span>
                                                {item.visitCount > 1 && (
                                                    <span className="text-[10px] bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                        <Sparkles size={10} /> {item.visitCount}ª vez
                                                    </span>
                                                )}
                                                {item.visitCount === 1 && (
                                                    <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-md font-bold">
                                                        Novo
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                {item.reservation.guestPhone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone size={10} /> {item.reservation.guestPhone}
                                                    </span>
                                                )}
                                                {item.lastVisit && (
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays size={10} /> Última: {item.lastVisit.split('-').reverse().join('/')}
                                                    </span>
                                                )}
                                            </div>

                                            {/* RATING BADGES */}
                                            <div className="flex gap-2 mt-1">
                                                {item.averageRating < 3 ? (
                                                    <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                        <AlertTriangle size={10} /> Cuidado ({item.averageRating.toFixed(1)})
                                                    </span>
                                                ) : item.averageRating >= 4.5 ? (
                                                    <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                        <Star size={10} fill="currentColor" /> VIP ({item.averageRating.toFixed(1)})
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity text-orange-500">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                        WhatsApp (Opcional)
                    </label>
                    <div className="relative group">
                        <Phone
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500"
                            size={20}
                        />
                        <input
                            type="tel"
                            value={guestPhone}
                            onChange={handlePhoneChange}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="(87) 99999-8888"
                        />
                    </div>
                </div>
            </div>

            {propertyId === 'integracao' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                            Qtd. Hóspedes
                        </label>
                        <div className="flex bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-1 mt-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setGuestCount(num)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-all ${guestCount === num ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                            Pagamento
                        </label>
                        <div className="flex bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-1">
                            <button
                                onClick={() => setPaymentMethod('pix')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${paymentMethod === 'pix' ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Sparkles size={14} /> Pix
                            </button>
                            <button
                                onClick={() => setPaymentMethod('money')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${paymentMethod === 'money' ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Banknote size={14} /> Dinheiro
                            </button>
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${paymentMethod === 'card' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <CreditCard size={14} /> Cartão
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {propertyId === 'lili' ? (
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                        Senha Porta
                    </label>
                    <div className="relative group">
                        <Lock
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500"
                            size={20}
                        />
                        <input
                            type="text"
                            inputMode="numeric"
                            value={lockCode}
                            onChange={handleNumericInput(setLockCode)}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest"
                            placeholder="123456"
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">
                        * A senha do cofre é gerenciada no CMS.
                    </p>
                </div>
            ) : (
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                        Número do Flat
                    </label>
                    <div className="relative group">
                        <KeyRound
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
                            size={20}
                        />
                        <input
                            type="text"
                            value={flatNumber}
                            onChange={(e) => setFlatNumber(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            placeholder="Ex: 101"
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">
                        * Chave física na portaria.
                    </p>
                </div>
            )}

            <div className="space-y-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                        <CalendarDays size={12} className="text-green-500" /> Check-in (Data)
                    </label>
                    <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                        <Clock size={12} className="text-green-500" /> Check-in (Hora)
                    </label>
                    <input
                        type="time"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 font-mono tracking-wider"
                    />
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 border-dashed"></div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                        <CalendarDays size={12} className="text-orange-500" /> Check-out (Data)
                    </label>
                    <input
                        type="date"
                        value={checkoutDate}
                        onChange={(e) => setCheckoutDate(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                        <Clock size={12} className="text-orange-500" /> Check-out (Hora)
                    </label>
                    <input
                        type="time"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-wider"
                    />
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 uppercase tracking-wider">
                        <MessageSquare size={14} /> Recado para {guestName || 'o Hóspede'}
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={guestAlertActive}
                            onChange={(e) => setGuestAlertActive(e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                </div>

                {guestAlertActive && (
                    <textarea
                        value={guestAlertText}
                        onChange={(e) => setGuestAlertText(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20 resize-none text-gray-700 dark:text-gray-200"
                        placeholder="Ex: Sua encomenda chegou na portaria."
                    />
                )}
            </div>

            {propertyId === 'lili' && (
                <>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                            Boas-vindas (Hóspede vê)
                        </label>
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            onBlur={() => setWelcomeMessage((prev: string) => prev.trim())}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500 text-sm h-20 resize-none"
                            placeholder="Mensagem personalizada..."
                        />
                    </div>

                    {/* --- QUALITY CONTROL / RATING --- */}
                    <div className="col-span-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                            <Flag size={14} /> Controle de Qualidade (Interno)
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Avaliação do Hóspede
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setGuestRating(star)}
                                        className={`p-1 transition-transform hover:scale-110 ${guestRating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                    >
                                        <Star size={24} fill={guestRating >= star ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Feedback Interno
                            </label>
                            <textarea
                                value={guestFeedback}
                                onChange={(e) => setGuestFeedback(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm min-h-[60px]"
                                placeholder="Ex: Deixou o quarto muito sujo, quebrou algo..."
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                Esta nota e comentário são visíveis apenas para o admin.
                            </p>
                        </div>
                    </div>
                </>
            )}

            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <StickyNote size={12} /> Observações Internas
                </label>
                <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    onBlur={() => setAdminNotes((prev: string) => prev.trim())}
                    className="w-full bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500 text-sm h-20 resize-none text-gray-700 dark:text-gray-300"
                    placeholder="Ex: Falta pagar 50%, pediu berço extra..."
                />
            </div>

            <Button
                onClick={handleSaveReservation}
                disabled={isSaving}
                fullWidth
                leftIcon={isSaving ? <Loader2 className="animate-spin" /> : editingId ? <Save size={20} /> : <Sparkles className="text-yellow-400" />}
                className={`py-4 text-lg shadow-xl ${editingId ? 'bg-orange-500' : 'bg-gray-900 dark:bg-white dark:text-gray-900'}`}
            >
                {isSaving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Gerar Magic Link'}
            </Button>

            {generatedLink && !editingId && (
                <div className="animate-fadeIn mt-4 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase text-center mb-2">
                        Reserva Criada!
                    </p>
                    <div
                        onClick={copyToClipboard}
                        className="bg-white dark:bg-gray-800 p-3 rounded-xl text-xs font-mono text-center break-all cursor-pointer border border-gray-200 dark:border-gray-600 mb-3"
                    >
                        {generatedLink}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={copyToClipboard}
                            variant="ghost"
                            size="sm"
                            leftIcon={<Copy size={14} />}
                            className="bg-white text-gray-700 border-gray-200 border"
                        >
                            Copiar
                        </Button>
                        <Button
                            onClick={shareOnWhatsApp}
                            variant="ghost"
                            size="sm"
                            leftIcon={<Send size={14} />}
                            className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-600"
                        >
                            WhatsApp
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationForm;
