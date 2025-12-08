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
} from 'lucide-react';
import Button from '../ui/Button';
import { PROPERTIES } from '../../config/properties';
import { PropertyId, UserPermission, PaymentMethod, Reservation } from '../../types';

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
}

const ReservationForm: React.FC<ReservationFormProps> = ({
    form,
    ui,
    userPermission,
    previousGuests = [],
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
    const [filteredGuests, setFilteredGuests] = React.useState<Reservation[]>([]);

    const handleGuestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGuestName(value);

        if (value.length > 2) {
            const uniqueGuests = new Map();
            previousGuests.forEach((g) => {
                if (g.guestName.toLowerCase().includes(value.toLowerCase())) {
                    uniqueGuests.set(g.guestName, g);
                }
            });
            setFilteredGuests(Array.from(uniqueGuests.values()).slice(0, 5));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectGuest = (guest: Reservation) => {
        setGuestName(guest.guestName);
        if (guest.guestPhone) setGuestPhone(guest.guestPhone);
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
                <div
                    className={`p-3 rounded-2xl border flex items-center gap-3 text-xs ${apiKeyStatus === 'ok' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700'}`}
                >
                    {apiKeyStatus === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span className="font-bold">
                        {apiKeyStatus === 'ok' ? 'IA Concierge Ativa' : 'IA Inativa'}
                    </span>
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
                                {filteredGuests.map((guest, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectGuest(guest)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center transition-colors"
                                    >
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                            {guest.guestName}
                                        </span>
                                        {guest.guestPhone && (
                                            <span className="text-xs text-gray-400">
                                                {guest.guestPhone}
                                            </span>
                                        )}
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
