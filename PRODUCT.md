# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dois públicos com peso igual no site de marketing:

1. **Hóspede particular** — busca hospedagem por temporada em Petrolina (lazer, consultas, trabalho pontual).
2. **Comprador corporativo / B2B** — RH, gestores ou empresas que acomodam diretores, engenheiros, consultores e equipes em estadias longas ou mensais.

Não são escopo de design deste contexto: a experiência do **guia do hóspede** logado nem o **painel admin**.

## Product Purpose

O **site Flats Integração** (`src/components/LandingFlats/`, domínio público) apresenta e vende flats mobiliados no Centro de Petrolina. Sucesso = visitante entende economia/preço e o que está incluso, e age (reservar / pedir orçamento via WhatsApp ou formulário corporativo).

## Positioning

Defender, com clareza, **economia**, **preço/custo-benefício** e **o que é oferecido** (estrutura do flat, comodidades, localização, benefícios B2B como Nota Fiscal PJ) frente a hotelaria e alternativas locais — sem diluir a oferta em narrativa genérica de “experiência”.

## Operating Context

- Superfície de trabalho: landing/marketing Flats Integração apenas.
- Conversão principal: WhatsApp (`+55 87 98828-3273`) e fluxo de orçamento corporativo na própria landing.
- Endereço publicado: R. São José, 475 B — Centro, Petrolina - PE.
- Site vivo: https://www.flatsintegracao.com.br/
- Guia do hóspede e admin existem no mesmo repositório, mas **fora do escopo** de alterações de UI deste produto/contexto.

## Capabilities and Constraints

- Landing com hero, galeria, comodidades, reputação/localização, FAQ, seção B2B/mensal, CTA final e acesso a guia (link), sem redesenhar o guia em si.
- Oferta comunicada no site (não inventar além do confirmado): flats mobiliados, cozinha, Wi-Fi/fibra, Smart TV, ar-condicionado, limpeza/enxoval conforme seções; B2B com NF PJ e comparação de economia vs hotelaria já presente na copy.
- Stack existente: React (Vite), TypeScript, Tailwind, Firebase no monólito do repo — o site público é SPA/PWA.
- **Undecided:** valores de preço numéricos canônicos a exibir (quando e quanto) — só usar números já publicados ou fornecidos pelo time; não inventar tabelas.

## Brand Commitments

- Nome: **Flats Integração**.
- Assets: `src/assets/flats-integracao-logo.png`; hero/galeria em `public/` e assets de galeria.
- Tom do site: direto sobre oferta, economia e localização em Petrolina; CTA de reserva/orçamento.
- Escopo de UI: apenas `LandingFlats` / páginas públicas do marketing — não alterar guia do hóspede nem admin.

## Evidence on Hand

- Copy e seções em `src/components/LandingFlats/` (incl. claims já publicados, ex. economia 30%–50% vs hotelaria, NF PJ).
- Meta/SEO e schema em `index.html` e Helmet da landing.
- Fotos/hero reais do imóvel; mapa embed da localização.
- **Não fabricar:** depoimentos novos, logos de clientes, benchmarks de preço, percentuais de economia ou benefícios que não estejam no site ou confirmados pelo time.

## Product Principles

1. Economia, preço e oferta concreta vêm antes de atmosfera genérica.
2. B2B e particular têm peso igual — nenhuma audiência some do hero/CTA sem decisão explícita.
3. Só comunicar o que o flat realmente oferece; ausência de dado = omitir, não inventar.
4. Trabalho de design fica na landing; guia e admin são superfícies vizinhas, não alvo.
5. Conversão deve permanecer óbvia (WhatsApp / orçamento) sem ruído de produto interno.
