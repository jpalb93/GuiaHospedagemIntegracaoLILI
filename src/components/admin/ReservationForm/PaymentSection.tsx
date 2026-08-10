import React from 'react';
import { DollarSign, Sparkles } from 'lucide-react';
import { PaymentMethod, PaymentStatus } from '../../../types';

interface PaymentSectionProps {
    paymentMethod: PaymentMethod | '';
    setPaymentMethod: (v: PaymentMethod | '') => void;
    paymentStatus: PaymentStatus | '';
    setPaymentStatus: (v: PaymentStatus) => void;
    totalAmount: number | '';
    setTotalAmount: (v: number | '') => void;
    depositAmount: number | '';
    setDepositAmount: (v: number | '') => void;
    isCorporate?: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    setPaymentStatus,
    totalAmount,
    setTotalAmount,
    depositAmount,
    setDepositAmount,
    isCorporate = false,
}) => {
    const isExternal = paymentStatus === 'external';
    const numericTotal =
        typeof totalAmount === 'number' ? totalAmount : parseFloat(totalAmount) || 0;
    const numericDeposit =
        typeof depositAmount === 'number' ? depositAmount : parseFloat(depositAmount) || 0;
    const remainingBalance = Math.max(0, numericTotal - numericDeposit);

    const handleSelectStatus = (status: PaymentStatus) => {
        setPaymentStatus(status);
        if (status === 'external') {
            setTotalAmount('');
            setDepositAmount('');
            setPaymentMethod('');
        }
    };

    if (isCorporate) {
        return (
            <div className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/60 dark:bg-orange-950/20">
                <p className="text-sm font-bold text-orange-900 dark:text-orange-200">
                    Faturado na empresa
                </p>
                <p className="text-xs text-orange-800/80 dark:text-orange-300/80 mt-1 leading-relaxed">
                    O valor desta estadia entra na fatura mensal do contrato. Não registre pagamento
                    avulso aqui — use Empresas → Faturas.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* STATUS DO PAGAMENTO */}
            <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                    Status do Pagamento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                        type="button"
                        onClick={() => handleSelectStatus('paid')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            paymentStatus === 'paid'
                                ? 'bg-green-500 text-white border-green-600 shadow-md scale-[1.02]'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                        Pago
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectStatus('partial')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            paymentStatus === 'partial'
                                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        Deu Sinal
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectStatus('pending')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            paymentStatus === 'pending' || !paymentStatus
                                ? 'bg-red-500 text-white border-red-600 shadow-md scale-[1.02]'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                        Falta Pagar
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectStatus('external')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            isExternal
                                ? 'bg-slate-700 text-white border-slate-800 shadow-md scale-[1.02]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-600'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        Pagamento externo
                    </button>
                </div>
            </div>

            {isExternal ? (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Pagamento fora do caixa (ex.: Airbnb)
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Não exige valor nem forma de pagamento. A reserva segue normal na operação,
                        mas o valor não aparece na lista nem entra no relatório financeiro.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* VALOR DA RESERVA */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                Valor Total da Reserva (R$)
                            </label>
                            <div className="relative group">
                                <DollarSign
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 z-10 pointer-events-none"
                                    size={20}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={totalAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setTotalAmount(val === '' ? '' : parseFloat(val));
                                    }}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500 font-bold text-gray-900 dark:text-gray-100"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>

                        {/* FORMA DE PAGAMENTO */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                Forma de Pagamento
                            </label>
                            <div className="relative group">
                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value as PaymentMethod | '')
                                    }
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900 dark:text-gray-100 cursor-pointer"
                                >
                                    <option value="">Não informado</option>
                                    <option value="pix">PIX</option>
                                    <option value="money">Espécie / Dinheiro</option>
                                    <option value="card">Cartão de Crédito/Débito</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* CAMPO DINÂMICO DE SINAL */}
                    {paymentStatus === 'partial' && (
                        <div className="p-4 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl animate-fadeIn space-y-3">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <label className="text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-amber-500" /> Valor Já Pago
                                    de Sinal (R$)
                                </label>

                                {numericTotal > 0 && (
                                    <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-sm">
                                        Resta Pagar: R${' '}
                                        {remainingBalance.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                            </div>

                            <div className="relative group">
                                <DollarSign
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 z-10 pointer-events-none"
                                    size={20}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={depositAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setDepositAmount(val === '' ? '' : parseFloat(val));
                                    }}
                                    className="w-full bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-amber-500 font-extrabold text-gray-900 dark:text-gray-100 text-sm shadow-sm"
                                    placeholder="Ex: 100,00"
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PaymentSection;
