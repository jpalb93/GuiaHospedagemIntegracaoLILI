import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
    {
        question: 'O flats possui estacionamento?',
        answer: 'Não possuímos estacionamento próprio, mas é totalmente seguro estacionar na rua.',
    },
    {
        question: 'Qual a voltagem das tomadas?',
        answer: 'Em Petrolina a voltagem é 220v. Nossos flats possuem tomadas padrão novo.',
    },
    {
        question: 'Fica perto de restaurantes?',
        answer: 'Sim, estamos no Centro, a 5 min do Bodódromo e com vários deliverys disponíveis.',
    },
    {
        question: 'Tem Wi-Fi para trabalhar?',
        answer: 'Sim, internet fibra ótica de alta velocidade em todas as unidades.',
    },
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-white" id="faq">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2 flex items-center justify-center gap-2">
                        <HelpCircle size={18} />
                        Dúvidas
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
                        Perguntas Frequentes
                    </h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
                                openIndex === index
                                    ? 'shadow-lg border-orange-200 bg-orange-50/10'
                                    : 'bg-gray-50 hover:bg-white'
                            }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span
                                    className={`font-bold text-lg ${openIndex === index ? 'text-orange-600' : 'text-gray-800'}`}
                                >
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-orange-500 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="text-gray-400 flex-shrink-0" />
                                )}
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    openIndex === index
                                        ? 'max-h-40 opacity-100'
                                        : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
