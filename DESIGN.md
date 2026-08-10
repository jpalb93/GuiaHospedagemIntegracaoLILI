---
name: Flats Integração
description: Landing editorial escura de hospedagem boutique em Petrolina — economia, oferta e conversão claras.
colors:
    brasa-petrolina: '#f97316'
    brasa-deep: '#ea580c'
    brasa-cta: '#c2410c'
    stone-ink: '#0c0a09'
    stone-panel: '#1c1917'
    stone-line: '#292524'
    stone-mute: '#a8a29e'
    stone-body: '#d6d3d1'
    snow: '#f5f5f4'
    ink: '#0c0a09'
    savings-green: '#34d399'
typography:
    display:
        fontFamily: 'Plus Jakarta Sans, sans-serif'
        fontSize: 'clamp(3rem, 8vw, 6rem)'
        fontWeight: 700
        lineHeight: 1.1
        letterSpacing: '-0.02em'
    headline:
        fontFamily: 'Plus Jakarta Sans, sans-serif'
        fontSize: 'clamp(1.875rem, 4vw, 3.75rem)'
        fontWeight: 700
        lineHeight: 1.15
        letterSpacing: '-0.01em'
    title:
        fontFamily: 'Plus Jakarta Sans, sans-serif'
        fontSize: '1.25rem'
        fontWeight: 500
        lineHeight: 1.375
    body:
        fontFamily: 'Inter, sans-serif'
        fontSize: '1rem'
        fontWeight: 300
        lineHeight: 1.625
    label:
        fontFamily: 'Plus Jakarta Sans, sans-serif'
        fontSize: '0.75rem'
        fontWeight: 700
        lineHeight: 1
        letterSpacing: '0.15em'
rounded:
    none: '0px'
    sm: '6px'
    md: '16px'
    lg: '24px'
    xl: '32px'
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
    button-hero-primary:
        backgroundColor: '{colors.snow}'
        textColor: '{colors.ink}'
        rounded: '{rounded.none}'
        padding: '1.25rem 2rem'
        typography: '{typography.label}'
    button-hero-primary-hover:
        backgroundColor: '#ffffff'
        textColor: '{colors.ink}'
    button-hero-ghost:
        backgroundColor: 'transparent'
        textColor: '{colors.stone-body}'
        rounded: '{rounded.none}'
        padding: '1.25rem 2rem'
    button-nav-cta:
        backgroundColor: '{colors.brasa-deep}'
        textColor: '#ffffff'
        rounded: '{rounded.full}'
        padding: '0.75rem 1.5rem'
        typography: '{typography.label}'
    button-nav-cta-hover:
        backgroundColor: '{colors.brasa-petrolina}'
        textColor: '#ffffff'
    button-whatsapp:
        backgroundColor: '{colors.brasa-cta}'
        textColor: '#ffffff'
        rounded: '{rounded.full}'
        padding: '1.25rem 2rem'
    button-b2b-outline:
        backgroundColor: 'transparent'
        textColor: '{colors.brasa-deep}'
        rounded: '{rounded.full}'
        padding: '0.625rem 1rem'
    nav-pill:
        backgroundColor: 'rgba(255,255,255,0.95)'
        textColor: '{colors.ink}'
        rounded: '{rounded.full}'
        padding: '0.75rem 1.5rem'
    card-panel:
        backgroundColor: 'rgba(28,25,23,0.4)'
        textColor: '{colors.stone-body}'
        rounded: '{rounded.xl}'
        padding: '2rem'
    chip-eyebrow:
        backgroundColor: 'rgba(249,115,22,0.1)'
        textColor: '{colors.brasa-petrolina}'
        rounded: '{rounded.full}'
        padding: '0.25rem 0.75rem'
        typography: '{typography.label}'
---

# Design System: Flats Integração

## Overview

**Creative North Star: "Petrolina Editorial Dark"**

O site público dos Flats Integração se comporta como um hotel boutique editorial em pedra escura: tipografia forte, fotografia real do imóvel, e oferta (economia, preço, o que está incluso) sempre legível. O clima é premium — no nível dos melhores sites de hotelaria do mundo — sóbrio, com momentos de “uau” por composição, escala tipográfica e imagem, nunca por efeitos genéricos.

