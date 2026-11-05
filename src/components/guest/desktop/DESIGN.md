---
name: Guia do hóspede — desktop
description: Sistema local da composição desktop do guia, a partir de 1280 px.
colors:
    lili-accent: '#a34225'
    lili-accent-soft: '#f5e8e1'
    integracao-accent: '#24485d'
    integracao-accent-soft: '#e4edf1'
    background: '#f7f6f2'
    surface: '#fffefa'
    ink: '#292722'
    muted: '#68665f'
    border: '#e4e1d9'
    dark-background: '#171411'
    dark-surface: '#211d19'
    dark-ink: '#f2efe9'
    dark-muted: '#b9b2a8'
    dark-border: '#403a33'
    dark-lili-accent: '#f0b098'
    dark-lili-accent-soft: '#3a2821'
    dark-integracao-accent: '#9bc9e1'
    dark-integracao-accent-soft: '#203442'
typography:
    body:
        fontFamily: 'Inter, sans-serif'
        fontSize: '14px'
        lineHeight: 1.6
    page-title:
        fontSize: '24px'
        fontWeight: 700
        lineHeight: 1.3
        letterSpacing: '-0.03em'
    navigation:
        fontSize: '13px'
        fontWeight: 500
    credential:
        fontFamily: 'JetBrains Mono, monospace'
        fontSize: '21px'
        letterSpacing: '0.1em'
rounded:
    control: '8px'
    action: '10px'
    search: '12px'
    access: '14px'
    panel: '16px'
spacing:
    compact: '8px'
    control: '12px'
    content: '16px'
    panel: '24px'
    layout: '32px'
---

# Design System: Guia do hóspede — desktop

## Overview

Documento de manutenção da implementação existente em `DesktopGuestGuide`, `DesktopStayOverview` e `DesktopExplore`. A identidade vem do guia: fundo off-white, neutros stone, acento terracota para Lili e azul para Integração, com equivalentes escuros. Informação de estadia e planejamento ocupam uma composição desktop própria, com navegação lateral estável e contexto de acesso sempre próximo.

**Regra de escopo.** Este arquivo governa apenas esta pasta e sua composição a partir de 1280 px. Não redefine a landing, o `DESIGN.md`/`PRODUCT.md` da raiz, o sistema global `.impeccable/design.json`, a composição mobile ou o assistente. A direção e o escopo estão em `.impeccable/surfaces/src-components-guest-desktop-desktopguestguide-tsx.md` na raiz do projeto.

## Colors

### Primary

Terracota Lili e azul Integração marcam ações, ícones funcionais e seleção. Seus pares suaves preenchem navegação ativa, lugar selecionado e bloco de acesso. Os tokens locais `--gd-accent` e `--gd-accent-soft` mudam pelo atributo de imóvel; `.dark` fornece a versão do tema escuro.

### Neutral

`--gd-ink`, `--gd-muted`, `--gd-surface` e `--gd-border` separam texto principal, descrição, painéis e divisórias. O fundo geral permanece distinto da superfície dos campos e detalhes. Usar esses papéis locais ao ampliar a composição; não tomar cores da landing como autoridade.

## Typography

Inter é herdada do `body`. Títulos de página são compactos e fortes; títulos de boas-vindas e exploração têm tracking negativo e escala fluida (`clamp(28px, 2.6vw, 40px)` na estadia; teto de `38px` na exploração), peso 650. O título da estadia usa `30px` entre 1280 e 1439 px. Detalhes de lugar usam `25px`, peso 650.

Texto descritivo usa 14–15 px, entrelinha 1.6–1.75 e limites de leitura de 55–65 caracteres onde definidos. Metadados e contexto usam 11–13 px. Códigos de acesso usam a pilha monoespaçada do frontmatter; não aplicar essa linguagem a descrições ou títulos.

## Layout

`GuestView` escolhe a composição desktop a partir de 1280 px. Abaixo disso, mantém a composição mobile existente. O contêiner tem largura máxima de 1600 px, margens laterais de 36 px e três colunas: navegação de 190 px, conteúdo flexível e contexto de 236 px, separadas por 32 px. A partir de 1500 px, margens passam a 48 px, laterais a 212/258 px e intervalo a 44 px. Navegação e contexto são sticky; o topo tem altura mínima de 104 px.

Minha estadia começa com o `SmartSuggestion` existente e combina texto e foto em duas colunas, resumo de reserva com divisórias e links funcionais. Entre 1280 e 1439 px, o resumo empilha e os links passam a uma coluna. Explorar mantém lista e detalhe lado a lado (`minmax(260px, 0.94fr)` / `minmax(300px, 1.06fr)`), intervalo de 24 px, ampliado para 32 px a partir de 1600 px. A área de exploração tem altura `clamp(300px, calc(100dvh - 490px), 640px)`; lista e detalhe rolam independentemente, com barras finas, espaço estável para scrollbar e contenção de rolagem. A paginação fica no rodapé da coluna da lista. Conteúdos herdados de flat, regras e ajuda ficam limitados a 830 px.

## Elevation & Depth

