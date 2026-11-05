import { HOST_PHONE } from '../constants';

export const DAY_USE_PATH = '/guia/day-use-petrolina';
export const DAY_USE_TITLE = 'Day use em Petrolina: 4 horas no Centro, sem pernoite';
export const DAY_USE_DESCRIPTION =
    'Day use individual no Centro de Petrolina: 4 horas, das 8h às 12h, sem pernoite e sem visitantes. Reserve antecipadamente. Consulte valores e disponibilidade.';
export const DAY_USE_WHATSAPP = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(
    'Olá! Gostaria de consultar o day use individual no Flats Integração, em Petrolina. Data desejada: __. Horário desejado: __. Podem informar o valor e a disponibilidade?'
)}`;

export const DAY_USE_FAQS = [
    {
        question: 'Como funciona o day use no Flats Integração, em Petrolina?',
        answer: 'É o uso individual do flat por um período durante o dia, sem pernoite e sem visitantes. O período da manhã tem 4 horas, das 8h às 12h. A reserva deve ser feita antecipadamente e está sujeita à disponibilidade. Outros horários podem ser consultados, também sujeitos à disponibilidade.',
    },
    {
        question: 'Quanto custa o day use em Petrolina no Flats Integração?',
        answer: 'Consulte o valor pelo WhatsApp, informando a data e o horário desejados. Confirme o preço, a disponibilidade e as condições com a equipe antes de reservar.',
    },
    {
        question: 'Posso levar acompanhante ou receber visitas no day use?',
        answer: 'Não. Esta modalidade é destinada a 1 pessoa, sem visitantes. Se você precisa de hospedagem para mais pessoas ou com pernoite, consulte outras opções com a equipe.',
    },
] as const;
