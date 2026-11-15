---
name: Flats Integração
description: Landing editorial Obsidian & Champagne para hospedagem boutique e estadias corporativas em Petrolina — contraste alto, clareza comercial e ritmo fluido em mobile.
colors:
    champagne: '#E5C98B'
    champagne-hover: '#edd6a1'
    bronze-ink: '#9E6B2B'
    route-muted: '#B8AA92'
    pure-white: '#FFFFFF'
    obsidian: '#12110F'
    obsidian-surface: '#181613'
    obsidian-card: '#191714'
    obsidian-nav: '#141210'
    alabaster: '#F5F2EB'
    ivory-card: '#FAF8F3'
    alabaster-line: '#DFD8CA'
    ink-dark: '#181614'
    ink-muted: '#5C564E'
    stone-mute: '#a8a29e'
    stone-body: '#d6d3d1'
    savings-green: '#34d399'
    whatsapp-green: '#25D366'
typography:
    score-display:
        fontFamily: 'Plus Jakarta Sans, Plus Jakarta Sans Fallback, sans-serif'
        fontSize: '6.25rem'
        fontWeight: 700
        lineHeight: 0.9
        letterSpacing: '-0.04em'
    display:
        fontFamily: 'Plus Jakarta Sans, Plus Jakarta Sans Fallback, sans-serif'
        fontSize: 'clamp(2.25rem, 6.5vw, 5.25rem)'
        fontWeight: 600
        lineHeight: 0.96
        letterSpacing: '-0.03em'
    editorial-serif:
        fontFamily: 'Fraunces, Georgia, serif'
        fontWeight: 500
    headline:
        fontFamily: 'Plus Jakarta Sans, Plus Jakarta Sans Fallback, sans-serif'
        fontSize: 'clamp(1.875rem, 4vw, 3.25rem)'
        fontWeight: 600
        lineHeight: 1.12
        letterSpacing: '-0.02em'
    headline-card:
        fontFamily: 'Plus Jakarta Sans, Plus Jakarta Sans Fallback, sans-serif'
        fontSize: '32px'
        fontWeight: 600
        lineHeight: 1.15
    title:
        fontFamily: 'Plus Jakarta Sans, Plus Jakarta Sans Fallback, sans-serif'
        fontSize: '1.25rem'
        fontWeight: 600
        lineHeight: 1.35
    body:
        fontFamily: 'Inter, Inter Fallback, sans-serif'
        fontSize: '1rem'
        fontWeight: 400
        lineHeight: 1.625
    nav-link:
        fontFamily: 'Inter, Inter Fallback, sans-serif'
        fontSize: '13px'
        fontWeight: 500
        lineHeight: 1.2
    mono-label:
        fontFamily: 'JetBrains Mono, monospace'
        fontSize: '0.75rem'
        fontWeight: 600
        lineHeight: 1
        letterSpacing: '0.2em'
    caption-xs:
        fontFamily: 'Inter, Inter Fallback, sans-serif'
        fontSize: '11px'
        fontWeight: 600
        lineHeight: 1.2
    micro-attribution:
        fontFamily: 'Inter, Inter Fallback, sans-serif'
        fontSize: '10px'
        fontWeight: 500
        lineHeight: 1.2
    map-legal:
        fontFamily: 'Inter, Inter Fallback, sans-serif'
        fontSize: '9px'
        fontWeight: 400
        lineHeight: 1.2
rounded:
    xs: '4px'
    sm: '12px'
    map-control: '14px'
    md: '16px'
    lg: '24px'
    xl: '40px'
    full: '9999px'
spacing:
    section-y: '8rem'
    section-y-md: '6rem'
    container-x: '1.5rem'
    container-x-md: '3rem'
    stack-sm: '1rem'
    stack-md: '1.5rem'
    stack-lg: '2.5rem'
components:
    button-champagne-primary:
        backgroundColor: '{colors.champagne}'
        textColor: '{colors.obsidian-nav}'
        rounded: '{rounded.full}'
        padding: '1rem 2rem'
    button-champagne-hover:
        backgroundColor: '{colors.champagne-hover}'
        textColor: '{colors.obsidian-nav}'
    button-obsidian-ghost:
        backgroundColor: 'transparent'
        textColor: '{colors.stone-body}'
        rounded: '{rounded.full}'
        padding: '1rem 2rem'
    nav-pill-scrolled:
        backgroundColor: 'rgba(20,18,16,0.95)'
        textColor: '#ffffff'
        rounded: '{rounded.full}'
        padding: '0.625rem 1.5rem'
    card-obsidian:
        backgroundColor: '{colors.obsidian-card}'
        textColor: '{colors.stone-body}'
        rounded: '{rounded.lg}'
        padding: '2rem'
    card-ivory:
        backgroundColor: '{colors.ivory-card}'
        textColor: '{colors.ink-dark}'
        rounded: '{rounded.lg}'
        padding: '2rem'
