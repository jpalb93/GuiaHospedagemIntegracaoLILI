import React from 'react';
import AvailabilityCalendar from './AvailabilityCalendar';
import { LILI_PHONE } from '../../constants';

const Location: React.FC = () => {
    return (
        <section id="localizacao" className="py-24 bg-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                    {/* Location Text */}
                    <div>
                        <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4 block">
                            A Localização
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-medium text-gray-900 mb-8">
                            Localização <br />{' '}
                            <span className="italic text-gray-400">Privilegiada.</span>
                        </h2>
                        <p className="text-gray-600 text-lg font-light mb-8">
                            Rua São José, 475 B - Centro. A localização mais cobiçada de Petrolina.
                            Faça tudo a pé: restaurantes, orla, bancos e comércio.
                        </p>
                        <div className="flex flex-col gap-4 text-sm font-bold text-gray-800">
                            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                                <span className="w-16">02 min</span>
                                <span className="font-normal text-gray-500">
                                    Caminhando até a Orla
                                </span>
                            </div>
                            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                                <span className="w-16">05 min</span>
                                <span className="font-normal text-gray-500">
                                    De carro até o Shopping
                                </span>
                            </div>
                            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                                <span className="w-16">01 min</span>
                                <span className="font-normal text-gray-500">
                                    Padarias e Mercados
                                </span>
                            </div>
                        </div>

                        {/* Google Maps Embed */}
                        <div className="mt-8 rounded-xl overflow-hidden shadow-lg border border-gray-100 h-64 w-full">
                            <iframe
                                src="https://maps.google.com/maps?q=R.+S%C3%A3o+Jos%C3%A9,+475+B+-+Centro,+Petrolina&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mapa de Localização"
                            ></iframe>
                        </div>
                    </div>

                    {/* Calendar Block */}
                    <div id="calendario" className="relative">
                        <div className="absolute -inset-4 bg-orange-100 rotate-2 rounded-[2.5rem] -z-10"></div>
                        <div className="bg-white p-2 rounded-[2rem] shadow-xl">
                            <AvailabilityCalendar />
                            <div className="p-6 bg-gray-50 rounded-b-[1.5rem] mt-2 text-center">
                                <p className="text-gray-500 text-sm mb-4">
                                    Pronto para viver essa experiência?
                                </p>
                                <a
                                    href={`https://wa.me/${LILI_PHONE}?text=Olá,%20vi%20o%20site%20do%20Flat%20de%20Lili%20e%20gostaria%20de%20reservar!`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors rounded-none"
                                >
                                    Reservar via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
