import React from 'react';
import { Clock, VolumeX, Ban, UserCheck } from 'lucide-react';

const InfoSection: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
                        Informações Importantes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Clock size={20} className="text-orange-500" /> Horários
                            </h3>
                            <ul className="space-y-4 text-gray-600 text-sm">
                                <li className="flex justify-between">
                                    <span>Check-in:</span>
                                    <span className="font-bold text-gray-900">15:00 - 18:30</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Check-out:</span>
                                    <span className="font-bold text-gray-900">08:00 - 13:00</span>
                                </li>
                                <li className="flex justify-between items-center text-xs bg-orange-50 p-2 rounded text-orange-800">
                                    Informe seu horário de chegada com antecedência.
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <UserCheck size={20} className="text-blue-500" /> Políticas
                            </h3>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex items-center gap-2">
                                    <Ban size={16} className="text-red-400" /> Proibido fumar em todas as áreas
                                </li>
                                <li className="flex items-center gap-2">
                                    <Ban size={16} className="text-red-400" /> Festas/eventos não permitidos
                                </li>
                                <li className="flex items-center gap-2">
                                    <Ban size={16} className="text-red-400" /> Pets não permitidos
                                </li>
                                <li className="flex items-center gap-2">
                                    <VolumeX size={16} className="text-blue-400" /> Silêncio entre 21:00 e 07:00
                                </li>
                                <li className="text-xs text-gray-500 mt-2">
                                    * Entrada permitida apenas para maiores de 18 anos.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoSection;
