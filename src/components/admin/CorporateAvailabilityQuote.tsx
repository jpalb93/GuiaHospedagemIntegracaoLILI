import React, { useEffect, useMemo, useState } from 'react';
import {
    Search,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Building2,
    ArrowRight,
    Briefcase,
} from 'lucide-react';
import { Allocation, Company, Reservation } from '../../types';
import { PROPERTIES } from '../../config/properties';
import { subscribeToActiveReservations } from '../../services/firebase/reservations';
import { subscribeToActiveAllocations } from '../../services/firebase/corporate';
import {
    quoteCorporateAvailability,
    nightsBetween,
    estimatePackageTotal,
    CorporateAvailabilityQuote,
} from '../../utils/corporateAvailability';

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (ymd: string, days: number) => {
    const d = new Date(ymd + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};

const fieldClass =
    'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-400 text-gray-900 dark:text-white';

interface CorporateAvailabilityQuoteProps {
    companies: Company[];
    onConvert: (payload: {
        startDate: string;
        endDate: string;
        flats: string[];
        companyId?: string;
        companyLabel?: string;
        monthlyPricePerFlat?: number;
    }) => void;
}

const CorporateAvailabilityQuotePanel: React.FC<CorporateAvailabilityQuoteProps> = ({
    companies,
    onConvert,
}) => {
    const [startDate, setStartDate] = useState(today());
    const [endDate, setEndDate] = useState(addDays(today(), 30));
    const [requestedCount, setRequestedCount] = useState(3);
    const [pricePerFlat, setPricePerFlat] = useState('');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFlats, setSelectedFlats] = useState<string[]>([]);
    const [companyId, setCompanyId] = useState('');
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const unsubAlloc = subscribeToActiveAllocations(setAllocations);
        let unsubRes: (() => void) | undefined;
        let cancelled = false;
        subscribeToActiveReservations(
            (list) => {
                if (!cancelled) {
                    setReservations(list);
                    setLoading(false);
                }
            },
            ['integracao']
        ).then((u) => {
            if (cancelled) u?.();
            else unsubRes = u;
        });
        return () => {
            cancelled = true;
            unsubAlloc();
            unsubRes?.();
        };
    }, []);

    const quote: CorporateAvailabilityQuote | null = useMemo(() => {
        if (!searched) return null;
        return quoteCorporateAvailability({
            startDate,
            endDate,
            requestedCount,
            reservations,
            allocations,
            units: PROPERTIES.integracao.units || [],
        });
    }, [searched, startDate, endDate, requestedCount, reservations, allocations]);

    const nights = nightsBetween(startDate, endDate);
    const estimate =
        quote && selectedFlats.length > 0 && Number(pricePerFlat) > 0
            ? estimatePackageTotal(
                  Number(pricePerFlat),
                  nights,
                  selectedFlats.length,
                  'per_unit_monthly'
              )
            : null;

    const toggleFlat = (flat: string) => {
        if (!quote?.availableFlats.includes(flat)) return;
        setSelectedFlats((prev) =>
            prev.includes(flat) ? prev.filter((f) => f !== flat) : [...prev, flat]
        );
    };

    const activeCompanies = companies.filter((c) => c.status !== 'archived');

    return (
        <div className="rounded-[2.5rem] border border-white/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 sm:p-8 space-y-5 shadow-xl shadow-gray-200/20 dark:shadow-none">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-md">
                    <Briefcase size={22} />
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                        Mesa comercial
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        Consulte disponibilidade para Z flats de X a Y — cruza reservas e contratos
                        sem cadastrar. Feche a proposta em contrato quando estiver pronto.
                    </p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                    <label
                        htmlFor="quote-start-date"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        De *
                    </label>
                    <input
                        id="quote-start-date"
                        type="date"
                        className={fieldClass}
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setSearched(false);
                        }}
                    />
                </div>
                <div>
                    <label
                        htmlFor="quote-end-date"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Até *
                    </label>
                    <input
                        id="quote-end-date"
                        type="date"
                        className={fieldClass}
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setSearched(false);
                        }}
                    />
                </div>
                <div>
                    <label
                        htmlFor="quote-flat-count"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Flats necessários *
                    </label>
                    <input
                        id="quote-flat-count"
                        type="number"
                        min={1}
                        max={PROPERTIES.integracao.units?.length || 10}
                        className={fieldClass}
                        value={requestedCount}
                        onChange={(e) => {
                            setRequestedCount(Math.max(1, Number(e.target.value) || 1));
                            setSearched(false);
                        }}
                    />
                </div>
                <div>
                    <label
                        htmlFor="quote-monthly-price"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Preço / flat / mês (est.)
                    </label>
                    <input
                        id="quote-monthly-price"
                        type="number"
                        className={fieldClass}
                        value={pricePerFlat}
                        onChange={(e) => setPricePerFlat(e.target.value)}
                        placeholder="Ex.: 3500"
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            <button
                type="button"
                disabled={loading || !startDate || !endDate || startDate >= endDate}
                onClick={() => {
                    const nextQuote = quoteCorporateAvailability({
                        startDate,
                        endDate,
                        requestedCount,
                        reservations,
                        allocations,
                        units: PROPERTIES.integracao.units || [],
                    });
                    setSelectedFlats(
                        nextQuote.canFulfill ? nextQuote.suggestedFlats : nextQuote.availableFlats
                    );
                    setSearched(true);
                }}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-extrabold disabled:opacity-50 shadow-lg touch-manipulation"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Buscar disponibilidade
            </button>

            {quote && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                    <div
                        className={`p-5 rounded-2xl border ${
                            quote.canFulfill
                                ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
                                : 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {quote.canFulfill ? (
                                <CheckCircle2
                                    className="text-emerald-600 shrink-0 mt-0.5"
                                    size={22}
                                />
                            ) : (
                                <AlertTriangle
                                    className="text-amber-600 shrink-0 mt-0.5"
                                    size={22}
                                />
                            )}
                            <div>
                                <p className="font-extrabold text-sm text-gray-900 dark:text-white font-heading">
                                    {quote.canFulfill
                                        ? `Disponível — ${quote.availableCount} flat${quote.availableCount !== 1 ? 's' : ''} livre${quote.availableCount !== 1 ? 's' : ''} no período`
                                        : `Capacidade insuficiente: ${quote.availableCount} livre${quote.availableCount !== 1 ? 's' : ''} (faltam ${quote.shortfall} para ${quote.requestedCount})`}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                                    {nights} noite{nights !== 1 ? 's' : ''} ·{' '}
                                    {quote.blockedFlats.length}{' '}
                                    {quote.blockedFlats.length !== 1
                                        ? 'indisponíveis'
                                        : 'indisponível'}{' '}
                                    de {quote.totalUnits}
                                    {estimate != null && selectedFlats.length > 0
                                        ? ` · Estimativa ~ R$ ${estimate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${selectedFlats.length} flat${selectedFlats.length !== 1 ? 's' : ''}, pró-rata 30d)`
                                        : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                            Flats livres — selecione a proposta
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quote.availableFlats.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    Nenhum flat livre neste período.
                                </p>
                            ) : (
                                quote.availableFlats.map((flat) => {
                                    const selected = selectedFlats.includes(flat);
                                    const suggested = quote.suggestedFlats.includes(flat);
                                    return (
                                        <button
                                            key={flat}
                                            type="button"
                                            onClick={() => toggleFlat(flat)}
                                            aria-pressed={selected}
                                            aria-label={`Flat ${flat}${suggested ? ', sugerido' : ''}`}
                                            className={`min-h-[44px] px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors touch-manipulation ${
                                                selected
                                                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900'
                                                    : suggested
                                                      ? 'border-emerald-400 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                                                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                                            }`}
                                        >
                                            {flat}
                                            {suggested && !selected ? ' ★' : ''}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {quote.blockedFlats.length > 0 && (
                        <div>
                            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                                Indisponíveis no período
                            </p>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                {quote.blockedFlats.map((b) => (
                                    <div
                                        key={b.flat}
                                        title={b.detail}
                                        className="text-xs px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 max-w-[12rem]"
                                    >
                                        <p className="font-bold text-rose-700 dark:text-rose-300">
                                            Flat {b.flat}
                                        </p>
                                        <p className="text-rose-600/90 dark:text-rose-400 truncate font-medium">
                                            {b.guestName ||
                                                (b.reason === 'allocation'
                                                    ? 'Outro contrato'
                                                    : 'Reservado')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedFlats.length > 0 && (
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 space-y-3">
                            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Building2 size={12} /> Fechar em contrato
                            </p>
                            <p className="text-xs text-gray-500">
                                Selecionados: <strong>{selectedFlats.join(', ')}</strong>
                            </p>
                            <div>
                                <label
                                    htmlFor="quote-company"
                                    className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                                >
                                    Conta corporativa
                                </label>
                                <select
                                    id="quote-company"
                                    className={fieldClass}
                                    value={companyId}
                                    onChange={(e) => setCompanyId(e.target.value)}
                                >
                                    <option value="">— Selecione a empresa —</option>
                                    {activeCompanies.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.tradeName || c.legalName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                disabled={!companyId || !(Number(pricePerFlat) > 0)}
                                onClick={() =>
                                    onConvert({
                                        startDate,
                                        endDate,
                                        flats: selectedFlats,
                                        companyId: companyId || undefined,
                                        companyLabel:
                                            activeCompanies.find((c) => c.id === companyId)
                                                ?.tradeName ||
                                            activeCompanies.find((c) => c.id === companyId)
                                                ?.legalName,
                                        monthlyPricePerFlat: Number(pricePerFlat) || undefined,
                                    })
                                }
                                className="inline-flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold disabled:opacity-40 shadow-lg shadow-emerald-600/20 touch-manipulation"
                            >
                                Criar contrato e alocar
                                <ArrowRight size={16} />
                            </button>
                            {!companyId && (
                                <p className="text-[11px] text-gray-400">
                                    Cadastre a conta (Nova conta) ou selecione uma existente para
                                    converter.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CorporateAvailabilityQuotePanel;
