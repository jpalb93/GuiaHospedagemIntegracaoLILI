import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

const FinalCTA: React.FC = () => {
    return (
        <section className="py-20 bg-gray-900 border-t border-gray-800 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-8 leading-tight">
                    Gostou? <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                        Reserve direto e economize.
                    </span>
                </h2>

                <div className="flex flex-col items-center gap-6">
                    <p className="text-gray-400 max-w-lg mx-auto text-lg">
                        Sem taxas de intermediários. Fale diretamente conosco e garanta sua estadia
                        com o melhor preço.
                    </p>

                    <a
                        href="https://wa.me/5587988283273"
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-orange-700 hover:bg-orange-800 text-white px-8 py-5 rounded-full text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
                    >
                        <MessageCircle size={24} />
                        Reservar pelo WhatsApp
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