---

# Design System: Flats Integração

## Overview

**Creative North Star: "Obsidian & Champagne — Hotelaria Editorial de Petrolina"**

O site público dos Flats Integração combina superfícies em obsidiana profunda (`#12110F`) com seções editoriais em alabastro quente (`#F5F2EB`) e ouro champagne (`#E5C98B` / bronze `#9E6B2B`). O ritmo visual alterna momentos cinematográficos escuros (Hero, Vitrine do Vale, Reputação Booking 9.0, Rodapé) com blocos claros altamente legíveis (Diferenciais, Galeria, Mapa de Rotas, Planos e FAQ).

Guia do hóspede e painel administrativo permanecem fora do escopo visual deste documento.

**Key Characteristics:**

- Alternância rítmica entre **Obsidian** (`#12110F`) e **Alabaster** (`#F5F2EB`)
- **Champagne** (`#E5C98B`) e **Bronze** (`#9E6B2B`) como acentos exclusivos (em fundos escuros e claros, respectivamente)
- Tipografia `Plus Jakarta Sans` em títulos, `Inter` em leitura contínua, `Fraunces` pontual em acentos editoriais e `JetBrains Mono` em marcadores numéricos (`tabular-nums`)
- CTAs em pílula (`rounded-full`) com áreas de toque mínimas de `44×44px` em controles móveis
- Coreografia scroll-driven via GSAP restrita ao desktop (`>= 801px`); no mobile, fluxo normal com transições GPU leves e sem `backdrop-filter` em barras/lightboxes em tempo real

## Colors

### Primary Accent

- **Champagne** (`#E5C98B`, hover `#edd6a1`): CTAs principais, destaques tipográficos e ícones sobre superfícies escuras.
- **Bronze Ink** (`#9E6B2B`): equivalente de alto contraste para acentos, números e bordas ativas sobre **Alabaster** (`#F5F2EB`) e **Ivory** (`#FAF8F3`).

### Functional Accents

- **Savings Green** (`#34d399`): métricas de economia corporativa/B2B (ex.: `30% a 50%`) e confirmações.
- **WhatsApp Green** (`#25D366`): restrito ao botão flutuante de reserva direta.

### Neutrals

- **Obsidian** (`#12110F`): fundo base escuro, hero e seções imersivas.
- **Obsidian Surface / Card / Nav** (`#181613`, `#191714`, `#141210`): elevação tonal de cards, modais e pílula de navegação.
- **Alabaster** (`#F5F2EB`) & **Ivory Card** (`#FAF8F3`): fundo claro editorial e superfície de cards/listagens com borda `#DFD8CA`.
- **Ink Dark** (`#181614`) & **Ink Muted** (`#5C564E`): hierarquia de texto sobre fundos claros.
- **Stone Body** (`#d6d3d1`) & **Stone Mute** (`#a8a29e`): hierarquia de texto legível sobre fundos escuros (mínimo `stone-400` para legendas secundárias).

## Typography

- **Display / Headings:** `Plus Jakarta Sans`
- **Body:** `Inter` (inputs móveis em `text-base` = `16px` mínimo para evitar auto-zoom no iOS Safari)
- **Editorial Serif:** `Fraunces` apenas em palavras-chave de destaque
- **Monospace / Counters:** `JetBrains Mono` com `tabular-nums`

## Layout & Motion

- Container central `max-w-[1320px]` com `px-6 md:px-12` e seções amplas (`py-20` a `py-32`).
- **Regra Mobile-First de Performance:** abaixo de `1024px`/`801px`, não montar GSAP nem `backdrop-blur` contínuo sobre elementos fixos/sticky ou imagens; `Hero` usa `min-h-[100svh]` e `PetrolinaCinemaSection` flui naturalmente com `IntersectionObserver` único e miniaturas `320w`.
- **`prefers-reduced-motion: reduce`:** todas as animações CSS, parallax GSAP, Framer Motion (`useReducedMotion`) e transições de mapa (`flyToBounds`) respeitam preferência reduzida.
- **Acessibilidade de Diálogos:** modais, lightboxes e drawer mobile implementam `role="dialog"`, `aria-modal="true"`, trava de foco (`Tab`), `Escape`, trava de scroll do `body` e restauração de foco no fechamento.
