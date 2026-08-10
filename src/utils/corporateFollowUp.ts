import { Company, Invoice } from '../types';
import { formatCompetenceLabel, invoiceBalance } from './corporateBilling';

const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Telefone de cobrança da empresa (financeiro → operacional) */
export function companyBillingPhone(company?: Company | null): string {
    if (!company) return '';
    const raw = company.contacts?.billing?.phone || company.contacts?.operational?.phone || '';
    return raw.replace(/\D/g, '');
}

/** Mensagem WhatsApp de cobrança / lembrete de fatura */
export function buildInvoiceReminderMessage(invoice: Invoice): string {
    const bal = invoiceBalance(invoice.total, invoice.amountPaid);
    const due = invoice.dueDate.split('-').reverse().join('/');
    const competence = formatCompetenceLabel(invoice.competence);
    const overdue = invoice.status === 'overdue';

    let text = `Olá! Aqui é da *Flats Integração*.\n\n`;
    text += overdue
        ? `Segue lembrete de *fatura vencida*:\n`
        : `Segue lembrete de *fatura em aberto*:\n`;
    text += `• Empresa: *${invoice.companyName}*\n`;
    text += `• Competência: *${competence}*\n`;
    text += `• Vencimento: *${due}*\n`;
    text += `• Total: ${money(invoice.total)}\n`;
    text += `• Já pago: ${money(invoice.amountPaid)}\n`;
    text += `• *Saldo: ${money(bal)}*\n\n`;
    text += `Qualquer dúvida, estamos à disposição.`;
    return text;
}

export function openInvoiceWhatsApp(invoice: Invoice, phoneDigits: string): void {
    const digits = phoneDigits.replace(/\D/g, '');
    if (digits.length < 8) {
        throw new Error('Informe o WhatsApp do contato financeiro/operacional na empresa');
    }
    const withCountry = digits.startsWith('55') ? digits : `55${digits}`;
    const text = encodeURIComponent(buildInvoiceReminderMessage(invoice));
    window.open(`https://api.whatsapp.com/send?phone=${withCountry}&text=${text}`, '_blank');
}
