import React from 'react';
import { Star, ThumbsUp, MapPin, ShieldCheck, Heart } from 'lucide-react';

const ReputationSection: React.FC = () => {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">

                    {/* Left: Score Highlight */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold text-sm mb-6 animate-fadeIn">
                            <Star size={16} className="fill-orange-600" />
                            <span>Recomendado pelos hóspedes</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                            Uma experiência <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                                aprovada e reconhecida.
                            </span>
                        </h2>

                        <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                            Nossa dedicação ao conforto e a qualidade do serviço reflete na satisfação de quem passa por aqui.
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                <MapPin className="text-blue-500" size={24} />
                                <div className="text-left">
                                    <span className="block font-bold text-gray-900">Localização</span>
                                    <span className="text-xs text-gray-500">Privilegiada</span>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                <ShieldCheck className="text-green-500" size={24} />
                                <div className="text-left">
                                    <span className="block font-bold text-gray-900">Segurança</span>
                                    <span className="text-xs text-gray-500">Monitorada</span>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                <Heart className="text-red-500" size={24} />
                                <div className="text-left">
                                    <span className="block font-bold text-gray-900">Conforto</span>
                                    <span className="text-xs text-gray-500">Garantido</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: The Score Card */}
                    <div className="relative">
                        {/* Decorative Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-200/50 rounded-full blur-3xl -z-10"></div>

                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl text-center border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-12">
                                <ThumbsUp className="text-white" size={32} />
                            </div>

                            <div className="text-7xl font-black text-gray-900 mb-2 tracking-tighter">
                                9.0
                            </div>
                            <div className="text-xl font-bold text-blue-600 uppercase tracking-widest mb-6">
                                Ótimo
                            </div>

                            <div className="w-full h-px bg-gray-100 mb-6"></div>

                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-bold bg-gray-50 px-4 py-2 rounded-full">
                                <span className="text-blue-600">Booking.com</span>
                                <span>•</span>
                                <span>Avaliação Verificada</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReputationSection;
