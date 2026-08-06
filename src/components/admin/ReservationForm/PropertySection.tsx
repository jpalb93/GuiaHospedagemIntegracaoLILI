import React from 'react';
import { Lock, KeyRound, Building2, Sparkles, AlertTriangle, Users } from 'lucide-react';
import { PropertyId, UserPermission, Reservation } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { checkAvailabilityForPeriod } from '../../../utils/availability';
import { formatDateBR } from '../../../utils/helpers';

interface PropertySectionProps {
    propertyId: PropertyId;
    setPropertyId: (v: PropertyId) => void;
    flatNumber: string;
    setFlatNumber: (v: string) => void;
    lockCode: string;
    setLockCode: (v: string) => void;
    guestCount: number;
    setGuestCount: (v: number) => void;
    checkInDate: string;
    checkoutDate: string;
    reservations?: Reservation[];
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
    checkInDate,
    checkoutDate,
    reservations = [],
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

    const currentProperty = PROPERTIES[propertyId];

    // CÁLCULO INTELIGENTE DE DISPONIBILIDADE EM TEMPO REAL
    const availabilitySummary = checkAvailabilityForPeriod(
        propertyId,
        checkInDate,
        checkoutDate,
        reservations,
        currentProperty.units || [],
        editingId
    );

    const selectedUnitStatus = availabilitySummary.unitsStatus.find(
        (u) => u.unit.trim() === flatNumber.trim()
    );

    return (
        <div className="space-y-4">
            {/* SELETOR DE PROPRIEDADE */}
            {!editingId && showPropertySelector && (
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
                    {Object.values(PROPERTIES).map((prop) => (
                        <button
                            key={prop.id}
                            type="button"
                            onClick={() => setPropertyId(prop.id)}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                                propertyId === prop.id
                                    ? prop.id === 'lili'
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                        >
                            <Building2 size={16} />
                            {prop.name}
                        </button>
                    ))}
                </div>
            )}

            {/* PAINEL DE DISPONIBILIDADE INTELIGENTE */}
            {checkInDate && checkoutDate && checkInDate < checkoutDate && (
                <div className="p-4 rounded-2xl border transition-all bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-500 animate-pulse" />
                            Disponibilidade ({formatDateBR(checkInDate)} até {formatDateBR(checkoutDate)})
                        </span>
                        <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                                availabilitySummary.isAvailable
                                    ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300'
                            }`}
                        >
                            {propertyId === 'integracao'
                                ? `${availabilitySummary.availableUnitsCount} de ${availabilitySummary.totalUnits} flats livres`
                                : availabilitySummary.isAvailable
                                  ? '🟢 Livre no Período'
                                  : '🔴 Já Reservado'}
                        </span>
                    </div>

                    {/* CONFLITO LILI */}
                    {propertyId === 'lili' && !availabilitySummary.isAvailable && (
                        <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>
                                Atenção: O Flat da Lili já está reservado no período por{' '}
                                <strong>{availabilitySummary.overlappingReservations[0]?.guestName}</strong> (
                                {formatDateBR(availabilitySummary.overlappingReservations[0]?.checkInDate || '')} a{' '}
                                {formatDateBR(availabilitySummary.overlappingReservations[0]?.checkoutDate || '')}).
                            </span>
                        </div>
                    )}

                    {/* CONFLITO FLAT INTEGRAÇÃO SELECIONADO */}
                    {propertyId === 'integracao' && selectedUnitStatus && !selectedUnitStatus.isAvailable && (
                        <div className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>
                                Atenção: O Flat {flatNumber} já está reservado por{' '}
                                <strong>{selectedUnitStatus.occupyingGuest}</strong> (
                                {formatDateBR(selectedUnitStatus.occupyingCheckIn || '')} a{' '}
                                {formatDateBR(selectedUnitStatus.occupyingCheckout || '')}).
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* SELEÇÃO DO FLAT & HÓSPEDES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NÚMERO DO FLAT */}
                {propertyId === 'lili' ? (
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
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
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest text-gray-900 dark:text-gray-100"
                                placeholder="123456"
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                            Número do Flat
                        </label>
                        <div className="relative group">
                            <KeyRound
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 z-10 pointer-events-none"
                                size={20}
                            />
                            {currentProperty.units && currentProperty.units.length > 0 ? (
                                <select
                                    value={flatNumber}
                                    onChange={(e) => setFlatNumber(e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-gray-900/50 border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 font-bold cursor-pointer appearance-none ${
                                        selectedUnitStatus && !selectedUnitStatus.isAvailable
                                            ? 'border-red-400 text-red-600 dark:text-red-400 focus:ring-red-500'
                                            : 'border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Selecione o Flat...</option>
                                    {availabilitySummary.unitsStatus.map((u) => (
                                        <option
                                            key={u.unit}
                                            value={u.unit}
                                            className={u.isAvailable ? 'text-green-700 font-bold' : 'text-red-600 font-medium'}
                                        >
                                            Flat {u.unit} {u.isAvailable ? '— 🟢 Livre' : `— 🔴 Ocupado (${u.occupyingGuest})`}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={flatNumber}
                                    onChange={(e) => setFlatNumber(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 dark:text-gray-100"
                                    placeholder="Ex: 101"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* QUANTIDADE DE HÓSPEDES */}
                <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                        Hóspedes / Pessoas
                    </label>
                    <div className="relative group">
                        <Users
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 z-10 pointer-events-none"
                            size={20}
                        />
                        <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900 dark:text-gray-100 cursor-pointer"
                        >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'Pessoa' : 'Pessoas'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertySection;
