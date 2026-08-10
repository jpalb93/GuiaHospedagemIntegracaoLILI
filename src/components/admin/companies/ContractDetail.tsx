import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Home, Check, X, Plus } from 'lucide-react';
import { Company, Contract, Allocation, PropertyId, Reservation } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import {
    subscribeToContractsByCompany,
    subscribeToAllocationsByContract,
    createAllocationsBatch,
    endAllocation,
    updateAllocation,
    refreshCompanyActiveFlatCount,
    subscribeToActiveAllocations,
    getEndContractChecklist,
    endContract,
} from '../../../services/firebase';
import type { EndContractChecklist } from '../../../services/firebase/corporate';
import {
    subscribeToActiveReservations,
    saveReservation,
} from '../../../services/firebase/reservations';
import { useToast } from '../../../contexts/ToastContext';
import InvoicePanel from '../InvoicePanel';
import { ContractForm } from './ContractForm';
import {
    FlatAvailability,
    reservationCoversDate,
    reservationOverlapsFrom,
    pricingLabel,
    contractStatusLabel,
    money,
    today,
    fieldClass,
    btnPrimary,
    btnSecondary,
} from './companyUtils';

interface ContractDetailProps {
    company: Company;
    contractId: string;
    onBack: () => void;
}

export const ContractDetail: React.FC<ContractDetailProps> = ({ company, contractId, onBack }) => {
    const { showSuccess, showError } = useToast();
    const [contract, setContract] = useState<Contract | null>(null);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [allActiveAllocations, setAllActiveAllocations] = useState<Allocation[]>([]);
    const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
    const [editing, setEditing] = useState(false);
    const [selectedFlats, setSelectedFlats] = useState<string[]>([]);
    const [guestNames, setGuestNames] = useState<Record<string, string>>({});
    const [guestPhones, setGuestPhones] = useState<Record<string, string>>({});
    const [allocStart, setAllocStart] = useState(today());
    const [adding, setAdding] = useState(false);
    const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
    const [editGuestName, setEditGuestName] = useState('');
    const [editGuestPhone, setEditGuestPhone] = useState('');
    const [creatingResId, setCreatingResId] = useState<string | null>(null);
    const [endChecklist, setEndChecklist] = useState<EndContractChecklist | null>(null);
    const [endingContract, setEndingContract] = useState(false);
    const [loadingChecklist, setLoadingChecklist] = useState(false);

    const units = useMemo(() => PROPERTIES.integracao.units || [], []);

    useEffect(() => {
        if (!company.id) return;
        return subscribeToContractsByCompany(company.id, (list) => {
            setContract(list.find((c) => c.id === contractId) || null);
        });
    }, [company.id, contractId]);

    useEffect(() => {
        return subscribeToAllocationsByContract(contractId, setAllocations);
    }, [contractId]);

    useEffect(() => {
        return subscribeToActiveAllocations(setAllActiveAllocations);
    }, []);

    useEffect(() => {
        let unsub: (() => void) | undefined;
        let cancelled = false;
        subscribeToActiveReservations(
            (list) => {
                if (!cancelled) setActiveReservations(list);
            },
            ['integracao']
        ).then((u) => {
            if (cancelled) u?.();
            else unsub = u;
        });
        return () => {
            cancelled = true;
            unsub?.();
        };
    }, []);

    const flatAvailability = useMemo(() => {
        const map = new Map<string, FlatAvailability>();
        const start = allocStart || today();

        for (const flat of units) {
            // Já neste contrato
            const onThis = allocations.find((a) => a.status === 'active' && a.flatNumber === flat);
            if (onThis) {
                map.set(flat, {
                    flat,
                    blocked: true,
                    reason: 'this_contract',
                    detail: 'Já neste contrato',
                });
                continue;
            }

            // Outro contrato ativo
            const other = allActiveAllocations.find(
                (a) =>
                    a.contractId !== contractId &&
                    a.propertyId === 'integracao' &&
                    a.flatNumber === flat &&
                    a.status === 'active' &&
                    a.startDate <= (a.endDate || '9999-12-31') &&
                    (!a.endDate || a.endDate > start)
            );
            if (other) {
                map.set(flat, {
                    flat,
                    blocked: true,
                    reason: 'other_contract',
                    detail: 'Em outro contrato',
                });
                continue;
            }

            // Reserva com overlap a partir do início da alocação
            const conflicting = activeReservations
                .filter(
                    (r) =>
                        (r.propertyId || 'lili') === 'integracao' &&
                        (r.flatNumber || '') === flat &&
                        r.status !== 'cancelled' &&
                        reservationOverlapsFrom(r, start)
                )
                .sort((a, b) => (a.checkInDate || '').localeCompare(b.checkInDate || ''))[0];

            if (conflicting) {
                const coversNow = reservationCoversDate(conflicting, start);
                map.set(flat, {
                    flat,
                    blocked: true,
                    reason: 'occupied',
                    guestName: conflicting.guestName,
                    detail: coversNow
                        ? `Ocupado: ${conflicting.guestName}`
                        : `Reservado (${conflicting.checkInDate?.split('-').reverse().join('/')} → ${conflicting.checkoutDate?.split('-').reverse().join('/')})`,
                });
                continue;
            }

            map.set(flat, { flat, blocked: false });
        }
        return map;
    }, [units, allocations, allActiveAllocations, activeReservations, contractId, allocStart]);

    // Remove da seleção flats que ficaram bloqueados (ex.: mudou a data)
    useEffect(() => {
        setSelectedFlats((prev) => prev.filter((f) => !flatAvailability.get(f)?.blocked));
        setGuestNames((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((f) => {
                if (flatAvailability.get(f)?.blocked) delete next[f];
            });
            return next;
        });
        setGuestPhones((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((f) => {
                if (flatAvailability.get(f)?.blocked) delete next[f];
            });
            return next;
        });
    }, [flatAvailability]);

    const toggleFlat = (flat: string) => {
        const avail = flatAvailability.get(flat);
        if (avail?.blocked) return;
        setSelectedFlats((prev) => {
            if (prev.includes(flat)) {
                setGuestNames((g) => {
                    const n = { ...g };
                    delete n[flat];
                    return n;
                });
                setGuestPhones((g) => {
                    const n = { ...g };
                    delete n[flat];
                    return n;
                });
                return prev.filter((f) => f !== flat);
            }
            return [...prev, flat];
        });
    };

    const handleAddAllocations = async () => {
        if (!company.id || !contract || selectedFlats.length === 0) return;
        const blocked = selectedFlats.filter((f) => flatAvailability.get(f)?.blocked);
        if (blocked.length > 0) {
            showError(`Flats indisponíveis: ${blocked.join(', ')}`);
            return;
        }
        setAdding(true);
        try {
            await createAllocationsBatch(
                selectedFlats.map((flatNumber) => ({
                    contractId,
                    companyId: company.id!,
                    propertyId: 'integracao' as PropertyId,
                    flatNumber,
                    status: 'active' as const,
                    startDate: allocStart || contract.startDate,
                    guestName: guestNames[flatNumber]?.trim() || undefined,
                    guestPhone: guestPhones[flatNumber]?.replace(/\D/g, '') || undefined,
                }))
            );
            await refreshCompanyActiveFlatCount(company.id);
            setSelectedFlats([]);
            setGuestNames({});
            setGuestPhones({});
            showSuccess(
                `${selectedFlats.length} flat${selectedFlats.length > 1 ? 's' : ''} alocado(s)`
            );
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao alocar flats');
        } finally {
            setAdding(false);
        }
    };

    const handleSaveGuest = async (allocationId: string) => {
        try {
            await updateAllocation(allocationId, {
                guestName: editGuestName.trim() || undefined,
                guestPhone: editGuestPhone.replace(/\D/g, '') || undefined,
            });
            setEditingGuestId(null);
            showSuccess('Profissional atualizado');
        } catch {
            showError('Erro ao salvar nome');
        }
    };

    const handleCreateReservation = async (a: Allocation) => {
        if (!a.id || !a.guestName?.trim()) {
            showError('Informe o nome do profissional antes de criar a reserva');
            return;
        }
        const phone = (a.guestPhone || '').replace(/\D/g, '');
        if (phone.length < 8) {
            showError('Informe o WhatsApp do profissional (mín. 8 dígitos) para criar a reserva');
            return;
        }
        const checkout = a.endDate || contract?.endDate;
        if (!checkout) {
            showError('Defina a data de fim no contrato ou na alocação para criar a reserva');
            return;
        }
        if (checkout <= (a.startDate || '')) {
            showError('Data de fim deve ser depois do início');
            return;
        }
        setCreatingResId(a.id);
        try {
            await saveReservation({
                guestName: a.guestName.trim(),
                guestPhone: phone,
                propertyId: a.propertyId,
                flatNumber: a.flatNumber,
                checkInDate: a.startDate,
                checkoutDate: checkout,
                checkInTime: PROPERTIES.integracao.defaults.checkInTime,
                checkOutTime: PROPERTIES.integracao.defaults.checkOutTime,
                guestCount: 1,
                companyId: a.companyId,
                contractId: a.contractId,
                allocationId: a.id,
                billingMode: 'corporate',
                paymentStatus: 'billed',
                adminNotes: `Corporativo — ${company.tradeName || company.legalName}`,
                status: 'active',
                createdAt: new Date().toISOString(),
            });
            showSuccess(`Reserva criada para ${a.guestName} no flat ${a.flatNumber}`);
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao criar reserva');
        } finally {
            setCreatingResId(null);
        }
    };

    if (!contract) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-slate-500" size={32} />
            </div>
        );
    }

    const priceLine =
        contract.unitMonthlyPrice != null
            ? `R$ ${money(contract.unitMonthlyPrice)}/flat`
            : contract.packageMonthlyPrice != null
              ? `Pacote R$ ${money(contract.packageMonthlyPrice)}`
              : contract.nightlyPrice != null
                ? `R$ ${money(contract.nightlyPrice)}/noite`
                : null;

    return (
        <div className="space-y-8 animate-fadeIn pb-8">
            <button
                type="button"
                onClick={onBack}
                className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1.5 min-h-[44px] touch-manipulation"
            >
                <ArrowLeft size={16} /> {company.tradeName || company.legalName}
            </button>

            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 text-white p-6 sm:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 mb-1">
                            Contrato comercial
                        </p>
                        <h2 className="text-2xl font-extrabold font-heading tracking-tight">
                            {pricingLabel[contract.pricingModel]}
                        </h2>
                        <p className="text-sm text-gray-300 mt-2">
                            {contract.startDate.split('-').reverse().join('/')}
                            {contract.endDate
                                ? ` → ${contract.endDate.split('-').reverse().join('/')}`
                                : ' · vigência aberta'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 text-gray-200">
                                {contractStatusLabel[contract.status]}
                            </span>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 text-gray-200">
                                Venc. dia {contract.billingDay}
                            </span>
                            {contract.emitsNf && (
                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 text-gray-200">
                                    Emite NF
                                </span>
                            )}
                        </div>
                        {priceLine && (
                            <p className="text-xl font-extrabold font-heading mt-4 text-emerald-300">
                                {priceLine}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <button
                            type="button"
                            onClick={() => setEditing((v) => !v)}
                            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold touch-manipulation"
                        >
                            {editing ? 'Fechar' : 'Editar contrato'}
                        </button>
                        {contract.status === 'active' && (
                            <button
                                type="button"
                                disabled={loadingChecklist}
                                onClick={async () => {
                                    setLoadingChecklist(true);
                                    try {
                                        const cl = await getEndContractChecklist(contractId);
                                        setEndChecklist(cl);
                                    } catch (err) {
                                        showError(
                                            err instanceof Error ? err.message : 'Erro ao carregar'
                                        );
                                    } finally {
                                        setLoadingChecklist(false);
                                    }
                                }}
                                className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-red-500/90 hover:bg-red-600 border border-red-400/30 text-white text-xs font-bold touch-manipulation disabled:opacity-50"
                            >
                                {loadingChecklist ? '…' : 'Encerrar contrato'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {endChecklist && (
                <div className="p-6 rounded-[2rem] border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/20 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-extrabold text-red-800 dark:text-red-300 font-heading">
                        Checklist de encerramento
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex justify-between gap-2">
                            <span>Flats ativos a encerrar</span>
                            <strong>{endChecklist.activeAllocations.length}</strong>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span>Faturas em aberto</span>
                            <strong
                                className={
                                    endChecklist.openInvoiceCount > 0
                                        ? 'text-red-600'
                                        : 'text-emerald-600'
                                }
                            >
                                {endChecklist.openInvoiceCount}
                                {endChecklist.openBalance > 0
                                    ? ` (R$ ${money(endChecklist.openBalance)})`
                                    : ''}
                            </strong>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span>Reservas corporativas ainda vigentes</span>
                            <strong>{endChecklist.activeCorporateReservations}</strong>
                        </li>
                    </ul>
                    {endChecklist.openInvoiceCount > 0 ? (
                        <p className="text-xs text-red-600 font-bold">
                            Quite ou cancele as faturas em aberto antes de encerrar.
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500">
                            As alocações ativas serão encerradas na data de hoje. Reservas de
                            ocupação não são canceladas automaticamente.
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-end">
                        <button
                            type="button"
                            onClick={() => setEndChecklist(null)}
                            className={btnSecondary}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={endingContract || endChecklist.openInvoiceCount > 0}
                            onClick={async () => {
                                if (!confirm('Confirmar encerramento do contrato?')) return;
                                setEndingContract(true);
                                try {
                                    await endContract(contractId);
                                    showSuccess('Contrato encerrado');
                                    setEndChecklist(null);
                                    onBack();
                                } catch (err) {
                                    showError(
                                        err instanceof Error ? err.message : 'Erro ao encerrar'
                                    );
                                } finally {
                                    setEndingContract(false);
                                }
                            }}
                            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-2xl bg-red-600 text-white text-xs font-extrabold disabled:opacity-40"
                        >
                            {endingContract && <Loader2 size={14} className="animate-spin" />}
                            Confirmar encerramento
                        </button>
                    </div>
                </div>
            )}

            {editing && (
                <ContractForm
                    company={company}
                    initial={contract}
                    onCancel={() => setEditing(false)}
                    onSaved={() => {
                        setEditing(false);
                        showSuccess('Contrato atualizado');
                    }}
                    onError={(msg) => showError(msg)}
                />
            )}

            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-5">
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-2 font-heading">
                    <Home size={14} /> Portfolio de unidades
                </h3>

                {allocations.filter((a) => a.status === 'active').length === 0 ? (
                    <p className="text-sm text-gray-400">
                        Nenhum flat ativo neste contrato — selecione unidades abaixo.
                    </p>
                ) : (
                    <div className="grid gap-3">
                        {allocations
                            .filter((a) => a.status === 'active')
                            .map((a) => (
                                <div
                                    key={a.id}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 space-y-2"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-extrabold text-sm text-gray-900 dark:text-white font-heading">
                                                Flat {a.flatNumber}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Desde {a.startDate.split('-').reverse().join('/')}
                                                {a.endDate
                                                    ? ` · Até ${a.endDate.split('-').reverse().join('/')}`
                                                    : ''}
                                            </p>
                                            {editingGuestId !== a.id && (
                                                <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                                                    {a.guestName ? (
                                                        <>
                                                            <span className="font-semibold">
                                                                {a.guestName}
                                                            </span>
                                                            {a.guestPhone
                                                                ? ` · ${a.guestPhone}`
                                                                : ''}
                                                        </>
                                                    ) : (
                                                        <span className="text-amber-600 dark:text-amber-400 text-xs font-medium">
                                                            Profissional não informado
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                                            {editingGuestId !== a.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingGuestId(a.id!);
                                                        setEditGuestName(a.guestName || '');
                                                        setEditGuestPhone(a.guestPhone || '');
                                                    }}
                                                    className="min-h-[44px] px-3 py-1.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 touch-manipulation"
                                                >
                                                    Nome
                                                </button>
                                            )}
                                            {a.guestName && (
                                                <button
                                                    type="button"
                                                    disabled={creatingResId === a.id}
                                                    onClick={() => handleCreateReservation(a)}
                                                    className="min-h-[44px] px-3 py-1.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 touch-manipulation"
                                                >
                                                    {creatingResId === a.id ? '…' : 'Reserva'}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                aria-label={`Encerrar flat ${a.flatNumber}`}
                                                onClick={async () => {
                                                    if (
                                                        !a.id ||
                                                        !confirm(`Encerrar flat ${a.flatNumber}?`)
                                                    )
                                                        return;
                                                    try {
                                                        await endAllocation(a.id);
                                                        if (company.id) {
                                                            await refreshCompanyActiveFlatCount(
                                                                company.id
                                                            );
                                                        }
                                                        showSuccess('Alocação encerrada');
                                                    } catch {
                                                        showError('Erro ao encerrar');
                                                    }
                                                }}
                                                className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 touch-manipulation"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    {editingGuestId === a.id && (
                                        <div className="grid sm:grid-cols-2 gap-2 pt-1">
                                            <input
                                                aria-label={`Nome do profissional no flat ${a.flatNumber || ''}`}
                                                className={fieldClass}
                                                placeholder="Nome do profissional *"
                                                value={editGuestName}
                                                onChange={(e) => setEditGuestName(e.target.value)}
                                                autoFocus
                                            />
                                            <input
                                                aria-label={`WhatsApp do profissional no flat ${a.flatNumber || ''}`}
                                                className={fieldClass}
                                                placeholder="WhatsApp"
                                                value={editGuestPhone}
                                                onChange={(e) => setEditGuestPhone(e.target.value)}
                                            />
                                            <div className="sm:col-span-2 flex gap-2 justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingGuestId(null)}
                                                    className={btnSecondary}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveGuest(a.id!)}
                                                    className={btnPrimary}
                                                >
                                                    Salvar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                <div className="p-5 rounded-[1.75rem] border border-dashed border-gray-300 dark:border-gray-600 bg-slate-50/80 dark:bg-gray-900/40 space-y-3">
                    <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                        Adicionar flats
                    </p>
                    <div>
                        <label
                            htmlFor="allocation-start-date"
                            className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                        >
                            Início da alocação
                        </label>
                        <input
                            id="allocation-start-date"
                            type="date"
                            value={allocStart}
                            onChange={(e) => setAllocStart(e.target.value)}
                            className={`${fieldClass} sm:w-48`}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {units.map((flat) => {
                            const avail = flatAvailability.get(flat);
                            const blocked = avail?.blocked ?? false;
                            const selected = selectedFlats.includes(flat);
                            const reason = avail?.reason;
                            const title = avail?.detail || flat;
                            return (
                                <button
                                    key={flat}
                                    type="button"
                                    disabled={blocked}
                                    title={title}
                                    onClick={() => toggleFlat(flat)}
                                    aria-pressed={selected}
                                    aria-label={`Flat ${flat}${blocked ? `, indisponível: ${title}` : ''}`}
                                    className={`min-h-[44px] px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors max-w-[11rem] touch-manipulation ${
                                        blocked
                                            ? reason === 'occupied'
                                                ? 'opacity-90 cursor-not-allowed border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                                                : reason === 'other_contract'
                                                  ? 'opacity-70 cursor-not-allowed border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                                                  : 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400'
                                            : selected
                                              ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900'
                                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-slate-500'
                                    }`}
                                >
                                    {selected && <Check size={12} className="inline mr-1" />}
                                    <span className="inline-flex flex-col items-start leading-tight text-left">
                                        <span>{flat}</span>
                                        {reason === 'occupied' && avail?.guestName && (
                                            <span className="font-medium text-[10px] truncate max-w-full opacity-90">
                                                {avail.guestName}
                                            </span>
                                        )}
                                        {reason === 'other_contract' && (
                                            <span className="font-medium text-[10px] opacity-80">
                                                Outro contrato
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {selectedFlats.length > 0 && (
                        <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                                Profissional em cada flat (opcional)
                            </p>
                            <p className="text-[11px] text-gray-400">
                                Nome de quem vai ficar — funcionário da empresa. Pode preencher
                                depois.
                            </p>
                            {selectedFlats.map((flat) => (
                                <div
                                    key={flat}
                                    className="grid sm:grid-cols-[4rem_1fr_1fr] gap-2 items-center"
                                >
                                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                                        {flat}
                                    </span>
                                    <input
                                        aria-label={`Nome do profissional no flat ${flat}`}
                                        className={fieldClass}
                                        placeholder="Nome do profissional"
                                        value={guestNames[flat] || ''}
                                        onChange={(e) =>
                                            setGuestNames((prev) => ({
                                                ...prev,
                                                [flat]: e.target.value,
                                            }))
                                        }
                                    />
                                    <input
                                        aria-label={`WhatsApp do profissional no flat ${flat}`}
                                        className={fieldClass}
                                        placeholder="WhatsApp"
                                        value={guestPhones[flat] || ''}
                                        onChange={(e) =>
                                            setGuestPhones((prev) => ({
                                                ...prev,
                                                [flat]: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded border border-rose-300 bg-rose-50" />{' '}
                            Ocupado / reservado
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded border border-amber-300 bg-amber-50" />{' '}
                            Outro contrato
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded border border-gray-200 bg-gray-100" />{' '}
                            Já neste contrato
                        </span>
                    </div>
                    <button
                        type="button"
                        disabled={adding || selectedFlats.length === 0}
                        onClick={handleAddAllocations}
                        className={btnPrimary}
                    >
                        {adding ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Plus size={14} />
                        )}
                        Alocar {selectedFlats.length || ''} flat
                        {selectedFlats.length !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/20 dark:shadow-none">
                <InvoicePanel
                    companyId={company.id!}
                    contractId={contractId}
                    companyName={company.tradeName || company.legalName}
                />
            </div>
        </div>
    );
};
