import React, { useEffect } from 'react';
import { Shield, Lock, Eye, Database, Server } from 'lucide-react';
import { HOST_PHONE } from '../constants';

const PrivacyPolicy: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100">
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
                        Política de Privacidade
                    </h1>
                    <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </header>

                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-8">
                    <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                            <Lock className="text-orange-500" size={24} />
                            1. Introdução e Compromisso
                        </h2>
                        <p>
                            Sua privacidade é fundamental para nós. Esta política descreve como os{' '}
                            <strong>Flats Integração e Flat de Lili</strong> coletam, usam e
                            protegem as informações pessoais dos nossos hóspedes e visitantes, em
                            conformidade com a{' '}
                            <strong>
                                Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
                            </strong>
                            .
                        </p>
                        <p>
                            Ao utilizar nosso site e nosso <strong>Guia Digital do Hóspede</strong>,
                            você concorda com as práticas descritas neste documento.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                            <Eye className="text-orange-500" size={24} />
                            2. Quais dados coletamos?
                        </h2>
                        <p>
                            Limitamos a coleta de dados ao mínimo necessário para garantir uma
                            hospedagem segura e confortável:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>
                                <strong>Dados de Reserva:</strong> Nome completo, datas da estadia e
                                contato (telefone/WhatsApp) fornecidos através das plataformas de
                                reserva (Airbnb, Booking) ou contato direto.
                            </li>
                            <li>
                                <strong>Guia Digital:</strong> Ao acessar nosso Guia do Hóspede
                                através do link exclusivo, nosso sistema armazena suas preferências
                                de navegação (como locais favoritados) para personalizar sua
                                experiência.
                            </li>
                            <li>
                                <strong>Dados de Navegação:</strong> Coletamos dados anônimos de
                                acesso (como páginas visitadas e tempo de permanência) através do
                                Google Analytics para melhorar nosso conteúdo.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                            <Database className="text-orange-500" size={24} />
                            3. Como usamos seus dados
                        </h2>
                        <p>Suas informações são utilizadas exclusivamente para:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>
                                Identificação e segurança no check-in (liberação de senhas e
                                acessos).
                            </li>
                            <li>Personalização do Guia Digital (exibição do seu nome e datas).</li>
                            <li>Comunicação sobre sua estadia (dicas, avisos e suporte).</li>
                            <li>Melhorias no nosso site e serviços.</li>
                        </ul>
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-6 text-sm text-orange-900 font-medium">
                            Nós <strong>NUNCA</strong> vendemos ou compartilhamos seus dados
                            pessoais com terceiros para fins publicitários.
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                            <Server className="text-orange-500" size={24} />
                            4. Armazenamento e Segurança
                        </h2>
                        <p>
                            Seus dados são armazenados em servidores seguros (Google Firebase) com
                            criptografia padrão de mercado. Mantemos essas informações apenas pelo
                            tempo necessário para cumprir as finalidades legais e de serviço da sua
                            hospedagem.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
                        <p>
                            Você tem total controle sobre seus dados. A qualquer momento, você pode
                            solicitar:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Confirmação da existência de tratamento de dados.</li>
                            <li>Acesso aos dados que possuímos sobre você.</li>
                            <li>Correção de dados incompletos ou desatualizados.</li>
                            <li>
                                Eliminação dos dados (exceto quando a manutenção for obrigatória por
                                lei).
                            </li>
                        </ul>
                    </section>

                    <div className="pt-8 border-t border-gray-200 mt-12">
                        <p className="font-bold text-gray-900 mb-2">Dúvidas sobre seus dados?</p>
                        <p>
                            Entre em contato conosco diretamente pelo WhatsApp para qualquer
                            solicitação relacionada à sua privacidade.
                        </p>
                        <a
                            href={`https://wa.me/${HOST_PHONE}?text=Olá,%20tenho%20dúvidas%20sobre%20a%20política%20de%20privacidade.`}
                            className="inline-block mt-4 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                            Contatar Encarregado de Dados
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
