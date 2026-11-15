import React, { useState, useRef, useId } from 'react';
import {
    X,
    Building2,
    Send,
    CheckCircle2,
    FileText,
    Calendar,
    Users,
    Phone,
    User,
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';

interface CorporateProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CorporateProposalModal: React.FC<CorporateProposalModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [companyName, setCompanyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const [employeesCount, setEmployeesCount] = useState('1');
    const [duration, setDuration] = useState('1 mês (30 dias)');
    const [notes, setNotes] = useState('');
    const [isSent, setIsSent] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const fieldId = useId();

    useDialogAccessibility({
        isOpen,
        dialogRef,
        onClose,
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName.trim() || !contactName.trim() || !phone.trim()) return;

        let message = `🏢 *SOLICITAÇÃO DE COTAÇÃO CORPORATIVA (B2B)*\n`;
        message += `------------------------------------\n`;
        message += `🏢 *Empresa:* ${companyName.trim()}\n`;
        if (cnpj.trim()) message += `📑 *CNPJ:* ${cnpj.trim()}\n`;
        message += `👤 *Contato/Gestor:* ${contactName.trim()}\n`;
        message += `📞 *WhatsApp:* ${phone.trim()}\n`;
        message += `👥 *Quantidade de Hóspedes/Colaboradores:* ${employeesCount}\n`;
        message += `📅 *Período Estimado:* ${duration}\n`;
        if (notes.trim()) message += `📝 *Observações/Necessidades:* ${notes.trim()}\n`;
        message += `------------------------------------\n`;
        message += `Desejo receber uma proposta com valores mensais e faturamento em Nota Fiscal.`;

        const targetPhone = HOST_PHONE; // WhatsApp Comercial Flats Integração
        const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            onClose();
        }, 2000);
    };

    return (
        <div
            className="fixed inset-0 bg-[#12110F]/95 md:bg-[#12110F]/85 md:backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#191714] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/15 animate-slideUp relative outline-none my-auto"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#141210] via-[#1C1A16] to-[#12110F] p-6 text-white border-b border-white/10 relative">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                        aria-label="Fechar modal"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E5C98B] mb-1.5 pr-10">
                        <Building2 size={15} /> Atendimento B2B & Mensalistas
                    </div>
                    <h2
                        id={titleId}
                        className="text-xl sm:text-2xl font-semibold font-heading tracking-tight pr-8"
                    >
                        Cotação Corporativa para Empresas
                    </h2>
                    <p className="text-xs text-stone-300 mt-1">
                        Preencha os dados da sua empresa para receber uma proposta com faturamento e
                        Nota Fiscal PJ.
                    </p>
                </div>

                {/* Form */}
                {isSent ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={36} />
                        </div>
                        <h3 className="text-xl font-semibold text-white font-heading">
                            Solicitação Enviada com Sucesso!
                        </h3>
                        <p className="text-sm text-stone-400">
                            Abrimos seu WhatsApp para conectar você diretamente à nossa equipe de
                            atendimento corporativo.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar"
                    >
                        <div>
                            <label
                                htmlFor={`${fieldId}-company`}
                                className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5"
                            >
                                <Building2 size={14} className="text-[#E5C98B]" /> Nome da Empresa *
                            </label>
                            <input
                                id={`${fieldId}-company`}
                                type="text"
                                required
                                aria-required="true"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Ex: Construtora Vale do São Francisco"
                                className="w-full px-4 py-3 bg-[#12110F] border border-white/15 rounded-xl text-base sm:text-sm text-white placeholder:text-stone-400/80 focus:border-[#E5C98B] focus:ring-1 focus:ring-[#E5C98B] outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor={`${fieldId}-cnpj`}
                                    className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5"
                                >
                                    <FileText size={14} className="text-[#E5C98B]" /> CNPJ
                                    (Opcional)
                                </label>
                                <input
                                    id={`${fieldId}-cnpj`}
                                    type="text"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                    placeholder="00.000.000/0001-00"
                                    className="w-full px-4 py-3 bg-[#12110F] border border-white/15 rounded-xl text-base sm:text-sm text-white placeholder:text-stone-400/80 focus:border-[#E5C98B] focus:ring-1 focus:ring-[#E5C98B] outline-none"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor={`${fieldId}-contact`}
                                    className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5"
                                >
                                    <User size={14} className="text-[#E5C98B]" /> Contato /
                                    Solicitante *
                                </label>
                                <input
                                    id={`${fieldId}-contact`}
                                    type="text"
                                    required
                                    aria-required="true"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    placeholder="Seu Nome / Cargo (RH/Gestor)"
                                    className="w-full px-4 py-3 bg-[#12110F] border border-white/15 rounded-xl text-base sm:text-sm text-white placeholder:text-stone-400/80 focus:border-[#E5C98B] focus:ring-1 focus:ring-[#E5C98B] outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor={`${fieldId}-phone`}
                                    className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5"
                                >
                                    <Phone size={14} className="text-[#E5C98B]" /> WhatsApp para
                                    Contato *
                                </label>
                                <input
                                    id={`${fieldId}-phone`}
                                    type="tel"
                                    required
                                    aria-required="true"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(87) 99999-9999"
                                    className="w-full px-4 py-3 bg-[#12110F] border border-white/15 rounded-xl text-base sm:text-sm text-white placeholder:text-stone-400/80 focus:border-[#E5C98B] focus:ring-1 focus:ring-[#E5C98B] outline-none"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor={`${fieldId}-employees`}
                                    className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5"
                                >
                                    <Users size={14} className="text-[#E5C98B]" /> Nº de
                                    Colaboradores
                                </label>
                                <select
                                    id={`${fieldId}-employees`}
                                    value={employeesCount}
                                    onChange={(e) => setEmployeesCount(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#12110F] border border-white/15 rounded-xl text-base sm:text-sm text-white focus:border-[#E5C98B] focus:ring-1 focus:ring-[#E5C98B] outline-none font-medium"
                                >
                                    <option value="1 colaborador">1 colaborador</option>
                                    <option value="2 a 4 colaboradores">2 a 4 colaboradores</option>
                                    <option value="5 a 10 colaboradores">
                                        5 a 10 colaboradores
                                    </option>
                                    <option value="Mais de 10 colaboradores">
                                        Mais de 10 colaboradores
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor={`${fieldId}-duration`}
                                className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5"
                            >
                                <Calendar size={14} className="text-[#E5C98B]" /> Período Estimado
                                da Estadia
                            </label>
                            <select
                                id={`${fieldId}-duration`}
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-4 py-3 bg-[#12110F] border border-white/15 rounded-xl text-base sm:text-sm text-white focus:border-[#E5C98B] focus:ring-1 focus:ring-[#E5C98B] outline-none font-medium"
                            >
                                <option value="1 mês (30 dias)">1 mês (30 dias)</option>
                                <option value="2 a 3 meses">2 a 3 meses</option>
                                <option value="4 a 6 meses">4 a 6 meses</option>
                                <option value="Mais de 6 meses">
                                    Mais de 6 meses (Longo Prazo)
                                </option>
                                <option value="Período Flexível / A definir">
                                    Período Flexível / A definir
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor={`${fieldId}-notes`}
                                className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5"
                            >
                                Observações ou Requisitos Especiais
                            </label>
                            <textarea
                                id={`${fieldId}-notes`}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                placeholder="Ex: Necessitamos de flats individuais com garagem e emissão de Nota Fiscal mensal..."
                                className="w-full px-4 py-3 bg-[#12110F] border border-white/15 rounded-xl text-base sm:text-sm text-white placeholder:text-stone-400/80 focus:border-[#E5C98B] focus:ring-1 focus:ring-[#E5C98B] outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] rounded-full font-semibold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
                        >
                            <Send size={17} /> Enviar e Abrir WhatsApp Comercial
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CorporateProposalModal;
