import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2, FileText, Calendar, Users, Phone, User } from 'lucide-react';
import { HOST_PHONE } from '../../constants';

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
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 animate-slideUp relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-950 p-6 text-white relative">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                        aria-label="Fechar modal"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-orange-400 mb-1">
                        <Building2 size={16} /> Atendimento B2B & Mensalistas
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-heading">
                        Cotação Corporativa para Empresas
                    </h2>
                    <p className="text-xs text-stone-300 mt-1">
                        Preencha os dados da sua empresa para receber uma proposta com faturamento e Nota Fiscal PJ.
                    </p>
                </div>

                {/* Form */}
                {isSent ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white font-heading">
                            Solicitação Enviada com Sucesso!
                        </h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            Abrimos seu WhatsApp para conectar você diretamente à nossa equipe de atendimento corporativo.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                                <Building2 size={14} className="text-orange-500" /> Nome da Empresa *
                            </label>
                            <input
                                type="text"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Ex: Construtora Vale do São Francisco"
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                                    <FileText size={14} className="text-orange-500" /> CNPJ (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                    placeholder="00.000.000/0001-00"
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                                    <User size={14} className="text-orange-500" /> Contato / Solicitante *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    placeholder="Seu Nome / Cargo (RH/Gestor)"
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                                    <Phone size={14} className="text-orange-500" /> WhatsApp para Contato *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(87) 99999-9999"
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                                    <Users size={14} className="text-orange-500" /> Nº de Colaboradores
                                </label>
                                <select
                                    value={employeesCount}
                                    onChange={(e) => setEmployeesCount(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                                >
                                    <option value="1 colaborador">1 colaborador</option>
                                    <option value="2 a 4 colaboradores">2 a 4 colaboradores</option>
                                    <option value="5 a 10 colaboradores">5 a 10 colaboradores</option>
                                    <option value="Mais de 10 colaboradores">Mais de 10 colaboradores</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                                <Calendar size={14} className="text-orange-500" /> Período Estimado da Estadia
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                            >
                                <option value="1 mês (30 dias)">1 mês (30 dias)</option>
                                <option value="2 a 3 meses">2 a 3 meses</option>
                                <option value="4 a 6 meses">4 a 6 meses</option>
                                <option value="Mais de 6 meses">Mais de 6 meses (Longo Prazo)</option>
                                <option value="Período Flexível / A definir">Período Flexível / A definir</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                                Observações ou Requisitos Especiais
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                placeholder="Ex: Necessitamos de flats individuais com garagem e emissão de Nota Fiscal mensal..."
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation uppercase tracking-wider font-heading"
                        >
                            <Send size={18} /> Enviar e Abrir WhatsApp Comercial
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CorporateProposalModal;