A densidade é generosa: seções amplas (`py-32` / `py-24`), muito ar negativo, divisores finos e grids editoriais. O laranja de marca (Brasa Petrolina) aparece com parcimônia — accent, CTA de conversão, eyebrows — sobre um campo quase monocromático de stone.

Rejeições confirmadas: nada genérico, nada com “cara de IA” (beige cremoso, purple gradients, glassmorphism ornamental, badge soup, cards empilhados sem propósito). Guia do hóspede e admin estão fora deste sistema visual.

**Key Characteristics:**

- Pedra escura full-bleed com tipografia Plus Jakarta Sans em escala hotelaria
- Brasa Petrolina como único accent de marca
- Hero com CTAs de canto reto; nav/WhatsApp em pílula
- Profundidade híbrida: camadas tonais + sombra suave em nav flutuante e CTAs
- Boutique hotel UI: espaçoso, refinado, detalhes premium sem enfeite

## Colors

Paleta quase monocromática de pedra, aquecida por uma única brasa laranja e um verde pontual de economia B2B.

### Primary

- **Brasa Petrolina** (`#f97316` / deep `#ea580c` / CTA `#c2410c`): accent de marca, underlines de nav, eyebrows, ícones em hover, CTAs de conversão (Reservar / WhatsApp). Raridade controlada.

### Secondary

Omitido — um único accent.

### Tertiary

- **Savings Green** (`#34d399`): apenas métricas positivas de economia na seção B2B (ex. “30% a 50%”), nunca como cor de marca geral.

### Neutral

- **Stone Ink** (`#0c0a09`): fundo de página e hero overlays.
- **Stone Panel** (`#1c1917`): painéis, FAQ, cards tonais.
- **Stone Line** (`#292524`): divisores e bordas sutis.
- **Stone Mute** (`#a8a29e`): texto secundário / captions.
- **Stone Body** (`#d6d3d1`): corpo padrão sobre fundo escuro.
- **Snow** (`#f5f5f4`): CTA primário do hero e texto sobre painéis claros da nav.
- **Ink** (`#0c0a09`): texto sobre snow / botões claros.

### Named Rules

**The One Ember Rule.** Brasa Petrolina ocupa no máximo uma fração pequena de cada viewport — accent e conversão, nunca preenchimento de seção.

**The Dark Field Rule.** O campo padrão da landing é stone-ink; superfícies claras ficam reservadas à nav flutuante e ao CTA hero claro.

## Typography

**Display Font:** Plus Jakarta Sans (com sans-serif)
**Body Font:** Inter (com sans-serif)
**Accent italic:** serif itálico do sistema (`font-serif italic`) só em fragmentos editoriais de subtítulo — nunca em CTAs ou nav.

**Character:** Pairing hotelaria contemporânea — headings geométricos e densos; corpo leve e legível; o itálico serif é um fioritura editorial pontual, não a voz principal.

### Hierarchy

- **Display** (700, clamp ~3–6rem, tight): hero H1.
- **Headline** (700–800, clamp ~1.875–3.75rem): títulos de seção.
- **Title** (500, ~1.25rem): títulos de feature / card.
- **Body** (300–400, ~1–1.25rem, relaxed): parágrafos e descrições (máx. ~65ch quando possível).
- **Label** (700, ~0.75rem, uppercase, tracking amplo ~0.15–0.3em): nav, eyebrows, botões.

### Named Rules

**The Hotel Scale Rule.** Títulos de seção devem sentir escala de hotel boutique (grandes, leves no tracking), não dashboard.

**The Label Discipline Rule.** Uppercase + tracking largo só em labels/CTAs/nav — nunca em parágrafos.

## Layout

Container central (`container` / `max-w-6xl`–`7xl`) com padding horizontal generoso (`px-6` / `md:px-12`). Ritmo vertical de seção ~`py-24` a `py-32`. Grids editoriais (features em colunas com bordas, não cards empilhados; B2B em bento). Hero full-bleed `100dvh`. Nav fixa que colapsa em pílula flutuante após scroll. Mobile: stack vertical, CTAs full-width onde faz sentido, tipografia ainda dominante.

**The Air First Rule.** Preferir espaço e divisores lineares a caixas; se um card não carrega interação ou conteúdo denso, preferir layout open.

## Elevation & Depth