A composição nova é predominantemente plana: divisórias finas, preenchimentos tonais e contraste entre fundo e superfície estabelecem hierarquia, sem sombras próprias nos três arquivos CSS desktop. O cartão QR reutilizado conserva sua aparência anterior, incluindo sombras e brilho; isso não cria uma regra para novos painéis.

Transições locais são curtas (150–160 ms), usadas em cor, fundo e brilho de ações. Respeitar `prefers-reduced-motion`, já tratado nos estilos desktop. Foco visível usa contorno no acento, de 2–3 px com afastamento; não substituir por um hover discreto.

## Shapes

Controles têm cantos suavemente arredondados conforme o frontmatter. Painéis de detalhe e fotos usam o maior raio; o bloco de acesso usa raio intermediário. Listas e resumos se organizam por linhas divisórias, sem envolver cada informação em um cartão. Imagens usam `object-fit: cover`; miniaturas têm fallback de ícone e a imagem da estadia tem fallback com o nome do imóvel.

## Components

- **Navegação:** seis destinos — Minha estadia, O flat, Explorar a região, Meus favoritos, Regras e avisos, Ajuda. O destino atual usa `aria-current="page"`, acento suave e peso 700. Trocar de destino leva o foco ao título e retorna ao topo. Há link de salto para o conteúdo, contato com anfitrião e SOS no rodapé lateral.
- **Minha estadia:** título, descrição e ação principal respondem à chegada, permanência, saída e pós-estadia. Chegada abre entrada; saída abre checkout; permanência e encerramento levam à exploração. Day use usa sua fase e janela próprias. Reserva e imóvel fornecem datas, horários, unidade e imagem; datas ausentes têm texto de confirmação.
- **Sugestão contextual:** o `SmartSuggestion` real ocupa o topo de Minha estadia, com `customSuggestions`, `isTimeVerified`, reserva, lugares e eventos atuais. Suas ações abrem entrada, saída, exploração já filtrada por categoria ou SOS nos fluxos existentes; preservar a lógica do componente compartilhado.
- **Contexto:** acesso, Wi-Fi, endereço e ações existentes. Credenciais dependem de liberação, desativação e etapa; pós-checkout não as expõe. Copiar dados apresenta retorno de sucesso ou falha. Preservar essas condições ao modificar a apresentação.
- **Busca e filtros:** campo de 50 px de altura mínima, superfície clara/escura e foco do contêiner. Busca ignora acentos e inclui nomes, descrições, endereço e tags; categorias têm contagem e estado pressionado. Quantidade de resultados é anunciada por região de status.
- **Lista e detalhe:** seis lugares por página, com Anterior/Próxima e contador de intervalo/total; extremos desabilitam a ação correspondente. Busca e categoria retornam à primeira página. O primeiro resultado da página é o detalhe padrão; selecionar outro lugar reinicia somente a rolagem do detalhe, preservando a posição da lista. Trocar página/filtros reinicia a lista e atualiza a seleção. Linha selecionada recebe preenchimento suave. Detalhe mostra apenas dados cadastrados, ações disponíveis e mapa por endereço. Ausência de resultados distingue filtros, favoritos vazios e catálogo ainda não publicado, com limpar filtros quando aplicável.
- **Favoritos:** corações e ação de salvar usam o provider existente e `aria-pressed`; não criar armazenamento paralelo. A seção reaproveita a exploração filtrada. A contagem lateral atual considera os lugares elegíveis recebidos em `places`.
- **Ações:** entrada/saída usam botão sólido com acento, cantos de ação e ícone; ações secundárias de exploração usam borda. No escuro, o texto dos botões sólidos muda para tom escuro. Contato, regras, flat, emergência, stories e salvar acesso reutilizam os fluxos/componentes existentes.
- **Levar no celular:** botão no topo alterna o cartão QR existente, que gera o QR localmente com qrcode a partir do endereço atual do guia, sem enviar o link a terceiros, e oferece copiar link com confirmação de sucesso ou recuperação de erro. Idiomas pt/en/es e alternância claro/escuro/sistema usam os providers atuais.

## Do's and Don'ts

- **Do** manter classes `gd-*` e tokens `--gd-*` isolados ao desktop; testar ambos os imóveis e temas ao mudar a composição.
- **Do** preservar conteúdo publicado, elegibilidade por imóvel, visibilidade, exclusão de eventos expirados e condições de acesso.
- **Do** usar endereço/link cadastrado para mapa e rotas, e exibir distância somente quando fornecida.
- **Don't** inventar disponibilidade, serviços, distâncias, localização precisa ou credenciais para preencher espaço.
- **Don't** propagar esta composição ou seus tokens para landing, mobile ou assistente sem escopo específico.
- **Don't** tratar validação local como validação em produção. Build final, TypeScript, ESLint e 51 testes relevantes passaram; a revisão independente das quatro imagens foi favorável, limitada às amostras. CUA observou desktop a 1440 px, desktop escuro/espanhol a 1280 px e preservação mobile a 390 px, com catálogo de 37 lugares fictícios. Capturas reais estão em `previews/desktop-guide/`: `explore-paged-1440.png`, `explore-last-1280-dark.png`, `stay-smart-1440.png` e `mobile-390.png`. O navegador foi encerrado corretamente. Detector sem design global: `previews/desktop-guide/detector.json` (`[]`).
