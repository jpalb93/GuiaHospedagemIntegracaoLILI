import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocationSection: React.FC = () => {
    return (
        <section id="localizacao" className="py-24 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Infos */}
                    <div className="order-2 lg:order-1">
                        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-2 block">Localização</span>
                        <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
                            No coração de Petrolina
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Aproveite a conveniência de estar perto de tudo. Restaurantes, serviços e os principais pontos turísticos da cidade a poucos minutos de distância.
                        </p>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600 mt-1">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">Endereço</h4>
                                    <p className="text-gray-600">
                                        R. São José, 475 B - Centro<br />
                                        Petrolina - PE, 56302-270
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href="https://maps.app.goo.gl/cjGLg5TvgFE9mn2M7"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <Navigation size={20} />
                            Abrir no Google Maps
                        </a>
                    </div>

                    {/* Map */}
                    <div className="order-1 lg:order-2 h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative z-10 w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.538608226922!2d-40.505701!3d-9.395689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x773708a0e3867ff%3A0x6a2c222c5e533c37!2sR.%20S%C3%A3o%20Jos%C3%A9%2C%20475%20B%20-%20Centro%2C%20Petrolina%20-%20PE%2C%2056302-270!5e0!3m2!1spt-BR!2sbr!4v1709664000000!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa Flats Integração"
                        ></iframe>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LocationSection;
