import React from 'react';
import IntentPageLayout from '../../components/seo/IntentPageLayout';

const HospedagemPetrolina: React.FC = () => (
    <IntentPageLayout
        canonicalPath="/hospedagem-em-petrolina"
        title="Hospedagem em Petrolina | Flats Mobiliados no Centro"
        description="Hospedagem em Petrolina no Centro com cozinha, Wi-Fi fibra e ar-condicionado. Flats mobiliados para lazer, trabalho, empresas e estadias mensais."
        eyebrow="Flats Integração · Centro"
        heading="Hospedagem em Petrolina com autonomia de casa"
        lead="Flats mobiliados no Centro para quem vem a lazer, trabalho, consultas ou estadias longas. Cozinha, Wi-Fi fibra e reserva direta em um só lugar."
        heroImage="/hero-bg-nova.webp"
        heroImageAlt="Hospedagem em Petrolina nos Flats Integração, no Centro"
        featuresHeading="O que está incluso na hospedagem"
        featuresLead="Estrutura para viver a cidade com mais independência e controlar melhor os custos do que em uma diária tradicional de hotel."
        features={[
            {
                title: 'Cozinha equipada',
                description:
                    'Frigobar, micro-ondas e utensílios para preparar refeições no próprio flat.',
            },
            {
                title: 'Wi-Fi fibra',
                description: 'Conexão para trabalho remoto, reuniões, estudos e entretenimento.',
            },
            {
                title: 'Flat mobiliado',
                description:
                    'Quarto, banheiro privativo, ar-condicionado e Smart TV prontos para a estadia.',
            },
            {
                title: 'Lazer ou empresa',
                description:
                    'Atendimento para hóspedes particulares, profissionais, equipes e períodos mensais.',
            },
        ]}
        detailHeading="No Centro de Petrolina"
        detailParagraphs={[
            'Os Flats Integração ficam na R. São José, 475 B, Centro de Petrolina, perto de comércio, hospitais e serviços.',
            'A localização reduz deslocamentos no dia a dia e facilita tanto uma viagem curta quanto uma estadia profissional ou mensal.',
        ]}
        faqs={[
            {
                question: 'Onde fica a hospedagem em Petrolina?',
                answer: 'Na R. São José, 475 B, Centro de Petrolina (PE), CEP 56302-270.',
            },
            {
                question: 'Os flats têm cozinha e Wi-Fi?',
                answer: 'Sim. As unidades são mobiliadas e contam com cozinha equipada e internet fibra.',
            },
            {
                question: 'A hospedagem atende empresas?',
                answer: 'Sim. Há atendimento para profissionais e equipes, inclusive estadias prolongadas e Nota Fiscal PJ.',
            },
            {
                question: 'Como consultar disponibilidade?',
                answer: 'A consulta pode ser feita diretamente pelo WhatsApp dos Flats Integração.',
            },
        ]}
    />
);

export default HospedagemPetrolina;
