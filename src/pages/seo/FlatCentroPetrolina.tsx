import React from 'react';
import IntentPageLayout from '../../components/seo/IntentPageLayout';

const FlatCentroPetrolina: React.FC = () => (
    <IntentPageLayout
        canonicalPath="/flat-centro-petrolina"
        title="Flat no Centro de Petrolina | Flats Integração"
        description="Flat mobiliado no Centro de Petrolina com cozinha, Wi-Fi fibra e ar-condicionado. Hospedagem perto de hospitais, comércio e serviços."
        eyebrow="R. São José, 475 B"
        heading="Flat no Centro de Petrolina, perto do que importa"
        lead="Hospedagem mobiliada para reduzir deslocamentos e manter sua rotina. Cozinha, Wi-Fi fibra e estrutura completa em uma localização central."
        heroImage="/assets/gallery/gallery-2.webp"
        heroImageAlt="Flat mobiliado no Centro de Petrolina"
        featuresHeading="Praticidade dentro e fora do flat"
        featuresLead="Uma base no Centro para descansar, trabalhar e resolver o dia a dia sem depender de longos deslocamentos."
        features={[
            {
                title: 'Endereço central',
                description:
                    'R. São José, 475 B, Centro de Petrolina, com comércio e serviços por perto.',
            },
            {
                title: 'Perto de hospitais',
                description: 'Localização prática para consultas, tratamentos e acompanhantes.',
            },
            {
                title: 'Rotina completa',
                description:
                    'Cozinha equipada, Wi-Fi fibra, ar-condicionado e Smart TV na unidade.',
            },
            {
                title: 'Estadias flexíveis',
                description: 'Opção para lazer, trabalho, empresas e permanências mais longas.',
            },
        ]}
        detailHeading="Hospedagem central em Petrolina"
        detailParagraphs={[
            'Estar no Centro facilita o acesso a hospitais, farmácias, supermercados, bancos, cartórios e polos de trabalho.',
            'O flat funciona como uma base privativa: você prepara refeições, trabalha com internet fibra e descansa com mais autonomia do que em um quarto convencional.',
        ]}
        faqs={[
            {
                question: 'Qual é o endereço dos Flats Integração?',
                answer: 'R. São José, 475 B, Centro, Petrolina (PE), CEP 56302-270.',
            },
            {
                question: 'O flat fica perto de hospitais?',
                answer: 'Sim. A localização central oferece acesso prático a hospitais, farmácias e outros serviços da cidade.',
            },
            {
                question: 'Há estacionamento privativo?',
                answer: 'Não há vaga privativa. É possível estacionar na rua em frente à propriedade.',
            },
            {
                question: 'O flat serve para estadia mensal?',
                answer: 'Sim. Consulte diretamente as condições e a disponibilidade para períodos prolongados.',
            },
        ]}
    />
);

export default FlatCentroPetrolina;