Sistema híbrido: profundidade principal por contraste tonal (ink → panel → line) e overlays/gradientes sobre fotografia. Sombra estrutural suave na nav flutuante (`shadow-2xl`) e nos CTAs de conversão; glows laranja blur (`orange-500/10`, blur 100–140px) como atmosfera, não como “neon UI”.

### Shadow Vocabulary

- **Nav float** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)` + ring sutil): header scrolled em pílula.
- **CTA lift** (`shadow-lg` / `hover:shadow-orange-500/30` + `translateY(-1)`): botões WhatsApp / conversão.
- **Ambient ember** (`blur-[100px]`–`[140px]` em blobs laranja/stone): atmosfera de seção, nunca sobre texto.

### Named Rules

**The Hybrid Depth Rule.** Camadas tonais primeiro; sombra só em elementos flutuantes ou de conversão.

## Shapes

Linguagem dual deliberada: **cantos retos (`0px`)** nos CTAs do hero (editorial/afiado); **pílula (`9999px`)** na nav, Cotação B2B outline, WhatsApp e CTAs de conversão persistentes. Painéis de conteúdo usam raios generosos (`1.5–2.5rem` / `rounded-2xl`–`rounded-[2.5rem]`). Badges/eyebrows: pílula ou `rounded-md` discreto. Divisores: linhas `1px` stone, às vezes gradient laranja curto sob títulos.

### Named Rules

**The Dual CTA Geometry Rule.** Hero = reto; nav/WhatsApp = pílula. Não unificar sem decisão explícita.

## Components

Boutique hotel UI: refinado, espaçoso, detalhes premium sem enfeite.

### Buttons

- **Shape:** dual — `0px` no hero; `full` na nav/WhatsApp.
- **Hero primary:** snow sobre ink, uppercase tracking, padding `py-5 px-8`, hover branco + lift leve.
- **Hero ghost:** borda `white/20`, texto stone-body, hover borda mais clara.
- **Nav CTA / WhatsApp:** Brasa deep/cta, pílula, uppercase tracking, sombra; hover brasa mais clara ou lift.
- **B2B outline:** borda brasa, texto brasa, pílula, fundo transparente.

### Chips

- **Eyebrow:** fundo brasa/10, borda brasa/20, texto brasa, uppercase micro-tracking.
- **Metric chip (B2B):** painel stone com número grande (economia em savings-green ou brasa).

### Cards / Containers

- **Corner Style:** generoso (`2rem`+) em info/reputação; bento B2B `rounded-3xl`; features muitas vezes sem card — só borda de coluna.
- **Background:** `stone-panel` / `stone-900/40` + blur leve.
- **Border:** `white/5` ou `stone-800`; hover pode acender borda brasa/30.
- **Internal Padding:** `p-8`–`p-10` (ou mais em location).

### Inputs / Fields

Poucos na landing pública (modal de orçamento corporativo). Preferir campos sóbrios sobre stone-panel, foco com ring brasa — sem inventar um design system de form denso aqui.

### Navigation

Header claro (snow/95 + blur) sobre hero escuro; links label uppercase stone; hover underline brasa animado; item Empresas pode enfatizar brasa. No scroll: pílula flutuante `max-w-6xl`, logo menor, CTA pílula.

### Signature: Full-bleed Hero

Fotografia real full-bleed, overlay stone, H1 hotel-scale com palavra-chave em gradient brasa, prova curta (conforto / privacidade / localização), dual CTA reto.

## Do's and Don'ts

### Do:

- **Do** manter o campo escuro e a Brasa Petrolina rara e decisiva.
- **Do** priorizar tipografia grande + foto real + oferta (economia/preço/incluso) na hierarquia.
- **Do** respeitar a Dual CTA Geometry (hero reto / nav-WhatsApp pílula).
- **Do** usar ar generoso e divisores lineares antes de criar novos cards.
- **Do** limitar savings-green a métricas de economia B2B.

### Don't:

- **Don't** introduzir paletas creme, roxo, glow neon ou “AI SaaS” glass stacks.
- **Don't** redesenhar guia do hóspede ou admin sob este documento — escopo é a landing.
- **Don't** fabricar depoimentos, preços ou % de economia que não existam no produto/copy confirmada.
- **Don't** transformar seções editoriais em dashboard de cards/stat strips.
- **Don't** usar italic serif em botões, nav ou blocos longos de corpo.
