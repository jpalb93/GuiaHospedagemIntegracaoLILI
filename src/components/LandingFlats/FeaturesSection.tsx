import React from 'react';
import { Shield, Sparkles, UtensilsCrossed, Wifi } from 'lucide-react';

const FeaturesSection: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-2 block">Por que escolher a Flats Integração?</span>
                    <h2 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900">
                        Comodidades que fazem a diferença
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                            <Sparkles size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Conforto Total</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Ar-condicionado split em todas as unidades, roupas de cama premium e banheiros privativos modernos.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                            <UtensilsCrossed size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Cozinha Equipada</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Micro-ondas, mesa de jantar e utensílios completos. Prepare suas refeições como se estivesse em casa.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                            <Wifi size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Conectividade & Lazer</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Wi-Fi gratuito de alta velocidade e TV de tela plana para seu entretenimento e trabalho remoto.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                            <Shield size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Segurança 24h</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Monitoramento por câmeras nas áreas comuns e extintores de incêndio para sua tranquilidade.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
