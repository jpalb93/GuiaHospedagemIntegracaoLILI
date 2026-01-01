import React from 'react';
import { Lock, KeyRound, Building2, Sparkles, Banknote, CreditCard } from 'lucide-react';
import { PropertyId, PaymentMethod, UserPermission } from '../../../types';
import { PROPERTIES } from '../../../config/properties';

interface PropertySectionProps {
    propertyId: PropertyId;
    setPropertyId: (v: PropertyId) => void;
    flatNumber: string;
    setFlatNumber: (v: string) => void;
    lockCode: string;
    setLockCode: (v: string) => void;
    guestCount: number;
    setGuestCount: (v: number) => void;
    paymentMethod: PaymentMethod | '';
    setPaymentMethod: (v: PaymentMethod | '') => void;
    editingId: string | null;
    userPermission?: UserPermission | null;
}

const PropertySection: React.FC<PropertySectionProps> = ({
    propertyId,
    setPropertyId,
    flatNumber,
    setFlatNumber,
    lockCode,
    setLockCode,
    guestCount,
    setGuestCount,
    paymentMethod,
    setPaymentMethod,
    editingId,
    userPermission,
}) => {
    const showPropertySelector =
        !userPermission ||
        userPermission.role === 'super_admin' ||
        userPermission.allowedProperties.length > 1;

    const handleNumericInput =
        (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value.replace(/\D/g, ''));
        };

    return (
        <>
            {/* SELETOR DE PROPRIEDADE */}
            {!editingId && showPropertySelector && (
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                    {Object.values(PROPERTIES).map((prop) => (
                        <button
                            key={prop.id}
                            onClick={() => setPropertyId(prop.id)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                                propertyId === prop.id
                                    ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                        >
                            <Building2 size={14} /> {prop.name}
                        </button>
                    ))}
                </div>
            )}

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
        </>
    );
};

export default PropertySection;
