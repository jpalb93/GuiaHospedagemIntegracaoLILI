import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, Database, Server } from 'lucide-react';
import { HOST_PHONE } from '../constants';

const PrivacyPolicy: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#F5F2EB] min-h-screen pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-[#181614]">
            <Helmet>
                <title>Política de Privacidade | Flats Integração</title>
                <meta
                    name="description"
                    content="Saiba como protegemos seus dados e sua privacidade durante sua estadia. Leia nossa Política de Privacidade baseada na LGPD."
                />
                <link
                    rel="canonical"
                    href="https://www.flatsintegracao.com.br/politica-privacidade"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    property="og:url"
                    content="https://www.flatsintegracao.com.br/politica-privacidade"
                />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Política de Privacidade | Flats Integração" />
                <meta
                    property="og:description"
                    content="Saiba como protegemos seus dados e sua privacidade durante sua estadia. Leia nossa Política de Privacidade baseada na LGPD."
                />
                <meta
                    property="og:image"
                    content="https://www.flatsintegracao.com.br/android-chrome-512x512.png"
                />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Política de Privacidade | Flats Integração" />
                <meta
                    name="twitter:description"
                    content="Saiba como protegemos seus dados e sua privacidade durante sua estadia. Leia nossa Política de Privacidade baseada na LGPD."
                />
                <meta
                    name="twitter:image"
                    content="https://www.flatsintegracao.com.br/android-chrome-512x512.png"
                />
            </Helmet>
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-[#E5E0D5]">
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#141210] text-[#E5C98B] rounded-full mb-4 border border-[#E5C98B]/30">
                        <Shield size={28} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-[#181614] mb-2 tracking-tight">
                        Política de Privacidade
                    </h1>
                    <p className="text-[#5C564E] text-xs uppercase tracking-[0.16em] font-semibold">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </header>

                <div className="prose prose-lg max-w-none text-[#5C564E] prose-strong:text-[#181614] prose-headings:text-[#181614] prose-headings:font-heading leading-relaxed space-y-8">
                    <section>
                        <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#181614] mb-4">
                            <Lock className="text-[#9E6B2B]" size={22} />
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
                        <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#181614] mb-4">
                            <Eye className="text-[#9E6B2B]" size={22} />
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
                        <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#181614] mb-4">
                            <Database className="text-[#9E6B2B]" size={22} />
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
                        <div className="bg-[#F5F2EB] border-l-4 border-[#9E6B2B] p-4 mt-6 rounded-r-xl text-sm text-[#181614] font-medium">
                            Nós <strong>NUNCA</strong> vendemos ou compartilhamos seus dados
                            pessoais com terceiros para fins publicitários.
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#181614] mb-4">
                            <Server className="text-[#9E6B2B]" size={22} />
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
                        <h2 className="text-xl font-semibold text-[#181614] mb-4">
                            5. Seus Direitos
                        </h2>
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

                    <div className="pt-8 border-t border-[#E5E0D5] mt-12">
                        <p className="font-semibold text-[#181614] mb-2">
                            Dúvidas sobre seus dados?
                        </p>
                        <p>
                            Entre em contato conosco diretamente pelo WhatsApp para qualquer
                            solicitação relacionada à sua privacidade.
                        </p>
                        <a
                            href={`https://wa.me/${HOST_PHONE}?text=Olá,%20tenho%20dúvidas%20sobre%20a%20política%20de%20privacidade.`}
                            className="inline-flex items-center justify-center mt-4 bg-[#141210] hover:bg-[#2a2621] text-[#E5C98B] px-7 py-3.5 rounded-full font-semibold text-sm transition-colors no-underline"
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
